import { CalendarCheck2, ClipboardList, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'
import { parentWeeklySchedule, therapistPatients, weeklyPlans } from '../dashboard/mockData'

export default function TherapistHomePage() {
  usePageTitle('Therapist Home')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-purple-800 via-fuchsia-700 to-indigo-700 p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-purple-100">
              <Sparkles className="h-4 w-4" />
              Therapist home
            </span>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Daily therapy control page</h1>
              <p className="mt-2 max-w-3xl text-purple-100">
                Track assigned patients, today&apos;s sessions, and your active weekly plan targets from one place.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-100">Today sessions</p>
            <p className="mt-2 text-2xl font-bold">{parentWeeklySchedule.length}</p>
            <p className="mt-1 text-sm text-purple-100">Live and scheduled therapy touchpoints</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Assigned patients</p>
              <p className="mt-1 text-3xl font-bold text-[var(--ink)]">{therapistPatients.length}</p>
            </div>
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Today sessions</p>
              <p className="mt-1 text-3xl font-bold text-[var(--ink)]">{parentWeeklySchedule.length}</p>
            </div>
          </div>
        </section>

        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Weekly plan</p>
              <p className="mt-1 text-3xl font-bold text-[var(--ink)]">{weeklyPlans.length}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
          <h2 className="text-xl font-bold text-[var(--ink)]">Assigned patients</h2>
          <div className="mt-5 grid gap-4">
            {therapistPatients.map((patient) => (
              <div key={patient.id} className="rounded-3xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{patient.name}</p>
                    <p className="text-sm text-[var(--muted)]">Age {patient.age} • {patient.diagnosis}</p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    {patient.progress}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">Weekly focus: {patient.weeklyFocus}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
            <h2 className="text-xl font-bold text-[var(--ink)]">Today sessions</h2>
            <div className="mt-4 space-y-3">
              {parentWeeklySchedule.map((session) => (
                <div key={session.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                  <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{session.therapist}</p>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">{session.date} • {session.time}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card rounded-[2rem] border border-[var(--border)] shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[var(--ink)]">Weekly plan</h2>
              <Link to="/therapist/sessions" className="text-sm font-semibold text-purple-700 hover:text-purple-800">
                Open sessions
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {weeklyPlans.map((plan) => (
                <div key={plan.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                  <p className="font-semibold text-[var(--ink)]">{plan.child}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{plan.goal}</p>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">{plan.sessions} sessions • Home task: {plan.homeTask}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
