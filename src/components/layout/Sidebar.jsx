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
    { name: 'Re-Test', path: '/parent/retest', icon: RotateCcw },
    { name: 'Profile', path: '/parent/profile', icon: Users },
  ],
}

const roleThemes = {
  [USER_ROLES.DOCTOR]: {
    active: 'bg-orange-50 text-orange-700',
    icon: 'text-orange-600',
    ring: 'ring-orange-200',
    gradient: 'from-blue-600 to-indigo-600',
  },
  [USER_ROLES.THERAPIST]: {
    active: 'bg-orange-50 text-orange-700',
    icon: 'text-orange-600',
    ring: 'ring-orange-200',
    gradient: 'from-violet-600 to-purple-600',
  },
  [USER_ROLES.PARENT]: {
    active: 'bg-orange-50 text-orange-700',
    icon: 'text-orange-600',
    ring: 'ring-orange-200',
    gradient: 'from-orange-500 to-amber-500',
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
    active: 'bg-orange-50 text-orange-700',
    icon: 'text-orange-600',
    ring: 'ring-orange-200',
    gradient: 'from-orange-500 to-amber-500',
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
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border)] bg-[var(--card)]/98 backdrop-blur-xl z-40 transform transition-transform duration-300 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Badge */}
        <div className="px-4 pb-4 pt-5 flex-shrink-0">
          <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] p-4 ring-1 ${theme.ring} shadow-sm`}>
            <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-xs uppercase tracking-widest">
                {(role || 'A').charAt(0)}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted-2)] font-semibold">{workspace.eyebrow}</p>
            <p className="mt-1 text-sm font-bold text-[var(--ink)]">{workspace.title}</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">{workspace.subtitle}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-4 space-y-0.5 flex-1 overflow-y-auto no-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 group ${
                    isActive
                      ? `${theme.active} border border-orange-200/60 font-semibold shadow-sm`
                      : 'text-[var(--muted)] hover:bg-[var(--card-alt)] hover:text-[var(--ink)]'
                  }`
                }
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${theme.icon}`} />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 px-3 pb-5 pt-2 border-t border-[var(--border)]">
          {role && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  role: PropTypes.string,
}
