import { useEffect, useState } from 'react'

interface TopBarProps {
  title: string
  subtitle?: string
  badge?: string
  children?: React.ReactNode
}

export function TopBar({ title, subtitle, badge, children }: TopBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector('input')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="fixed top-8 left-[calc(50%+128px)] -translate-x-1/2 w-full max-w-2xl z-[60] p-1 glass-panel rounded-2xl shadow-[0px_40px_100px_rgba(0,0,0,0.6)] flex items-center gap-4 inner-glow border border-white/5">
      <div className="flex items-center flex-1 px-4 text-on-surface-variant focus-within:text-primary transition-colors">
        <span className="material-symbols-outlined text-[20px] mr-2">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or execute commands (⌘K)"
          className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-mono-md font-mono-md text-on-surface placeholder:text-on-surface-variant/40"
        />
      </div>
      <div className="flex items-center gap-2 pr-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-highest/30 rounded-lg">
          <kbd className="text-[10px] font-mono-md text-on-surface-variant">⌘</kbd>
          <kbd className="text-[10px] font-mono-md text-on-surface-variant">K</kbd>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-opacity">
          Execute
        </button>
      </div>
    </header>
  )
}
