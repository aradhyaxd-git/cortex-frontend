import { useNetworkStore } from '@/store/networkStore'

export function GlobalHeader() {
  const { state } = useNetworkStore()

  return (
    <div className="w-full flex items-center justify-between py-6 px-4 mb-2">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#adc6ff] animate-pulse"></span>
          <span className="text-label-md font-mono-md tracking-wider text-on-surface/80 uppercase">
            SYSTEM_HEALTH: OPERATIONAL
          </span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant/60">
          <span className="material-symbols-outlined text-[18px]">speed</span>
          <span className="text-label-md font-mono-md">12ms LATENCY</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant/60">
          <span className="material-symbols-outlined text-[18px]">dns</span>
          <span className="text-label-md font-mono-md">
            {state.activeTrains.toLocaleString()} NODES
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="material-symbols-outlined text-on-surface-variant/60 cursor-pointer hover:text-primary transition-colors">
          notifications
        </span>
        <div className="flex items-center gap-3 p-1 pl-3 bg-surface-container/30 rounded-full border border-white/5">
          <span className="text-label-md font-medium text-on-surface-variant/80">Arch. J. Doe</span>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFEnI_AjUK-z90I6DSKDED_8xQj9rIBDDpABUqCrXo6jumZJiI-gBD7UvBK4GmgJuVRu0DmELH72kONdOY-lc8Zog2Uawiz6qK_qqoFitZCEzFZM9fUwmt4JiPv55MOY0oWITuQqvgfNkMbPC4pffPDdyGYgaLY_RBohW0d_08r6GokC4p-L0x4OxUEcWO6WadG0CoPJqSrssg2PMOaApkVUoEGtFBFbzIerWGPNoMD0j-grOzR3OP"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
