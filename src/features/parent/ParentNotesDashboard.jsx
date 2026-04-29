import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FilePenLine, Plus } from 'lucide-react'
import usePageTitle from '@/utils/usePageTitle'
import { PageHeader } from '@/components/shared/PageFrame'
import { addHomeNote, getHomeNotes, getSessionNotes } from '@/api/sessions.api'
import { DashboardEmpty, DashboardSkeleton } from '@/components/shared/DashboardState'

export default function ParentNotesDashboard() {
  const [draftCount, setDraftCount] = useState(0)
  const queryClient = useQueryClient()
  const { data: sessionNotes = [], isLoading } = useQuery({
    queryKey: ['session-notes'],
    queryFn: getSessionNotes,
  })
  const { data: homeNotes = [], isLoading: homeNotesLoading } = useQuery({
    queryKey: ['home-notes'],
    queryFn: getHomeNotes,
  })
  const addNoteMutation = useMutation({
    mutationFn: addHomeNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['home-notes'] }),
  })

  usePageTitle('Parent Notes')

  const handleAddNote = async () => {
    const next = draftCount + 1
    setDraftCount(next)
    await addNoteMutation.mutateAsync({
      title: `ملاحظة منزلية ${next}`,
      note: 'تمت إضافة ملاحظة منزلية تجريبية وجاهزة للربط مع الـ backend لاحقا.',
      date: 'اليوم',
    })
  }

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Notes"
        subtitle="تابع ملاحظات الجلسات مع الملاحظات المنزلية في صفحة واحدة واضحة."
        action={
          <button
            type="button"
            onClick={handleAddNote}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            <Plus className="h-4 w-4" />
            {addNoteMutation.isPending ? 'جاري الإضافة...' : 'إضافة ملاحظة'}
          </button>
        }
      />

      {(isLoading || homeNotesLoading) && <DashboardSkeleton cards={3} />}

      {!isLoading && sessionNotes.length === 0 && (
        <DashboardEmpty title="لا توجد ملاحظات جلسات" description="ستظهر هنا ملاحظات الجلسات فور توفرها." />
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {sessionNotes.map((note) => (
          <section key={note.id} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <FilePenLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--ink)]">{note.child}</h2>
                <p className="text-sm text-[var(--muted)]">{note.sessionType} - {note.date}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Summary</p>
                <p className="mt-2 text-[var(--ink)]">{note.summary}</p>
              </div>
              <div className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">Next step</p>
                <p className="mt-2 text-[var(--ink)]">{note.nextStep}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--ink)]">الملاحظات المنزلية</h2>
        {homeNotes.length === 0 ? (
          <div className="mt-4">
            <DashboardEmpty title="لا توجد ملاحظات منزلية" description="أضيفي أول ملاحظة منزلية لتظهر هنا." />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {homeNotes.map((entry) => (
              <div key={entry.id} className="rounded-2xl bg-[var(--card-alt)] p-4">
                <p className="text-sm font-semibold text-[var(--ink)]">{entry.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted-2)]">{entry.date}</p>
                <p className="mt-3 text-sm text-[var(--muted)]">{entry.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
