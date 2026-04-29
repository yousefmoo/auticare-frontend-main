#!/bin/bash

cd /home/claude/auticare-frontend

# ========================================
# LAYOUT COMPONENTS
# ========================================

cat > src/components/layout/Navbar.jsx << 'EOF'
import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { toggleSidebar, notifications } = useUIStore()
  const navigate = useNavigate()

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 fixed w-full top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-primary-600">AutiCare</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </nav>
  )
}
EOF

cat > src/components/layout/Sidebar.jsx << 'EOF'
import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'
import { USER_ROLES } from '../../utils/constants'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Settings,
} from 'lucide-react'

const navigationConfig = {
  [USER_ROLES.DOCTOR]: [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    { name: 'Create Plan', path: '/doctor/create-plan', icon: FileText },
    { name: 'Reports', path: '/doctor/reports', icon: BarChart3 },
    { name: 'Profile', path: '/doctor/profile', icon: Settings },
  ],
  [USER_ROLES.THERAPIST]: [
    { name: 'Dashboard', path: '/therapist/dashboard', icon: LayoutDashboard },
    { name: 'Weekly Plan', path: '/therapist/weekly-plan', icon: Calendar },
    { name: 'Session Notes', path: '/therapist/session-notes', icon: ClipboardList },
    { name: 'Profile', path: '/therapist/profile', icon: Settings },
  ],
  [USER_ROLES.PARENT]: [
    { name: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    { name: 'Daily Log', path: '/parent/daily-log', icon: ClipboardList },
    { name: 'Statistics', path: '/parent/statistics', icon: BarChart3 },
    { name: 'Resources', path: '/parent/resources', icon: BookOpen },
    { name: 'Profile', path: '/parent/profile', icon: Settings },
  ],
}

export default function Sidebar({ role }) {
  const { isSidebarOpen } = useUIStore()
  const navigation = navigationConfig[role] || []

  if (!isSidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-30">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
EOF

cat > src/components/layout/DashboardLayout.jsx << 'EOF'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useUIStore } from '../../store/uiStore'

export default function DashboardLayout({ children, role }) {
  const { isSidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar role={role} />
      
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
EOF

echo "✅ Layout components created"

# ========================================
# DOCTOR DASHBOARDS
# ========================================

cat > src/features/doctor/DoctorDashboard.jsx << 'EOF'
import { Users, FileText, TrendingUp, Calendar } from 'lucide-react'

export default function DoctorDashboard() {
  const stats = [
    { label: 'Active Patients', value: '24', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Plans', value: '18', icon: FileText, color: 'bg-green-500' },
    { label: 'Assessments Due', value: '5', icon: Calendar, color: 'bg-yellow-500' },
    { label: 'Avg Progress', value: '78%', icon: TrendingUp, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Johnson</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Patient {i}</p>
                  <p className="text-sm text-gray-600">Last visit: 2 days ago</p>
                </div>
                <button className="text-primary-600 text-sm font-medium hover:underline">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assessments</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Assessment {i}</p>
                  <p className="text-sm text-gray-600">Due in {i * 2} days</p>
                </div>
                <span className="badge badge-warning">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

cat > src/features/doctor/PatientList.jsx << 'EOF'
export default function PatientList() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient List</h1>
      <div className="card">
        <p className="text-gray-600">Patient list will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/doctor/CreateTreatmentPlan.jsx << 'EOF'
export default function CreateTreatmentPlan() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Treatment Plan</h1>
      <div className="card">
        <p className="text-gray-600">Treatment plan creation form will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/doctor/ViewReports.jsx << 'EOF'
export default function ViewReports() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
      <div className="card">
        <p className="text-gray-600">Reports and analytics will be implemented here</p>
      </div>
    </div>
  )
}
EOF

# ========================================
# THERAPIST DASHBOARDS
# ========================================

cat > src/features/therapist/TherapistDashboard.jsx << 'EOF'
import { Calendar, ClipboardList, Users, MessageSquare } from 'lucide-react'

export default function TherapistDashboard() {
  const stats = [
    { label: "Today's Sessions", value: '6', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Active Plans', value: '12', icon: ClipboardList, color: 'bg-green-500' },
    { label: 'Patients', value: '15', icon: Users, color: 'bg-purple-500' },
    { label: 'Messages', value: '8', icon: MessageSquare, color: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Therapist Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Emily</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Session with Patient {i}</p>
                <p className="text-sm text-gray-600">{9 + i}:00 AM - {10 + i}:00 AM</p>
              </div>
              <button className="btn-primary">Start Session</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
EOF

cat > src/features/therapist/ViewWeeklyPlan.jsx << 'EOF'
export default function ViewWeeklyPlan() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Weekly Plan</h1>
      <div className="card">
        <p className="text-gray-600">Weekly plan view will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/therapist/SessionNotes.jsx << 'EOF'
export default function SessionNotes() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Session Notes</h1>
      <div className="card">
        <p className="text-gray-600">Session notes form will be implemented here</p>
      </div>
    </div>
  )
}
EOF

# ========================================
# PARENT DASHBOARDS
# ========================================

cat > src/features/parent/ParentDashboard.jsx << 'EOF'
import { CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

export default function ParentDashboard() {
  const stats = [
    { label: 'Completed Activities', value: '12', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Activities', value: '5', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Refused Activities', value: '2', icon: XCircle, color: 'bg-red-500' },
    { label: 'Weekly Progress', value: '85%', icon: TrendingUp, color: 'bg-blue-500' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-600 mt-1">Tracking progress for Alex Chen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Activity {i}</p>
                <p className="text-sm text-gray-600">Speech Therapy Exercise</p>
              </div>
              <button className="btn-primary">Log Feedback</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
EOF

cat > src/features/parent/DailyFeedbackLog.jsx << 'EOF'
export default function DailyFeedbackLog() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily Feedback Log</h1>
      <div className="card">
        <p className="text-gray-600">Daily feedback form will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/parent/ProgressStatistics.jsx << 'EOF'
export default function ProgressStatistics() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Progress Statistics</h1>
      <div className="card">
        <p className="text-gray-600">Charts and statistics will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/parent/EducationalResources.jsx << 'EOF'
export default function EducationalResources() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Educational Resources</h1>
      <div className="card">
        <p className="text-gray-600">Educational content will be displayed here</p>
      </div>
    </div>
  )
}
EOF

# ========================================
# SHARED COMPONENTS
# ========================================

cat > src/features/shared/ProfileSettings.jsx << 'EOF'
export default function ProfileSettings() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      <div className="card">
        <p className="text-gray-600">Profile settings will be implemented here</p>
      </div>
    </div>
  )
}
EOF

cat > src/features/shared/Unauthorized.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShieldX className="w-24 h-24 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    </div>
  )
}
EOF

cat > src/features/shared/NotFound.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
      </div>
    </div>
  )
}
EOF

echo "
========================================
✅ All dashboard components created!
========================================
"
