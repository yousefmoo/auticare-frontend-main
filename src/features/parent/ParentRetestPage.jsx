import { CalendarDays, RotateCcw, ShieldCheck } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { getDemoScreeningResult, getStoredScreeningResult } from '../screening/screeningInsights'

const retestSchedule = [
  { label: 'Last test', value: 'April 2, 2026' },
  { label: 'Next test', value: 'April 16, 2026' },
  { label: 'Recommended frequency', value: 'Every 2 weeks or after major changes' },
]

export default function ParentRetestPage() {
  const screeningResult = getStoredScreeningResult() || getDemoScreeningResult()

  usePageTitle('Parent Re-Test')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 p-6 text-white shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold">Re-Test</h1>
        <p className="mt-2 max-w-3xl text-amber-100">
          Keep your child&apos;s screening timeline current with a clear schedule, last result, and next recommended test.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {retestSchedule.map((item, index) => {
          const icons = [CalendarDays, RotateCcw, ShieldCheck]
          const Icon = icons[index]

          return (
            <section key={item.label} className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-amber-50 p-3">
                  <Icon className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--muted)]">{item.label}</p>
                  <p className="mt-1 text-lg font-bold text-[var(--ink)]">{item.value}</p>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
        <h2 className="text-xl font-bold text-[var(--ink)]">Test schedule</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--card-alt)] p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Last test summary</p>
            <p className="mt-3 text-3xl font-bold text-[var(--ink)]">{screeningResult.riskLevel.label} Risk</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {screeningResult.score}/{screeningResult.totalQuestions} indicators flagged in the most recent questionnaire.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Next test guidance</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">Schedule another screening after a change in routines, therapy direction, or visible progress.</div>
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">Use the re-test to keep the parent home overview aligned with the latest child status.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
