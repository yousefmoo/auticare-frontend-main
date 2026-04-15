import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  generateScreeningInsights,
  saveScreeningResult,
  screeningQuestions as localQuestions,
} from '../screening/screeningInsights'
import { getQuestions, submitAssessment } from '../../api/assessment.api'

const introHighlights = [
  {
    title: '10 quick questions',
    description: 'Takes about 3-5 minutes',
    icon: ClipboardList,
  },
  {
    title: 'Secure & private',
    description: 'Your data stays protected',
    icon: ShieldCheck,
  },
  {
    title: 'Personalized insights',
    description: 'Tailored guidance after completion',
    icon: Sparkles,
  },
]

export default function QuestionnaireExperience() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    helper: '',
    agreed: false,
  })
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState(localQuestions)
  const [questionLoadError, setQuestionLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions(1)
        if (isMounted && fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions)
        }
      } catch (error) {
        if (isMounted) {
          setQuestionLoadError('Could not load questions from server. Using local questions.')
        }
      }
    }

    loadQuestions()
    return () => {
      isMounted = false
    }
  }, [])

  const totalQuestions = questions.length
  const isCompleted = step > totalQuestions

  const screeningResult = useMemo(() => {
    if (!isCompleted) return null
    return generateScreeningInsights(formData, answers)
  }, [answers, formData, isCompleted])

  const handleNext = () => {
    if (step === 0 && !formData.agreed) return
    if (step >= totalQuestions) return
    setStep((currentStep) => currentStep + 1)
  }

  const handleBack = () => setStep((currentStep) => currentStep - 1)

  const handleAnswer = async (option) => {
    const nextAnswers = { ...answers, [questions[step - 1].id]: option }
    setAnswers(nextAnswers)

    if (step === questions.length) {
      const insights = generateScreeningInsights(formData, nextAnswers)
      saveScreeningResult(insights)
      setSubmitError('')

      try {
        await submitAssessment({
          childInfo: formData,
          answers: nextAnswers,
          score: insights.score,
          riskLevel: insights.riskLevel.label,
        })
      } catch (error) {
        setSubmitError('Could not save your answers to the server. Results were saved locally.')
      }

      setStep(questions.length + 1)
      return
    }

    setStep((currentStep) => currentStep + 1)
  }

  if (step === 0) {
    return (
      <div className="min-h-screen bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute inset-0 hero-surface" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full hero-glow-1 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full hero-glow-2 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--card)] px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Autism screening
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-[var(--ink)] leading-tight">
                Get started with the early signs questionnaire
              </h1>
              <p className="text-lg text-[var(--muted)]">
                Share your child&apos;s details to personalize the screening. This is not a diagnosis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {introHighlights.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--muted-2)]">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Child profile</p>
                  <h2 className="text-2xl font-display font-bold text-[var(--ink)] mt-1">
                    Tell us about your child
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {totalQuestions} questions
                </div>
              </div>

              <p className="text-sm text-[var(--muted)] mt-2">
                We only use this to personalize your screening summary.
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  handleNext()
                }}
              >
                {questionLoadError && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    {questionLoadError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="child-name" className="text-sm font-medium text-[var(--muted)]">Child full name</label>
                    <input
                      id="child-name"
                      className="input-field mt-2"
                      placeholder="e.g. Lina Ahmed"
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="child-age" className="text-sm font-medium text-[var(--muted)]">Age</label>
                    <input
                      id="child-age"
                      type="number"
                      min="0"
                      max="18"
                      inputMode="numeric"
                      className="input-field mt-2"
                      placeholder="e.g. 4"
                      value={formData.age}
                      onChange={(event) => setFormData({ ...formData, age: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="child-gender" className="text-sm font-medium text-[var(--muted)]">Gender</label>
                    <select
                      id="child-gender"
                      className="input-field mt-2"
                      value={formData.gender}
                      onChange={(event) => setFormData({ ...formData, gender: event.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="caregiver-role" className="text-sm font-medium text-[var(--muted)]">Caregiver role</label>
                    <select
                      id="caregiver-role"
                      className="input-field mt-2"
                      value={formData.helper}
                      onChange={(event) => setFormData({ ...formData, helper: event.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="therapist">Therapist</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="child-dob" className="text-sm font-medium text-[var(--muted)]">Date of birth (optional)</label>
                  <input
                    id="child-dob"
                    type="date"
                    className="input-field mt-2"
                    value={formData.dob}
                    onChange={(event) => setFormData({ ...formData, dob: event.target.value })}
                  />
                </div>

                <label
                  htmlFor="child-photo-upgraded"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-emerald-100 bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]"
                >
                  Upload photo (optional)
                  <span className="text-xs font-semibold text-emerald-700">Choose file</span>
                  <input id="child-photo-upgraded" type="file" className="hidden" />
                </label>

                <div className="rounded-2xl border border-emerald-100 bg-[var(--card)] p-4">
                  <label className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={formData.agreed}
                      onChange={(event) => setFormData({ ...formData, agreed: event.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-[var(--border)] text-emerald-600 focus:ring-emerald-500"
                    />
                    I agree to the use of my data for this screening.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!formData.agreed}
                  className="w-full bg-[var(--ink)] hover:opacity-90 text-[var(--surface)] font-semibold py-4 rounded-full flex justify-center items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
                >
                  Start Questionnaire
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-xs text-center text-[var(--muted-2)]">
                  This screening helps spot early signs and is not a diagnosis.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted && screeningResult) {
    const toneClasses = {
      red: 'bg-red-50 text-red-700 border-red-100',
      amber: 'bg-amber-50 text-amber-700 border-amber-100',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    }

    return (
      <div className="min-h-screen bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute inset-0 hero-surface" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Screening completed
                </span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
                    {screeningResult.profile.name}&apos;s screening summary
                  </h1>
                  <p className="mt-2 text-[var(--muted)]">
                    Your 10 answers were saved and will now appear inside the parent home overview.
                  </p>
                </div>
              </div>

              <div className={`rounded-3xl border px-5 py-4 ${toneClasses[screeningResult.riskLevel.tone]}`}>
                <p className="text-xs uppercase tracking-[0.25em]">Risk level</p>
                <p className="mt-2 text-3xl font-bold">{screeningResult.riskLevel.label}</p>
                <p className="mt-1 text-sm">
                  {screeningResult.score}/{screeningResult.totalQuestions} flagged answers
                </p>
                <p className="text-sm">{screeningResult.riskLevel.probability}% screening probability</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-alt)] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <AlertCircle className="h-4 w-4 text-emerald-600" />
                  Flagged areas
                </div>
                <div className="mt-5 space-y-4">
                  {screeningResult.domainBreakdown.map((item) => (
                    <div key={item.domain}>
                      <div className="flex items-center justify-between text-sm font-medium text-[var(--ink)]">
                        <span>{item.domain}</span>
                        <span>{item.flagged}/{item.total}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400"
                          style={{ width: `${Math.max(item.percent, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <h2 className="text-lg font-bold text-[var(--ink)]">Recommended next steps</h2>
                <div className="mt-4 space-y-3">
                  {screeningResult.recommendations.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-sm text-[var(--ink)]">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/parent/home')}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Open Parent Home
                  </button>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2.5 font-medium text-[var(--ink)] hover:bg-[var(--card-alt)] transition-colors"
                  >
                    Sign in first
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[step - 1]
  const progress = (step / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-[var(--surface)] relative overflow-hidden">
      <div className="absolute inset-0 hero-surface" />
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full hero-glow-1 blur-3xl" />
      <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full hero-glow-2 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
              <ClipboardList className="h-4 w-4 text-emerald-600" />
              Question {step} of {totalQuestions}
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              {Math.round(progress)}% complete
            </span>
          </div>

          <div className="mt-4 h-2 rounded-full bg-[var(--card-alt)]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-sm mt-8 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <HelpCircle className="h-4 w-4" />
              Choose the best answer
            </div>
            <h3 className="text-2xl font-display font-bold text-[var(--ink)] mt-4 text-center">
              {currentQ.text}
            </h3>
            {submitError && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {submitError}
              </p>
            )}

            <div className="space-y-4 mt-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className="w-full text-left p-5 border border-[var(--border)] rounded-2xl font-semibold text-base hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-4"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-[var(--ink)] flex-1">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 rounded-full border border-[var(--border)] text-[var(--muted)] font-semibold hover:border-[var(--border)] hover:text-[var(--ink)] transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              aria-disabled={!answers[currentQ.id]}
              className="px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--surface)] font-semibold hover:opacity-90 transition-colors ml-auto disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === totalQuestions ? 'Finish' : 'Next'}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--muted-2)]">
            <Clock className="h-3.5 w-3.5" />
            Estimated time remaining: {Math.max(totalQuestions - step, 1)} minutes
          </div>
        </div>
      </div>
    </div>
  )
}
