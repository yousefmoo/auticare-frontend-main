import { BookOpen, PlayCircle } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { resourceCollections } from '../dashboard/mockData'

export default function ParentResourcesPage() {
  usePageTitle('Educational Resources')

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-600 via-lime-500 to-yellow-400 p-6 sm:p-8 text-slate-900 shadow-xl">
        <h1 className="text-3xl font-bold">Educational resources</h1>
        <p className="mt-2 text-slate-700">Curated guides, videos, and worksheets for families and home routines.</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {resourceCollections.map((resource) => (
          <section key={resource.id} className="card rounded-[2rem] shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-emerald-50 p-3">
                {resource.format === 'Video' ? (
                  <PlayCircle className="h-5 w-5 text-emerald-700" />
                ) : (
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                )}
              </div>
              <span className="rounded-full bg-[var(--card-alt)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {resource.format}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-bold text-[var(--ink)]">{resource.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{resource.category}</p>
            <p className="mt-4 text-sm text-[var(--ink)]">{resource.description}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
