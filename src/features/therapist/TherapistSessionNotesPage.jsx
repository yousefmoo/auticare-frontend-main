import { FilePenLine } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { sessionNotes } from '../dashboard/mockData'

export default function TherapistSessionNotesPage() {
  usePageTitle('Session Notes')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-fuchsia-700 via-purple-700 to-indigo-600 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Session notes</h1>
        <p className="mt-2 text-fuchsia-100">Structured session summaries ready to connect to backend notes and note drafts.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {sessionNotes.map((note) => (
          <section key={note.id} className="card rounded-[2rem] shadow-lg">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-purple-50 p-3">
                <FilePenLine className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--ink)]">{note.child}</h2>
                <p className="text-sm text-[var(--muted)]">{note.sessionType} • {note.date}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Summary</p>
                <p className="mt-2 text-[var(--ink)]">{note.summary}</p>
              </div>
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Next step</p>
                <p className="mt-2 text-[var(--ink)]">{note.nextStep}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
