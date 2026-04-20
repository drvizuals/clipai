// Supabase Edge Function: generate-brand-voice
// Calls the Anthropic API (Claude Opus 4.7) using the TypeScript SDK with
// prompt caching on the stable system prompt. The per-user story is sent as
// a user message so cache hits accrue across users with the same language.
//
// Deploy:
//   supabase functions deploy generate-brand-voice
// Set secret:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

// @ts-expect-error -- Deno import specifier, resolved at deploy time by Supabase.
import Anthropic from 'npm:@anthropic-ai/sdk@^0.35.0';

interface RequestBody {
  name: string;
  language: 'es' | 'en' | 'spanglish';
  industry: string;
  story: string;
}

interface BrandVoice {
  tagline: string;
  voice_description: string;
  pillars: string[];
  sample_posts: string[];
}

const SYSTEM_PROMPT = `You are Lazo, a brand voice coach for Latino entrepreneurs and creators.

You help people articulate a brand voice that feels like them — rooted in their
culture, their family, their neighborhood, their hustle. You never flatten
Latino identity into a stereotype. You honor bilingual and code-switching
speech as a strength, not a gap.

When given an entrepreneur's name, industry, preferred language, and origin
story, you respond with a JSON object matching this exact shape:

{
  "tagline": string (<=12 words, in their preferred language),
  "voice_description": string (2-3 sentences describing how they sound: tone,
    cadence, vocabulary, emotional register),
  "pillars": string[] (exactly 3 short brand pillars — 1 to 3 words each),
  "sample_posts": string[] (exactly 3 short social posts, 1-2 sentences each,
    written IN their preferred language and voice)
}

Rules:
- Respect the user's language preference exactly. If they chose Spanglish,
  code-switch naturally the way a bilingual person actually talks.
- Pull specific details from their story — names of family, places, foods,
  rituals, turning points. Generic copy is a failure.
- No hashtags. No emojis unless the user used them in their story.
- Output ONLY valid JSON. No preface, no commentary, no markdown fences.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return json({ error: 'ANTHROPIC_API_KEY is not configured on the edge function.' }, 500);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const missing = (['name', 'language', 'industry', 'story'] as const).filter((k) => !body[k]);
  if (missing.length) {
    return json({ error: `Missing fields: ${missing.join(', ')}` }, 400);
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = [
    `Name: ${body.name}`,
    `Preferred language: ${languageLabel(body.language)}`,
    `Industry: ${body.industry}`,
    '',
    'Their story (in their own words):',
    body.story.trim(),
  ].join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      // Cache the stable system prompt — it's the same for every user.
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('')
      .trim();

    const parsed = safeParseBrandVoice(text);
    if (!parsed) {
      return json({ error: 'Model returned invalid JSON.', raw: text }, 502);
    }

    return json(parsed, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, 500);
  }
});

function safeParseBrandVoice(text: string): BrandVoice | null {
  // Fall back to extracting the first {...} block if the model wraps it.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (
      typeof parsed.tagline === 'string' &&
      typeof parsed.voice_description === 'string' &&
      Array.isArray(parsed.pillars) &&
      Array.isArray(parsed.sample_posts)
    ) {
      return parsed as BrandVoice;
    }
    return null;
  } catch {
    return null;
  }
}

function languageLabel(lang: RequestBody['language']): string {
  switch (lang) {
    case 'es':
      return 'Español';
    case 'en':
      return 'English';
    case 'spanglish':
      return 'Spanglish (natural code-switching)';
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};
