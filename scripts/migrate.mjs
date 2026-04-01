/**
 * Omnia — Run database migrations against Supabase.
 *
 * Requires DATABASE_URL (direct postgres connection) OR
 * falls back to running the SQL via the Supabase REST API
 * using the service role key.
 *
 * Usage:
 *   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres \
 *   node scripts/migrate.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
try {
  const env = readFileSync(join(__dirname, '../.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
} catch { /* no .env.local */ }

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL
const DATABASE_URL     = process.env.DATABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const sql = readFileSync(
  join(__dirname, '../supabase/migrations/001_initial_schema.sql'),
  'utf8'
)

async function runViaDirectConnection() {
  const { default: pg } = await import('pg')
  const { Client } = pg
  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()
  console.log('Connected via direct postgres connection.')
  await client.query(sql)
  await client.end()
  console.log('✓ Schema applied successfully.')
}

async function runViaServiceRole() {
  // Use Supabase REST RPC — requires the exec_sql helper function
  // to exist, or we can POST to /rest/v1/rpc/exec_sql
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql_query: sql }),
  })
  if (!res.ok) throw new Error(await res.text())
  console.log('✓ Schema applied via service role.')
}

(async () => {
  console.log('Omnia — Running database migrations...\n')

  if (DATABASE_URL) {
    await runViaDirectConnection()
  } else if (SERVICE_ROLE_KEY) {
    await runViaServiceRole()
  } else {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MANUAL STEP REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  No DATABASE_URL or SUPABASE_SERVICE_ROLE_KEY found.

  To apply the schema, open your Supabase dashboard:
  https://supabase.com/dashboard/project/npkafbhmgcnjxzideyni/sql

  Then paste and run the contents of:
  supabase/migrations/001_initial_schema.sql

  Or add to .env.local:
  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.npkafbhmgcnjxzideyni.supabase.co:5432/postgres

  And re-run:  node scripts/migrate.mjs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
    process.exit(1)
  }
})().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
