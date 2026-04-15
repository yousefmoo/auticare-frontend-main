import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'
import { therapistPatients } from '../dashboard/mockData'

export default function TherapistPatientsPage() {
  usePageTitle('My Patients')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-purple-700 via-fuchsia-600 to-violet-500 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">My patients</h1>
        <p className="mt-2 text-purple-100">A therapist workspace for active caseload, weekly focus, and progress visibility.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {therapistPatients.map((patient) => (
          <section key={patient.id} className="card rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-purple-50 p-3">
                <UserRound className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--ink)]">{patient.name}</h2>
                <p className="text-sm text-[var(--muted)]">Age {patient.age} • {patient.diagnosis}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex justify-between"><span>Weekly focus</span><span className="font-medium text-[var(--ink)]">{patient.weeklyFocus}</span></div>
              <div className="flex justify-between"><span>Therapist</span><span className="font-medium text-[var(--ink)]">{patient.therapist}</span></div>
              <div className="flex justify-between"><span>Last visit</span><span className="font-medium text-[var(--ink)]">{patient.lastVisit}</span></div>
            </div>
            <Link
              to="/therapist/sessions"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              View sessions
            </Link>
          </section>
        ))}
      </div>
    </div>
  )
}
