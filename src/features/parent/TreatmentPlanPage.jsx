import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  MessageCircle, 
  FileText, 
  Calendar, 
  LayoutDashboard,
  Heart,
  User,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { useAuthStore, useUIStore } from '@/store'
import usePageTitle from '@/utils/usePageTitle'
import { getTreatmentPlansByChild } from '@/api/plans.api'
import { getChildren } from '@/api/children.api'
import { getScreeningAnalytics } from '@/api/screening.api'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function TreatmentPlanPage() {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)

  usePageTitle('Treatment Plan')

  useEffect(() => {
    const init = async () => {
      try {
        const childrenData = await getChildren()
        setChildren(childrenData)
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0])
          fetchChildData(childrenData[0].id)
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Failed to fetch profile.' })
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const fetchChildData = async (childId) => {
    try {
      setIsLoading(true)
      const [plansData, analyticsData] = await Promise.all([
        getTreatmentPlansByChild(childId),
        getScreeningAnalytics(childId)
      ])
      setPlans(plansData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Error fetching child data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChildChange = (e) => {
    const childId = e.target.value
    const child = children.find(c => c.id === parseInt(childId))
    setSelectedChild(child)
    fetchChildData(childId)
  }

  if (isLoading && children.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="fade-in space-y-8 pb-10 text-center py-20">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-lg mx-auto">
          <User className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-800">No Child Profile Found</h1>
          <p className="mt-2 text-slate-500 mb-8">Please complete the initial screening to create a profile for your child.</p>
          <button 
            onClick={() => navigate('/parent/questionnaire')}
            className="btn-primary"
          >
            Start Screening
          </button>
        </div>
      </div>
    )
  }

  const activePlan = plans[0] || null

  return (
    <div className="fade-in space-y-8 pb-10">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            {selectedChild?.firstName}&apos;s Care Roadmap
          </h1>
          <p className="mt-2 text-[var(--muted)]">Your child&apos;s personalized therapy goals and latest progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedChild?.id || ''} 
            onChange={handleChildChange}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-sm"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: AI Evaluation Summary */}
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="bg-emerald-50 rounded-2xl p-4">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-8">AI Screening Summary</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Confidence Level Ring */}
                <div className="relative h-48 w-48 flex items-center justify-center">
                  <svg className="h-full w-full rotate-[-90deg]">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 84}
                      strokeDashoffset={2 * Math.PI * 84 * (1 - (analytics?.latestConfidenceScore || 0))}
                      strokeLinecap="round"
                      className="text-emerald-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-slate-800">
                      {analytics?.latestConfidenceScore ? `${(analytics.latestConfidenceScore * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Confidence</span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="flex-1 w-full space-y-4">
                  <div className={`p-5 rounded-3xl border ${analytics?.lastPrediction === 'Normal' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Status Result</p>
                    <p className={`text-2xl font-bold ${analytics?.lastPrediction === 'Normal' ? 'text-emerald-700' : 'text-orange-700'}`}>
                      {analytics?.lastPrediction || 'No Screening Yet'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Tests</p>
                      <p className="text-lg font-bold text-slate-800">{analytics?.totalTests || 0}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Risk Count</p>
                      <p className="text-lg font-bold text-slate-800">{analytics?.highRiskCount || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {activePlan && (
                <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                    Current Treatment Goal
                  </h3>
                  <p className="text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/50 pl-4">
                    &quot;{activePlan.goal}&quot;
                  </p>
                  
                  {activePlan.notes && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Specialist Notes</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{activePlan.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Timeline */}
            <section className="rounded-[2.5rem] bg-indigo-900 p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-300" />
                  Plan Timeline
                </h2>
                {activePlan && (
                  <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-indigo-200 uppercase tracking-widest">
                    Active
                  </span>
                )}
              </div>
              
              {activePlan ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative pl-6 border-l-2 border-indigo-500/30">
                    <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">Start Date</p>
                    <p className="text-xl font-bold">{new Date(activePlan.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-indigo-500/30">
                    <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">Review Date</p>
                    <p className="text-xl font-bold">{new Date(activePlan.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-200 italic">No treatment plan timeline available yet.</p>
              )}
            </section>
          </div>

          {/* Right Column: Actions and Sessions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Care Team</h2>
              <div className="space-y-3">
                <Link to="/parent/messages" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group border border-transparent hover:border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Specialist</span>
                  </div>
                  <MessageCircle className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                </Link>
                <Link to="/parent/messages" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Doctor</span>
                  </div>
                  <MessageCircle className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </section>

            {/* Sessions Overview Card */}
            <section className="rounded-[2.5rem] bg-orange-50 border border-orange-100 p-8 text-center space-y-6 flex flex-col items-center shadow-sm">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-sm text-orange-600">
                  <Calendar className="h-10 w-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                  <div className="bg-emerald-500 h-4 w-4 rounded-full border-2 border-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-orange-900">Therapy Sessions</h2>
                <p className="text-sm text-orange-800/70 mt-2">
                  Consistent sessions lead to better outcomes. Review your schedule.
                </p>
              </div>

              <Link 
                to="/parent/sessions" 
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all hover:-translate-y-0.5"
              >
                Go to Sessions
                <ChevronRight className="h-5 w-5" />
              </Link>
            </section>
            
            {/* Reports Card */}
            <section className="rounded-[2.5rem] bg-slate-100 p-8 text-slate-800 border border-slate-200">
               <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-700">
                  <FileText className="h-6 w-6" />
                </div>
                <Link to="/parent/reports" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
              </div>
              <h3 className="font-bold text-lg">Detailed Reports</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Access clinical reports, screening histories, and progress documentation.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

