import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  History, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Filter
} from 'lucide-react'
import { getScreeningResults, getScreeningAnalytics } from '../../api/screening.api'
import { getChildren } from '../../api/children.api'
import usePageTitle from '../../utils/usePageTitle'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { useUIStore } from '../../store'

export default function ScreeningResultsPage() {
  const { childId: paramChildId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(paramChildId || null)
  const [results, setResults] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  usePageTitle('Screening Results')

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const childrenData = await getChildren()
        setChildren(childrenData)
        
        if (childrenData.length > 0 && !selectedChildId) {
          setSelectedChildId(childrenData[0].id)
        }
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Failed to fetch children.' })
      } finally {
        if (!selectedChildId && children.length === 0) setIsLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedChildId) {
      fetchScreeningData(selectedChildId)
    }
  }, [selectedChildId])

  const fetchScreeningData = async (id) => {
    try {
      setIsLoading(true)
      const [resultsData, analyticsData] = await Promise.all([
        getScreeningResults(id),
        getScreeningAnalytics(id)
      ])
      setResults(resultsData)
      setAnalytics(analyticsData)
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to fetch screening data.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && children.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6 pb-10">
      <section className="rounded-[2rem] bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-700 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Screening Insights</h1>
            <p className="mt-2 text-blue-100 max-w-2xl">
              Track your child&apos;s screening history and AI-powered developmental analytics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Filter className="h-5 w-5 text-blue-200" />
             <select 
              value={selectedChildId || ''} 
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-white/30 transition-all"
             >
               {children.map(child => (
                 <option key={child.id} value={child.id} className="text-slate-800">
                   {child.firstName} {child.lastName}
                 </option>
               ))}
             </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="card rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Tests</p>
                    <p className="text-2xl font-bold text-slate-800">{analytics.totalTests}</p>
                  </div>
                </div>
              </div>

              <div className="card rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Last Prediction</p>
                    <p className="text-2xl font-bold text-slate-800">{analytics.lastPrediction || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="card rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Confidence</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.latestConfidenceScore ? `${(analytics.latestConfidenceScore * 100).toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">High Risk</p>
                    <p className="text-2xl font-bold text-slate-800">{analytics.highRiskCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <History className="h-6 w-6 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-800">Screening History</h2>
              </div>
              
              {results.length === 0 ? (
                <div className="card rounded-[2rem] p-10 text-center border-dashed border-2 border-slate-200">
                  <p className="text-slate-400 italic">No screening history found for this child.</p>
                  <button 
                    onClick={() => navigate('/parent/questionnaire')}
                    className="mt-4 text-orange-600 font-bold hover:underline"
                  >
                    Start First Screening
                  </button>
                </div>
              ) : (
                results.map((item, index) => (
                  <div 
                    key={index}
                    className="card rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${item.predictionClass === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {item.predictionClass === 'Normal' ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{item.predictionClass} Result</h3>
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-800">{(item.confidenceScore * 100).toFixed(1)}%</p>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Confidence</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Guidance */}
            <div className="space-y-6">
              <section className="card rounded-[2rem] bg-slate-900 text-white p-8">
                <h3 className="text-xl font-bold mb-4">Risk Distribution</h3>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">High Risk</span>
                        <span className="text-orange-400 font-bold">{analytics?.highRiskCount || 0}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ width: `${(analytics?.highRiskCount / (analytics?.totalTests || 1)) * 100}%` }}
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Low Risk</span>
                        <span className="text-emerald-400 font-bold">{analytics?.lowRiskCount || 0}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${(analytics?.lowRiskCount / (analytics?.totalTests || 1)) * 100}%` }}
                        />
                      </div>
                   </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-xs text-slate-400 leading-relaxed italic">
                     Analytics are updated automatically after each screening submission to help track developmental trends.
                   </p>
                </div>
              </section>

              <button
                onClick={() => navigate('/parent/questionnaire')}
                className="w-full card rounded-[2rem] p-6 bg-orange-500 text-white hover:bg-orange-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-bold text-lg leading-tight text-white">Start New<br/>Screening</p>
                  </div>
                  <ChevronRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
