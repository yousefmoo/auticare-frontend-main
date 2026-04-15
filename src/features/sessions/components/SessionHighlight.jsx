import PropTypes from 'prop-types'
import { ArrowUpRight, CalendarRange } from 'lucide-react'

export default function SessionHighlight({ title, session }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-900 via-cyan-800 to-teal-700 p-6 text-white shadow-xl">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-100">{title}</p>
            <h2 className="mt-1 text-2xl font-bold">{session.sessionType}</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">When</p>
            <p className="mt-2 text-lg font-semibold">{session.dateLabel}</p>
            <p className="text-sm text-sky-100">{session.timeLabel}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Meeting link</p>
            <p className="mt-2 text-lg font-semibold">{session.meetingLabel}</p>
            <p className="text-sm text-sky-100">{session.mode}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
          >
            <ArrowUpRight className="h-4 w-4" />
            Join session
          </a>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm">{session.notesSummary}</div>
        </div>
      </div>
    </section>
  )
}

SessionHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  session: PropTypes.shape({
    sessionType: PropTypes.string.isRequired,
    dateLabel: PropTypes.string.isRequired,
    timeLabel: PropTypes.string.isRequired,
    meetingLabel: PropTypes.string.isRequired,
    meetingLink: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    notesSummary: PropTypes.string.isRequired,
  }).isRequired,
}
