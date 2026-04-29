import { CalendarCheck2 } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { screeningQueue } from '../dashboard/mockData'

export default function DoctorScreeningPage() {
  usePageTitle('AI Screenings')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">AI Screenings</h1>
        <p className="mt-2 text-cyan-100">Upcoming reviews and screening queue for doctor follow-up.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {screeningQueue.map((screening) => (
          <section key={screening.id} className="card rounded-[2rem] shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3">
                  <CalendarCheck2 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--ink)]">{screening.child}</h2>
                  <p className="text-sm text-[var(--muted)]">{screening.type}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                screening.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {screening.priority}
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex justify-between"><span>Date</span><span className="font-medium text-[var(--ink)]">{screening.date}</span></div>
              <div className="flex justify-between"><span>Assigned Doctor</span><span className="font-medium text-[var(--ink)]">{screening.owner}</span></div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
