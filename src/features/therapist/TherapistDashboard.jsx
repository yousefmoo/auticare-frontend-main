import { Link } from 'react-router-dom'
import {
  Activity,
  Calendar,
  ClipboardList,
  MessageSquare,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'

const stats = [
  { label: 'Active Clients', value: 14, sub: '3 new this month', icon: Users, color: 'bg-purple-100 text-purple-600' },
  { label: 'Sessions Today', value: 5, sub: '2 virtual, 3 in-person', icon: Calendar, color: 'bg-violet-100 text-violet-600' },
  { label: 'Notes Pending', value: 4, sub: 'Complete within 24h', icon: ClipboardList, color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Messages', value: 7, sub: '2 unread', icon: MessageSquare, color: 'bg-fuchsia-100 text-fuchsia-600' },
]

const engagementTrend = [
  { day: 'Mon', value: 68 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 72 },
  { day: 'Thu', value: 74 },
  { day: 'Fri', value: 78 },
  { day: 'Sat', value: 76 },
  { day: 'Sun', value: 80 },
]

const sessionBreakdown = [
  { name: 'Speech', value: 6 },
  { name: 'Behavioral', value: 4 },
  { name: 'Social', value: 3 },
  { name: 'Parent Coaching', value: 2 },
]

const upcomingSessions = [
  { id: 1, client: 'Olivia Wilson', time: '10:00 AM', type: 'Speech Therapy' },
  { id: 2, client: 'Noah Garcia', time: '1:30 PM', type: 'Social Skills' },
  { id: 3, client: 'Emma Davis', time: '3:00 PM', type: 'Parent Coaching' },
]

const activityFeed = [
  { id: 1, label: 'Session notes submitted for Olivia Wilson', time: '45 minutes ago' },
  { id: 2, label: 'Weekly plan updated for Noah Garcia', time: '3 hours ago' },
  { id: 3, label: 'New parent message received', time: 'Yesterday' },
]

const quickActions = [
  { icon: ClipboardList, label: 'Write Session Note', path: '/therapist/session-notes', color: 'bg-purple-600' },
  { icon: Calendar, label: 'Weekly Plans', path: '/therapist/weekly-plans', color: 'bg-violet-600' },
  { icon: TrendingUp, label: 'Statistics', path: '/therapist/statistics', color: 'bg-indigo-600' },
  { icon: MessageSquare, label: 'Messages', path: '/therapist/messages', color: 'bg-fuchsia-600' },
]

export default function TherapistDashboard() {
  const { user } = useAuthStore()
  usePageTitle('Therapist Dashboard')

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-purple-100 mt-2">Your therapy schedule and insights are ready.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <UserCheck className="h-4 w-4" />
              14 active clients
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Activity className="h-4 w-4" />
              92% engagement rate
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="card shadow-lg rounded-2xl">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Client Engagement Trend</h2>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Session Mix</h2>
            <span className="text-xs text-gray-500">This week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionBreakdown}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#c084fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.client}</p>
                    <p className="text-sm text-gray-600">{session.type}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{session.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`p-3 ${action.color} rounded-lg mb-2`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
