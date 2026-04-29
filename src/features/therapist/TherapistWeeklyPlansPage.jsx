import { CalendarDays } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { weeklyPlans } from '../dashboard/mockData'

export default function TherapistWeeklyPlansPage() {
  usePageTitle('Weekly Plans')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Weekly plans</h1>
        <p className="mt-2 text-violet-100">Plan board for goals, session count, and home tasks.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {weeklyPlans.map((plan) => (
          <section key={plan.id} className="card rounded-[2rem] shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-purple-50 p-3">
                  <CalendarDays className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--ink)]">{plan.child}</h2>
                  <p className="text-sm text-[var(--muted)]">{plan.goal}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                plan.status === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {plan.status}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex justify-between"><span>Sessions this week</span><span className="font-medium text-[var(--ink)]">{plan.sessions}</span></div>
              <div className="flex justify-between"><span>Home task</span><span className="font-medium text-[var(--ink)]">{plan.homeTask}</span></div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
