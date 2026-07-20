import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { cn } from '@/lib/utils'

const SCENARIOS = [
  { id: 'sc-1', name: 'Basic Crossing Loop', desc: 'Simulate single track crossing loop resolution.' },
  { id: 'sc-2', name: 'Priority Conflict', desc: 'Shatabdi vs Goods train scheduling conflict.' },
  { id: 'sc-3', name: 'Cascade Delay', desc: 'Cascading terminal delay simulation.' },
  { id: 'sc-4', name: 'Disruption Handling', desc: 'Track maintenance block rerouting simulation.' },
]

export function SimulationPage() {
  const [activeScenario, setActiveScenario] = useState('sc-1')
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE')
  const [speed, setSpeed] = useState<'1x' | '2x' | '5x'>('1x')

  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Simulation Control" />
      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Left side Scenario selection panel */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container/30 rounded-[2rem] p-8 inner-glow border border-white/5 flex flex-col">
            <h2 className="text-headline-md font-headline-md tracking-tight mb-6">Select Scenario</h2>

            <div className="space-y-4">
              {SCENARIOS.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id)}
                  className={cn(
                    'p-4 rounded-2xl cursor-pointer border transition-all duration-150',
                    activeScenario === sc.id
                      ? 'bg-primary/10 border-primary text-on-surface shadow-[0_0_15px_rgba(173,198,255,0.15)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-on-surface-variant'
                  )}
                >
                  <p className="text-body-lg font-semibold">{sc.name}</p>
                  <p className="text-body-md text-on-surface-variant/60 mt-1">{sc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Controls */}
          <div className="bg-surface-container/30 rounded-[2rem] p-8 inner-glow border border-white/5 flex flex-col gap-6">
            <h3 className="text-label-md font-bold uppercase tracking-[0.2em] text-on-surface">Execution Settings</h3>

            <div className="flex gap-2">
              <button
                onClick={() => setStatus('RUNNING')}
                className={cn(
                  'flex-1 py-3 text-label-md font-bold rounded-xl transition-all flex items-center justify-center gap-2 border',
                  status === 'RUNNING'
                    ? 'bg-primary text-on-primary border-primary shadow-[0_0_20px_rgba(173,198,255,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-on-surface'
                )}
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                Start Simulation
              </button>
              <button
                onClick={() => setStatus('PAUSED')}
                className={cn(
                  'py-3 px-5 text-label-md font-bold rounded-xl transition-all border flex items-center justify-center',
                  status === 'PAUSED'
                    ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_20px_rgba(255,181,149,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-on-surface'
                )}
              >
                <span className="material-symbols-outlined text-[18px]">pause</span>
              </button>
              <button
                onClick={() => { setStatus('IDLE') }}
                className="py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/5 text-on-surface text-label-md font-bold rounded-xl transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">stop</span>
              </button>
            </div>

            {/* Speed config */}
            <div className="flex justify-between items-center bg-[#1c1b1b] border border-white/5 rounded-xl p-1">
              <span className="text-label-md text-on-surface-variant/60 font-semibold pl-3">Simulation Speed</span>
              <div className="flex gap-1">
                {(['1x', '2x', '5x'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      'px-4 py-1.5 text-label-md font-bold rounded-lg transition-colors',
                      speed === s ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right side interactive monitor */}
        <section className="col-span-12 lg:col-span-7 bg-surface-container/30 rounded-[2rem] p-8 inner-glow border border-white/5 flex flex-col justify-between h-[540px]">
          <div>
            <h2 className="text-headline-md font-headline-md tracking-tight mb-4">Simulation Monitor</h2>
            <div className="rounded-[1.5rem] bg-[#0e0e0e] border border-white/5 h-64 flex flex-col items-center justify-center text-center p-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">dns</span>
              <p className="text-body-lg text-on-surface font-semibold">Active Monitoring Panel</p>
              <p className="text-body-md text-on-surface-variant/60 mt-1">Simulation engine state is currently: {status}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-label-md font-bold uppercase tracking-[0.2em] text-on-surface">Inject Action Cluster</h3>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-on-surface text-label-md font-bold rounded-xl border border-white/5 transition-all">
                Inject Delay Node
              </button>
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-on-surface text-label-md font-bold rounded-xl border border-white/5 transition-all">
                Block Track Segment
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
