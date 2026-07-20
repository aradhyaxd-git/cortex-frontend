import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/dashboard',      label: 'Dashboard',       icon: 'dashboard' },
  { to: '/network',        label: 'Network',          icon: 'analytics' },
  { to: '/conflicts',      label: 'Conflicts',        icon: 'terminal' },
  { to: '/recommendations',label: 'Recommendations',  icon: 'security' },
  { to: '/simulation',     label: 'Simulation',       icon: 'deployed_code' },
  { to: '/audit',          label: 'Audit',            icon: 'database' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col p-space-md z-50 bg-surface/40 backdrop-blur-md border-r border-white/5">
      <div className="mb-space-xl px-2">
        <h1 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>deployed_code</span>
          Cortex Engine
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {NAV.map(({ to, label, icon }) => {
          const active = location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
              )}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-label-md font-label-md">{label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer / Info */}
      <div className="mt-auto pt-space-md">
        <button className="w-full py-3 mb-space-md bg-primary text-on-primary text-label-md font-bold rounded-xl hover:shadow-[0_0_20px_rgba(173,198,255,0.3)] transition-all">
          Deploy New Node
        </button>
        <div className="space-y-1">
          <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined">description</span>
            <span className="text-label-md font-label-md">Docs</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined">help</span>
            <span className="text-label-md font-label-md">Support</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
