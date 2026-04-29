import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Video } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import usePageTitle from '../../utils/usePageTitle'
import { parentWeeklySchedule } from '../dashboard/mockData'

export default function ParentWeeklyPlanPro() {
  usePageTitle('Weekly Plan')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Weekly plan and booking</h1>
        <p className="mt-2 text-slate-200">A parent booking workspace with direct access to live sessions and care-team communication.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-6">
        <section className="card rounded-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3">
              <CalendarDays className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Upcoming sessions</h2>
          </div>

          <div className="mt-5 space-y-4">
            {parentWeeklySchedule.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{item.therapist}</p>
                    <p className="text-sm text-[var(--muted)]">{item.specialty}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.sessionType}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Clock3 className="h-4 w-4" />
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/parent/sessions/live"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Video className="h-4 w-4" />
                    Join Session
                  </Link>
                  <Link
                    to="/parent/messages"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-alt)]"
                  >
                    Message Care Team
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card rounded-[2rem] shadow-lg">
          <h2 className="text-xl font-bold text-[var(--ink)]">Request an update</h2>
          <div className="mt-5 space-y-4">
            <Input label="Preferred specialist" placeholder="Choose from doctor or therapist list" />
            <Input label="Preferred day" placeholder="e.g. Sun 10" />
            <Input label="Preferred time" placeholder="e.g. 09:00 AM" />
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-2">Note for next session</label>
              <textarea rows={5} className="input-field" placeholder="Add a note for the care team." />
            </div>
            <Button>Send Booking Request</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
