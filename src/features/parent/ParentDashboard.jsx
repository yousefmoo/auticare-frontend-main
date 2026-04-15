import { Link } from 'react-router-dom'
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'

const stats = [
  { label: 'Completed Today', value: '12/15', sub: '80% complete', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Weekly Progress', value: '80%', sub: '+5% from last week', icon: TrendingUp, color: 'bg-teal-100 text-teal-600' },
  { label: 'Next Session', value: '10:00 AM', sub: 'Speech Therapy', icon: Clock, color: 'bg-lime-100 text-lime-600' },
  { label: 'New Messages', value: '3', sub: 'From therapists', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
]

const progressTrend = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 68 },
  { day: 'Wed', value: 70 },
  { day: 'Thu', value: 72 },
  { day: 'Fri', value: 78 },
  { day: 'Sat', value: 82 },
  { day: 'Sun', value: 85 },
]

const routineCompletion = [
  { name: 'Communication', value: 85 },
  { name: 'Social', value: 72 },
  { name: 'Motor', value: 68 },
  { name: 'Cognitive', value: 90 },
]

const recentActivities = [
  { id: 1, name: 'Morning Routine', status: 'completed', time: '9:00 AM', duration: '15 min' },
  { id: 2, name: 'Speech Therapy Session', status: 'completed', time: '10:30 AM', duration: '45 min' },
  { id: 3, name: 'Reading Time', status: 'in progress', time: '2:00 PM', duration: '20 min' },
  { id: 4, name: 'Social Skills Practice', status: 'pending', time: '4:00 PM', duration: '30 min' },
]

const upcomingSessions = [
  { id: 1, title: 'Speech Therapy', therapist: 'Dr. Johnson', time: 'Tomorrow 10:00 AM', duration: '45 min' },
  { id: 2, title: 'Behavioral Therapy', therapist: 'Sarah Wilson', time: 'Friday 2:00 PM', duration: '60 min' },
  { id: 3, title: 'Parent Consultation', therapist: 'Dr. Smith', time: 'Next Monday 11:00 AM', duration: '30 min' },
]

const quickActions = [
  { icon: Calendar, label: 'View Weekly Plan', path: '/parent/weekly-plan', color: 'bg-emerald-500' },
  { icon: TrendingUp, label: 'Progress Stats', path: '/parent/progress', color: 'bg-green-500' },
  { icon: BookOpen, label: 'Resources', path: '/parent/resources', color: 'bg-teal-500' },
  { icon: MessageSquare, label: 'Messages', path: '/parent/messages', color: 'bg-lime-500' },
]

const activityFeed = [
  { id: 1, label: 'Morning routine completed successfully', note: 'Great progress on independence', time: '2 hours ago', tone: 'positive' },
  { id: 2, label: 'Had difficulty with reading activity', note: 'May need additional support', time: 'Yesterday', tone: 'warning' },
  { id: 3, label: 'Excellent participation in group activity', note: 'Social skills improving', time: '3 days ago', tone: 'success' },
]

export default function ParentDashboard() {
  const { user } = useAuthStore()
  usePageTitle('Parent Dashboard')

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-emerald-100 mt-2">Here is your child&apos;s care summary for today.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Users className="h-4 w-4" />
              Therapist: Dr. Sarah Wilson
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Activity className="h-4 w-4" />
              Last session: Yesterday
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
            <h2 className="text-xl font-bold text-gray-900">Weekly Progress Trend</h2>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressTrend}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#a7f3d0" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Skill Focus Areas</h2>
            <span className="text-xs text-gray-500">Completion %</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routineCompletion}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Today&apos;s Activities</h2>
            <Link to="/parent/weekly-plan" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-600">
                    {activity.time} - {activity.duration}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activity.status === 'in progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-600">
                    {session.therapist} - {session.duration}
                  </p>
                  <p className="text-xs text-gray-500">{session.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Feedback</h2>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.note}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <Award className={`h-5 w-5 ${
                  item.tone === 'positive'
                    ? 'text-emerald-500'
                    : item.tone === 'warning'
                      ? 'text-amber-500'
                      : 'text-blue-500'
                }`} />
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
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
    </div>
  )
}
