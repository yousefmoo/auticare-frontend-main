import { Link } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  Calendar,
  ClipboardList,
  FileText,
  MessageSquare,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'

const stats = [
  { label: 'Total Patients', value: 24, change: '+2 this month', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: 'Active Cases', value: 18, change: '75% of total', icon: Activity, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Pending Reviews', value: 5, change: 'Needs attention', icon: ClipboardList, color: 'bg-amber-100 text-amber-600' },
  { label: 'Critical Cases', value: 2, change: 'Urgent review', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
]

const patientTrend = [
  { week: 'Mon', value: 12 },
  { week: 'Tue', value: 14 },
  { week: 'Wed', value: 16 },
  { week: 'Thu', value: 15 },
  { week: 'Fri', value: 18 },
  { week: 'Sat', value: 17 },
  { week: 'Sun', value: 20 },
]

const sessionOutcomes = [
  { name: 'Speech', value: 72 },
  { name: 'Behavioral', value: 64 },
  { name: 'Occupational', value: 81 },
  { name: 'Social', value: 68 },
]

const recentPatients = [
  {
    id: 1,
    name: 'Alex Johnson',
    age: 8,
    condition: 'ASD Level 2',
    lastVisit: 'Today',
    status: 'stable',
    therapist: 'Sarah Wilson',
  },
  {
    id: 2,
    name: 'Emma Davis',
    age: 6,
    condition: 'Speech Delay',
    lastVisit: 'Yesterday',
    status: 'improving',
    therapist: 'Dr. Johnson',
  },
  {
    id: 3,
    name: 'Liam Brown',
    age: 10,
    condition: 'ADHD',
    lastVisit: '2 days ago',
    status: 'critical',
    therapist: 'Mike Chen',
  },
]

const upcomingAppointments = [
  { id: 1, patient: 'Alex Johnson', time: '10:00 AM', type: 'Follow-up', therapist: 'Sarah Wilson' },
  { id: 2, patient: 'Emma Davis', time: '11:30 AM', type: 'Screening', therapist: 'Dr. Johnson' },
  { id: 3, patient: 'Liam Brown', time: '2:00 PM', type: 'Urgent Review', therapist: 'Mike Chen' },
]

const quickActions = [
  { icon: Users, label: 'Patient List', path: '/doctor/patients', color: 'bg-blue-600' },
  { icon: Calendar, label: 'Screenings', path: '/doctor/screening', color: 'bg-emerald-600' },
  { icon: FileText, label: 'Reports', path: '/doctor/reports', color: 'bg-purple-600' },
  { icon: ClipboardList, label: 'Treatment Plans', path: '/doctor/treatment-plans', color: 'bg-orange-500' },
]

const activityFeed = [
  { id: 1, label: 'Treatment plan approved for Alex Johnson', time: '2 hours ago' },
  { id: 2, label: 'New screening uploaded for Emma Davis', time: '4 hours ago' },
  { id: 3, label: 'Parent feedback flagged for review', time: 'Yesterday' },
]

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  usePageTitle('Doctor Dashboard')

  return (
    <div className="fade-in space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Dr. {user?.name}!</h1>
            <p className="text-blue-100 mt-2">Here is your patient overview for today.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Stethoscope className="h-4 w-4" />
              Pediatric Neurology
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Activity className="h-4 w-4" />
              On-call
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
                  <p className="text-xs text-gray-500">{item.change}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Patient Load Trend</h2>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientTrend}>
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Session Outcomes</h2>
            <span className="text-xs text-gray-500">Completion %</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionOutcomes}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Patient Activity</h2>
            <Link to="/doctor/patients" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium text-sm">
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.condition} - Age {patient.age}
                    </p>
                    <p className="text-xs text-gray-500">Therapist: {patient.therapist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      patient.status === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : patient.status === 'improving'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{patient.lastVisit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today&apos;s Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.type} - {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500">with {appointment.therapist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="card shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-blue-500" />
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

      <div className="card shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Treatment Plan Status</h2>
          <Link to="/doctor/treatment-plans" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Manage Plans
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <MessageSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-800">12</p>
            <p className="text-sm text-emerald-600">Approved Plans</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <ClipboardList className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-800">5</p>
            <p className="text-sm text-amber-600">Pending Review</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">89%</p>
            <p className="text-sm text-blue-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
