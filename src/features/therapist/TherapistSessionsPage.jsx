import { CalendarClock, FilePenLine } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { parentWeeklySchedule, sessionNotes } from '../dashboard/mockData'

export default function TherapistSessionsPage() {
  usePageTitle('Therapist Sessions')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-purple-900 via-fuchsia-800 to-indigo-700 p-6 text-white shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <p className="mt-2 text-purple-100">Track today&apos;s sessions and keep session notes visible for fast follow-up.</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-50 p-3">
              <CalendarClock className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Session list</h2>
              <p className="text-sm text-[var(--muted)]">Each assigned session ready for live delivery or follow-up.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {parentWeeklySchedule.map((session, index) => (
              <div key={`${session.id}-therapy`} className="rounded-3xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                    <p className="text-sm text-[var(--muted)]">{session.therapist}</p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    {index === 0 ? 'Today' : 'Upcoming'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{session.date} • {session.time}</p>
                <p className="mt-2 text-sm text-[var(--ink)]">Latest note: {sessionNotes[index]?.summary || 'Add session note after completion.'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3">
              <FilePenLine className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Session notes</h2>
              <p className="text-sm text-[var(--muted)]">Quick view of the latest note summaries.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {sessionNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="font-semibold text-[var(--ink)]">{note.child}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{note.sessionType} • {note.date}</p>
                <p className="mt-3 text-sm text-[var(--ink)]">{note.summary}</p>
                <p className="mt-2 text-xs text-[var(--muted-2)]">Next step: {note.nextStep}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
