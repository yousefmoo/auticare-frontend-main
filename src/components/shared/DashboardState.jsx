import PropTypes from 'prop-types'

export function DashboardSkeleton({ cards = 3, className = '' }) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        >
          <div className="h-4 w-24 rounded-full bg-[var(--card-alt)]" />
          <div className="mt-6 h-8 w-2/3 rounded-full bg-[var(--card-alt)]" />
          <div className="mt-4 h-3 w-full rounded-full bg-[var(--card-alt)]" />
          <div className="mt-3 h-3 w-5/6 rounded-full bg-[var(--card-alt)]" />
        </div>
      ))}
    </div>
  )
}

export function DashboardEmpty({ title, description }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--muted)]">{description}</p>
    </div>
  )
}

DashboardSkeleton.propTypes = {
  cards: PropTypes.number,
  className: PropTypes.string,
}

DashboardEmpty.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
