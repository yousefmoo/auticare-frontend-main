import { ClipboardList, PlusCircle } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { treatmentPlans } from '../dashboard/mockData'

export default function DoctorTreatmentPlansPage() {
  usePageTitle('Treatment Plans')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Treatment plans</h1>
            <p className="mt-2 text-blue-100">Manage active plans, review updates, and prepare for backend save/edit actions.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700">
            <PlusCircle className="h-4 w-4" />
            New Plan
          </button>
        </div>
      </section>

      <section className="card rounded-[2rem] shadow-lg">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-blue-700" />
          <h2 className="text-xl font-bold text-[var(--ink)]">Plan board</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {treatmentPlans.map((plan) => (
            <div key={plan.id} className="rounded-3xl border border-[var(--border)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{plan.title}</p>
                  <p className="text-sm text-[var(--muted)]">{plan.child} • {plan.therapyType}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  plan.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {plan.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <div className="flex justify-between"><span>Frequency</span><span className="font-medium text-[var(--ink)]">{plan.frequency}</span></div>
                <div className="flex justify-between"><span>Owner</span><span className="font-medium text-[var(--ink)]">{plan.owner}</span></div>
                <div className="flex justify-between"><span>Updated</span><span className="font-medium text-[var(--ink)]">{plan.updatedAt}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
