import { useQuery } from '@tanstack/react-query'
import { CalendarDays, RotateCcw, ShieldCheck, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../utils/usePageTitle'
import { PageHeader } from '../../../components/shared/PageFrame'
import { getRetestOverview } from '../../../api/reports.api'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function ParentRetestDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['retest-overview'],
    queryFn: getRetestOverview,
  })

  usePageTitle('Parent Re-Test')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Re-Test"
        subtitle="حافظ على جدول الفحص محدثا مع ملخص النتيجة الأخيرة والموعد الموصى به للفحص القادم."
        action={
          <button
            onClick={() => navigate('/questionnaire')}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--surface)] shadow-lg transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            فحص جديد
          </button>
        }
      />

      {isLoading && <DashboardSkeleton cards={3} />}
      {!isLoading && isError && (
        <DashboardEmpty title="تعذر تحميل بيانات إعادة الفحص" description="حاول مرة أخرى بعد التحقق من الاتصال." />
      )}
      {!isLoading && !data && (
        <div className="flex flex-col items-center gap-6">
          <DashboardEmpty title="لا توجد بيانات فحص" description="ستظهر هنا بيانات إعادة الفحص فور توفرها." />
          <button
            onClick={() => navigate('/questionnaire')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            بدء فحص جديد
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {(data.schedule || []).map((item, index) => {
              const icons = [CalendarDays, RotateCcw, ShieldCheck]
              const Icon = icons[index % icons.length]

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
                  {(data.guidance || []).map((item) => (
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
