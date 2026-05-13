import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Baby,
  ArrowRight,
  Activity,
  History,
} from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { useAuthStore, useUIStore } from '@/store'
import { getChildren } from '@/api/children.api'
import { getScreeningResults, getScreeningAnalytics } from '@/api/screening.api'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function ParentRetestPage() {
  usePageTitle('Re-Test')

  const navigate = useNavigate()
  const { addToast } = useUIStore()

  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  // Fetch children and last screening result on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const childrenData = await getChildren()
        const list = Array.isArray(childrenData) ? childrenData : []
        setChildren(list)

        if (list.length > 0) {
          const first = list[0]
          setSelectedChild(first)

          try {
            const [results, analyticsData] = await Promise.all([
              getScreeningResults(first.id),
              getScreeningAnalytics(first.id),
            ])
            const resultList = Array.isArray(results) ? results : []
            if (resultList.length > 0) {
              setLastResult(resultList[resultList.length - 1])
            }
            setAnalytics(analyticsData)
          } catch {
            // No prior screening — that's fine
          }
        }
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Failed to load children.' })
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleChildChange = async (child) => {
    setSelectedChild(child)
    setLastResult(null)
    setAnalytics(null)
    try {
      const [results, analyticsData] = await Promise.all([
        getScreeningResults(child.id),
        getScreeningAnalytics(child.id),
      ])
      const resultList = Array.isArray(results) ? results : []
      if (resultList.length > 0) {
        setLastResult(resultList[resultList.length - 1])
      }
      setAnalytics(analyticsData)
    } catch {
      // No prior screening for this child
    }
  }

  const handleStartRetest = () => {
    if (!selectedChild) {
      addToast({ type: 'error', title: 'Select a child', message: 'Please select a child before starting.' })
      return
    }
    setIsStarting(true)
    // Navigate to questionnaire — the questionnaire page handles start session & fetching questions
    navigate('/parent/questionnaire')
  }

  const scheduleItems = [
    {
      icon: CalendarDays,
      label: 'Last Screening',
      value: lastResult
        ? new Date(lastResult.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })
        : 'No prior screening',
    },
    {
      icon: RotateCcw,
      label: 'Recommended Frequency',
      value: 'Every 2 weeks or after major changes',
    },
    {
      icon: ShieldCheck,
      label: 'Total Tests Completed',
      value: analytics?.totalTests != null ? `${analytics.totalTests} test${analytics.totalTests !== 1 ? 's' : ''}` : 'N/A',
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6 pb-10">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-orange-500/20 sm:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-orange-100 mb-2">
              Behavioral Screening
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl leading-tight">Re-Test</h1>
            <p className="mt-2 max-w-2xl text-orange-50 text-sm sm:text-base">
              Keep your child's screening timeline current. Start a new session, review
              your last results, and track developmental trends over time.
            </p>
          </div>
          <button
            onClick={handleStartRetest}
            disabled={isStarting || !selectedChild}
            className="flex-shrink-0 flex items-center gap-3 bg-white text-orange-600 font-bold px-7 py-4 rounded-2xl
                       hover:bg-orange-50 active:scale-[0.97] transition-all duration-200
                       shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <LoadingSpinner size="sm" />
                Starting…
              </>
            ) : (
              <>
                <RotateCcw className="h-5 w-5" />
                Start Re-Test
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Child Selector */}
      {children.length > 1 && (
        <section className="card rounded-[2rem] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Baby className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--ink)]">Select Child</h2>
              <p className="text-xs text-[var(--muted)]">Choose which child to re-screen</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleChildChange(child)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
                  selectedChild?.id === child.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-[var(--border)] bg-[var(--card-alt)] text-[var(--muted)] hover:border-orange-300'
                }`}
              >
                {child.firstName} {child.lastName}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Stats Row */}
      <div className="grid gap-5 md:grid-cols-3">
        {scheduleItems.map((item) => {
          const Icon = item.icon
          return (
            <section
              key={item.label}
              className="card rounded-[2rem] border border-[var(--border)] shadow-sm card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-orange-50 p-3 flex-shrink-0">
                  <Icon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-bold text-[var(--ink)]">{item.value}</p>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Last Result & Guidance */}
      <section className="card rounded-[2rem] border border-[var(--border)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--ink)] mb-5 flex items-center gap-3">
          <History className="h-5 w-5 text-[var(--muted)]" />
          Last Screening Summary
        </h2>
        <div className="grid gap-5 md:grid-cols-2">

          {/* Result card */}
          <div className="rounded-3xl bg-[var(--card-alt)] p-6 border border-[var(--border)]">
            {lastResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    lastResult.predictionClass === 'Normal'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {lastResult.predictionClass === 'Normal'
                      ? <CheckCircle2 className="h-6 w-6" />
                      : <AlertCircle className="h-6 w-6" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--muted)]">Prediction Result</p>
                    <p className={`text-xl font-bold ${
                      lastResult.predictionClass === 'Normal' ? 'text-emerald-600' : 'text-orange-600'
                    }`}>
                      {lastResult.predictionClass}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-2)] uppercase tracking-wider font-semibold mb-1">Confidence</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-[var(--ink)]">
                      {(lastResult.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--border)] mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        lastResult.predictionClass === 'Normal' ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${(lastResult.confidenceScore * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
                {analytics && (
                  <div className="flex gap-4 pt-2">
                    <div>
                      <p className="text-xs text-[var(--muted-2)] font-semibold uppercase tracking-wider">Total Tests</p>
                      <p className="text-lg font-bold text-[var(--ink)]">{analytics.totalTests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted-2)] font-semibold uppercase tracking-wider">High Risk</p>
                      <p className="text-lg font-bold text-orange-600">{analytics.highRiskCount ?? 0}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4 gap-3">
                <Activity className="h-10 w-10 text-[var(--muted-2)]" />
                <p className="font-semibold text-[var(--ink)]">No prior screening</p>
                <p className="text-sm text-[var(--muted)]">
                  {selectedChild
                    ? `${selectedChild.firstName} hasn't completed a screening yet.`
                    : 'Select a child to view their history.'}
                </p>
              </div>
            )}
          </div>

          {/* Guidance card */}
          <div className="rounded-3xl border border-[var(--border)] p-6 space-y-4">
            <p className="font-bold text-[var(--ink)] flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
              When to Re-Test
            </p>
            <div className="space-y-3 text-sm text-[var(--muted)]">
              {[
                'Re-screen after any noticeable change in routines or behavior.',
                'After a new therapist recommendation or care plan update.',
                'Following 2–4 weeks of a new therapy milestone.',
                'Whenever you need the parent dashboard aligned with the latest child status.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-[var(--card-alt)] p-4">
                  <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Re-Test CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleStartRetest}
            disabled={isStarting || !selectedChild}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3
                       bg-orange-500 text-white font-bold py-4 px-8 rounded-2xl
                       hover:bg-orange-600 active:scale-[0.98] transition-all duration-200
                       shadow-[0_8px_25px_rgba(249,115,22,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? <LoadingSpinner size="sm" /> : <RotateCcw className="h-5 w-5" />}
            {isStarting ? 'Starting Session…' : 'Start New Screening'}
            {!isStarting && <ArrowRight className="h-5 w-5" />}
          </button>
          <button
            onClick={() => navigate('/parent/home')}
            className="w-full sm:w-auto flex items-center justify-center gap-2
                       bg-[var(--card-alt)] border border-[var(--border)] text-[var(--ink)]
                       font-semibold py-4 px-8 rounded-2xl
                       hover:bg-[var(--border)] transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  )
}
