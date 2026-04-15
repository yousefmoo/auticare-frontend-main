import { BarChart3, ClipboardList, RotateCcw, UserRound } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store'
import usePageTitle from '../../../utils/usePageTitle'
import { getReportsOverview } from '../../../api/reports.api'
import { getHomeNotes, getSessionNotes, getUpcomingSessions } from '../../../api/sessions.api'
import { getParentDashboard } from '../../../api/dashboard.api'
import { getDemoScreeningResult, getStoredScreeningResult } from '../../screening/screeningInsights'
import SessionHighlight from '../../sessions/components/SessionHighlight'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function ParentHomeDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const screeningResult = getStoredScreeningResult() || getDemoScreeningResult()
  const recommendations = screeningResult?.recommendations || []
  const profile = screeningResult?.profile || {}
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'parent', user?.id || 'anonymous', 'upcoming'],
    queryFn: () => getUpcomingSessions('parent'),
  })
  const { data: sessionNotes = [] } = useQuery({
    queryKey: ['session-notes', user?.id || 'anonymous'],
    queryFn: getSessionNotes,
  })
  const { data: homeNotes = [] } = useQuery({
    queryKey: ['home-notes', user?.id || 'anonymous'],
    queryFn: getHomeNotes,
  })
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard', 'parent'],
    queryFn: getParentDashboard,
  })
  const { data: reportsData } = useQuery({
    queryKey: ['reports-overview', user?.id || 'anonymous'],
    queryFn: getReportsOverview,
  })
  const nextSession = upcomingSessions[0]

  usePageTitle('Parent Home')

  return (
    <div className="fade-in space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-800 via-teal-700 to-sky-700 p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-100">Parent home</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back, {dashboardData?.user?.name || user?.name || 'Parent'}</h1>
            <p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
              {dashboardData?.greeting || 'See your next session, the latest report highlights, and the most important care notes without digging through the app.'}
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-100">Latest screening</p>
            <p className="mt-2 text-2xl font-bold">{screeningResult?.riskLevel?.label || 'Unknown'} Risk</p>
            <p className="mt-1 text-sm text-emerald-50">
              {screeningResult?.score || 0}/{screeningResult?.totalQuestions || 0} indicators flagged
            </p>
          </div>
        </div>
      </section>

      {nextSession && <SessionHighlight title={nextSession.homeRoleLabel.parent} session={nextSession} />}

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Child overview</h2>
              <p className="text-sm text-[var(--muted)]">A cleaner snapshot of the care picture right now.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Child</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{profile.name || 'Unknown child'}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Age</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{profile.age || '-'} years</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Caregiver</p>
              <p className="mt-2 text-lg font-semibold capitalize text-[var(--ink)]">{profile.caregiver || '-'}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Next focus</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{recommendations[0] || 'No recommendation yet'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Re-test reminder</h2>
              <p className="text-sm text-[var(--muted)]">Keep the screening insight fresh as things change at home.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.75rem] bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-950/40 dark:to-orange-950/30">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Suggested next re-test</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-[var(--ink)]">In 2 weeks</p>
              <button
                type="button"
                onClick={() => navigate('/questionnaire')}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                Start Re-Test
              </button>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Re-test after major behavior changes, new therapist recommendations, or a new care review.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">الجلسات القادمة</h2>
              <p className="text-sm text-[var(--muted)]">Your next meetings with join links and notes.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {sessionsLoading && <DashboardSkeleton cards={2} className="md:grid-cols-1 xl:grid-cols-1" />}
            {!sessionsLoading && upcomingSessions.length === 0 && (
              <DashboardEmpty title="لا توجد جلسات حاليا" description="ستظهر هنا الجلسات القادمة للأسرة عند توفرها." />
            )}
            {!sessionsLoading && upcomingSessions.map((session) => (
              <div key={session.id} className="rounded-[1.5rem] border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sky-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    انضمام
                  </a>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {session.dateLabel} - {session.timeLabel}
                </p>
                <p className="mt-2 text-sm text-[var(--ink)]">{session.notesSummary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Notes</h2>
              <p className="text-sm text-[var(--muted)]">Recent therapist notes and home follow-up.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {sessionNotes.slice(0, 2).map((note) => (
              <div key={note.id} className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
                <p className="font-semibold text-[var(--ink)]">{note.sessionType}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{note.summary}</p>
                <p className="mt-2 text-xs text-[var(--muted-2)]">Next step: {note.nextStep}</p>
              </div>
            ))}
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              آخر ملاحظة منزلية: {homeNotes[0]?.note}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--ink)]">ملخص التقرير</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Progress</p>
              <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{reportsData?.summary?.[0]?.value || '78%'}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Communication and routines are moving in the right direction.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Screening result</p>
              <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{reportsData?.summary?.[1]?.value || screeningResult?.riskLevel?.label || 'N/A'}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Use the reports page to download the latest summary PDF.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

