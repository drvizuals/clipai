'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Globe, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LIME = '#C8F135'

const PERKS = [
  'AI finds your best 10 clips automatically',
  'Animated captions rendered server-side',
  'Auto-publish to 7 platforms',
  'Starts free — no card required',
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    })
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080808' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(200,241,53,0.12)', border: `1px solid ${LIME}` }}>
            <Check size={28} style={{ color: LIME }} />
          </div>
          <h2 className="font-display text-4xl tracking-wide text-white mb-3">Check your email</h2>
          <p className="text-[#999] text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-white">{email}</span>.<br />
            Click it to activate your account.
          </p>
          <Link href="/login" className="inline-block mt-8 text-sm font-medium transition-colors hover:text-white" style={{ color: LIME }}>
            Back to login →
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      {/* left panel — perks */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] border-r border-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%,rgba(200,241,53,0.06) 0%,transparent 60%)' }} />
        <Link href="/" className="font-display text-3xl tracking-widest text-white mb-16 block">
          OMNI<span style={{ color: LIME }}>A</span>
        </Link>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-none tracking-wide text-white mb-8">
          Film once.<br /><span style={{ color: LIME }}>Publish</span><br />everywhere.
        </h2>
        <ul className="space-y-4">
          {PERKS.map(p => (
            <li key={p} className="flex items-center gap-3 text-sm text-[#999]">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(200,241,53,0.12)' }}>
                <Check size={11} style={{ color: LIME }} />
              </div>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <Link href="/" className="inline-block font-display text-3xl tracking-widest text-white">
              OMNI<span style={{ color: LIME }}>A</span>
            </Link>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-white mb-2">Create your account</h1>
          <p className="text-[#999] text-sm mb-8">Free forever. No credit card required.</p>

          <div className="rounded-xl border border-[#222] p-8" style={{ background: '#111' }}>
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

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs text-[#999] mb-2 tracking-wide">Full name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#999] mb-2 tracking-wide">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#999] mb-2 tracking-wide">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors" />
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
                  : <><span>Create free account</span><ArrowRight size={14} /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#555] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="hover:text-white transition-colors" style={{ color: LIME }}>Sign in</Link>
          </p>
          <p className="text-center text-xs text-[#333] mt-4">
            By continuing you agree to our <Link href="#" className="hover:text-[#555] transition-colors">Terms</Link> and <Link href="#" className="hover:text-[#555] transition-colors">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
