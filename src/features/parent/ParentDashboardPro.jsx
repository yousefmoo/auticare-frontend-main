import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  BadgeCheck,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import {
  getDemoScreeningResult,
  getStoredScreeningResult,
} from '../screening/screeningInsights'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'results', label: 'Question Results', icon: Brain },
]

const quickActions = [
  { icon: Users, label: 'Care Recommendations', path: '/parent/care-recommendations', color: 'bg-emerald-700' },
  { icon: Calendar, label: 'Book Session', path: '/parent/weekly-plan', color: 'bg-emerald-500' },
  { icon: FileText, label: 'Daily Feedback', path: '/parent/feedback', color: 'bg-sky-500' },
  { icon: BookOpen, label: 'Resources', path: '/parent/resources', color: 'bg-lime-500' },
  { icon: MessageSquare, label: 'Messages', path: '/parent/messages', color: 'bg-green-600' },
]

const statusTone = {
  flagged: 'bg-red-50 text-red-700 border-red-100',
  monitored: 'bg-amber-50 text-amber-700 border-amber-100',
  stable: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default function ParentDashboardPro() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('results')

  usePageTitle('Parent Dashboard')

  const screeningResult = useMemo(() => getStoredScreeningResult() || getDemoScreeningResult(), [])

  const priorityTone =
    screeningResult.riskLevel.label === 'High'
      ? 'flagged'
      : screeningResult.riskLevel.label === 'Moderate'
        ? 'monitored'
        : 'stable'

  const overviewStats = [
    {
      label: 'AQ Score',
      value: `${screeningResult.score} / ${screeningResult.totalQuestions}`,
      sub: 'Flagged questionnaire answers',
      icon: Brain,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Probability',
      value: `${screeningResult.riskLevel.probability}%`,
      sub: `${screeningResult.riskLevel.label} screening risk`,
      icon: ShieldAlert,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Recommended Team',
      value: screeningResult.specialists.length,
      sub: 'Doctors and therapists ready',
      icon: Users,
      color: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'Next Review',
      value: 'This Week',
      sub: 'Share results with care team',
      icon: Clock3,
      color: 'bg-lime-100 text-lime-700',
    },
  ]

  return (
    <div className="fade-in space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-yellow-300/10 blur-2xl" />
        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100">
              <BadgeCheck className="h-4 w-4" />
              Child screening result
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Hello, {user?.name || 'Parent'}! {screeningResult.profile.name}&apos;s dashboard is ready.
              </h1>
              <p className="mt-2 max-w-3xl text-slate-200">
                Review the 10-question screening outcome, then check the doctor and therapist recommendations in the table below.
              </p>
            </div>
          </div>

          <div className={`min-w-[280px] rounded-3xl border px-5 py-4 backdrop-blur ${statusTone[priorityTone]}`}>
            <p className="text-xs uppercase tracking-[0.3em]">Current status</p>
            <p className="mt-2 text-3xl font-bold">{screeningResult.riskLevel.label} Risk</p>
            <p className="mt-1 text-sm">
              {screeningResult.riskLevel.probability}% probability with {screeningResult.score} flagged indicators
            </p>
            <p className="mt-2 text-xs">
              Last updated: {new Date(screeningResult.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {overviewStats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.label} className="card rounded-3xl border border-[var(--border)] shadow-lg">
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--muted)]">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{item.value}</p>
                  <p className="text-xs text-[var(--muted-2)]">{item.sub}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <section className="card rounded-[2rem] border border-[var(--border)] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)]">AutiCare results hub</h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              A professional parent view for screening outcomes and specialist recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-[var(--card-alt)] text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-alt)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Activity className="h-4 w-4 text-emerald-600" />
                Area breakdown
              </div>
              <div className="mt-5 space-y-4">
                {screeningResult.domainBreakdown.map((item) => (
                  <div key={item.domain}>
                    <div className="flex items-center justify-between text-sm font-medium text-[var(--ink)]">
                      <span>{item.domain}</span>
                      <span>{item.flagged}/{item.total}</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-white">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-400"
                        style={{ width: `${Math.max(item.percent, 10)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <h3 className="text-xl font-bold text-[var(--ink)]">Quick actions</h3>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] p-4 hover:shadow-lg transition-all"
                  >
                    <div className={`inline-flex rounded-2xl p-3 ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="mt-3 font-semibold text-[var(--ink)]">{action.label}</p>
                    <p className="mt-1 text-xs text-[var(--muted-2)]">Open this section</p>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-semibold text-emerald-200">Recommended next step</p>
                <p className="mt-2 text-lg font-semibold">
                  Open Care Recommendations, then message a doctor or therapist from the suggested list.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  This creates the fastest path from questionnaire result to care follow-up.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-alt)] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Questionnaire summary</p>
                    <h3 className="mt-1 text-2xl font-bold text-[var(--ink)]">
                      {screeningResult.profile.name}, {screeningResult.profile.age} years
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-2)]">AQ Score</p>
                    <p className="text-2xl font-bold text-[var(--ink)]">{screeningResult.score}/10</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span>Risk Level</span>
                    <span className="font-semibold text-[var(--ink)]">{screeningResult.riskLevel.label}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span>Probability</span>
                    <span className="font-semibold text-[var(--ink)]">{screeningResult.riskLevel.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span>Caregiver</span>
                    <span className="font-semibold capitalize text-[var(--ink)]">{screeningResult.profile.caregiver}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <h3 className="text-lg font-bold text-[var(--ink)]">Professional notes</h3>
                <div className="mt-4 space-y-3">
                  {screeningResult.recommendations.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-sm text-[var(--ink)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink)]">Results of the 10 questions</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Flagged answers are highlighted for easy review by the care team.
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  10 questions
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                      <th className="py-3 pr-4 font-medium">#</th>
                      <th className="py-3 pr-4 font-medium">Question</th>
                      <th className="py-3 pr-4 font-medium">Domain</th>
                      <th className="py-3 pr-4 font-medium">Answer</th>
                      <th className="py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screeningResult.questionResults.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--border)] last:border-b-0">
                        <td className="py-4 pr-4 font-semibold text-[var(--ink)]">{item.id}</td>
                        <td className="py-4 pr-4 text-[var(--ink)]">{item.question}</td>
                        <td className="py-4 pr-4 text-[var(--muted)]">{item.domain}</td>
                        <td className="py-4 pr-4">
                          <span className="rounded-full bg-[var(--card-alt)] px-3 py-1 font-medium text-[var(--ink)]">
                            {item.answer || 'Not answered'}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.isFlagged
                                ? 'bg-red-50 text-red-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {item.isFlagged ? 'Flagged' : 'Within range'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
