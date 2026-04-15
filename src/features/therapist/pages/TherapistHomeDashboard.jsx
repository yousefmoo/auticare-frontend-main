import { ClipboardList, MessageSquare, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import usePageTitle from '../../../utils/usePageTitle'
import { getUpcomingSessions } from '../../../api/sessions.api'
import { getSpecialistDashboard } from '../../../api/dashboard.api'
import { PageHeader } from '../../../components/shared/PageFrame'
import SessionHighlight from '../../sessions/components/SessionHighlight'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function TherapistHomeDashboard() {
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'therapist', 'upcoming'],
    queryFn: () => getUpcomingSessions('therapist'),
  })
  
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', 'specialist'],
    queryFn: getSpecialistDashboard,
  })

  const nextSession = upcomingSessions[0]
  const patientsCount = dashboardData?.patients?.length || 0;
  const plansCount = dashboardData?.plans?.length || 0;
  const messagesCount = dashboardData?.unreadMessages || 0;

  const stats = [
    { label: 'Assigned patients', value: patientsCount, tone: 'bg-violet-100 text-violet-700', icon: Users },
    { label: 'Active plans', value: plansCount, tone: 'bg-amber-100 text-amber-700', icon: ClipboardList },
    { label: 'Unread messages', value: messagesCount, tone: 'bg-sky-100 text-sky-700', icon: MessageSquare },
  ]

  usePageTitle('Therapist Home')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Therapist Home"
        subtitle="تابعي الجلسات المكلفة بها والملاحظات والتنسيق مع الأسرة من مساحة علاجية واضحة."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <section key={item.label} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--ink)]">{item.value}</p>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {nextSession && <SessionHighlight title={nextSession.sessionType} session={nextSession} />}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[var(--ink)]">الجلسات القادمة</h2>
            <Link to="/therapist/sessions" className="text-sm font-semibold text-violet-700 hover:text-violet-600">
              عرض الكل
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {sessionsLoading && <DashboardSkeleton cards={2} className="md:grid-cols-1 xl:grid-cols-1" />}
            {!sessionsLoading && upcomingSessions.length === 0 && (
              <DashboardEmpty title="لا توجد جلسات حاليا" description="ستظهر هنا الجلسات المكلفة بها فور إضافتها." />
            )}
            {!sessionsLoading && upcomingSessions.map((session) => (
              <div key={session.id} className="rounded-[1.5rem] border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{session.childName || 'Unknown Patient'}</p>
                    <p className="text-sm text-[var(--muted)]">{session.sessionType || 'Session'}</p>
                  </div>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                    >
                      الانضمام
                    </a>
                  )}
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {session.sessionDate} - {session.sessionTime}
                </p>
                <p className="mt-2 text-sm text-[var(--ink)]">الملاحظات: {session.sessionNotes || 'No notes yet.'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--ink)]">الأطفال المكلفون</h2>
            <div className="mt-4 space-y-3">
              {dashboardLoading ? <DashboardSkeleton cards={1} /> : null}
              {!dashboardLoading && (!dashboardData?.patients || dashboardData.patients.length === 0) && (
                 <DashboardEmpty title="لا يوجد أطفال" description="لم يتم تخصيص أي أطفال لمتابعتك حتى الآن." />
              )}
              {dashboardData?.patients?.map((patient) => (
                <div key={patient.id} className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
                  <p className="font-semibold text-[var(--ink)]">{patient.firstName} {patient.lastName}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{patient.medicalHistory || 'No diagnosis info'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--ink)]">الخطط الأسبوعية</h2>
            <div className="mt-4 space-y-3">
              {dashboardLoading ? <DashboardSkeleton cards={1} /> : null}
              {!dashboardLoading && (!dashboardData?.plans || dashboardData.plans.length === 0) && (
                 <DashboardEmpty title="لا توجد خطط" description="لا توجد خطط أسبوعية مخصصة." />
              )}
              {dashboardData?.plans?.map((plan) => (
                <div key={plan.id} className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
                  <p className="font-semibold text-[var(--ink)]">{plan.goal}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{plan.notes}</p>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">Progress: {plan.progress || 'N/A'}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

