import { CalendarClock, ClipboardList, Clock3, RotateCcw, Sparkles, UserRound } from 'lucide-react'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { dailyFeedbackEntries, parentWeeklySchedule, sessionNotes } from '../dashboard/mockData'
import { getDemoScreeningResult, getStoredScreeningResult } from '../screening/screeningInsights'

export default function ParentHomePage() {
  const { user } = useAuthStore()
  const screeningResult = getStoredScreeningResult() || getDemoScreeningResult()
  const latestSessions = parentWeeklySchedule.slice(0, 2)
  const latestNotes = sessionNotes.slice(0, 2)
  const upcomingSessions = parentWeeklySchedule.slice(0, 3)

  usePageTitle('Parent Home')

  return (
    <div className="fade-in space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-800 via-emerald-700 to-sky-700 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-10 bottom-0 h-32 w-32 rounded-full bg-amber-300/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100">
              <Sparkles className="h-4 w-4" />
              Parent home
            </span>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome back, {user?.name || 'Parent'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-50 sm:text-base">
                This is your main page for child updates, sessions, notes, and your next screening reminder.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-100">Latest screening</p>
            <p className="mt-2 text-2xl font-bold">{screeningResult.riskLevel.label} Risk</p>
            <p className="mt-1 text-sm text-emerald-50">
              {screeningResult.score}/{screeningResult.totalQuestions} indicators flagged
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <UserRound className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Child overview</h2>
              <p className="text-sm text-[var(--muted)]">A quick snapshot of the current care picture.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Child</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{screeningResult.profile.name}</p>
            </div>
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Age</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{screeningResult.profile.age} years</p>
            </div>
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Caregiver</p>
              <p className="mt-2 text-lg font-semibold capitalize text-[var(--ink)]">{screeningResult.profile.caregiver}</p>
            </div>
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Next focus</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{screeningResult.recommendations[0]}</p>
            </div>
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3">
              <RotateCcw className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Re-test reminder</h2>
              <p className="text-sm text-[var(--muted)]">Keep screening data fresh as your child progresses.</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-5">
            <p className="text-sm font-semibold text-amber-800">Suggested next re-test</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ink)]">In 2 weeks</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Re-test after major behavior changes, new therapist recommendations, or a new care review.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] p-4 text-sm text-[var(--muted)]">
            The latest questionnaire score was {screeningResult.score}/{screeningResult.totalQuestions}. Running the test again will refresh your parent home summary.
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3">
              <Clock3 className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Latest sessions</h2>
              <p className="text-sm text-[var(--muted)]">Most recent booked care touchpoints.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {latestSessions.map((session) => (
              <div key={`${session.therapist}-${session.date}-${session.time}`} className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{session.therapist}</p>
                <p className="mt-2 text-xs text-[var(--muted-2)]">{session.date} at {session.time}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-50 p-3">
              <ClipboardList className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Notes summary</h2>
              <p className="text-sm text-[var(--muted)]">Recent therapist notes and home updates.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {latestNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="font-semibold text-[var(--ink)]">{note.sessionType}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{note.summary}</p>
                <p className="mt-2 text-xs text-[var(--muted-2)]">Next step: {note.nextStep}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              Latest home note: {dailyFeedbackEntries[0]?.note}
            </div>
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <CalendarClock className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Upcoming sessions</h2>
              <p className="text-sm text-[var(--muted)]">What’s coming up next for your child.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingSessions.map((session) => (
              <div key={`${session.therapist}-${session.date}-${session.time}-upcoming`} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--ink)]">{session.date}</p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {session.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--ink)]">{session.sessionType}</p>
                <p className="text-sm text-[var(--muted)]">{session.therapist}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
