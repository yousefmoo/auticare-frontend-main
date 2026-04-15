import { CalendarClock, FileText } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { parentWeeklySchedule, sessionNotes } from '../dashboard/mockData'

const sessionRows = parentWeeklySchedule.map((session, index) => ({
  id: `${session.id}-doctor`,
  date: session.date,
  time: session.time,
  therapist: session.therapist,
  status: index === 0 ? 'Today' : 'Upcoming',
  notes: sessionNotes[index]?.summary || 'Review note pending',
}))

export default function DoctorSessionsPage() {
  usePageTitle('Doctor Sessions')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-900 to-sky-700 p-6 text-white shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <p className="mt-2 text-slate-200">Review session dates, assigned therapists, current status, and the latest clinical notes.</p>
      </section>

      <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Time</th>
                <th className="py-3 pr-4 font-medium">Therapist</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sessionRows.map((session) => (
                <tr key={session.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="py-4 pr-4 text-[var(--ink)]">{session.date}</td>
                  <td className="py-4 pr-4 text-[var(--ink)]">{session.time}</td>
                  <td className="py-4 pr-4 text-[var(--ink)]">{session.therapist}</td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 text-[var(--muted)]">{session.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3">
              <CalendarClock className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Today&apos;s focus</h2>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Start with therapist notes, confirm the child response at home, and capture any treatment changes before the next review.
          </p>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <FileText className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Clinical notes summary</h2>
          </div>
          <div className="mt-4 space-y-3">
            {sessionNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-[var(--card-alt)] p-4 text-sm text-[var(--muted)]">
                <p className="font-semibold text-[var(--ink)]">{note.child}</p>
                <p className="mt-1">{note.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
