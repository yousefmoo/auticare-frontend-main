import { useState } from 'react'
import { ClipboardList, SmilePlus } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import usePageTitle from '../../utils/usePageTitle'
import { dailyFeedbackEntries } from '../dashboard/mockData'

export default function ParentFeedbackPage() {
  usePageTitle('Daily Feedback')
  const [note, setNote] = useState('')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-500 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Daily feedback</h1>
        <p className="mt-2 text-emerald-100">Log home observations and keep the care team updated with clean daily summaries.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
        <section className="card rounded-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <SmilePlus className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">New log entry</h2>
              <p className="text-sm text-[var(--muted)]">Ready for backend form submission later.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <Input label="Activity" placeholder="e.g. Picture matching" />
            <Input label="Mood" placeholder="e.g. engaged, calm, mixed" />
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-2">Notes</label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                className="input-field"
                placeholder="Write a short summary for the doctor and therapist."
              />
            </div>
            <Button>Save Daily Feedback</Button>
          </div>
        </section>

        <section className="card rounded-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <ClipboardList className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Recent feedback logs</h2>
          </div>

          <div className="mt-5 space-y-4">
            {dailyFeedbackEntries.map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{entry.activity}</p>
                    <p className="text-sm text-[var(--muted)]">{entry.date} • Mood: {entry.mood}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {entry.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--ink)]">{entry.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
