import { Search, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'
import { doctorPatients } from '../dashboard/mockData'

const riskClasses = {
  high: 'bg-red-50 text-red-700',
  moderate: 'bg-amber-50 text-amber-700',
  stable: 'bg-emerald-50 text-emerald-700',
}

export default function DoctorPatientsPage() {
  usePageTitle('Patients')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Patients list</h1>
        <p className="mt-2 max-w-3xl text-blue-100">
          Review all active children, risk level, therapist assignment, and current progress.
        </p>
      </section>

      <section className="card rounded-[2rem] shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Active patients</h2>
            <p className="text-sm text-[var(--muted)]">Prepared for backend list and filters.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--card-alt)] px-4 py-2 text-sm text-[var(--muted)]">
            <Search className="h-4 w-4" />
            Search ready
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
          {doctorPatients.map((patient) => (
            <div key={patient.id} className="rounded-3xl border border-[var(--border)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <UserRound className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{patient.name}</p>
                    <p className="text-sm text-[var(--muted)]">Age {patient.age} • {patient.id}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskClasses[patient.risk]}`}>
                  {patient.risk}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <div className="flex justify-between"><span>Diagnosis</span><span className="font-medium text-[var(--ink)]">{patient.diagnosis}</span></div>
                <div className="flex justify-between"><span>Therapist</span><span className="font-medium text-[var(--ink)]">{patient.therapist}</span></div>
                <div className="flex justify-between"><span>Last visit</span><span className="font-medium text-[var(--ink)]">{patient.lastVisit}</span></div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">Progress</span>
                  <span className="font-semibold text-[var(--ink)]">{patient.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--card-alt)]">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${patient.progress}%` }} />
                </div>
              </div>

              <Link
                to="/doctor/sessions"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                View sessions
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
