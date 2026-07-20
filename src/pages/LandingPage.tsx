import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  AlertTriangle, Lightbulb, ShieldCheck, Eye, Search,
  BarChart3, CheckCircle, Bell, User, ArrowRight, Zap,
} from 'lucide-react'
import trainBg from '@/assets/train-bg.png'


function NavBar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 transition-all ${scrolled ? 'bg-[#0A0E1A]/95 backdrop-blur border-b border-[#1F2D40]' : ''}`}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-[#F1F5F9] tracking-widest">CORTEX</span>
        </div>
        <div className="flex gap-6">
          {['Home', 'Network', 'Simulation'].map((l) => (
            <a key={l} href="#" className="text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">{l}</a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink-dot" />
          <span className="text-xs font-medium text-emerald-400">Simulation Active</span>
        </div>
        <button className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9]"><Bell size={16} /></button>
        <button className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9]"><User size={16} /></button>
      </div>
    </nav>
  )
}

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center pt-20 px-8 max-w-7xl mx-auto">
      <div className="flex-1 max-w-2xl pr-12">
        <div className="flex gap-2 mb-6">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 rounded-sm uppercase tracking-wider">
            Version 6.2 Release
          </span>
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 rounded-sm uppercase tracking-wider">
            Enhanced Neural Routing
          </span>
        </div>

        <h1 className="text-6xl font-bold leading-tight text-[#F1F5F9] mb-4">
          <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CORTEX</span>
          <br />
          Railway Conflict
          <br />
          Management at Network{' '}
          <span className="italic" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SPEED
          </span>
        </h1>

        <p className="text-base text-[#94A3B8] leading-relaxed mb-8 max-w-lg">
          Precision orchestration for high-density rail corridors.{' '}
          <strong className="text-[#F1F5F9] font-semibold">AI-detected conflicts. Human decisions.</strong>{' '}
          CORTEX masters your network throughput with sub-second resolution.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/simulation')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Launch Demo <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm font-semibold text-[#94A3B8] border border-[#1F2D40] rounded-md hover:bg-[#111827] hover:text-[#F1F5F9] transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Hero mockup card */}
      <div className="flex-1 flex justify-end">
        <div className="w-[480px] rounded-xl border border-[#1F2D40] bg-[#111827] overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1F2D40]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs font-mono text-[#475569] ml-2">CORTEX — MASTER CONTROL LIVE</span>
          </div>
          {/* Mock dashboard content */}
          <div className="p-4 space-y-3">
            <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 animate-pulse-glow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-red-400 font-mono uppercase">CRITICAL CONFLICT</span>
                <span className="text-[10px] font-mono text-red-400">T-MINUS 12M</span>
              </div>
              <p className="text-xs text-[#94A3B8]">GWL_TRACK_TBs — Intersection overlap at 122°s</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: 'Active Trains', v: '1,284', c: 'text-emerald-400' },
                { l: 'Conflicts',     v: '4',     c: 'text-red-400' },
                { l: 'Delay',         v: '+42m',  c: 'text-amber-400' },
              ].map(({ l, v, c }) => (
                <div key={l} className="rounded bg-[#1C2333] border border-[#1F2D40] p-2.5">
                  <p className="text-[9px] text-[#475569] uppercase tracking-wider">{l}</p>
                  <p className={`text-lg font-mono font-bold mt-0.5 ${c}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="h-24 rounded bg-[#0A0E1A] border border-[#1F2D40] flex items-center justify-center">
              <span className="text-xs text-[#1F2D40] font-mono">▸ NETWORK TOPOLOGY RENDERING</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: AlertTriangle,
      title: 'Detect Conflicts',
      desc: 'Proactive identification of overlaps, speed violations, and infrastructure bottlenecks across the entire network in real-time.',
      color: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    {
      icon: Lightbulb,
      title: 'Recommend Actions',
      desc: 'Neural optimization engine generates viable re-route and re-timing strategies to preserve schedule integrity and safety.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Explain Decisions',
      desc: "Transparent AI logic provides the 'Why' behind every recommendation, ensuring human operators maintain total cognitive control.",
      color: 'text-amber-400',
      border: 'border-amber-500/20',
    },
  ]

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc, color, border }) => (
          <div key={title} className={`rounded-xl border ${border} bg-[#111827] p-6 space-y-4`}>
            <Icon size={24} className={color} />
            <h3 className="text-base font-semibold text-[#F1F5F9]">{title}</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ArchitectureSection() {
  const steps = [
    { icon: Eye,       label: 'Observe',   desc: 'Ingest telemetry from 120+ sensors' },
    { icon: Search,    label: 'Detect',    desc: 'Realtime network-wide anomalies' },
    { icon: BarChart3, label: 'Recommend', desc: 'Calculate optimal resolution paths' },
    { icon: CheckCircle,label: 'Decide',  desc: 'Deploy changes to live trains' },
  ]

  return (
    <section className="py-24 bg-[#111827] border-y border-[#1F2D40]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-mono font-bold text-[#475569] uppercase tracking-widest mb-2">System Architecture</p>
          <h2 className="text-3xl font-bold text-[#F1F5F9]">The Intelligence Loop</h2>
        </div>
        <div className="flex items-start justify-center gap-0">
          {steps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex items-start">
              <div className="flex flex-col items-center text-center w-40">
                <div className="w-14 h-14 rounded-full bg-[#1C2333] border border-[#1F2D40] flex items-center justify-center mb-3">
                  <Icon size={22} className="text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-[#F1F5F9]">{label}</p>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center mt-7 mx-1">
                  <div className="w-10 h-px bg-[#1F2D40]" />
                  <ArrowRight size={12} className="text-[#1F2D40]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {/* Predictive Latency */}
        <div className="rounded-xl border border-[#1F2D40] bg-[#111827] p-8">
          <h3 className="text-xl font-bold text-[#F1F5F9] mb-2">Predictive Latency Analysis</h3>
          <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
            Our neural engine simulates 1.2M potential scenarios every minute to ensure the most robust recovery strategies.
          </p>
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-[#475569] uppercase tracking-widest">RTR Reduction</p>
            <p className="text-6xl font-bold" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              42%
            </p>
          </div>
        </div>

        {/* SIL-4 */}
        <div className="rounded-xl border border-[#1F2D40] bg-[#111827] p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-blue-400" />
              <h3 className="text-xl font-bold text-[#F1F5F9]">SIL-4 Compliant</h3>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Built to the highest safety integrity standards required for European and North American rail networks. Full safety by design.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'System Health', sub: 'Active Nodes', val: '1,284', pct: 95 },
              { label: '',              sub: 'Buffer Capacity', val: '98%', pct: 98 },
            ].map(({ sub, val, pct }) => (
              <div key={sub} className="space-y-1">
                <div className="flex justify-between text-xs text-[#94A3B8]">
                  <span>{sub}</span><span className="font-mono">{val}</span>
                </div>
                <div className="h-1 bg-[#1C2333] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-[#1F2D40] bg-[#111827] p-12 text-center">
        <h2 className="text-3xl font-bold text-[#F1F5F9] mb-3">Ready to optimize your network?</h2>
        <p className="text-sm text-[#94A3B8] mb-8">
          Join leading rail operators globally using CORTEX to reduce delays and maximize infrastructure lifespan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/simulation')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Schedule an Audit
          </button>
          <button className="px-6 py-2.5 text-sm font-semibold text-[#94A3B8] border border-[#1F2D40] rounded-md hover:bg-[#1C2333] hover:text-[#F1F5F9] transition-colors">
            View Whitepaper
          </button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    { title: 'CORTEX', links: ['Pioneering the future of digital railway management through advanced neural optimization and human-control AI.'] },
    { title: 'Solution',  links: ['Network Planning', 'Conflict Resolution', 'Asset Monitoring'] },
    { title: 'Company',   links: ['Our Approach', 'Contributors', 'Contact'] },
    { title: 'System Status', links: ['⊘ System Ø-Line'] },
  ]
  return (
    <footer className="border-t border-[#1F2D40] bg-[#111827] px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        {cols.map(({ title, links }) => (
          <div key={title}>
            <p className="text-sm font-semibold text-[#F1F5F9] mb-3">{title}</p>
            {links.map((l) => (
              <p key={l} className="text-xs text-[#94A3B8] mb-2 leading-relaxed">{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1F2D40] flex items-center justify-between">
        <p className="text-xs text-[#475569]">© 2026 CORTEX Intelligence Inc. All rights reserved. Built for Mission Critical Environments.</p>
        <div className="flex gap-4 text-xs text-[#475569]">
          {['Privacy', 'Terms', 'Security'].map((l) => <a key={l} href="#" className="hover:text-[#94A3B8]">{l}</a>)}
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-xs opacity-50"
          style={{
            backgroundImage: `url(${trainBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0E1A] via-[#0A0E1A]/85 to-transparent" />
      </div>

      <div className="relative z-10">
        <NavBar />
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <StatsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
