import { ShieldAlert } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import {
  getDemoScreeningResult,
  getStoredScreeningResult,
} from '../screening/screeningInsights'
import CareRecommendationsContent from './components/CareRecommendationsContent'

export default function ParentCareRecommendations() {
  usePageTitle('Care Recommendations')

  const screeningResult = getStoredScreeningResult() || getDemoScreeningResult()

  return (
    <div className="fade-in space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <ShieldAlert className="h-4 w-4" />
              Care recommendations
            </div>
            <h1 className="mt-4 text-3xl font-bold">Doctor and therapist recommendations</h1>
            <p className="mt-2 max-w-3xl text-emerald-50">
              Use the screening result to review the suggested care team and then open messages to contact a doctor or therapist directly.
            </p>
          </div>

          <div className="rounded-3xl bg-white/15 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">Based on screening</p>
            <p className="mt-2 text-3xl font-bold">{screeningResult.riskLevel.label} Risk</p>
            <p className="text-sm text-emerald-50">{screeningResult.riskLevel.probability}% probability</p>
          </div>
        </div>
      </section>

      <CareRecommendationsContent screeningResult={screeningResult} />
    </div>
  )
}
