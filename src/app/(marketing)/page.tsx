'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Zap, TrendingUp, Globe2, ChevronDown } from 'lucide-react'

const LIME = '#C8F135'

// ── Scroll reveal hook ─────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? '#222' : 'transparent'}`,
      }}
    >
      <span className="font-display text-2xl tracking-widest text-white">
        OMNI<span style={{ color: LIME }}>A</span>
      </span>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'Pricing'].map(l => (
          <Link key={l} href={`#${l.toLowerCase()}`} className="text-sm text-[#999] hover:text-white transition-colors tracking-wide">
            {l}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-[#999] hover:text-white transition-colors px-4 py-2">Log in</Link>
        <Link href="/signup" className="text-sm font-semibold px-5 py-2.5 rounded-md transition-all hover:opacity-90" style={{ background: LIME, color: '#080808' }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}

// ── Waitlist form ──────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setState('loading')
    setTimeout(() => setState('done'), 1200)
  }
  if (state === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 text-sm font-medium" style={{ color: LIME }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: LIME }}>
          <Check size={12} color="#080808" strokeWidth={3} />
        </div>
        You&apos;re on the list. We&apos;ll be in touch.
      </motion.div>
    )
  }
  return (
    <form onSubmit={submit} className="flex items-center max-w-sm w-full">
      <div className="flex flex-1 items-center rounded-l-md border border-r-0 focus-within:border-[#C8F135] transition-colors" style={{ background: '#111', borderColor: '#333' }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-[#444] outline-none" required />
      </div>
      <button type="submit" disabled={state === 'loading'} className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-r-md transition-all hover:brightness-110 disabled:opacity-60" style={{ background: LIME, color: '#080808' }}>
        {state === 'loading'
          ? <span className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
          : <><span>Early access</span><ArrowRight size={14} /></>}
      </button>
    </form>
  )
}

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-8 rounded-xl border overflow-hidden hover:border-[#333] transition-colors duration-300"
      style={{ background: '#111', borderColor: '#222' }}
    >
      <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to right, transparent, ${LIME}, transparent)` }} />
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6" style={{ background: 'rgba(200,241,53,0.1)' }}>
        <span style={{ color: LIME }}>{icon}</span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-[#999] leading-relaxed">{desc}</p>
    </motion.div>
  )
}

// ── Step row ───────────────────────────────────────────────────────────────
function StepRow({ n, title, desc }: { n: string; title: string; desc: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-6 py-8 border-b border-[#1a1a1a] last:border-0"
    >
      <div className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm" style={{ borderColor: LIME, color: LIME }}>{n}</div>
      <div>
        <div className="font-heading font-semibold text-white mb-1">{title}</div>
        <div className="text-sm text-[#999] leading-relaxed">{desc}</div>
      </div>
    </motion.div>
  )
}

// ── Pricing card ───────────────────────────────────────────────────────────
function PricingCard({ name, price, features, accent }: { name: string; price: number | string; features: string[]; accent?: boolean }) {
  const { ref, visible } = useScrollReveal()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col p-8 rounded-xl border"
      style={{ background: accent ? 'linear-gradient(135deg,rgba(200,241,53,0.06) 0%,#111 100%)' : '#111', borderColor: accent ? LIME : '#222' }}
    >
      {accent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wide" style={{ background: LIME, color: '#080808' }}>Most popular</div>
      )}
      <div className="font-heading text-sm text-[#999] uppercase tracking-widest mb-4">{name}</div>
      <div className="mb-6">
        {typeof price === 'number'
          ? <><span className="font-display text-5xl" style={{ color: accent ? LIME : '#fff' }}>${price}</span><span className="text-[#999] text-sm ml-2">/mo</span></>
          : <span className="font-display text-5xl text-white">{price}</span>}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-3 text-sm text-[#ccc]">
            <Check size={14} className="shrink-0 mt-0.5" style={{ color: LIME }} />{f}
          </li>
        ))}
      </ul>
      <Link href="/signup" className="w-full text-center py-3 rounded-md text-sm font-semibold transition-all hover:opacity-90" style={accent ? { background: LIME, color: '#080808' } : { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
        Get started
      </Link>
    </motion.div>
  )
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionHeading({ label, title }: { label: string; title: React.ReactNode }) {
  const { ref, visible } = useScrollReveal()
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-20">
      <div className="text-xs font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: LIME }}>{label}</div>
      <h2 className="font-display text-[clamp(40px,6vw,80px)] leading-none tracking-wide text-white">{title}</h2>
    </motion.div>
  )
}

// ── How it works heading ───────────────────────────────────────────────────
function HowHeading() {
  const { ref, visible } = useScrollReveal()
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
      <div className="text-xs font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: LIME }}>How it works</div>
      <h2 className="font-display text-[clamp(40px,6vw,80px)] leading-none tracking-wide text-white">
        Eight steps.<br /><span style={{ color: LIME }}>Zero friction.</span>
      </h2>
    </motion.div>
  )
}

// ── Quote section ──────────────────────────────────────────────────────────
function QuoteSection() {
  const { ref, visible } = useScrollReveal()
  return (
    <section className="py-32 px-6 text-center border-t border-[#1a1a1a]">
      <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 font-display pointer-events-none select-none" style={{ fontSize: 280, lineHeight: 0.7, color: 'rgba(200,241,53,0.025)' }}>"</div>
        <blockquote className="relative font-display text-[clamp(28px,4vw,52px)] leading-tight tracking-wide text-white">
          "Creators who understand their data{' '}
          <span style={{ color: LIME }}>grow 4× faster</span>{' '}
          than those who don&apos;t."
        </blockquote>
        <cite className="block mt-6 text-xs tracking-[0.2em] uppercase text-[#555] not-italic">2024 Creator Economy Report</cite>
      </motion.div>
    </section>
  )
}

// ── Bottom CTA ─────────────────────────────────────────────────────────────
function BottomCTA() {
  const { ref, visible } = useScrollReveal()
  return (
    <section className="py-40 px-6 text-center relative overflow-hidden border-t border-[#1a1a1a]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px" style={{ background: `linear-gradient(to right,transparent,${LIME},transparent)` }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(200,241,53,0.08) 0%,transparent 70%)' }} />
      <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="relative">
        <h2 className="font-display text-[clamp(52px,9vw,120px)] leading-none tracking-wide text-white mb-4">
          Your content.<br /><span style={{ color: LIME }}>Everywhere it belongs.</span>
        </h2>
        <p className="text-[#999] text-lg mb-12">Be first when we launch. No credit card. No commitment.</p>
        <div className="flex justify-center"><WaitlistForm /></div>
      </motion.div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <div style={{ background: '#080808' }}>
      <Nav />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(200,241,53,0.07) 0%,transparent 65%)' }} />
        {/* scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)' }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 flex flex-col items-center">
          {/* eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-3 mb-10">
            <span className="h-px w-8 opacity-60" style={{ background: LIME }} />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: LIME }}>The content operating system</span>
            <span className="h-px w-8 opacity-60" style={{ background: LIME }} />
          </motion.div>

          {/* headline — 3 staggered lines */}
          <h1 className="font-display leading-[0.9] tracking-wider mb-8" style={{ fontSize: 'clamp(72px,12vw,170px)' }}>
            {[
              { text: 'Film once.', delay: 0.2, accent: false },
              { text: 'Publish', delay: 0.35, accent: true },
              { text: 'everywhere.', delay: 0.5, accent: false },
              { text: 'Learn what wins.', delay: 0.65, accent: false },
            ].map(({ text, delay, accent }) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: accent ? LIME : '#FFFFFF', display: 'block' }}
              >
                {text}
              </motion.div>
            ))}
          </h1>

          {/* sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }} className="text-base md:text-lg text-[#999] max-w-xl leading-relaxed mb-12">
            Upload one video. Omnia transcribes it, finds your best 10 clips with AI, lets you edit in-browser,
            renders animated captions, and auto-publishes to every platform — on schedule.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-col items-center gap-4">
            <WaitlistForm />
            <p className="text-xs text-[#444]">Join <span className="text-[#666]">1,240+</span> creators on the waitlist · No card required</p>
          </motion.div>

          {/* platforms */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }} className="flex items-center gap-6 mt-16 flex-wrap justify-center">
            <span className="text-xs text-[#444] tracking-widest uppercase">Publishes to</span>
            {['YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'X'].map(p => (
              <span key={p} className="font-display text-base tracking-widest text-[#333] hover:text-[#999] transition-colors cursor-default">{p.toUpperCase()}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#333]">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={16} color="#333" />
          </motion.div>
        </motion.div>
      </section>

      {/* FLOW BAR */}
      <section className="border-y border-[#1a1a1a] py-5 overflow-hidden">
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="flex items-center whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {['Upload', 'Transcribe', 'AI Clips', 'Edit', 'Animate', 'Render', 'Publish', 'Learn'].map((step, j) => (
                <div key={j} className="flex items-center">
                  <span className="px-8 text-xs font-semibold tracking-[0.2em] uppercase text-[#555]">{step}</span>
                  <span className="text-lg opacity-30" style={{ color: LIME }}>→</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 max-w-6xl mx-auto">
        <SectionHeading label="Why Omnia" title={<>One app.<br />The entire workflow.</>} />
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard icon={<Zap size={20} />} title="Record once, reach everywhere" desc="Upload a single video. Omnia reformats, resizes, and optimises it for every platform — captions, aspect ratios, hooks included." delay={0} />
          <FeatureCard icon={<TrendingUp size={20} />} title="AI that learns your audience" desc="Track which hooks, formats, and topics drive growth. Omnia surfaces the patterns behind your best content and gets smarter every week." delay={0.1} />
          <FeatureCard icon={<Globe2 size={20} />} title="Publish at peak moments" desc="AI-powered timing analyses when your audience is most active across each platform, then publishes automatically at the right moment." delay={0.2} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-3xl mx-auto">
          <HowHeading />
          <StepRow n="01" title="Upload your raw footage" desc="Drop any video — long-form, podcast, Zoom, screen recording. No file preparation needed." />
          <StepRow n="02" title="Whisper transcribes with timestamps" desc="Word-level transcription with emotion detection. You see exactly what was said and when." />
          <StepRow n="03" title="Claude finds your 10 best clips" desc="AI scores each moment for hook strength, viral potential, and retention — ranked by industry." />
          <StepRow n="04" title="Edit in-browser" desc="Drag-to-trim timeline, waveform view, silence removal — no CapCut needed." />
          <StepRow n="05" title="Animate captions with Remotion" desc="Karaoke, bold pop, or minimal fade. Your brand kit applied to every render automatically." />
          <StepRow n="06" title="Render server-side" desc="AWS Lambda renders your final video at $0.003 per minute. Download or publish directly." />
          <StepRow n="07" title="Publish everywhere" desc="Claude rewrites your caption for each platform. Schedule with one click. Staggered posting." />
          <StepRow n="08" title="Learn what wins" desc="Analytics pulled from every platform. Feed performance back to Claude for smarter clips next time." />
        </div>
      </section>

      <QuoteSection />

      {/* PRICING */}
      <section id="pricing" className="py-32 px-6 border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Pricing" title="Simple, honest pricing." />
          <div className="grid md:grid-cols-4 gap-4">
            <PricingCard name="Free" price={0} features={['3 clips/month', 'AI clip detection', 'Basic captions', 'Manual download']} />
            <PricingCard name="Creator" price={49} features={['50 clips/month', 'Remotion renders', 'Auto-publish 2 platforms', 'Brand kit', 'Scheduling', 'Hook optimizer']} />
            <PricingCard name="Agency" price={149} features={['300 clips/month', 'Everything in Creator', '5 client workspaces', 'All platforms', 'Analytics dashboard', 'Priority rendering']} accent />
            <PricingCard name="Enterprise" price="Custom" features={['Unlimited everything', 'Custom AI training', 'White label', 'API access', 'Dedicated support']} />
          </div>
        </div>
      </section>

      <BottomCTA />

      {/* FOOTER */}
      <footer className="px-8 py-8 border-t border-[#1a1a1a] flex items-center justify-between flex-wrap gap-6">
        <span className="font-display text-xl tracking-widest text-[#555]">OMNI<span style={{ color: LIME }}>A</span></span>
        <div className="flex gap-8">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <Link key={l} href="#" className="text-xs tracking-wider uppercase text-[#555] hover:text-[#999] transition-colors">{l}</Link>
          ))}
        </div>
        <span className="text-xs text-[#333]">&copy; 2025 Omnia. All rights reserved.</span>
      </footer>
    </div>
  )
}
