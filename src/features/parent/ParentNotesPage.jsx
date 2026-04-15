import { useState } from 'react'
import { FilePenLine, Plus } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { dailyFeedbackEntries, sessionNotes } from '../dashboard/mockData'

export default function ParentNotesPage() {
  const [notes, setNotes] = useState(
    dailyFeedbackEntries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      title: entry.activity,
      note: entry.note,
    }))
  )

  usePageTitle('Parent Notes')

  const handleAddNote = () => {
    const noteNumber = notes.length + 1
    setNotes((current) => [
      {
        id: `note-${noteNumber}`,
        date: 'Today',
        title: `Daily note ${noteNumber}`,
        note: 'New home observation added. Update this text when backend note creation is connected.',
      },
      ...current,
    ])
  }

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="mt-2 text-violet-100">
              Review therapist note summaries alongside the latest home observations in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNote}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-violet-900 transition-colors hover:bg-violet-50"
          >
            <Plus className="h-4 w-4" />
            Add note
          </button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {sessionNotes.map((note) => (
          <section key={note.id} className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
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

      <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
        <h2 className="text-xl font-bold text-[var(--ink)]">Daily notes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {notes.map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">{entry.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">{entry.date}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{entry.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
