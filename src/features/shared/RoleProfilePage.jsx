import { User, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { profileByRole } from '../dashboard/mockData'

export default function RoleProfilePage() {
  const { role, user } = useAuthStore()
  const profile = profileByRole[role] || profileByRole.parent

  usePageTitle(profile.title)

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <User className="h-4 w-4" />
              Profile workspace
            </div>
            <h1 className="mt-4 text-3xl font-bold">{profile.title}</h1>
            <p className="mt-2 text-slate-200">
              Review the account details and role information prepared for backend mapping.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Signed in as</p>
            <p className="mt-2 text-2xl font-bold">{user?.name || 'AutiCare User'}</p>
            <p className="text-sm capitalize text-slate-200">{role}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <section className="card rounded-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary-100 p-3">
              <ShieldCheck className="h-5 w-5 text-primary-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Profile details</h2>
              <p className="text-sm text-[var(--muted)]">{profile.team}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {profile.fields.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-[var(--card-alt)] px-4 py-4">
                <span className="text-sm text-[var(--muted)]">{label}</span>
                <span className="text-sm font-semibold text-[var(--ink)] text-right">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card rounded-[2rem] shadow-lg">
          <h2 className="text-xl font-bold text-[var(--ink)]">Backend handoff notes</h2>
          <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
            <div className="rounded-2xl border border-[var(--border)] p-4">
              Map the displayed profile fields to the backend `users` and role-specific profile tables.
            </div>
            <div className="rounded-2xl border border-[var(--border)] p-4">
              Replace static identifiers, license numbers, and care assignments with API-backed records.
            </div>
            <div className="rounded-2xl border border-[var(--border)] p-4">
              Keep this layout and bind form editing later if inline profile updates are needed.
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
