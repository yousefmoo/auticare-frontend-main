import { Activity, BarChart3, MessageSquare, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import usePageTitle from '../../../utils/usePageTitle'
import { PageHeader } from '../../../components/shared/PageFrame'

import { getReportsOverview } from '../../../api/reports.api'
import { getHomeNotes, getSessionNotes, getUpcomingSessions } from '../../../api/sessions.api'
import { getSpecialistDashboard } from '../../../api/dashboard.api'
import SessionHighlight from '../../sessions/components/SessionHighlight'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

const quickLinks = [
  { label: 'Open reports', to: '/doctor/reports' },
  { label: 'Review sessions', to: '/doctor/sessions' },
  { label: 'Message care team', to: '/doctor/messages' },
]

export default function DoctorHomeDashboard() {
  const { data: reportsData } = useQuery({
    queryKey: ['reports-overview'],
    queryFn: getReportsOverview,
  })
  const { data: upcomingSessions = [], isLoading } = useQuery({
    queryKey: ['sessions', 'doctor', 'upcoming'],
    queryFn: () => getUpcomingSessions('doctor'),
  })
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard', 'specialist'],
    queryFn: getSpecialistDashboard,
  })
  const nextSession = upcomingSessions[0]
  const stats = [
    { label: 'الحالات النشطة', value: dashboardData?.stats?.activeCases || 0, icon: Users, tone: 'bg-sky-100 text-sky-700' },
    { label: 'التقارير الجاهزة', value: dashboardData?.stats?.readyReports || reportsData?.cards?.length || 0, icon: BarChart3, tone: 'bg-violet-100 text-violet-700' },
    { label: 'المراجعات المعلقة', value: dashboardData?.stats?.pendingReviews || dashboardData?.pendingAssessments?.length || 0, icon: Activity, tone: 'bg-amber-100 text-amber-700' },
  ]

  usePageTitle('Doctor Home')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Doctor Home"
        subtitle="تابع الجلسات والتقارير ورسائل الفريق من لوحة طبية منظمة وواضحة."
        action={
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            <MessageSquare className="h-4 w-4" />
            3 محادثات نشطة
          </div>
        }
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

      {nextSession && <SessionHighlight title={nextSession.homeRoleLabel.doctor} session={nextSession} />}

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">الجلسات القادمة</h2>
              <p className="text-sm text-[var(--muted)]">روابط الاجتماع والملاحظات وملخص آخر جلسة لكل حالة.</p>
            </div>
            <Link to="/doctor/sessions" className="text-sm font-semibold text-sky-700 hover:text-sky-600">
              عرض الكل
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {isLoading && <DashboardSkeleton cards={2} className="md:grid-cols-1 xl:grid-cols-1" />}
            {!isLoading && upcomingSessions.length === 0 && (
              <DashboardEmpty title="لا توجد جلسات حاليا" description="ستظهر هنا الجلسات القادمة الخاصة بالطبيب فور توفرها." />
            )}
            {!isLoading && upcomingSessions.map((session) => (
              <div key={session.id} className="rounded-[1.5rem] border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{session.child}</p>
                    <p className="text-sm text-[var(--muted)]">{session.therapistName}</p>
                  </div>
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    {session.meetingLabel}
                  </a>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {session.dateLabel} - {session.timeLabel}
                </p>
                <p className="mt-2 text-sm text-[var(--ink)]">الملاحظات: {session.notesSummary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--ink)]">اختصارات</h2>
            <div className="mt-4 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-alt)] px-4 py-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--card)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--ink)]">قائمة المراجعات</h2>
            <div className="mt-4 space-y-3">
              {!dashboardData?.pendingAssessments || dashboardData.pendingAssessments.length === 0 ? (
                 <DashboardEmpty title="لا توجد مراجعات" description="لا توجد أي تقييمات معلقة حالياً." />
              ) : (
                dashboardData.pendingAssessments.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
                    <p className="font-semibold text-[var(--ink)]">{item.child}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.type}</p>
                    <p className="mt-2 text-xs text-[var(--muted-2)]">
                      {item.date} - أولوية {item.priority}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

