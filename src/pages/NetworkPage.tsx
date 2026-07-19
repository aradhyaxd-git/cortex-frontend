import { useEffect, useRef, useState, useCallback } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { STATIONS, SEGMENTS, CONFLICTS } from '@/data/mockData'
import { useNetworkStore } from '@/store/networkStore'
import { cn } from '@/lib/utils'
import type { Train, Station } from '@/types/domain'

function trainColor(t: Train): string {
  if (CONFLICTS.some((c) => c.trainIds.includes(t.id) && c.severity === 'CRITICAL')) return '#ffb4ab' // error / critical
  switch (t.status) {
    case 'RUNNING':  return '#adc6ff' // primary
    case 'DELAYED':  return '#ffb595' // tertiary
    case 'WAITING':  return '#e2e2e2' // secondary
    case 'STOPPED':  return '#ffb4ab' // error
    default:         return '#8b90a0'
  }
}

function getTrainXY(train: Train, stations: Station[]): { x: number; y: number } | null {
  if (train.currentStationId) {
    const s = stations.find((st) => st.id === train.currentStationId)
    return s ? { x: s.x, y: s.y } : null
  }
  if (train.currentSegmentId) {
    const seg = SEGMENTS.find((s) => s.id === train.currentSegmentId)
    if (!seg) return null
    const from = stations.find((s) => s.id === seg.sourceStationId)
    const to   = stations.find((s) => s.id === seg.destStationId)
    if (!from || !to) return null
    const t = train.direction === 'UP' ? 1 - train.segmentProgress : train.segmentProgress
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
  }
  return null
}

interface CanvasProps {
  selectedTrainId: string | null
  onSelectTrain: (id: string | null) => void
  zoom: number
}

