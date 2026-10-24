import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import { AppShell } from './components/layout/AppShell'
import { OverviewPage } from './pages/Overview'
import { LeadsPage } from './pages/Leads'
import { ClientsPage } from './pages/Clients'
import { ProjectsPage } from './pages/Projects'
import { InvoicesPage } from './pages/Invoices'
import { SerenitePage } from './pages/Serenite'
import { SeoAuditsPage } from './pages/SeoAudits'
import { SettingsPage } from './pages/Settings'
import { LoginPage } from './pages/Login'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
})

function ProtectedLayout() {
  const { session, isDemo, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="font-geist-mono text-xs text-gray-500">Chargement du Command Center...</p>
        </div>
      </div>
    )
  }

  if (!session && !isDemo) {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}

function ThemedToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      toastOptions={{
        style:
          theme === 'light'
            ? {
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                color: '#0f172a',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              }
            : {
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
      }}
    />
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/projets" element={<ProjectsPage />} />
                <Route path="/facturation" element={<InvoicesPage />} />
                <Route path="/serenite" element={<SerenitePage />} />
                <Route path="/audits" element={<SeoAuditsPage />} />
                <Route path="/parametres" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
