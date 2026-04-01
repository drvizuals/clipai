import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Upload, FolderOpen, Zap, TrendingUp, ArrowRight, Film } from 'lucide-react'

const LIME = '#C8F135'

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  uploading:   { label: 'Uploading',   color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  transcribing:{ label: 'Transcribing',color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  analyzing:   { label: 'Analyzing',   color: '#C8F135', bg: 'rgba(200,241,53,0.1)' },
  ready:       { label: 'Ready',       color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  error:       { label: 'Error',       color: '#FF4444', bg: 'rgba(255,68,68,0.1)' },
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.uploading
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: s.color, background: s.bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: projectsData }, { count: clipsCount }] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('clips').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
  ])
  const projects = projectsData as import('@/lib/supabase/types').Project[] | null

  const firstName = (user?.user_metadata?.full_name as string)?.split(' ')[0] ?? 'there'

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-2xl font-semibold text-white mb-1">
          Good to see you, {firstName} 👋
        </h1>
        <p className="text-sm text-[#666]">Here&apos;s your content overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total projects', value: projects?.length ?? 0, icon: <FolderOpen size={16} /> },
          { label: 'Clips created', value: clipsCount ?? 0, icon: <Film size={16} /> },
          { label: 'Clips this month', value: 0, icon: <Zap size={16} /> },
          { label: 'Published', value: 0, icon: <TrendingUp size={16} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="p-5 rounded-xl border" style={{ background: '#111', borderColor: '#222' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#555]">{icon}</span>
            </div>
            <div className="font-display text-4xl text-white mb-1">{value}</div>
            <div className="text-xs text-[#666]">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/upload"
          className="group flex items-center gap-4 p-6 rounded-xl border border-[#222] hover:border-[#C8F135] transition-all duration-300 relative overflow-hidden"
          style={{ background: '#111' }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(ellipse at top left, rgba(200,241,53,0.05) 0%, transparent 60%)' }} />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: 'rgba(200,241,53,0.1)' }}>
            <Upload size={20} style={{ color: LIME }} />
          </div>
          <div className="relative flex-1">
            <div className="font-heading font-semibold text-white mb-1">Upload a video</div>
            <div className="text-sm text-[#666]">Start a new project from any video source</div>
          </div>
          <ArrowRight size={16} className="text-[#444] group-hover:text-[#C8F135] transition-colors relative" />
        </Link>

        <Link
          href="/projects"
          className="group flex items-center gap-4 p-6 rounded-xl border border-[#222] hover:border-[#333] transition-all duration-300"
          style={{ background: '#111' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#1a1a1a' }}>
            <FolderOpen size={20} className="text-[#555]" />
          </div>
          <div className="flex-1">
            <div className="font-heading font-semibold text-white mb-1">View all projects</div>
            <div className="text-sm text-[#666]">Browse, edit, and distribute your clips</div>
          </div>
          <ArrowRight size={16} className="text-[#444] group-hover:text-[#666] transition-colors" />
        </Link>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-white">Recent projects</h2>
          <Link href="/projects" className="text-xs text-[#555] hover:text-[#999] transition-colors">View all →</Link>
        </div>

        {!projects?.length ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-[#222]" style={{ background: '#0d0d0d' }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: '#1a1a1a' }}>
              <Film size={24} className="text-[#444]" />
            </div>
            <p className="text-[#555] text-sm mb-1">No projects yet</p>
            <p className="text-[#333] text-xs mb-6">Upload your first video to get started</p>
            <Link href="/upload" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: LIME, color: '#080808' }}>
              <Upload size={14} /> Upload video
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(p => (
              <Link
                key={p.id}
                href={`/editor/${p.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-[#0d0d0d] transition-all duration-200"
                style={{ background: '#0a0a0a' }}
              >
                {/* thumbnail placeholder */}
                <div className="w-16 h-10 rounded-md shrink-0 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
                  <Film size={14} className="text-[#444]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">{p.title}</div>
                  <div className="text-xs text-[#555] mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {p.duration ? ` · ${Math.round(p.duration / 60)}m ${Math.round(p.duration % 60)}s` : ''}
                  </div>
                </div>
                <StatusChip status={p.status ?? 'uploading'} />
                <ArrowRight size={14} className="text-[#333] shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
