import { cn } from '@/lib/utils'
import type { ConflictSeverity, TrainStatus, ControllerAction } from '@/types/domain'

// ─── Severity Badge ──────────────────────────────────────────────────────────
const severityConfig: Record<ConflictSeverity, { label: string; classes: string }> = {
  CRITICAL: { label: 'CRITICAL', classes: 'bg-red-500/20 text-red-400 border-red-500/40' },
  HIGH:     { label: 'HIGH',     classes: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  MEDIUM:   { label: 'MEDIUM',  classes: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  LOW:      { label: 'LOW',     classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
}

export function SeverityBadge({ severity, className }: { severity: ConflictSeverity; className?: string }) {
  const { label, classes } = severityConfig[severity]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider border rounded-sm', classes, className)}>
      {label}
    </span>
  )
}

// ─── Status Pill ─────────────────────────────────────────────────────────────
const statusConfig: Record<TrainStatus, { label: string; dot: string; text: string }> = {
  RUNNING:   { label: 'RUNNING',   dot: 'bg-emerald-400', text: 'text-emerald-400' },
  DELAYED:   { label: 'DELAYED',   dot: 'bg-amber-400',   text: 'text-amber-400' },
  WAITING:   { label: 'WAITING',   dot: 'bg-blue-400',    text: 'text-blue-400' },
  CROSSING:  { label: 'CROSSING',  dot: 'bg-purple-400',  text: 'text-purple-400' },
  STOPPED:   { label: 'STOPPED',   dot: 'bg-red-400',     text: 'text-red-400' },
  COMPLETED: { label: 'COMPLETED', dot: 'bg-[#475569]',   text: 'text-[#475569]' },
}

export function TrainStatusBadge({ status }: { status: TrainStatus }) {
  const { label, dot, text } = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-mono font-medium', text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}

// ─── Controller Action Badge ──────────────────────────────────────────────────
const actionConfig: Record<ControllerAction, { label: string; classes: string }> = {
  ACCEPTED:   { label: 'ACCEPTED',   classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  REJECTED:   { label: 'REJECTED',   classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
  OVERRIDDEN: { label: 'OVERRIDDEN', classes: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  IGNORED:    { label: 'IGNORED',    classes: 'bg-[#1C2333] text-[#475569] border-[#1F2D40]' },
}

export function ActionBadge({ action }: { action: ControllerAction }) {
  const { label, classes } = actionConfig[action]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider border rounded-sm', classes)}>
      {label}
    </span>
  )
}

// ─── Level Badge (events) ─────────────────────────────────────────────────────
const levelConfig: Record<string, string> = {
  INFO:  'text-blue-400',
  WARN:  'text-amber-400',
  RECO:  'text-purple-400',
  ERROR: 'text-red-400',
}

export function EventLevelBadge({ level }: { level: string }) {
  return (
    <span className={cn('font-mono text-[10px] font-bold tracking-widest w-10 text-right', levelConfig[level] ?? 'text-[#94A3B8]')}>
      {level}
    </span>
  )
}
