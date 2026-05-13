import { BarChart3, ClipboardList, RotateCcw, UserRound, Plus, ArrowRight } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import usePageTitle from '@/utils/usePageTitle'
import { getParentDashboard } from '@/api/dashboard.api'
import { getUpcomingBookings } from '@/api/sessions.api'
import { getChildren, createChild } from '@/api/children.api'
import { getNotes } from '@/api/notes.api'


import SessionHighlight from '@/features/sessions/components/SessionHighlight'
import { DashboardEmpty, DashboardSkeleton } from '@/components/shared/DashboardState'

export default function ParentHomeDashboard() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [newChild, setNewChild] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    medicalHistory: '',
    consent: false,
    picture: null,
  })



  const handleAddChild = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        firstName: newChild.firstName,
        lastName: newChild.lastName,
        dateOfBirth: new Date(newChild.dateOfBirth).toISOString(),
        gender: newChild.gender,
        medicalHistory: newChild.medicalHistory
      }
      await createChild(payload)
      queryClient.invalidateQueries(['children'])
      setIsAddingChild(false)
      setNewChild({ 
        firstName: '', 
        lastName: '', 
        dateOfBirth: '', 
        gender: 'Male', 
        medicalHistory: '',
        consent: false,
        picture: null
      })
    } catch (err) {
      console.error('Failed to add child:', err)
    }
  }
  
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', 'parent'],
    queryFn: getParentDashboard,
  })

  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['children'],
    queryFn: getChildren,
  })

  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'parent', 'upcoming'],
    queryFn: getUpcomingBookings,
  })

  const { data: notes = [] } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  })

  const selectedChild = children[0] || null;

  const nextSession = upcomingSessions[0]

  usePageTitle('Parent Home')

  return (
    <div className="fade-in space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 p-6 text-white shadow-2xl shadow-orange-500/20 sm:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-orange-100">Parent Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back, {user?.name || 'Parent'}</h1>
            <p className="mt-3 max-w-2xl text-sm text-orange-50 sm:text-base">
              See your next session, the latest report highlights, and the most important care notes without digging through the app.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-orange-100">Dashboard Stats</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl font-bold">{dashboardData?.totalChildren || 0}</p>
                <p className="text-xs text-orange-100">Children</p>
              </div>
              <div>
                <p className="text-xl font-bold">{dashboardData?.upcomingBookings || 0}</p>
                <p className="text-xs text-orange-100">Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {nextSession && (
        <SessionHighlight 
          title={nextSession.homeRoleLabel?.parent || 'Next Session'} 
          session={nextSession} 
        />
      )}

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--ink)]">Child overview</h2>
                <p className="text-sm text-[var(--muted)]">A cleaner snapshot of the care picture right now.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingChild(!isAddingChild)}
              className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {isAddingChild && (
            <form onSubmit={handleAddChild} className="mt-5 space-y-4 bg-[var(--card-alt)] p-6 rounded-3xl border border-emerald-100 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  placeholder="First Name" 
                  className="input-field text-sm" 
                  value={newChild.firstName}
                  onChange={e => setNewChild({...newChild, firstName: e.target.value})}
                  required
                />
                <input 
                  placeholder="Last Name" 
                  className="input-field text-sm" 
                  value={newChild.lastName}
                  onChange={e => setNewChild({...newChild, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="date" 
                  className="input-field text-sm" 
                  value={newChild.dateOfBirth}
                  onChange={e => setNewChild({...newChild, dateOfBirth: e.target.value})}
                  required
                />
                <select 
                  className="input-field text-sm"
                  value={newChild.gender}
                  onChange={e => setNewChild({...newChild, gender: e.target.value})}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <textarea 
                placeholder="Medical History" 
                className="input-field text-sm min-h-[80px] py-2" 
                value={newChild.medicalHistory}
                onChange={e => setNewChild({...newChild, medicalHistory: e.target.value})}
                required
              />


              <div className="flex items-center justify-between p-3 bg-[var(--card)] rounded-2xl border border-emerald-50">
                <span className="text-xs text-[var(--muted)]">Child Photo (Optional)</span>
                <input type="file" className="text-[10px]" onChange={e => setNewChild({...newChild, picture: e.target.files[0]})} />
              </div>

              <label className="flex items-start gap-2 text-xs text-[var(--muted)] cursor-pointer p-1">
                <input 
                  type="checkbox" 
                  checked={newChild.consent} 
                  onChange={e => setNewChild({...newChild, consent: e.target.checked})} 
                  className="mt-0.5"
                />
                I confirm that I agree to start the screening using my child&apos;s data.
              </label>

              <button 
                type="submit" 
                disabled={!(
                  newChild.firstName.trim() && 
                  newChild.lastName.trim() && 
                  newChild.dateOfBirth && 
                  newChild.medicalHistory.trim() && 
                  newChild.consent
                )}
                className="w-full btn-primary py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register Child
              </button>
            </form>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Child</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                {selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : 'No child registered'}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Age</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                {selectedChild?.ageInYears ? `${selectedChild.ageInYears} years` : 'N/A'}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Gender</p>
              <p className="mt-2 text-lg font-semibold capitalize text-[var(--ink)]">
                {selectedChild?.gender || 'Not specified'}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Screenings</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">{dashboardData?.completedTests || 0} Completed</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/parent/questionnaire')}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-lg transition-all hover:bg-orange-600 hover:-translate-y-1"
          >
            Start New Screening
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Re-test reminder</h2>
              <p className="text-sm text-[var(--muted)]">Keep the screening insight fresh as things change at home.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.75rem] bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-950/40 dark:to-orange-950/30">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Suggested next re-test</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ink)]">In 2 weeks</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Re-test after major behavior changes, new therapist recommendations, or a new care review.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Upcoming Sessions</h2>
              <p className="text-sm text-[var(--muted)]">Your next meetings with join links and notes.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {sessionsLoading && <DashboardSkeleton cards={2} className="md:grid-cols-1 xl:grid-cols-1" />}
            {!sessionsLoading && upcomingSessions.length === 0 && (
              <DashboardEmpty title="No upcoming sessions" description="Your upcoming family sessions will appear here when available." />

            )}
            {!sessionsLoading && upcomingSessions.map((session) => (
              <div key={session.id} className="rounded-[1.5rem] border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--ink)]">{session.sessionType}</p>
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sky-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    انضمام
                  </a>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {session.dateLabel} - {session.timeLabel}
                </p>
                <p className="mt-2 text-sm text-[var(--ink)]">{session.notesSummary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--ink)]">Notes</h2>
              <p className="text-sm text-[var(--muted)]">Recent therapist notes and home follow-up.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {notes.slice(0, 3).map((note) => (
              <div key={note.id || note.noteId} className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
                <p className="font-semibold text-[var(--ink)]">{note.title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{note.content}</p>
                <p className="mt-2 text-xs text-[var(--muted-2)]">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-4">No notes available yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--ink)]">Report Summary</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Progress</p>
              <p className="mt-2 text-2xl font-bold text-[var(--ink)]">78%</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Communication and routines are moving in the right direction.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-alt)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Last Screening</p>
              <p className="mt-2 text-2xl font-bold text-[var(--ink)]">View Results</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Use the reports page to download the latest summary PDF.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

