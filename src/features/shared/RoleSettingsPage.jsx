import { Bell, Cog, MoonStar, Shield } from 'lucide-react'
import { useAuthStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { settingsByRole } from '../dashboard/mockData'

export default function RoleSettingsPage() {
  const { role } = useAuthStore()
  const settings = settingsByRole[role] || settingsByRole.parent

  usePageTitle(settings.title)

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-primary-700 via-primary-600 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <Cog className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{settings.title}</h1>
            <p className="mt-1 text-primary-100">
              Production-ready settings layout for notifications, workflow defaults, and account preferences.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="space-y-6">
          {settings.sections.map((section) => (
            <section key={section.title} className="card rounded-[2rem] shadow-lg">
              <h2 className="text-xl font-bold text-[var(--ink)]">{section.title}</h2>
              <div className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <label
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4"
                  >
                    <span className="text-sm font-medium text-[var(--ink)]">{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="card rounded-[2rem] shadow-lg">
          <h2 className="text-xl font-bold text-[var(--ink)]">System preferences</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">Notification center</p>
                  <p className="text-sm text-[var(--muted)]">Ready to bind with backend preference flags.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <div className="flex items-center gap-3">
                <MoonStar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">Theme preference</p>
                  <p className="text-sm text-[var(--muted)]">Works with the existing light/dark toggle in the navbar.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--card-alt)] p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">Security defaults</p>
                  <p className="text-sm text-[var(--muted)]">Prepared for audit logs, sessions, and access-policy integration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
