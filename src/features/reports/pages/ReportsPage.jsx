import { Download, FileStack } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PageHeader } from '../../../components/shared/PageFrame'
import usePageTitle from '../../../utils/usePageTitle'
import ReportCard from '../components/ReportCard'
import Charts from '../components/Charts'
import { exportReportsPdf, getReportsOverview } from '../../../api/reports.api'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

const summaryTone = {
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
}

export default function ReportsPage() {
  const { data: reportsOverview, isLoading, isError } = useQuery({
    queryKey: ['reports-overview'],
    queryFn: getReportsOverview,
  })
  const exportMutation = useMutation({
    mutationFn: exportReportsPdf,
  })

  usePageTitle('Reports')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Reports"
        subtitle="متابعة تقدم الطفل ونتائج الفحص وملخص الجلسات والإحصاءات من لوحة تقارير صحية واضحة."
        action={
          <button
            type="button"
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            <Download className="h-4 w-4" />
            {exportMutation.isPending ? 'جاري التصدير...' : 'Export PDF'}
          </button>
        }
      />

      {isLoading && <DashboardSkeleton cards={4} />}
      {!isLoading && isError && (
        <DashboardEmpty title="تعذر تحميل التقارير" description="تعذر الوصول إلى بيانات التقارير حاليا. حاول مرة أخرى." />
      )}
      {!isLoading && !reportsOverview && (
        <DashboardEmpty title="لا توجد تقارير" description="ستظهر هنا التقارير والإحصاءات فور توفر البيانات." />
      )}

      {reportsOverview && (
        <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(reportsOverview.summary || []).map((item) => (
          <section key={item.id} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${summaryTone[item.tone]}`}>
              {item.label}
            </div>
            <p className="mt-4 text-3xl font-bold text-[var(--ink)]">{item.value}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {(reportsOverview.cards || []).map((item) => (
          <ReportCard key={item.id} item={item} />
        ))}
      </div>

      <Charts
        progressTrend={reportsOverview.progressTrend}
        behaviorStats={reportsOverview.behaviorStats}
        sessionMix={reportsOverview.sessionMix}
      />

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <FileStack className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Summary insight</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Communication and engagement are trending upward, while behavior regulation remains the biggest opportunity.
              The report set is ready for export and family review.
            </p>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  )
}
