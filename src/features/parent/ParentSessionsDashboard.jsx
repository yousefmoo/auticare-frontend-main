import { useQuery } from '@tanstack/react-query'
import usePageTitle from '@/utils/usePageTitle'
import { PageHeader } from '@/components/shared/PageFrame'
import { getSessions } from '@/api/sessions.api'
import SessionCard from '@/features/sessions/components/SessionCard'
import { DashboardEmpty, DashboardSkeleton } from '@/components/shared/DashboardState'

export default function ParentSessionsDashboard() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', 'parent'],
    queryFn: () => getSessions('parent'),
  })

  usePageTitle('Parent Sessions')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Sessions"
        subtitle="عرض الجلسات أونلاين مع اسم الطبيب والأخصائي والموعد والحالة وروابط الاجتماعات والملاحظات."
      />

      <div className="grid gap-5">
        {isLoading && <DashboardSkeleton cards={2} />}
        {!isLoading && sessions.length === 0 && (
          <DashboardEmpty title="لا توجد جلسات" description="ستظهر هنا جلسات الأسرة القادمة عند توفرها." />
        )}
        {!isLoading && sessions.map((session) => (
          <SessionCard key={session.id} session={session} role="parent" />
        ))}
      </div>
    </div>
  )
}
