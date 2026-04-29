import { ArrowRight, CalendarCheck2, Link2, MessageSquare, Stethoscope, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'

const sessionHighlights = [
  {
    title: 'Doctor',
    description: 'Reviews screening results, adjusts treatment direction, and confirms the next clinical step.',
    icon: Stethoscope,
  },
  {
    title: 'Therapist',
    description: 'Runs the session, records observations, and translates goals into clear home guidance.',
    icon: CalendarCheck2,
  },
  {
    title: 'Parent',
    description: 'Books the session, shares home observations, and keeps the communication loop active.',
    icon: Users,
  },
]

const connectionMoments = [
  {
    title: 'Before the session',
    detail: 'The parent shares what happened at home, the therapist prepares the session focus, and the doctor reviews major risks or changes.',
  },
  {
    title: 'During the session',
    detail: 'The therapist leads the session while progress, behavior, and response are captured in a way the rest of the team can understand.',
  },
  {
    title: 'After the session',
    detail: 'Notes, recommendations, and messages connect the parent, therapist, and doctor before the next visit.',
  },
]

const realConnectionPoints = [
  'Messages connect questions, updates, and follow-up decisions.',
  'Session notes connect what happened in therapy with what the parent should do next.',
  'Screenings and reports connect therapist observations to doctor review.',
  'Booking and weekly plans connect family availability with therapist delivery.',
]

export default function PublicSessionsPage() {
  usePageTitle('Sessions')

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--surface)] text-[var(--ink)]">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 hero-surface" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full hero-glow-1 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full hero-glow-2 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--card)] px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm">
              <Link2 className="h-4 w-4" />
              Connected sessions
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-display font-bold leading-tight">
              Real connection between parent, therapist, and doctor
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] max-w-3xl">
              The sessions experience is not just booking. It is the communication bridge that keeps everyone aligned around the same child.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/questionnaire"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--surface)] shadow-sm hover:opacity-90 transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-alt)] transition-colors"
              >
                Open Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sessionHighlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
                <div className="inline-flex rounded-2xl bg-primary-50 p-3">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>
                <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="text-2xl font-bold">How the session connects everyone</h2>
            <div className="mt-6 space-y-4">
              {connectionMoments.map((item, index) => (
                <div key={item.title} className="flex gap-4 rounded-2xl bg-[var(--card-alt)] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--surface)] text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
            <div className="inline-flex rounded-2xl bg-emerald-50 p-3">
              <MessageSquare className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">What makes it feel real</h2>
            <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
              {realConnectionPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--border)] p-4">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-sm font-semibold text-emerald-200">Inside the workspace</p>
              <p className="mt-2 text-sm text-slate-200">
                After login, each role sees its own sessions page, messages, notes, plans, and follow-up actions connected together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
