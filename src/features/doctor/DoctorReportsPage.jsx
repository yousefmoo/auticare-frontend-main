import { FileText } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { reportItems } from '../dashboard/mockData'

export default function DoctorReportsPage() {
  usePageTitle('Reports')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-800 via-slate-700 to-blue-700 p-6 sm:p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-slate-200">A clean report center for review-ready and pending documents.</p>
      </section>

      <section className="card rounded-[2rem] shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-4 font-medium">Report</th>
                <th className="py-3 pr-4 font-medium">Child</th>
                <th className="py-3 pr-4 font-medium">Author</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {reportItems.map((report) => (
                <tr key={report.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-blue-50 p-2">
                        <FileText className="h-4 w-4 text-blue-700" />
                      </div>
                      <span className="font-semibold text-[var(--ink)]">{report.title}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[var(--ink)]">{report.child}</td>
                  <td className="py-4 pr-4 text-[var(--muted)]">{report.author}</td>
                  <td className="py-4 pr-4 text-[var(--muted)]">{report.category}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      report.status === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 text-[var(--ink)]">{report.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
