import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { SeverityBadge } from '@/components/shared/Badges'
import { CONFLICTS } from '@/data/mockData'
import { cn, tMinusLabel } from '@/lib/utils'
import type { ConflictSeverity, Conflict } from '@/types/domain'

const TABS: Array<{ key: ConflictSeverity | 'ALL'; label: string }> = [
  { key: 'ALL',      label: 'ALL' },
  { key: 'LOW',      label: 'LOW' },
  { key: 'MEDIUM',   label: 'MEDIUM' },
  { key: 'HIGH',     label: 'HIGH' },
  { key: 'CRITICAL', label: 'CRITICAL' },
]

function ConflictCard({ conflict }: { conflict: Conflict }) {
  const navigate = useNavigate()
  const isCritical = conflict.severity === 'CRITICAL'

  return (
    <div className="col-span-12 md:col-span-6 bg-surface-container/30 rounded-[2rem] p-8 inner-glow border border-white/5 floating-element flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SeverityBadge severity={conflict.severity} />
            <span className="text-label-md font-mono-md text-on-surface-variant/60">
              {conflict.location}
            </span>
          </div>
          <span className={cn(
            'text-[10px] font-mono-md px-2 py-0.5 rounded',
            isCritical ? 'bg-error/20 text-error' : 'bg-white/10 text-on-surface-variant'
          )}>
            {tMinusLabel(conflict.tMinusMinutes)}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn(
          'text-headline-md font-headline-md tracking-tight leading-tight',
          isCritical ? 'text-error' : 'text-on-surface'
        )}>
          {conflict.type}
        </h3>

        {/* Affected details */}
        <p className="text-body-md text-on-surface-variant/80 leading-relaxed">
          {conflict.description}
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => navigate('/recommendations')}
          className="flex-1 py-2.5 bg-primary text-on-primary text-label-md font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          View Recommendation
        </button>
        <button className="px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>
    </div>
  )
}

export function ConflictsPage() {
  const [activeTab, setActiveTab] = useState<ConflictSeverity | 'ALL'>('ALL')
  const [query, setQuery] = useState('')

  const filtered = CONFLICTS.filter((c) => {
    const matchTab = activeTab === 'ALL' || c.severity === activeTab
    const matchQ   = query === '' ||
      c.type.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase())
    return matchTab && matchQ
  })

  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Active Conflicts" />

      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Filter and Search controls */}
        <div className="col-span-12 flex items-center justify-between gap-4 flex-wrap bg-surface-container/30 border border-white/5 p-4 rounded-[1.5rem] glass-panel">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#1c1b1b] border border-white/5 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'px-4 py-2 text-label-md font-bold rounded-lg transition-colors',
                  activeTab === t.key
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative flex items-center bg-[#1c1b1b] border border-white/5 rounded-xl px-3 py-1.5 focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant/40 mr-2">search</span>
            <input
              type="text"
              placeholder="Filter by segment or ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-body-md text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        {/* Conflicts list */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          {filtered.map((c) => (
            <ConflictCard key={c.id} conflict={c} />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-12 flex flex-col items-center justify-center py-20 bg-surface-container/10 border border-dashed border-white/5 rounded-[2rem] text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-3">shield_check</span>
              <p className="text-body-lg text-on-surface font-semibold">No active conflicts detected</p>
              <p className="text-body-md text-on-surface-variant/60 mt-1">This corridor is fully clear and operational.</p>
            </div>
          )}
        </div>

        {/* Bottom stats row */}
        <div className="col-span-12 grid grid-cols-3 gap-6 pt-4">
          {[
            { label: 'Network Load', value: '42.8 GB/S', icon: 'speed' },
            { label: 'Active Driver Nodes', value: '1,024 ONLINE', icon: 'dns' },
            { label: 'Safety Index', value: '99.982%', icon: 'security' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-surface-container/30 rounded-[2rem] p-6 inner-glow floating-element border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
                {label}
              </span>
              <div className="mt-2 flex items-baseline">
                <span className="text-headline-md font-mono-md text-on-surface">{value}</span>
              </div>
              <span className="material-symbols-outlined text-[48px] text-white/5 absolute right-4 bottom-4 pointer-events-none">
                {icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
