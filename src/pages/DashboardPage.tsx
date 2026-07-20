import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { useNetworkStore } from '@/store/networkStore'
import { CONFLICTS, RECOMMENDATIONS } from '@/data/mockData'
import { cn, tMinusLabel } from '@/lib/utils'
import type { SystemEvent } from '@/types/domain'

// ─── Network Topology Map Canvas ─────────────────────────────────────────────
function TopologyMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const nodes = [
      { x: 180, y: 150, label: 'NDLS', color: '#adc6ff' },
      { x: 380, y: 100, label: 'GWL',  color: '#adc6ff' },
      { x: 580, y: 200, label: 'JHS',  color: '#ffb595' },
      { x: 280, y: 300, label: 'MTJ',  color: '#adc6ff' },
      { x: 480, y: 320, label: 'BPL',  color: '#adc6ff' },
    ]

    const edges = [
      [0, 1], [1, 2], [2, 4], [4, 3], [3, 0], [1, 3]
    ]

    const flows = [
      { edge: [0, 1], t: 0.2, speed: 0.15, color: '#adc6ff' },
      { edge: [1, 2], t: 0.6, speed: 0.12, color: '#ffb595' },
      { edge: [2, 4], t: 0.4, speed: 0.18, color: '#adc6ff' },
      { edge: [4, 3], t: 0.8, speed: 0.1,  color: '#adc6ff' },
    ]

    function draw(ts: number) {
      if (!canvas || !ctx) return
      const dt = (ts - timeRef.current) / 1000
      timeRef.current = ts

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const W = canvas.width / 800
      const H = canvas.height / 400

      // Edges
      edges.forEach(([a, b]) => {
        const from = nodes[a], to = nodes[b]
        ctx.beginPath()
        ctx.moveTo(from.x * W, from.y * H)
        ctx.lineTo(to.x * W, to.y * H)
        ctx.strokeStyle = '#353534'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      // Animated Flow Lines
      flows.forEach((flow) => {
        flow.t = (flow.t + dt * flow.speed) % 1
        const [ai, bi] = flow.edge
        const a = nodes[ai], b = nodes[bi]
        const x = (a.x + (b.x - a.x) * flow.t) * W
        const y = (a.y + (b.y - a.y) * flow.t) * H
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = flow.color
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = flow.color + '22'
        ctx.fill()
      })

      // Nodes
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x * W, n.y * H, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#0e0e0e'
        ctx.fill()
        ctx.strokeStyle = n.color
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = '#e5e2e1'
        ctx.font = '11px Geist Mono, monospace'
        ctx.fillText(n.label, n.x * W - 14, n.y * H - 12)
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame((ts) => {
      timeRef.current = ts
      frameRef.current = requestAnimationFrame(draw)
    })

    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// ─── Event Feed Log ──────────────────────────────────────────────────────────
function EventFeedLog() {
  const { events, addEvent } = useNetworkStore()

  useEffect(() => {
    const templates = [
      'INFO: Initialization of core_worker_01 complete.',
      'INFO: Handshake established with external gateway.',
      'WARN: Latency spike detected on node_cluster_B. Retrying...',
      'INFO: node_cluster_B stabilized. Current RTT: 15ms.',
      'CRITICAL: Consensus mismatch in partition_7. Initiating manual review.',
      'INFO: Logging packet trace to /var/log/cortex/trace_712.log',
    ]

    const id = setInterval(() => {
      const msg = templates[Math.floor(Math.random() * templates.length)]
      const level = msg.includes('CRITICAL') ? 'ERROR' : msg.includes('WARN') ? 'WARN' : 'INFO'
      addEvent({
        id: `EV-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level,
        message: msg,
      })
    }, 8000)
    return () => clearInterval(id)
  }, [addEvent])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [events])

  function fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <div
      ref={containerRef}
      className="p-8 font-mono-md text-mono-md flex-1 overflow-y-auto leading-relaxed text-on-surface-variant/60 scanline"
    >
      {events.slice(-18).map((ev: SystemEvent) => {
        const colorClass =
          ev.level === 'ERROR'
            ? 'text-error/70'
            : ev.level === 'WARN'
            ? 'text-tertiary/70'
            : 'text-primary/70'
        return (
          <p key={ev.id} className="animate-fade-in">
            <span className={colorClass}>[{fmtTime(ev.timestamp)}]</span>{' '}
            {ev.message}
          </p>
        )
      })}
      <p className="flex items-center gap-1">
        <span className="w-1.5 h-4 bg-primary/40 animate-pulse"></span>
      </p>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const navigate = useNavigate()
  const { state } = useNetworkStore()

  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Cortex Master Control" />

      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Live Network Topology */}
        <section className="col-span-12 lg:col-span-8 h-[540px] relative rounded-[2rem] overflow-hidden raycast-dots group glass-panel inner-glow border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
          <div className="absolute top-8 left-8 z-10">
            <h2 className="text-label-md font-bold uppercase tracking-[0.2em] text-primary mb-2">
              Live Network Topology
            </h2>
            <p className="text-headline-lg font-headline-md tracking-tight">Active Node Clusters</p>
          </div>

          {/* Map canvas */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <TopologyMapCanvas />
          </div>

          <div className="absolute bottom-8 right-8 flex gap-3">
            <div className="px-4 py-2 bg-surface-container/60 backdrop-blur rounded-xl text-[11px] font-mono-md text-on-surface-variant border border-white/5">
              ZONE_ALPHA: STABLE
            </div>
            <div className="px-4 py-2 bg-tertiary/10 backdrop-blur rounded-xl text-[11px] font-mono-md text-tertiary border border-tertiary/20">
              ZONE_BETA: LOAD_SPIKE
            </div>
          </div>
        </section>

        {/* Right Column: Critical Conflicts */}
        <section className="col-span-12 lg:col-span-4 h-[540px] flex flex-col gap-8">
          <div className="flex-1 glass-panel rounded-[2rem] inner-glow p-8 flex flex-col border border-white/5 overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-label-md font-bold uppercase tracking-[0.2em] text-error mb-2">
                  System Critical
                </h2>
                <p className="text-headline-md font-headline-md tracking-tight">Conflicts</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {CONFLICTS.slice(0, 2).map((c) => (
                <div key={c.id} className="p-4 bg-white/5 rounded-2xl floating-element border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-label-md font-mono-md text-on-surface tracking-wider">
                      {c.location.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-mono-md px-2 py-0.5 rounded',
                        c.severity === 'CRITICAL' ? 'bg-error/20 text-error' : 'bg-white/10 text-on-surface-variant'
                      )}
                    >
                      {tMinusLabel(c.tMinusMinutes)}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant/80">{c.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate('/conflicts')}
                      className="flex-1 py-2.5 bg-error text-on-error text-label-md font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Resolve
                    </button>
                    <button className="px-3 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Mini-cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface-container/30 rounded-[2rem] p-6 inner-glow floating-element border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
                Throughput
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-headline-md font-mono-md">1.2</span>
                <span className="text-label-md text-on-surface-variant/60">GB/S</span>
              </div>
            </div>
            <div className="bg-surface-container/30 rounded-[2rem] p-6 inner-glow floating-element border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
                CPU Usage
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-headline-md font-mono-md">44</span>
                <span className="text-label-md text-on-surface-variant/60">%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Row: Terminal Console */}
        <section className="col-span-12 lg:col-span-8 bg-black/40 rounded-[2rem] overflow-hidden flex flex-col glass-panel inner-glow border border-white/5">
          <div className="px-8 py-5 flex justify-between items-center border-b border-white/5 bg-surface-container-low/20">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-[11px] font-mono-md text-on-surface-variant/60 uppercase tracking-widest">
              System Events Log
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 hover:text-on-surface cursor-pointer">
              fullscreen
            </span>
          </div>
          <EventFeedLog />
        </section>

        {/* AI Recommendations/Intelligence */}
        <section className="col-span-12 lg:col-span-4 rounded-[2rem] p-8 glass-panel inner-glow flex flex-col justify-between border border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
              </div>
              <h2 className="text-label-md font-bold uppercase tracking-[0.2em] text-on-surface">Intelligence</h2>
            </div>

            <div className="space-y-8">
              {RECOMMENDATIONS.map((r, i) => (
                <div key={r.id} className="group cursor-default">
                  <div className="flex gap-4 items-start">
                    <div
                      className={cn(
                        'w-1.5 h-12 rounded-full transition-all group-hover:h-16',
                        i === 0
                          ? 'bg-primary group-hover:shadow-[0_0_15px_#adc6ff]'
                          : 'bg-tertiary group-hover:shadow-[0_0_15px_#ffb595]'
                      )}
                    />
                    <div>
                      <p className="text-body-lg text-on-surface font-semibold mb-1">
                        {r.action.split(' ').slice(0, 4).join(' ')}
                      </p>
                      <p className="text-body-md text-on-surface-variant/60 leading-relaxed">
                        {r.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate('/recommendations')}
              className="inline-flex items-center gap-2 text-label-md text-primary font-bold group"
            >
              View All Insights
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
