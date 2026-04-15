import { CalendarClock, ClipboardList, Sparkles, Stethoscope, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../../utils/usePageTitle'
import { PageHeader } from '../../../components/shared/PageFrame'
import { assessmentQueue, doctorPatients, parentWeeklySchedule } from '../../dashboard/mockData'

const overviewStats = [
  { label: 'Patients count', value: doctorPatients.length, icon: Users, tone: 'bg-blue-100 text-blue-700' },
  { label: 'Sessions today', value: 3, icon: ClipboardList, tone: 'bg-emerald-100 text-emerald-700' },
  { label: 'Upcoming sessions', value: parentWeeklySchedule.length, icon: CalendarClock, tone: 'bg-amber-100 text-amber-700' },
]

const quickActions = [
  { label: 'Open patients', to: '/doctor/patients' },
  { label: 'Review sessions', to: '/doctor/sessions' },
  { label: 'View profile', to: '/doctor/profile' },
]

export default function DoctorHomePage() {
  usePageTitle('Doctor Home')

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Doctor Home"
        subtitle="Your main control page for patient load, session visibility, and fast access to clinical actions."
        action={(
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            {assessmentQueue.length} priority reviews
          </div>
        )}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {overviewStats.map((item) => {
          const Icon = item.icon
          return (
            <section key={item.label} className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 ${item.tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--muted)]">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--ink)]">{item.value}</p>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3">
              <CalendarClock className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Upcoming sessions</h2>
              <p className="text-sm text-[var(--muted)]">Scheduled doctor reviews and care touchpoints.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {parentWeeklySchedule.map((session) => (
              <div key={session.id} className="rounded-3xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                    <p className="text-sm text-[var(--muted)]">{session.therapist}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {session.time}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{session.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <Stethoscope className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">Quick actions</h2>
                <p className="text-sm text-[var(--muted)]">Jump straight to the core doctor workflows.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] px-4 py-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--card)]"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
            <h2 className="text-xl font-bold text-[var(--ink)]">Assessment queue</h2>
            <div className="mt-4 space-y-3">
              {assessmentQueue.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                  <p className="font-semibold text-[var(--ink)]">{item.child}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.type}</p>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">{item.date} • Priority {item.priority}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
