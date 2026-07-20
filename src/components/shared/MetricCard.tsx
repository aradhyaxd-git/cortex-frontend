import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendDir?: 'up' | 'down' | 'neutral'
  danger?: boolean
  warning?: boolean
  highlighted?: boolean
  sub?: string
}

export function MetricCard({
  label, value, icon: Icon, trend, trendDir, danger, warning, highlighted, sub,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-2 rounded-lg border p-4 bg-[#111827] transition-all',
        danger   && 'border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.12)]',
        warning  && 'border-amber-500/40',
        highlighted && 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        !danger && !warning && !highlighted && 'border-[#1F2D40]',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
        <Icon
          size={16}
          className={cn(
            danger   ? 'text-red-400' :
            warning  ? 'text-amber-400' :
            highlighted ? 'text-amber-300' :
            'text-[#475569]',
          )}
        />
      </div>

      <div className="flex items-end gap-2">
        <span
          className={cn(
            'text-3xl font-bold font-mono leading-none',
            danger      ? 'text-red-400' :
            warning     ? 'text-amber-400' :
            highlighted ? 'text-amber-300' :
            'text-[#F1F5F9]',
          )}
        >
          {value}
        </span>
        {highlighted && (
          <span className="text-2xl text-amber-400 font-bold mb-0.5">!</span>
        )}
        {trend && (
          <span
            className={cn(
              'text-xs font-medium mb-0.5',
              trendDir === 'up'   ? 'text-emerald-400' :
              trendDir === 'down' ? 'text-red-400' :
              'text-[#94A3B8]',
            )}
          >
            {trendDir === 'up' ? '▲' : trendDir === 'down' ? '▼' : ''} {trend}
          </span>
        )}
      </div>

      {sub && (
        <p className="text-[11px] text-[#94A3B8] font-mono">{sub}</p>
      )}
    </div>
  )
}
