import { MessageCircle, Stethoscope, Video } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '../../../components/shared/PageFrame'
import { useAuthStore } from '../../../store'
import usePageTitle from '../../../utils/usePageTitle'
import { getSpecialists } from '../../../api/specialists.api'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function SpecialistsDirectoryPage() {
  const role = useAuthStore((state) => state.role)
  const { data: specialistDirectory = [], isLoading } = useQuery({
    queryKey: ['specialists'],
    queryFn: getSpecialists,
  })

  usePageTitle('Specialists')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Specialists"
        subtitle="استعرض قائمة الأطباء والأخصائيين وابدأ الرسائل أو الحجز من واجهة بطاقات نظيفة."
      />

      {isLoading && <DashboardSkeleton cards={4} />}
      {!isLoading && specialistDirectory.length === 0 && (
        <DashboardEmpty title="لا يوجد متخصصون" description="ستظهر هنا قائمة الأطباء والأخصائيين عند توفرها." />
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {specialistDirectory.map((specialist) => (
          <article key={specialist.id} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                  {specialist.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--ink)]">{specialist.name}</h2>
                  <p className="text-sm text-[var(--muted)]">
                    {specialist.type} - {specialist.specialization}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {specialist.experience}
              </span>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Care focus</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{specialist.focus}</p>
              <p className="mt-3 text-sm font-medium text-[var(--ink)]">{specialist.availability}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--card-alt)]"
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                <Video className="h-4 w-4" />
                Book session
              </button>
              {role === 'doctor' && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                  <Stethoscope className="h-4 w-4" />
                  Specialist network
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
