import PropTypes from 'prop-types'

const accentStyles = {
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
}

export default function ReportCard({ item }) {
  return (
    <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accentStyles[item.accent]}`}>
        {item.metric}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
    </article>
  )
}

ReportCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    metric: PropTypes.string.isRequired,
    accent: PropTypes.oneOf(['sky', 'amber', 'emerald', 'violet']).isRequired,
  }).isRequired,
}
