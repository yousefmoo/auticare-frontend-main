import { Link } from 'react-router-dom'
import {
  Camera,
  Mic,
  MonitorUp,
  PhoneOff,
  MessageSquareText,
  ClipboardCheck,
  UserCircle2,
} from 'lucide-react'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { liveSessionScenarios } from '../dashboard/mockData'

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function SessionCallRoomPage() {
  const { role } = useAuthStore()
  const session = liveSessionScenarios[role] || liveSessionScenarios.parent

  usePageTitle('Live Session')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-primary-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Camera className="h-4 w-4" />
              Live session room
            </div>
            <h1 className="mt-4 text-3xl font-bold">{session.title}</h1>
            <p className="mt-2 text-slate-200">{session.focus}</p>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Now live</p>
            <p className="mt-2 text-2xl font-bold">{session.sessionType}</p>
            <p className="text-sm text-slate-200">{session.time}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
        <section className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {session.participants.map((participant, index) => (
              <div
                key={participant.id}
                className={`relative min-h-[240px] rounded-[1.75rem] border border-[var(--border)] ${
                  index === 0 ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white' : 'bg-[var(--card)]'
                } p-5 shadow-lg`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${participant.tone}`}>
                    {participant.role}
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-current">
                    {participant.status}
                  </span>
                </div>

                <div className="mt-10 flex flex-col items-center justify-center text-center">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${
                    index === 0 ? 'bg-white/15 text-white' : 'bg-[var(--card-alt)] text-[var(--ink)]'
                  }`}>
                    {getInitials(participant.name)}
                  </div>
                  <p className={`mt-4 text-lg font-semibold ${index === 0 ? 'text-white' : 'text-[var(--ink)]'}`}>
                    {participant.name}
                  </p>
                  <p className={`text-sm ${index === 0 ? 'text-slate-200' : 'text-[var(--muted)]'}`}>
                    {participant.role}
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className={`text-xs ${index === 0 ? 'text-slate-200' : 'text-[var(--muted)]'}`}>Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded-full bg-white/10 p-2 text-current">
                      <Mic className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-full bg-white/10 p-2 text-current">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[var(--card-alt)] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                <Mic className="h-4 w-4" />
                Mute
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[var(--card-alt)] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                <Camera className="h-4 w-4" />
                Camera
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[var(--card-alt)] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                <MonitorUp className="h-4 w-4" />
                Share Screen
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white">
                <PhoneOff className="h-4 w-4" />
                Leave Call
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary-100 p-3">
                <ClipboardCheck className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">Session checkpoints</h2>
                <p className="text-sm text-[var(--muted)]">Live coordination between the care roles.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {session.checkpoints.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-[var(--card-alt)] p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-[var(--ink)]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3">
                <MessageSquareText className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">Connected tools</h2>
                <p className="text-sm text-[var(--muted)]">Move from the call into communication and notes.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Link
                to={`/${role}/messages`}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-alt)]"
              >
                Open messages
                <span className="text-[var(--muted)]">Chat with the care team</span>
              </Link>
              <Link
                to={role === 'therapist' ? '/therapist/session-notes' : role === 'doctor' ? '/doctor/reports' : '/parent/weekly-plan'}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--card-alt)]"
              >
                Continue workflow
                <span className="text-[var(--muted)]">
                  {role === 'therapist' ? 'Write session notes' : role === 'doctor' ? 'Review reports' : 'Open weekly plan'}
                </span>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3">
                <UserCircle2 className="h-5 w-5 text-sky-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">Why this feels connected</h2>
                <p className="text-sm text-[var(--muted)]">Everyone is in the same room around the same child.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <div className="rounded-2xl border border-[var(--border)] p-4">Parent, child, therapist, and doctor can all appear in one shared session flow.</div>
              <div className="rounded-2xl border border-[var(--border)] p-4">Video call, messages, notes, and review pages are linked together instead of being isolated tools.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
