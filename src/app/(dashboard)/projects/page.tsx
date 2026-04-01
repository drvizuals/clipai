import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Upload, Film, ArrowRight, Search } from 'lucide-react'
import type { Project } from '@/lib/supabase/types'

const LIME = '#C8F135'

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  uploading:    { label: 'Uploading',    color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  transcribing: { label: 'Transcribing', color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  analyzing:    { label: 'Analyzing',    color: '#C8F135', bg: 'rgba(200,241,53,0.1)' },
  ready:        { label: 'Ready',        color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  error:        { label: 'Error',        color: '#FF4444', bg: 'rgba(255,68,68,0.1)' },
}

const INDUSTRY_LABELS: Record<string, string> = {
  founder: '👤 Founder', agency: '🏢 Agency', real_estate: '🏠 Real Estate',
  hotel: '🏨 Hotel', spa: '💆 Spa', restaurant: '🍽️ Restaurant',
  saas: '💻 SaaS', general: '🎬 General',
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.uploading
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ color: s.color, background: s.bg }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/editor/${project.id}`}
      className="group flex flex-col rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] overflow-hidden transition-all duration-200 hover:translate-y-[-1px]"
      style={{ background: '#0d0d0d' }}
    >
      {/* thumbnail */}
      <div className="aspect-video relative overflow-hidden" style={{ background: '#1a1a1a' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Film size={32} className="text-[#2a2a2a]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {project.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(0,0,0,0.8)', color: '#999' }}>
            {Math.floor(project.duration / 60)}:{String(Math.round(project.duration % 60)).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm text-white leading-snug line-clamp-2 flex-1">{project.title}</h3>
          <StatusChip status={project.status ?? 'uploading'} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
          <span className="text-xs text-[#555]">
            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-[#555]">
            {INDUSTRY_LABELS[project.industry] ?? '🎬 General'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projectsRaw } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  const projects = projectsRaw as Project[] | null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white mb-1">Projects</h1>
          <p className="text-sm text-[#666]">{projects?.length ?? 0} project{projects?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: LIME, color: '#080808' }}
        >
          <Upload size={14} /> New project
        </Link>
      </div>

      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-xl border border-dashed border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ background: '#1a1a1a' }}>
            <Film size={28} className="text-[#333]" />
          </div>
          <h2 className="font-heading font-semibold text-white mb-2">No projects yet</h2>
          <p className="text-sm text-[#555] mb-8 text-center max-w-xs">
            Upload your first video. Omnia will transcribe it and find your best clips with AI.
          </p>
          <Link href="/upload" className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: LIME, color: '#080808' }}>
            <Upload size={14} /> Upload your first video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map(p => <ProjectCard key={p.id} project={p as Project} />)}
        </div>
      )}
    </div>
  )
}
