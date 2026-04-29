import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ArrowRight, Stethoscope, Table2, TrendingUp, Users } from 'lucide-react'

export function SpecialistTable({ specialists }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
            <th className="py-3 pr-4 font-medium">Care Team</th>
            <th className="py-3 pr-4 font-medium">Specialty</th>
            <th className="py-3 pr-4 font-medium">Experience</th>
            <th className="py-3 pr-4 font-medium">Match</th>
            <th className="py-3 pr-4 font-medium">Availability</th>
            <th className="py-3 font-medium">Reason</th>
          </tr>
        </thead>
        <tbody>
          {specialists.map((specialist, index) => (
            <tr
              key={specialist.id}
              className={index !== specialists.length - 1 ? 'border-b border-[var(--border)]' : ''}
            >
              <td className="py-4 pr-4">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{specialist.name}</p>
                  <p className="text-xs text-[var(--muted-2)]">{specialist.channel}</p>
                </div>
              </td>
              <td className="py-4 pr-4 text-[var(--ink)]">{specialist.specialty}</td>
              <td className="py-4 pr-4 text-[var(--muted)]">
                {specialist.experience}
                <div className="text-xs text-[var(--muted-2)]">{specialist.cases} cases</div>
              </td>
              <td className="py-4 pr-4">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {Math.round(specialist.rating * 20)}% fit
                </span>
              </td>
              <td className="py-4 pr-4 text-[var(--muted)]">{specialist.availability}</td>
              <td className="py-4 text-[var(--ink)]">{specialist.recommendedFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CareRecommendationsContent({ screeningResult }) {
  const doctorCount = screeningResult.specialists.filter((item) => item.channel === 'Doctor').length
  const therapistCount = screeningResult.specialists.filter((item) => item.channel === 'Therapist').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-[var(--border)] bg-sky-50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3">
              <Stethoscope className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sky-700">Doctors</p>
              <p className="text-2xl font-bold text-slate-900">{doctorCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3">
              <Users className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700">Therapists</p>
              <p className="text-2xl font-bold text-slate-900">{therapistCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-amber-50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3">
              <TrendingUp className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-700">Suggested path</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Doctor review + therapist follow-up</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--card-alt)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
              <Table2 className="h-3.5 w-3.5" />
              Care recommendations
            </div>
            <h3 className="mt-3 text-xl font-bold text-[var(--ink)]">Recommended doctors and therapists</h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              This table is built from the screening result to help you choose the next conversation.
            </p>
          </div>

          <Link
            to="/parent/messages"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Contact care team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6">
          <SpecialistTable specialists={screeningResult.specialists} />
        </div>
      </div>
    </div>
  )
}

CareRecommendationsContent.propTypes = {
  screeningResult: PropTypes.shape({
    specialists: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
}

SpecialistTable.propTypes = {
  specialists: PropTypes.arrayOf(PropTypes.object).isRequired,
}
