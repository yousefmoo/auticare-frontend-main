import { ArrowRight, CalendarCheck2, MessageSquare, PlayCircle, Stethoscope, Video, UserCircle2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { sessionWorkflowByRole } from '../dashboard/mockData'

const roleActionConfig = {
  doctor: {
    primaryAction: { label: 'Open Messages', to: '/doctor/messages' },
    secondaryAction: { label: 'Open Assessments', to: '/doctor/assessments' },
    liveCall: { label: 'Start Video Call', to: '/doctor/sessions/live' },
    partnerTitle: 'Connected with',
    partners: [
      { label: 'Therapist notes', value: 'Weekly plans, session notes, child response', icon: Stethoscope },
      { label: 'Parent updates', value: 'Home feedback, booking notes, concerns', icon: Users },
    ],
  },
  therapist: {
    primaryAction: { label: 'Open Messages', to: '/therapist/messages' },
    secondaryAction: { label: 'Open Session Notes', to: '/therapist/session-notes' },
    liveCall: { label: 'Start Video Call', to: '/therapist/sessions/live' },
    partnerTitle: 'Connected with',
    partners: [
      { label: 'Doctor direction', value: 'Treatment goals, assessments, review points', icon: Stethoscope },
      { label: 'Parent follow-up', value: 'Home routine notes, session preparation, feedback', icon: Users },
    ],
  },
  parent: {
    primaryAction: { label: 'Open Messages', to: '/parent/messages' },
    secondaryAction: { label: 'Open Weekly Plan', to: '/parent/weekly-plan' },
    liveCall: { label: 'Join Video Call', to: '/parent/sessions/live' },
    partnerTitle: 'Connected with',
    partners: [
      { label: 'Doctor review', value: 'Assessment follow-up, report explanation, plan changes', icon: Stethoscope },
      { label: 'Therapist guidance', value: 'Session notes, home tasks, booking coordination', icon: Users },
    ],
  },
}

export default function SessionsHubPage() {
  const { role, user } = useAuthStore()
  const workflow = sessionWorkflowByRole[role] || sessionWorkflowByRole.parent
  const roleActions = roleActionConfig[role] || roleActionConfig.parent

  usePageTitle('Sessions')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-primary-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <PlayCircle className="h-4 w-4" />
              Sessions hub
            </div>
            <h1 className="mt-4 text-3xl font-bold">{workflow.heading}</h1>
            <p className="mt-2 max-w-3xl text-slate-200">
              {workflow.description} This page is intentionally simple and only appears after login.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={roleActions.liveCall.to}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                <Video className="h-4 w-4" />
                {roleActions.liveCall.label}
              </Link>
              <Link
                to={roleActions.primaryAction.to}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                {roleActions.primaryAction.label}
              </Link>
              <Link
                to={roleActions.secondaryAction.to}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {roleActions.secondaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Current workspace</p>
            <p className="mt-2 text-2xl font-bold">{user?.name || 'AutiCare User'}</p>
            <p className="text-sm capitalize text-slate-200">{role}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <section className="card rounded-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary-100 p-3">
              <CalendarCheck2 className="h-5 w-5 text-primary-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Role workflow</h2>
              <p className="text-sm text-[var(--muted)]">How this role connects into the session cycle.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            {workflow.cards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-[var(--border)] p-5">
                <h3 className="text-lg font-bold text-[var(--ink)]">{card.title}</h3>
                <div className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm text-[var(--ink)]">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="card rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3">
                <MessageSquare className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">{roleActions.partnerTitle}</h2>
                <p className="text-sm text-[var(--muted)]">Real communication between the care roles around each session.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {roleActions.partners.map((partner) => {
                const Icon = partner.icon

                return (
                  <div key={partner.label} className="rounded-3xl bg-[var(--card-alt)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white p-3">
                        <Icon className="h-5 w-5 text-primary-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{partner.label}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{partner.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3">
                <UserCircle2 className="h-5 w-5 text-sky-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">Simple session communication</h2>
                <p className="text-sm text-[var(--muted)]">What actually connects the session work.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                Start or join the live session room with video tiles for doctor, therapist, parent, and child.
              </div>
              <div className="rounded-2xl border border-[var(--border)] p-4">
                One role starts the session flow.
              </div>
              <div className="rounded-2xl border border-[var(--border)] p-4">
                Messages keep the other roles informed before and after the session.
              </div>
              <div className="rounded-2xl border border-[var(--border)] p-4">
                Plans, notes, feedback, and assessments complete the same shared communication loop.
              </div>
              <Link
                to={roleActions.liveCall.to}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 font-semibold text-white"
              >
                Open live session room
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
