import { TopBar } from '@/components/layout/TopBar'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { ActionBadge } from '@/components/shared/Badges'
import { AUDIT_RECORDS } from '@/data/mockData'

function fmtTs(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
}

export function AuditPage() {
  return (
    <div className="flex-1 w-full min-h-screen">
      <TopBar title="Audit Logs" />
      <div className="pt-24 px-margin-desktop pb-margin-desktop max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


        {/* Audit Table Container */}
        <div className="col-span-12 bg-surface-container/30 rounded-[2rem] p-8 inner-glow border border-white/5 overflow-hidden">
          <h2 className="text-headline-md font-headline-md tracking-tight mb-6">Decision Audit Trail</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-on-surface-variant/60 font-mono-md">
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Timestamp</th>
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Recommendation</th>
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Affected Node</th>
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Action Code</th>
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Delay Impact</th>
                  <th className="py-4 px-4 text-label-md font-bold uppercase tracking-wider">Logs / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-body-md text-on-surface-variant/80">
                {AUDIT_RECORDS.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono-md text-[13px]">{fmtTs(r.timestamp)}</td>
                    <td className="py-4 px-4 font-semibold text-on-surface">{r.recommendation}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5">
                        {r.affectedTrains.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <ActionBadge action={r.controllerAction} />
                    </td>
                    <td className="py-4 px-4 font-mono-md font-bold text-primary">
                      {r.delayImpact}
                    </td>
                    <td className="py-4 px-4 text-xs italic text-on-surface-variant/40">
                      {r.notes ?? 'System check verified.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
