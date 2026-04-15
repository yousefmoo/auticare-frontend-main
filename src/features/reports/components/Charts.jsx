import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'
import PropTypes from 'prop-types'

const pieColors = ['#0ea5e9', '#14b8a6', '#f59e0b']

export default function Charts({ progressTrend, behaviorStats, sessionMix }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--ink)]">Therapy progress</h3>
          <p className="text-sm text-[var(--muted)]">Weekly communication, engagement, and behavior movement.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-2)" />
              <YAxis stroke="var(--muted-2)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="communication" stroke="#0ea5e9" strokeWidth={3} />
              <Line type="monotone" dataKey="engagement" stroke="#14b8a6" strokeWidth={3} />
              <Line type="monotone" dataKey="behavior" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--ink)]">Behavior statistics</h3>
          <p className="text-sm text-[var(--muted)]">A quick read on routine quality and regulation patterns.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-2)" />
              <YAxis stroke="var(--muted-2)" />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm xl:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--ink)]">Sessions summary</h3>
          <p className="text-sm text-[var(--muted)]">Distribution between therapy, review sessions, and parent coaching.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sessionMix} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                {sessionMix.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

Charts.propTypes = {
  progressTrend: PropTypes.arrayOf(PropTypes.object).isRequired,
  behaviorStats: PropTypes.arrayOf(PropTypes.object).isRequired,
  sessionMix: PropTypes.arrayOf(PropTypes.object).isRequired,
}