function NetworkCanvas({ selectedTrainId, onSelectTrain, zoom }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const { state, updateTrainProgress } = useNetworkStore()
  const trains = state.trains

  useEffect(() => {
    const id = setInterval(updateTrainProgress, 100)
    return () => clearInterval(id)
  }, [updateTrainProgress])

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return
    const ctxElement = canvasElement.getContext('2d')
    if (!ctxElement) return

    const canvas = canvasElement
    const ctx = ctxElement

    function draw(ts: number) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = zoom * Math.min(canvas.width / 700, canvas.height / 420)
      const offX = (canvas.width - 700 * scale) / 2
      const offY = (canvas.height - 420 * scale) / 2

      function sx(v: number) { return offX + v * scale }
      function sy(v: number) { return offY + v * scale }

      // Draw segments
      SEGMENTS.forEach((seg) => {
        const from = STATIONS.find((s) => s.id === seg.sourceStationId)!
        const to   = STATIONS.find((s) => s.id === seg.destStationId)!
        const hasConflict = CONFLICTS.some(
          (c) => c.segmentId === seg.id && (c.severity === 'CRITICAL' || c.severity === 'HIGH')
        )

        if (hasConflict) {
          ctx.beginPath()
          ctx.moveTo(sx(from.x), sy(from.y))
          ctx.lineTo(sx(to.x), sy(to.y))
          ctx.strokeStyle = `rgba(255, 180, 171, ${0.25 + 0.15 * Math.sin(ts / 400)})`
          ctx.lineWidth = 14 * scale / zoom
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.moveTo(sx(from.x), sy(from.y))
        ctx.lineTo(sx(to.x), sy(to.y))
        ctx.strokeStyle = hasConflict ? '#93000a' : '#353534'
        ctx.lineWidth = seg.isSingleTrack ? 1.5 : 3
        ctx.lineWidth *= scale / zoom
        ctx.setLineDash(seg.isSingleTrack ? [5 * scale, 4 * scale] : [])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Draw stations
      STATIONS.forEach((station) => {
        const r = station.type === 'MAJOR' ? 8 : 5
        ctx.beginPath()
        ctx.arc(sx(station.x), sy(station.y), r * scale / zoom, 0, Math.PI * 2)
        ctx.fillStyle = '#0e0e0e'
        ctx.strokeStyle = '#adc6ff'
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#e5e2e1'
        ctx.font = `${Math.max(9, 10 * scale / zoom)}px Geist Mono, monospace`
        ctx.textAlign = 'center'
        ctx.fillText(station.code, sx(station.x), sy(station.y) + (r + 14) * scale / zoom)
      })

      // Draw trains
      trains.forEach((train) => {
        const pos = getTrainXY(train, STATIONS)
        if (!pos) return

        const color = trainColor(train)
        const isSelected = train.id === selectedTrainId
        const size = 8 * scale / zoom

        if (isSelected) {
          ctx.beginPath()
          ctx.arc(sx(pos.x), sy(pos.y), size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = color + '22'
          ctx.fill()
        }

        const dir = train.direction === 'DOWN' ? 1 : -1
        ctx.beginPath()
        ctx.moveTo(sx(pos.x) + size * dir, sy(pos.y))
        ctx.lineTo(sx(pos.x) - size * 0.6 * dir, sy(pos.y) - size * 0.7)
        ctx.lineTo(sx(pos.x) - size * 0.6 * dir, sy(pos.y) + size * 0.7)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trains, selectedTrainId, zoom])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const scale = zoom * Math.min(canvas.width / 700, canvas.height / 420)
    const offX = (canvas.width - 700 * scale) / 2
    const offY = (canvas.height - 420 * scale) / 2

    let closest: string | null = null
    let minD = 25

    trains.forEach((train) => {
      const pos = getTrainXY(train, STATIONS)
      if (!pos) return
      const sx = offX + pos.x * scale
      const sy = offY + pos.y * scale
      const d  = Math.hypot(cx - sx, cy - sy)
      if (d < minD) { minD = d; closest = train.id }
    })

    onSelectTrain(closest)
  }, [trains, zoom, onSelectTrain])

  return <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" onClick={handleClick} />
}

export function NetworkPage() {
  const [filter, setFilter] = useState<'ALL' | 'DELAYED' | 'CONFLICTS'>('ALL')
  const [zoom, setZoom] = useState(1)
  const { selectedTrainId, setSelectedTrain } = useNetworkStore()
  const trainDetail = useNetworkStore((s) => s.state.trains.find((t) => t.id === selectedTrainId))

  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Network View" />

      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Filters control bar */}
        <div className="col-span-12 flex justify-between items-center bg-surface-container/30 border border-white/5 p-4 rounded-[1.5rem] glass-panel">
          <div className="flex gap-2">
            {(['ALL', 'DELAYED', 'CONFLICTS'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 text-label-md font-bold rounded-lg transition-colors border border-white/5',
                  filter === f ? 'bg-primary text-on-primary' : 'bg-[#1c1b1b] text-on-surface-variant hover:text-on-surface'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 bg-[#1c1b1b] rounded-lg p-1 border border-white/5">
            <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))} className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">zoom_in</span>
            </button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">zoom_out</span>
            </button>
            <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Network View Panel Grid */}
        <div className="col-span-12 lg:col-span-8 h-[540px] relative rounded-[2rem] overflow-hidden raycast-dots group glass-panel inner-glow border border-white/5">
          <NetworkCanvas selectedTrainId={selectedTrainId} onSelectTrain={setSelectedTrain} zoom={zoom} />
        </div>

        {/* Right Detail Panel */}
        <div className="col-span-12 lg:col-span-4 h-[540px] glass-panel rounded-[2rem] inner-glow p-8 flex flex-col justify-between border border-white/5">
          {trainDetail ? (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-headline-md font-headline-md tracking-tight">
                      Train {trainDetail.number}
                    </h3>
                    <p className="text-label-md font-mono-md text-on-surface-variant/60">
                      {trainDetail.name.toUpperCase()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedTrain(null)} className="p-1.5 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-label-md text-on-surface-variant/60 font-semibold">Priority</span>
                    <span className="text-label-md font-mono-md text-on-surface">P{trainDetail.priority}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-label-md text-on-surface-variant/60 font-semibold">Status</span>
                    <span className="text-label-md font-mono-md text-on-surface">{trainDetail.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-label-md text-on-surface-variant/60 font-semibold">Delay</span>
                    <span className="text-label-md font-mono-md text-error">+{trainDetail.delayMinutes}m</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-label-md text-on-surface-variant/60 font-semibold">Speed</span>
                    <span className="text-label-md font-mono-md text-on-surface">{trainDetail.speedKmh} km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button className="w-full py-3 bg-primary text-on-primary text-label-md font-bold rounded-xl hover:shadow-[0_0_20px_rgba(173,198,255,0.3)] transition-all">
                  Resolve Conflict
                </button>
                <button className="w-full py-3 bg-white/5 text-on-surface text-label-md font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                  View Telemetry Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">info</span>
              <p className="text-body-lg text-on-surface font-semibold">No node selected</p>
              <p className="text-body-md text-on-surface-variant/60 mt-1">Click a moving train cluster marker on the canvas map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
