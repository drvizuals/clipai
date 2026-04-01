'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, X, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LIME = '#C8F135'

const INDUSTRIES = [
  { value: 'general',     label: '🎬 General' },
  { value: 'founder',     label: '👤 Founder / Coach' },
  { value: 'agency',      label: '🏢 Agency' },
  { value: 'real_estate', label: '🏠 Real Estate' },
  { value: 'hotel',       label: '🏨 Hotel / Hospitality' },
  { value: 'spa',         label: '💆 Spa / Wellness' },
  { value: 'restaurant',  label: '🍽️ Restaurant' },
  { value: 'saas',        label: '💻 SaaS' },
]

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/mp4']
const MAX_SIZE = 2 * 1024 * 1024 * 1024 // 2 GB

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  return h ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`
}

export default function UploadPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [industry, setIndustry] = useState('general')
  const [duration, setDuration] = useState<number | null>(null)
  const [drag, setDrag] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const pickFile = useCallback((f: File) => {
    if (!ACCEPTED.includes(f.type)) { setError('Unsupported file type. Use MP4, MOV, WebM, MP3, or WAV.'); return }
    if (f.size > MAX_SIZE) { setError('File is too large. Maximum size is 2 GB.'); return }
    setError('')
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, ''))

    // Get video duration
    if (f.type.startsWith('video/')) {
      const url = URL.createObjectURL(f)
      const vid = document.createElement('video')
      vid.src = url
      vid.onloadedmetadata = () => { setDuration(vid.duration); URL.revokeObjectURL(url) }
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }, [pickFile])

  async function handleUpload() {
    if (!file || !title.trim()) return
    setUploadState('uploading')
    setProgress(0)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setUploadState('error'); return }

    // Create project row first
    const { data: projectRaw, error: projErr } = await supabase
      .from('projects')
      .insert({ user_id: user.id, title: title.trim(), industry, status: 'uploading', duration } as never)
      .select()
      .single()
    const project = projectRaw as import('@/lib/supabase/types').Project | null

    if (projErr || !project) { setError(projErr?.message ?? 'Failed to create project'); setUploadState('error'); return }

    // Upload file to Supabase Storage
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${project.id}/original.${ext}`

    // Simulate progress for large uploads (Supabase JS doesn't expose XHR progress)
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 90))
    }, 300)

    const { error: storageErr } = await supabase.storage
      .from('videos')
      .upload(path, file, { upsert: true, contentType: file.type })

    clearInterval(progressInterval)

    if (storageErr) {
      await supabase.from('projects').update({ status: 'error' } as never).eq('id', project!.id)
      setError(storageErr.message)
      setUploadState('error')
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(path)

    await supabase.from('projects').update({
      original_video_url: publicUrl,
      status: 'transcribing',
    } as never).eq('id', project!.id)

    setProgress(100)
    setUploadState('success')

    setTimeout(() => router.push(`/projects`), 1500)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-white mb-1">Upload a video</h1>
        <p className="text-sm text-[#666]">Omnia will transcribe it and find your best clips automatically.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 mb-6 cursor-pointer ${drag ? 'border-[#C8F135] bg-[rgba(200,241,53,0.04)]' : 'border-[#2a2a2a] hover:border-[#444]'}`}
        style={{ background: drag ? undefined : '#0d0d0d' }}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }} />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: drag ? 'rgba(200,241,53,0.12)' : '#1a1a1a' }}>
                <Upload size={28} style={{ color: drag ? LIME : '#444' }} />
              </div>
              <p className="font-heading font-semibold text-white mb-2">
                {drag ? 'Drop it here' : 'Drag & drop your video'}
              </p>
              <p className="text-sm text-[#555] mb-4">or click to browse</p>
              <p className="text-xs text-[#333]">MP4, MOV, WebM, MP3, WAV · Up to 2 GB</p>
            </motion.div>
          ) : (
            <motion.div key="file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(200,241,53,0.1)' }}>
                <Film size={20} style={{ color: LIME }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-[#555] mt-0.5">
                  {formatBytes(file.size)}
                  {duration != null ? ` · ${formatDuration(duration)}` : ''}
                </p>
              </div>
              <button onClick={e => { e.stopPropagation(); setFile(null); setDuration(null) }} className="text-[#444] hover:text-[#999] transition-colors p-1">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-lg border border-[#FF4444]/20 bg-[#FF4444]/8 mb-6 text-sm text-[#FF4444]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </motion.div>
      )}

      {/* Form */}
      <div className="space-y-5 p-6 rounded-xl border border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
        <div>
          <label className="block text-xs text-[#999] mb-2 tracking-wide">Project title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="My awesome video"
            className="w-full px-4 py-3 rounded-lg border border-[#2a2a2a] bg-[#111] text-sm text-white placeholder-[#444] outline-none focus:border-[#C8F135] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[#999] mb-2 tracking-wide">Industry</label>
          <p className="text-xs text-[#555] mb-3">Omnia uses this to optimise AI clip scoring and caption tone.</p>
          <div className="grid grid-cols-2 gap-2">
            {INDUSTRIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setIndustry(value)}
                className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 border ${
                  industry === value
                    ? 'border-[#C8F135] text-white'
                    : 'border-[#222] text-[#666] hover:border-[#333] hover:text-[#999]'
                }`}
                style={industry === value ? { background: 'rgba(200,241,53,0.06)' } : { background: '#111' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload button / progress */}
      <div className="mt-6">
        {uploadState === 'uploading' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-[#555] mb-2">
              <span>Uploading…</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: LIME }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00FF88' }}>
            <CheckCircle size={16} />
            Upload complete! Taking you to your projects…
          </motion.div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || !title.trim() || uploadState === 'uploading' || uploadState === 'success'}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: LIME, color: '#080808' }}
        >
          {uploadState === 'uploading'
            ? <><span className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" /><span>Uploading…</span></>
            : <><Upload size={16} /><span>Upload & start AI analysis</span></>}
        </button>
        <p className="text-center text-xs text-[#333] mt-3">
          Whisper will transcribe your video · Claude will find your best 10 clips · Usually takes 2–5 minutes
        </p>
      </div>
    </div>
  )
}
