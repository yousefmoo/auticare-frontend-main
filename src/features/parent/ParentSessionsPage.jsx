import { CalendarClock, ClipboardList } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { parentWeeklySchedule, sessionNotes } from '../dashboard/mockData'

const parentSessions = parentWeeklySchedule.map((session, index) => ({
  id: `${session.id}-parent`,
  date: session.date,
  therapist: session.therapist,
  status: index === 0 ? 'Scheduled' : 'Upcoming',
  notes: sessionNotes[index]?.summary || 'No notes yet',
  type: session.sessionType,
  time: session.time,
}))

export default function ParentSessionsPage() {
  usePageTitle('Parent Sessions')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-800 via-emerald-700 to-sky-700 p-6 text-white shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <p className="mt-2 text-emerald-100">See your child&apos;s sessions with date, therapist, status, and the latest session note.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {parentSessions.map((session) => (
          <section key={session.id} className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <CalendarClock className="h-5 w-5 text-emerald-700" />
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {session.status}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><span className="text-[var(--muted)]">Date</span><span className="font-medium text-[var(--ink)]">{session.date}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--muted)]">Time</span><span className="font-medium text-[var(--ink)]">{session.time}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--muted)]">Therapist</span><span className="font-medium text-[var(--ink)]">{session.therapist}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--muted)]">Type</span><span className="font-medium text-[var(--ink)]">{session.type}</span></div>
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--card-alt)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <ClipboardList className="h-4 w-4 text-emerald-700" />
                Notes
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{session.notes}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
