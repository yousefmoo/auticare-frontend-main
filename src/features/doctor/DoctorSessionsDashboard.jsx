import { useState, useEffect } from 'react'
import { PlusCircle, X, Calendar, Clock, FileText, User, Heart, Pencil } from 'lucide-react'
import usePageTitle from '@/utils/usePageTitle'
import { PageHeader } from '@/components/shared/PageFrame'
import { createSession, updateSession, getSessionsByTreatment, getMyBookings } from '@/api/sessions.api'
import { getMyTreatmentPlans } from '@/api/plans.api'
import { useUIStore } from '@/store'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function DoctorSessionsDashboard() {
  const [sessions, setSessions] = useState([])
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useUIStore()

  const [formData, setFormData] = useState({
    treatmentId: '',
    sessionDate: '',
    sessionTime: '',
    sessionNotes: '',
    activityNotes: '',
    report: '',
  })

  usePageTitle('Doctor Sessions')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [sessionsData, plansData] = await Promise.all([
        getMyBookings(), // Using bookings as sessions for now
        getMyTreatmentPlans()
      ])
      setSessions(sessionsData)
      setPlans(plansData)
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to fetch sessions.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (session = null) => {
    if (session) {
      setEditingSession(session)
      setFormData({
        treatmentId: session.treatmentId || '',
        sessionDate: session.sessionDate ? new Date(session.sessionDate).toISOString().split('T')[0] : '',
        sessionTime: session.sessionTime || '',
        sessionNotes: session.sessionNotes || '',
        activityNotes: session.activityNotes || '',
        report: session.report || '',
      })
    } else {
      setEditingSession(null)
      setFormData({
        treatmentId: '',
        sessionDate: '',
        sessionTime: '',
        sessionNotes: '',
        activityNotes: '',
        report: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        sessionDate: new Date(formData.sessionDate).toISOString()
      }
      
      if (editingSession) {
        await updateSession(editingSession.id, payload)
        addToast({ type: 'success', title: 'Success', message: 'Session updated successfully.' })
      } else {
        await createSession(payload)
        addToast({ type: 'success', title: 'Success', message: 'Session scheduled successfully.' })
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save session.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fade-in space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Session Management"
          subtitle="Schedule and review therapeutic sessions with your patients."
        />
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Schedule Session
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-5">
          {sessions.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic">No scheduled sessions found.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="card rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800">{session.childName || 'Child Session'}</h3>
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                          session.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {session.status || 'Scheduled'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(session.sessionDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.sessionTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleOpenModal(session)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Details
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10">
                      Join Call
                    </button>
                  </div>
                </div>

                {session.sessionNotes && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Session Notes
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed italic">{session.sessionNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">{editingSession ? 'Edit' : 'Schedule'} Session</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Treatment Plan</label>
                  <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.treatmentId}
                    onChange={(e) => setFormData({...formData, treatmentId: e.target.value})}
                  >
                    <option value="">Select a plan...</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.childName} - {plan.goal.substring(0, 30)}...</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Session Time</label>
                  <input
                    required
                    type="time"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.sessionTime}
                    onChange={(e) => setFormData({...formData, sessionTime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Session Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.sessionDate}
                    onChange={(e) => setFormData({...formData, sessionDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Activity Notes</label>
                <input
                  type="text"
                  placeholder="What will you focus on in this session?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={formData.activityNotes}
                  onChange={(e) => setFormData({...formData, activityNotes: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Session Notes</label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={formData.sessionNotes}
                  onChange={(e) => setFormData({...formData, sessionNotes: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                  {isSubmitting ? 'Saving...' : (editingSession ? 'Update Session' : 'Schedule Session')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

