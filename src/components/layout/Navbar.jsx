import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../shared/ThemeToggle'

const getRoleHomePath = (role) => {
  if (!role) return '/'
  return `/${role}/home`
}

export default function Navbar() {
  const { user, logout, role } = useAuthStore()
  const { toggleSidebar, notifications } = useUIStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-xl p-2.5 transition-colors hover:bg-[var(--card-alt)]"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-[var(--muted)]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              A
            </div>
            <div className="leading-tight">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-2)]">AutiCare</p>
              <p className="text-lg font-semibold text-[var(--ink)] capitalize">{role || 'Dashboard'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="p-2" />
          <button
            className="relative rounded-xl p-2.5 transition-colors hover:bg-[var(--card-alt)]"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--muted)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(getRoleHomePath(role))}
            className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3.5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            aria-label="Open home page"
          >
            <User className="w-4 h-4" />
            Profile
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl p-1.5 pl-2 pr-3 transition-colors hover:bg-[var(--card-alt)]"
              aria-label="User menu"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[var(--ink)]">{user?.name}</p>
                <p className="text-xs text-[var(--muted-2)] capitalize">{user?.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--muted-2)] hidden sm:block" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg animate-fade-in">
                <button
                  onClick={() => navigate(getRoleHomePath(role))}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-alt)]"
                >
                  <User className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => navigate(role ? `/${role}/settings` : '/')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-alt)]"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
