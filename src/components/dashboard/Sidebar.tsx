'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  BarChart2,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

const LIME = '#C8F135'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
]

const BOTTOM_NAV = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0].toUpperCase() ?? 'U'

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-full border-r"
      style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: '#1a1a1a' }}>
        <Link href="/dashboard" className="font-display text-2xl tracking-widest text-white">
          OMNI<span style={{ color: LIME }}>A</span>
        </Link>
      </div>

      {/* Upload CTA */}
      <div className="px-4 py-4 border-b" style={{ borderColor: '#1a1a1a' }}>
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: LIME, color: '#080808' }}
        >
          <Upload size={14} />
          New upload
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                active ? 'text-white' : 'text-[#666] hover:text-[#999] hover:bg-[#111]'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: '#161616' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: LIME }} />
              )}
              <Icon size={16} className="relative shrink-0" style={{ color: active ? LIME : undefined }} />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="mx-3 mb-3 p-3 rounded-lg border" style={{ background: 'rgba(200,241,53,0.04)', borderColor: 'rgba(200,241,53,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={12} style={{ color: LIME }} />
          <span className="text-xs font-semibold" style={{ color: LIME }}>Free plan</span>
        </div>
        <p className="text-[10px] text-[#666] leading-relaxed mb-2.5">3 clips/month. Upgrade for unlimited renders.</p>
        <Link href="/pricing" className="block text-center text-[11px] font-semibold py-1.5 rounded-md transition-all hover:opacity-90" style={{ background: LIME, color: '#080808' }}>
          Upgrade
        </Link>
      </div>

      {/* Bottom nav + user */}
      <div className="px-3 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: '#1a1a1a' }}>
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200', active ? 'text-white bg-[#161616]' : 'text-[#666] hover:text-[#999] hover:bg-[#111]')}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-[#FF4444] hover:bg-[#111] transition-all duration-200 w-full">
          <LogOut size={16} />
          Sign out
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: LIME, color: '#080808' }}>
            {initials}
          </div>
          <span className="text-xs text-[#666] truncate">{user.email}</span>
        </div>
      </div>
    </aside>
  )
}
