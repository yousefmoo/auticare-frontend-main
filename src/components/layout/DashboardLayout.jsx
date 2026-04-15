import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'

export default function DashboardLayout() {
  const { isSidebarOpen, setSidebarOpen } = useUIStore()
  const { role } = useAuthStore()

  useEffect(() => {
    const updateSidebarState = () => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      setSidebarOpen(isDesktop)
    }

    updateSidebarState()
    window.addEventListener('resize', updateSidebarState)
    return () => window.removeEventListener('resize', updateSidebarState)
  }, [setSidebarOpen])

  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Navbar />
      <Sidebar role={role} />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
