import { Activity, BarChart3, CheckCircle2 } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { therapistStats } from '../dashboard/mockData'

const statIcons = [BarChart3, CheckCircle2, Activity]

export default function TherapistStatisticsPage() {
  usePageTitle('Statistics')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-600 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Therapist statistics</h1>
        <p className="mt-2 text-indigo-100">A complete stats view for performance, note throughput, and client engagement.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {therapistStats.map((item, index) => {
          const Icon = statIcons[index]
          return (
            <section key={item.label} className="card rounded-[2rem] shadow-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-purple-50 p-3">
                  <Icon className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">{item.label}</p>
                  <p className="text-2xl font-bold text-[var(--ink)]">{item.value}</p>
                  <p className="text-xs text-[var(--muted-2)]">{item.sub}</p>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
