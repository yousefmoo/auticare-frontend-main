import { useAuthStore } from '../../../store'
import usePageTitle from '../../../utils/usePageTitle'
import { getDemoScreeningResult, getStoredScreeningResult } from '../../screening/screeningInsights'
import { 
  MessageCircle, 
  FileText, 
  Calendar, 
  LayoutDashboard,
  Heart,
  User,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TreatmentPlanPage() {
  const { user } = useAuthStore()
  const screeningResult = getStoredScreeningResult() || getDemoScreeningResult()
  
  usePageTitle('Treatment Plan')

  return (
    <div className="fade-in space-y-8 pb-10">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            Hello, {user?.name || screeningResult.profile.name + "'s Parent"}
          </h1>
          <p className="mt-2 text-[var(--muted)]">Your personalized care roadmap and latest progress overview.</p>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          <div className="inline-block h-10 w-10 rounded-full bg-emerald-100 ring-2 ring-white flex items-center justify-center text-emerald-700 font-bold">
            P
          </div>
          <div className="inline-block h-10 w-10 rounded-full bg-blue-100 ring-2 ring-white flex items-center justify-center text-blue-700 font-bold">
            D
          </div>
          <div className="inline-block h-10 w-10 rounded-full bg-purple-100 ring-2 ring-white flex items-center justify-center text-purple-700 font-bold">
            T
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Evaluation Summary */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-[2.5rem] bg-white border border-[var(--border)] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-emerald-50 rounded-2xl p-4">
                <LayoutDashboard className="h-6 w-6 text-emerald-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-8">AI Evaluation Summary</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Risk Level Ring */}
              <div className="relative h-48 w-48 flex items-center justify-center">
                <svg className="h-full w-full rotate-[-90deg]">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 84}
                    strokeDashoffset={2 * Math.PI * 84 * (1 - screeningResult.riskLevel.probability / 100)}
                    strokeLinecap="round"
                    className="text-orange-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-[var(--ink)]">{screeningResult.riskLevel.probability}%</span>
                  <span className="text-xs uppercase tracking-widest text-[var(--muted)]">Probability</span>
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Risk Level</p>
                  <p className="text-xl font-bold text-orange-600">{screeningResult.riskLevel.label} Level Risk</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">Name</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{screeningResult.profile.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">Age</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{screeningResult.profile.age} Years</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">Current Status</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">High Level</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">Last Evaluation</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Breakdown Bars */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
              {screeningResult.domainBreakdown.slice(0, 5).map((domain) => (
                <div key={domain.domain} className="space-y-2">
                  <div className="h-24 bg-slate-50 rounded-2xl relative overflow-hidden flex items-end">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-sky-700/80 transition-all duration-1000" 
                      style={{ height: `${domain.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center font-bold text-[var(--muted)] truncate px-1">
                    {domain.domain}
                  </p>
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-sm text-[var(--muted)] leading-relaxed italic border-l-2 border-emerald-200 pl-4">
              "Social attention needs support. Joint attention needs support. Social communication needs support."
            </p>
          </section>

          {/* Goal Overview */}
          <section className="rounded-[2.5rem] bg-sky-700 p-8 text-white shadow-lg shadow-sky-900/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 fill-white/20" />
              Goal Overview
            </h2>
            <p className="text-sky-100 leading-relaxed text-sm">
              Don't forget the session appointment with your doctor and therapist. Focus on visual routines and naming games during the next 48 hours.
            </p>
          </section>
        </div>

        {/* Right Column: Actions and Sessions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section className="rounded-[2.5rem] bg-white border border-[var(--border)] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/parent/messages" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group">
                <span className="text-sm font-semibold group-hover:text-emerald-700">Message Therapist</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700" />
              </Link>
              <Link to="/parent/messages" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                <span className="text-sm font-semibold group-hover:text-blue-700">Message Doctor</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-700" />
              </Link>
              <Link to="/parent/reports" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-violet-50 transition-colors group">
                <span className="text-sm font-semibold group-hover:text-violet-700">View Reports</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-violet-700" />
              </Link>
            </div>
          </section>

          {/* Sessions Overview Card */}
          <section className="rounded-[2.5rem] bg-orange-50 border border-orange-100 p-8 text-center space-y-6 flex flex-col items-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-orange-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                <div className="bg-emerald-500 h-4 w-4 rounded-full border-2 border-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-orange-900">Sessions</h2>
              <p className="text-sm text-orange-800/70 mt-2">
                We help your child to improve. Check your next scheduled call.
              </p>
            </div>

            <Link 
              to="/parent/sessions" 
              className="mt-4 flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
          
          {/* Helper Card */}
          <section className="rounded-[2.5rem] bg-slate-900 p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-bold">Need Help?</h3>
              <p className="text-xs text-white/60 mt-2 mb-6 capitalize">
                Contact your care coordinator if you have any questions about the plan.
              </p>
              <button className="text-xs font-bold py-2 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
