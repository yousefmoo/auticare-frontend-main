import { useQuery } from '@tanstack/react-query'
import usePageTitle from '../../../utils/usePageTitle'
import { PageHeader } from '../../../components/shared/PageFrame'
import { getSessions } from '../../../api/sessions.api'
import SessionCard from '../../sessions/components/SessionCard'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function TherapistSessionsDashboard() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', 'therapist'],
    queryFn: () => getSessions('therapist'),
  })

  usePageTitle('Therapist Sessions')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Sessions"
        subtitle="إدارة الجلسات العلاجية ببطاقات أوضح للوقت وروابط الاجتماع والملاحظات وملخصات المتابعة."
      />

      <div className="grid gap-5">
        {isLoading && <DashboardSkeleton cards={2} />}
        {!isLoading && sessions.length === 0 && (
          <DashboardEmpty title="لا توجد جلسات" description="ستظهر هنا الجلسات العلاجية القادمة عند توفرها." />
        )}
        {!isLoading && sessions.map((session) => (
          <SessionCard key={session.id} session={session} role="therapist" />
        ))}
      </div>
    </div>
  )
}
