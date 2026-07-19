import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { LandingPage }         from '@/pages/LandingPage'
import { DashboardPage }       from '@/pages/DashboardPage'
import { NetworkPage }         from '@/pages/NetworkPage'
import { ConflictsPage }       from '@/pages/ConflictsPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { SimulationPage }      from '@/pages/SimulationPage'
import { AuditPage }           from '@/pages/AuditPage'

function AppShell({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — no shell */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell pages */}
        <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/network"   element={<AppShell><NetworkPage /></AppShell>} />
        <Route path="/conflicts" element={<AppShell><ConflictsPage /></AppShell>} />
        <Route path="/recommendations" element={<AppShell><RecommendationsPage /></AppShell>} />
        <Route path="/simulation" element={<AppShell><SimulationPage /></AppShell>} />
        <Route path="/audit"     element={<AppShell><AuditPage /></AppShell>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
