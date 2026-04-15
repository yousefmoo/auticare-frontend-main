import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../shared/ThemeToggle'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Sessions', to: '/sessions' },
  { label: 'Get Started', to: '/questionnaire' },
]

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useUIStore()
  const { isAuthenticated, role } = useAuthStore()

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-[var(--surface)] bg-[var(--ink)] shadow-sm'
        : 'text-[var(--muted)] hover:text-[var(--ink)]'
    }`

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-[var(--card)] backdrop-blur border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center font-semibold">
              A
            </div>
            <div className="leading-tight">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">AutiCare</p>
              <p className="text-base font-semibold text-[var(--ink)]">ASD Support Platform</p>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to={isAuthenticated && role ? `/${role}/home` : '/login'}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              Login
            </NavLink>
            <ThemeToggle className="h-9 w-9 rounded-full" />
            <NavLink
              to="/questionnaire"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--surface)] shadow-sm hover:opacity-90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--card-alt)] transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-[var(--muted)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={isAuthenticated && role ? `/${role}/home` : '/login'}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[var(--muted)]"
            >
              Profile
            </NavLink>
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[var(--muted)]"
            >
              Login
            </NavLink>
            <div className="px-3 py-2">
              <ThemeToggle className="h-10 w-full justify-center gap-2 rounded-lg">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </ThemeToggle>
            </div>
            <NavLink
              to="/questionnaire"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--surface)] shadow-sm hover:opacity-90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
