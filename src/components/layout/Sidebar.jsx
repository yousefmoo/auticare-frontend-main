import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { USER_ROLES } from '../../utils/constants'
import {
  BarChart3,
  MessageSquare,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  PlayCircle,
  ShieldPlus,
  RotateCcw,
  TrendingUp,
  Users,
} from 'lucide-react'
import { roleSidebarSummary } from '../../features/dashboard/portalArabicData'

const navigationConfig = {
  [USER_ROLES.DOCTOR]: [
    { name: 'Home', path: '/doctor/home', icon: Home },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    { name: 'Sessions', path: '/doctor/sessions', icon: PlayCircle },
    { name: 'Messages', path: '/doctor/messages', icon: MessageSquare },
    { name: 'Reports', path: '/doctor/reports', icon: BarChart3 },
    { name: 'Specialists', path: '/doctor/specialists', icon: ShieldPlus },
    { name: 'AI Screening', path: '/doctor/screening', icon: ClipboardList },
    { name: 'Profile', path: '/doctor/profile', icon: FileText },
  ],
  [USER_ROLES.THERAPIST]: [
    { name: 'Home', path: '/therapist/home', icon: Home },
    { name: 'Patients', path: '/therapist/patients', icon: Users },
    { name: 'Sessions', path: '/therapist/sessions', icon: PlayCircle },
    { name: 'Messages', path: '/therapist/messages', icon: MessageSquare },
    { name: 'Reports', path: '/therapist/reports', icon: BarChart3 },
    { name: 'Specialists', path: '/therapist/specialists', icon: ShieldPlus },
    { name: 'Profile', path: '/therapist/profile', icon: ClipboardList },
  ],
  [USER_ROLES.PARENT]: [
    { name: 'Home', path: '/parent/home', icon: Home },
    { name: 'Treatment Plan', path: '/parent/treatment-plan', icon: FileText },
    { name: 'Messages', path: '/parent/messages', icon: MessageSquare },
    { name: 'Reports', path: '/parent/reports', icon: BarChart3 },
    { name: 'Notes', path: '/parent/notes', icon: ClipboardList },
    { name: 'Sessions', path: '/parent/sessions', icon: PlayCircle },
    { name: 'Specialists', path: '/parent/specialists', icon: ShieldPlus },
    { name: 'Screening Results', path: '/parent/screening-results', icon: TrendingUp },
    { name: 'Profile', path: '/parent/profile', icon: Users },
  ],
}

const roleThemes = {
  [USER_ROLES.DOCTOR]: {
    active: 'bg-blue-50 text-blue-700',
    icon: 'text-blue-600',
    ring: 'ring-blue-200',
  },
  [USER_ROLES.THERAPIST]: {
    active: 'bg-purple-50 text-purple-700',
    icon: 'text-purple-600',
    ring: 'ring-purple-200',
  },
  [USER_ROLES.PARENT]: {
    active: 'bg-emerald-50 text-emerald-700',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
}

export default function Sidebar({ role }) {
  const { isSidebarOpen, closeSidebar } = useUIStore()
  const { logout } = useAuthStore()
  const navigation = navigationConfig[role] || []
  const workspace = roleSidebarSummary[role] || {
    eyebrow: 'Workspace',
    title: 'Dashboard',
    subtitle: 'AutiCare care coordination tools',
  }
  const theme = roleThemes[role] || {
    active: 'bg-primary-50 text-primary-700',
    icon: 'text-primary-600',
    ring: 'ring-primary-200',
  }

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      closeSidebar()
    }
  }

  const handleLogout = () => {
    logout()
    handleNavClick()
    window.location.href = '/login'
  }

  return (
    <>
      {isSidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 bg-gray-900/40 z-30 lg:hidden"
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border)] bg-[var(--card)]/95 backdrop-blur z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 pb-4 pt-5">
          <div className={`rounded-[1.75rem] border border-[var(--border)] bg-[var(--card-alt)] p-4 ring-1 ${theme.ring}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-2)]">{workspace.eyebrow}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{workspace.title}</p>
            <p className="text-xs text-[var(--muted)]">{workspace.subtitle}</p>
          </div>
        </div>
        <nav className="px-3 pb-6 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all duration-200 ${
                    isActive
                      ? `${theme.active} border border-[var(--border)] font-semibold shadow-sm`
                      : 'text-[var(--muted)] hover:bg-[var(--card-alt)] hover:text-[var(--ink)]'
                  }`
                }
              >
                <Icon className={`w-5 h-5 ${theme.icon}`} />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            )
          })}
          {role && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-red-600 transition-all duration-200 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </nav>
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  role: PropTypes.string,
}
