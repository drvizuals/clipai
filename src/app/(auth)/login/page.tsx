'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LIME = '#C8F135'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push(next)
    router.refresh()
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080808' }}>
      {/* bg glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(200,241,53,0.05) 0%,transparent 65%)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md relative">
        {/* logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block font-display text-3xl tracking-widest text-white hover:opacity-80 transition-opacity">
            OMNI<span style={{ color: LIME }}>A</span>
          </Link>
          <p className="text-[#999] text-sm mt-3">Welcome back. Sign in to continue.</p>
        </div>

        <div className="rounded-xl border border-[#222] p-8" style={{ background: '#111' }}>
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-[#333] text-sm font-medium text-white hover:border-[#444] hover:bg-[#1a1a1a] transition-all duration-200 mb-6 disabled:opacity-60"
          >
            {googleLoading
              ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              : <Globe size={16} />}
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#222]" />
            <span className="text-xs text-[#444] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#222]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[#999] mb-2 tracking-wide">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#999] tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#555] hover:text-[#999] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[#FF4444] bg-[#FF4444]/10 px-4 py-3 rounded-lg border border-[#FF4444]/20">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: LIME, color: '#080808' }}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                : <><span>Sign in</span><ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#555] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="hover:text-white transition-colors" style={{ color: LIME }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
