import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { RECOMMENDATIONS, EXPLANATIONS } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/domain'

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING')
  const explanation = EXPLANATIONS[rec.id]
  const pct = Math.round(rec.confidenceScore * 100)

  return (
    <div className={cn(
      'rounded-[2rem] p-8 inner-glow border transition-all duration-300 bg-surface-container/30',
      status === 'ACCEPTED' ? 'border-primary/40' :
      status === 'REJECTED' ? 'border-error/40' : 'border-white/5'
    )}>
      <div className="space-y-4">
        {/* Info label row */}
        <div className="flex justify-between items-center">
          <span className="text-label-md font-mono-md text-on-surface-variant/60 uppercase">
            Confidence Index: {pct}%
          </span>
          <span className={cn(
            'text-[10px] font-mono-md px-2 py-0.5 rounded',
            status === 'ACCEPTED' ? 'bg-primary/20 text-primary' :
            status === 'REJECTED' ? 'bg-error/20 text-error' : 'bg-white/10 text-on-surface-variant'
          )}>
            {status}
          </span>
        </div>

        {/* Action Header */}
        <h3 className="text-headline-md font-headline-md text-on-surface tracking-tight">
          {rec.action}
        </h3>

        {/* Confidence rating slider preview */}
        <div className="w-full bg-[#1c1b1b] rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              pct >= 85 ? 'bg-primary' : pct >= 65 ? 'bg-tertiary' : 'bg-error'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Explanation text summary */}
        <p className="text-body-md text-on-surface-variant/80 leading-relaxed">
          {rec.reason}
        </p>

        {/* Details Toggle Accordion */}
        {expanded && explanation && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3 font-mono text-xs text-on-surface-variant/80">
            <p><span className="text-primary/70">[SITUATION]</span> {explanation.situation}</p>
            <p><span className="text-primary/70">[DECISION]</span> {explanation.decision}</p>
            <p><span className="text-primary/70">[REASONING]</span> {explanation.reasoning}</p>
            <p><span className="text-primary/70">[OUTCOME]</span> {explanation.expectedOutcome}</p>
            <p><span className="text-primary/70">[FUTURE]</span> {explanation.futureConsequences}</p>
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-label-md text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
            {expanded ? 'Hide Insights Log' : 'View Insights Log'}
          </button>

          {status === 'PENDING' && (
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('ACCEPTED')}
                className="px-5 py-2 bg-primary text-on-primary text-label-md font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Accept
              </button>
              <button
                onClick={() => setStatus('REJECTED')}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-on-surface text-label-md font-bold rounded-xl transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {status !== 'PENDING' && (
            <button
              onClick={() => setStatus('PENDING')}
              className="text-label-md text-on-surface-variant hover:text-on-surface hover:underline"
            >
              Reset Decision
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function RecommendationsPage() {
  const [tab, setTab] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING')

  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Recommendation Center" />
      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Tab filters */}
        <div className="col-span-12 flex bg-surface-container/30 border border-white/5 p-4 rounded-[1.5rem] glass-panel w-fit">
          <div className="flex gap-1 bg-[#1c1b1b] border border-white/5 rounded-xl p-1">
            {(['PENDING', 'ACCEPTED', 'REJECTED'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-2 text-label-md font-bold rounded-lg transition-colors',
                  tab === t ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations list */}
        <div className="col-span-12 space-y-6 max-w-4xl">
          {RECOMMENDATIONS.map((r) => (
            <RecommendationCard key={r.id} rec={r} />
          ))}
        </div>
      </div>
    </div>
  )
}
