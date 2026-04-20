# Lazo

AI-powered personal brand builder for Latino entrepreneurs and creators.

Lazo helps you articulate the brand only you can build — rooted in your story, your language (Spanish, English, or Spanglish), and your industry. The onboarding flow gathers your name, language preference, industry, and origin story, then calls Claude to shape a brand voice: a tagline, voice description, three pillars, and sample posts in your actual voice.

## Stack

- **Mobile**: [Expo](https://expo.dev) (iOS + Android) with [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- **Backend / Auth**: [Supabase](https://supabase.com) (Postgres, Auth, Edge Functions)
- **AI**: [Anthropic Claude](https://www.anthropic.com) (`claude-opus-4-7`) via a Supabase Edge Function, with prompt caching on the stable system prompt

## Project layout

```
app/                        Expo Router routes
  _layout.tsx               Root stack + providers
  index.tsx                 Entry redirect → onboarding
  onboarding/
    _layout.tsx
    welcome.tsx             Hero screen
    name.tsx                Step 1: brand / user name
    language.tsx            Step 2: es | en | spanglish
    industry.tsx            Step 3: industry picker
    story.tsx               Step 4: free-form origin story → triggers AI
    brand-voice.tsx         AI result: tagline, voice, pillars, samples
src/
  components/               Button, Screen, OptionCard, TextField, ProgressBar
  constants/                industries.ts, copy.ts (i18n strings per language)
  contexts/                 OnboardingContext (in-memory draft + brand voice)
  lib/                      supabase.ts, brandVoice.ts (edge function client)
  theme/                    colors, spacing, typography
  types/                    shared TS types (BrandVoice, Profile, ...)
supabase/
  migrations/0001_init.sql  profiles table with RLS + brand_voice jsonb column
  functions/generate-brand-voice/
    index.ts                Deno edge function → Anthropic SDK w/ prompt caching
```

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure env

```bash
cp .env.example .env
```

Fill in:
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `ANTHROPIC_API_KEY` — only used by the edge function, never bundled in the app

### 3. Supabase

```bash
supabase db push                                           # apply 0001_init.sql
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...          # edge function secret
supabase functions deploy generate-brand-voice             # deploy the AI endpoint
```

### 4. Run the app

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm start        # QR code for Expo Go on device
```

## Onboarding flow

The flow is four steps plus an AI result screen:

1. **Name** — user or brand name (validated: min 2 chars)
2. **Language** — Spanish, English, or Spanglish. All copy after this step respects the choice.
3. **Industry** — 12 preset verticals with emoji, localized labels
4. **Story** — multiline textarea, min 40 chars. On continue, calls `supabase.functions.invoke('generate-brand-voice', ...)`
5. **Brand voice** — tagline, voice description, three pillars, three sample posts. Regenerate or finish.

Draft state lives in `OnboardingContext`. After the user finishes, wire up `supabase.from('profiles').upsert(...)` inside `onFinish` in `app/onboarding/brand-voice.tsx` once auth is in place.

## How the AI call works

The edge function at `supabase/functions/generate-brand-voice/index.ts`:

- Uses the official `@anthropic-ai/sdk`
- Calls `claude-opus-4-7` with `max_tokens: 1024`
- Puts the stable Lazo system prompt in a `system` block with `cache_control: { type: 'ephemeral' }` so every subsequent user pays the ~0.1× cache-read rate instead of the full input-token rate
- Extracts the JSON object from the model's response and validates the shape before returning

The `ANTHROPIC_API_KEY` is never exposed to the client — it's a Supabase function secret.

## Next steps

- [ ] Supabase email / OTP auth (`src/contexts/AuthContext.tsx`)
- [ ] Persist the generated `BrandVoice` to `public.profiles.brand_voice` on finish
- [ ] Home tab bar: feed, caption generator, post planner
- [ ] Migrate in-memory `OnboardingContext` to AsyncStorage for resume-later
