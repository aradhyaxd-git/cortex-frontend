import { Sidebar } from './Sidebar'
import trainBg from '@/assets/train-bg.png'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 h-screen overflow-y-auto relative bg-[#0e0e0e]">
        {/* Background Atmospheric Effect */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-xs opacity-50"
            style={{
              backgroundImage: `url(${trainBg})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent" />
        </div>

        {/* Core Layout Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
