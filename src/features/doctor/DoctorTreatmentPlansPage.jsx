import { useState, useEffect } from 'react'
import { ClipboardList, PlusCircle, Pencil, Trash2, X, Calendar, User, Heart } from 'lucide-react'
import usePageTitle from '../../utils/usePageTitle'
import { getMyTreatmentPlans, createTreatmentPlan, updateTreatmentPlan } from '../../api/plans.api'
import { getChildren } from '../../api/children.api'
import { useUIStore } from '../../store'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function DoctorTreatmentPlansPage() {
  const [plans, setPlans] = useState([])
  const [children, setChildren] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useUIStore()

  const [formData, setFormData] = useState({
    childId: '',
    goal: '',
    notes: '',
    startDate: '',
    endDate: '',
  })

  usePageTitle('Treatment Plans')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [plansData, childrenData] = await Promise.all([
        getMyTreatmentPlans(),
        getChildren()
      ])
      setPlans(plansData)
      setChildren(childrenData)
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to fetch data.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        childId: plan.childId,
        goal: plan.goal,
        notes: plan.notes || '',
        startDate: plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : '',
        endDate: plan.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : '',
      })
    } else {
      setEditingPlan(null)
      setFormData({
        childId: '',
        goal: '',
        notes: '',
        startDate: '',
        endDate: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      if (editingPlan) {
        await updateTreatmentPlan(editingPlan.id, formData)
        addToast({ type: 'success', title: 'Success', message: 'Plan updated successfully.' })
      } else {
        await createTreatmentPlan(formData)
        addToast({ type: 'success', title: 'Success', message: 'Plan created successfully.' })
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Action failed. Please check your data.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fade-in space-y-6 pb-10">
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Treatment Plans</h1>
            <p className="mt-2 text-blue-100">Design and manage personalized therapeutic roadmaps for your patients.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg hover:bg-blue-50 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            New Plan
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <section className="card rounded-[2rem] shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="h-6 w-6 text-blue-700" />
            <h2 className="text-xl font-bold text-[var(--ink)]">Plan Board</h2>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic">No active treatment plans found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[var(--ink)]">{plan.childName || `Patient #${plan.childId}`}</h3>
                        <p className="text-sm text-[var(--muted)]">Last Updated: {new Date(plan.updatedAt || plan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(plan)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Core Goal</p>
                      <p className="text-[var(--ink)] font-medium leading-relaxed">{plan.goal}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Calendar className="h-4 w-4" />
                        <span>Starts: {new Date(plan.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Calendar className="h-4 w-4" />
                        <span>Ends: {new Date(plan.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">{editingPlan ? 'Edit' : 'Create'} Treatment Plan</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {!editingPlan && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Select Patient</label>
                  <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.childId}
                    onChange={(e) => setFormData({...formData, childId: e.target.value})}
                  >
                    <option value="">Select a child...</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.firstName} {child.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Primary Goal</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Improve verbal communication through daily naming games"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Start Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">End Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Additional Notes</label>
                <textarea
                  rows="4"
                  placeholder="Detailed notes for the parent and therapist..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                  {isSubmitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

