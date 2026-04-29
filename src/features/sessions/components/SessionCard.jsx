import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, ClipboardPenLine, Link2, XCircle } from 'lucide-react'
import { cancelSession, sendSessionNote } from '../../../api/sessions.api'

const statusTone = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-sky-100 text-sky-700',
  'Needs confirmation': 'bg-amber-100 text-amber-700',
  'مؤكدة': 'bg-emerald-100 text-emerald-700',
  'قادمة': 'bg-sky-100 text-sky-700',
  'بانتظار التأكيد': 'bg-amber-100 text-amber-700',
  'ملغاة': 'bg-red-100 text-red-700',
}

export default function SessionCard({ session, role, compact = false }) {
  const queryClient = useQueryClient()
  const cancelMutation = useMutation({
    mutationFn: () => cancelSession(session.id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['sessions', role] }),
      ])
    },
  })
  const noteMutation = useMutation({
    mutationFn: () => sendSessionNote(session.id),
  })
  const labelMap = {
    parent: session.therapistName,
    doctor: session.child,
    therapist: session.child,
  }

  return (
    <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]">{session.sessionType}</h3>
            <p className="text-sm text-[var(--muted)]">{labelMap[role] || session.child}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[session.status] || 'bg-slate-100 text-slate-700'}`}>
          {session.status}
        </span>
      </div>

      <div className={`mt-5 grid gap-3 text-sm ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        <div className="rounded-2xl bg-[var(--card-alt)] p-3">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-2)]">Date</p>
          <p className="mt-2 font-medium text-[var(--ink)]">{session.dateLabel}</p>
        </div>
        <div className="rounded-2xl bg-[var(--card-alt)] p-3">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-2)]">Time</p>
          <p className="mt-2 font-medium text-[var(--ink)]">{session.timeLabel}</p>
        </div>
        {!compact && (
          <div className="rounded-2xl bg-[var(--card-alt)] p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-2)]">Meeting</p>
            <p className="mt-2 font-medium text-[var(--ink)]">{session.mode}</p>
          </div>
        )}
        <div className="rounded-2xl bg-[var(--card-alt)] p-3">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-2)]">Doctor</p>
          <p className="mt-2 font-medium text-[var(--ink)]">{session.doctorName}</p>
        </div>
        <div className="rounded-2xl bg-[var(--card-alt)] p-3">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-2)]">Therapist</p>
          <p className="mt-2 font-medium text-[var(--ink)]">{session.therapistName}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-alt)] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
          <ClipboardPenLine className="h-4 w-4 text-sky-700" />
          {session.notesLabel}
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{session.notesSummary}</p>
        <p className="mt-3 text-sm font-medium text-[var(--ink)]">ملخص آخر جلسة: {session.lastSummary}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={session.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          <Link2 className="h-4 w-4" />
          {session.meetingLabel}
        </a>
        <button
          type="button"
          onClick={() => noteMutation.mutate()}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--card-alt)]"
        >
          <ClipboardPenLine className="h-4 w-4" />
          {noteMutation.isPending ? 'Sending...' : 'Send note'}
        </button>
        <button
          type="button"
          onClick={() => cancelMutation.mutate()}
          disabled={cancelMutation.isPending || session.status === 'ملغاة'}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/40"
        >
          <XCircle className="h-4 w-4" />
          {session.status === 'ملغاة' ? 'Cancelled' : cancelMutation.isPending ? 'Cancelling...' : 'Cancel session'}
        </button>
      </div>
    </article>
  )
}

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sessionType: PropTypes.string.isRequired,
    child: PropTypes.string.isRequired,
    dateLabel: PropTypes.string.isRequired,
    timeLabel: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    meetingLabel: PropTypes.string.isRequired,
    meetingLink: PropTypes.string.isRequired,
    notesLabel: PropTypes.string.isRequired,
    notesSummary: PropTypes.string.isRequired,
    lastSummary: PropTypes.string.isRequired,
    doctorName: PropTypes.string.isRequired,
    therapistName: PropTypes.string.isRequired,
  }).isRequired,
  role: PropTypes.oneOf(['parent', 'doctor', 'therapist']).isRequired,
  compact: PropTypes.bool,
}
