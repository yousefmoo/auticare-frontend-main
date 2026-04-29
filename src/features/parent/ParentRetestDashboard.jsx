import { useQuery } from '@tanstack/react-query'
import { CalendarDays, RotateCcw, ShieldCheck } from 'lucide-react'
import usePageTitle from '@/utils/usePageTitle'
import { PageHeader } from '@/components/shared/PageFrame'
import { getRetestOverview } from '@/api/reports.api'
import { DashboardEmpty, DashboardSkeleton } from '@/components/shared/DashboardState'

export default function ParentRetestDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['retest-overview'],
    queryFn: getRetestOverview,
  })

  usePageTitle('Parent Re-Test')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Re-Test"
        subtitle="حافظ على جدول الفحص محدثا مع ملخص النتيجة الأخيرة والموعد الموصى به للفحص القادم."
      />

      {isLoading && <DashboardSkeleton cards={3} />}
      {!isLoading && !data && (
        <DashboardEmpty title="لا توجد بيانات فحص" description="ستظهر هنا بيانات إعادة الفحص فور توفرها." />
      )}

      {data && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {data.schedule.map((item, index) => {
              const icons = [CalendarDays, RotateCcw, ShieldCheck]
              const Icon = icons[index]

              return (
                <section key={item.label} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                      <Icon className="h-6 w-6" />
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

          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--ink)]">جدول الفحص</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-[var(--card-alt)] p-5">
                <p className="text-sm font-semibold text-[var(--ink)]">{data.summaryTitle}</p>
                <p className="mt-3 text-3xl font-bold text-[var(--ink)]">{data.summaryRisk}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{data.summaryScore}</p>
              </div>

              <div className="rounded-3xl border border-[var(--border)] p-5">
                <p className="text-sm font-semibold text-[var(--ink)]">إرشادات الفحص القادم</p>
                <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  {data.guidance.map((item) => (
                    <div key={item} className="rounded-2xl bg-[var(--card-alt)] p-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
