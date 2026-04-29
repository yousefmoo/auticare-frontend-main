import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Users,
  ClipboardList,
  LayoutDashboard,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuthStore, useUIStore } from '../../store'
import usePageTitle from '../../utils/usePageTitle'
import { getChildren, createChild } from '../../api/children.api'
import { startScreening, getScreeningQuestions, submitScreening } from '../../api/screening.api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function ParentQuestionnairePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  usePageTitle('Initial Screening')
  
  const { addToast } = useUIStore()
  
  const [step, setStep] = useState(-1) // -1: Loading/Select Child, 0: Child Info, 1+: Questions
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'boy',
    medicalHistory: '',
    jaundice: '',
    familyHistory: '',
    consent: false,
    picture: null,
  })
  
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')

  const toFiniteNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    if (value === null || value === undefined) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  const getQuestionIdRaw = (question) => question?.id ?? question?.questionId ?? question?.question_id

  const getQuestionIdNumber = (question) => {
    const raw = getQuestionIdRaw(question)
    return toFiniteNumber(raw)
  }

  const getBackendErrorMessage = (err) => {
    const data = err?.response?.data
    if (!data) return null
    if (typeof data === 'string') return data
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.detail === 'string') return data.detail
    if (typeof data?.error === 'string') return data.error
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const first = data.errors[0]
      if (typeof first === 'string') return first
      if (typeof first?.message === 'string') return first.message
      if (typeof first?.defaultMessage === 'string') return first.defaultMessage
      if (typeof first?.cause?.defaultMessage === 'string') return first.cause.defaultMessage
    }
    if (data?.errors && typeof data.errors === 'object') {
      const values = Object.values(data.errors).flat?.() ?? Object.values(data.errors)
      const first = values?.[0]
      if (typeof first === 'string') return first
      if (Array.isArray(first) && typeof first[0] === 'string') return first[0]
    }
    return null
  }

  const getAnswerValueForQuestion = (question, selectedOption) => {
    if (selectedOption === null || selectedOption === undefined) return null

    if (Array.isArray(question?.riskAnswers)) {
      return question.riskAnswers.includes(selectedOption) ? 1 : 0
    }

    const directNumber = toFiniteNumber(selectedOption)
    if (directNumber !== null) return directNumber

    const normalized = String(selectedOption).trim().toLowerCase()
    if (normalized === 'yes' || normalized === 'y' || normalized === 'true') return 1
    if (normalized === 'no' || normalized === 'n' || normalized === 'false') return 0

    const options = Array.isArray(question?.options) ? question.options : []
    const index = options.findIndex((opt) => opt === selectedOption)
    if (index >= 0) return index

    const indexInsensitive = options.findIndex(
      (opt) => String(opt).trim().toLowerCase() === normalized
    )
    if (indexInsensitive >= 0) return indexInsensitive

    return null
  }

  useEffect(() => {
    const init = async () => {
      try {
        const childrenData = await getChildren()
        setChildren(childrenData)
        if (childrenData.length > 0) {
          setStep(-1) // Show selection
        } else {
          setStep(0) // No children, show form
        }
      } catch (err) {
        console.error('Failed to fetch children:', err)
        setStep(0)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const data = await getScreeningQuestions()
      setQuestions(data)
      setStep(1)
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to load questions.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartScreening = async () => {
    let childId = selectedChildId
    
    if (step === 0) {
      // Create new child
      try {
        setIsSubmitting(true)
        const newChild = await createChild({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          medicalHistory: formData.medicalHistory,
          jaundice: formData.jaundice === 'yes',
          familyHistory: formData.familyHistory === 'yes'
        })
        childId = newChild.id
        setSelectedChildId(childId)
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Failed to save child profile.' })
        setIsSubmitting(false)
        return
      }
    }

    try {
      setIsSubmitting(true)
      await startScreening({ childId })
      await fetchQuestions()
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to start screening.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAnswers = async () => {
    try {
      setIsSubmitting(true)

      const childId = toFiniteNumber(selectedChildId)
      if (childId === null || !Number.isInteger(childId)) {
        addToast({ type: 'error', title: 'Missing child', message: 'Please select a child before submitting.' })
        return
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        addToast({ type: 'error', title: 'No questions', message: 'No screening questions were loaded. Please refresh and try again.' })
        return
      }

      const payloadAnswers = []
      for (const question of questions) {
        const questionId = getQuestionIdNumber(question)
        if (questionId === null || !Number.isInteger(questionId)) {
          addToast({ type: 'error', title: 'Invalid questions', message: 'Question IDs are missing/invalid. Please refresh and try again.' })
          return
        }

        const selectedOption = answers[String(questionId)]
        if (selectedOption === undefined) {
          addToast({ type: 'error', title: 'Incomplete answers', message: 'Please answer all screening questions before submitting.' })
          return
        }

        const answerValue = getAnswerValueForQuestion(question, selectedOption)
        if (answerValue === null || !Number.isFinite(answerValue) || !Number.isInteger(answerValue)) {
          addToast({ type: 'error', title: 'Invalid answer', message: 'One or more answers are invalid. Please review and try again.' })
          return
        }

        payloadAnswers.push({ questionId, answerValue })
      }

      const payload = { childId, answers: payloadAnswers }

      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.log('Submitting screening payload:', payload)
      }

      const response = await submitScreening(payload)
      setResult(response)
      setStep(questions.length + 1)
    } catch (err) {
      const backendMessage = getBackendErrorMessage(err)
      const fallback = err?.message || 'Please check your answers and try again.'

      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.error('Screening submission failed:', err)
        // eslint-disable-next-line no-console
        console.log('Backend response:', err?.response?.data)
      }

      addToast({
        type: 'error',
        title: 'Submission failed',
        message: backendMessage || fallback,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalQuestions = questions.length

  const handleNext = () => {
    setError('')
    
    const isFormValid = 
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.dateOfBirth !== '' &&
      formData.gender !== '' &&
      formData.medicalHistory.trim() !== '' &&
      formData.jaundice !== '' &&
      formData.familyHistory !== '' &&
      formData.consent;

    if (step === 0) {
      if (!isFormValid) {
        setError('Please fill all required fields and agree to the consent.')
        return
      }
    }
    
    // Validation for Questions (Step 1-10)
    if (step > 0 && step <= totalQuestions) {
      const currentQId = getQuestionIdNumber(questions[step - 1])
      if (currentQId === null) {
        setError('Failed to read the current question. Please refresh and try again.')
        return
      }

      if (answers[String(currentQId)] === undefined) {
        setError('Please select an answer before proceeding.')
        return
      }
    }
    
    // If finished
    if (step === totalQuestions) {
      handleSubmitAnswers()
      return
    }

    if (step === 0 || step === -1) {
      handleStartScreening()
      return
    }

    setStep(current => current + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(current => current - 1)
  }

  const handleAnswer = (option) => {
    const currentQId = getQuestionIdNumber(questions[step - 1])
    if (currentQId === null) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to read the current question. Please refresh and try again.' })
      return
    }

    setAnswers({ ...answers, [String(currentQId)]: option })
    setError('') // clear error once they select
  }

  const renderHeader = () => (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-12">
      <div className="flex justify-between items-center px-4 overflow-x-auto gap-4 no-scrollbar">
        <div className="flex flex-col items-center gap-2 group">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${step === 0 ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-800'}`}>
            <Users className={`h-8 w-8 ${step === 0 ? 'text-white' : 'text-slate-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest ${step === 0 ? 'text-orange-500' : 'text-slate-500'}`}>About child</span>
        </div>
        <div className="h-px bg-slate-800 flex-1 min-w-[20px]" />
        <div className="flex flex-col items-center gap-2">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${(step > 0 && step <= 5) ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-800'}`}>
            <User className={`h-8 w-8 ${(step > 0 && step <= 5) ? 'text-white' : 'text-slate-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest ${(step > 0 && step <= 5) ? 'text-orange-500' : 'text-slate-500'}`}>Behavior</span>
        </div>
        <div className="h-px bg-slate-800 flex-1 min-w-[20px]" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-full border-2 border-orange-500 flex items-center justify-center -mt-2 bg-white shadow-xl">
             <span className="text-xl font-bold text-orange-600 tracking-tight">AutiCare</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Screening</span>
        </div>
        <div className="h-px bg-slate-800 flex-1 min-w-[20px]" />
        <div className="flex flex-col items-center gap-2">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${(step > 5 && step <= 10) ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-800'}`}>
            <ClipboardList className={`h-8 w-8 ${(step > 5 && step <= 10) ? 'text-white' : 'text-slate-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest ${(step > 5 && step <= 10) ? 'text-orange-500' : 'text-slate-500'}`}>Details</span>
        </div>
        <div className="h-px bg-slate-800 flex-1 min-w-[20px]" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
            <LayoutDashboard className="h-8 w-8 text-slate-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Results</span>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#1e293b] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (step === -1) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#1e293b] text-white">
        {renderHeader()}
        <div className="max-w-2xl mx-auto px-6 pb-20 fade-in">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Select a child for screening</h2>
            <p className="text-slate-400 mt-2">Choose one of your registered children to start their screening.</p>
          </div>

          <div className="grid gap-4">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${selectedChildId === child.id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}`}
              >
                <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{child.firstName} {child.lastName}</p>
                  <p className="text-sm text-slate-400">DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep(0)}
              className="mt-4 flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-orange-400 hover:text-orange-400 transition-all"
            >
              <Users className="h-6 w-6" />
              <span className="font-bold text-lg">Add New Child</span>
            </button>

            {selectedChildId && (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="mt-8 w-full py-5 rounded-xl bg-orange-500 text-white font-bold text-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                {isSubmitting ? 'Starting...' : 'Continue to Screening'}
                {!isSubmitting && <ChevronRight className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (step === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#1e293b] text-white overflow-x-hidden">
        {renderHeader()}
        
        <div className="relative mx-auto max-w-2xl px-6 pb-20 fade-in">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white tracking-tight">Please fill in your child details</h2>
             <p className="text-slate-400 mt-2">This helps us personalize your screening journey.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, gender: 'boy'})}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === 'boy' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}`}
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${formData.gender === 'boy' ? 'bg-orange-500' : 'bg-slate-700'}`}>
                  <User className="h-7 w-7 text-white" />
                </div>
                <span className="font-bold text-lg">Boy</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, gender: 'girl'})}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === 'girl' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}`}
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${formData.gender === 'girl' ? 'bg-orange-500' : 'bg-slate-700'}`}>
                  <User className="h-7 w-7 text-white" />
                </div>
                <span className="font-bold text-lg">Girl</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="relative">
                  <input 
                    required
                    className="w-full bg-slate-800 border-b-2 border-slate-700 px-5 py-4 rounded-t-xl outline-none focus:border-orange-500 transition-colors text-white placeholder:text-slate-500"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
               </div>
               <div className="relative">
                  <input 
                    required
                    className="w-full bg-slate-800 border-b-2 border-slate-700 px-5 py-4 rounded-t-xl outline-none focus:border-orange-500 transition-colors text-white placeholder:text-slate-500"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-3 bg-slate-800/30 p-5 rounded-2xl border border-slate-700">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
              <input 
                required
                type="date"
                className="w-full bg-slate-800 border-b-2 border-slate-700 px-5 py-4 rounded-t-xl outline-none focus:border-orange-500 transition-colors text-white"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>

            <div className="space-y-3 bg-slate-800/30 p-5 rounded-2xl border border-slate-700">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical History</label>
              <textarea 
                required
                className="w-full bg-slate-800 border-b-2 border-slate-700 px-5 py-4 rounded-t-xl outline-none focus:border-orange-500 transition-colors text-white placeholder:text-slate-500 min-h-[100px]"
                placeholder="Medical history details..."
                value={formData.medicalHistory}
                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-800/30 rounded-2xl border border-slate-700">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Have your child ever had jaundice before?</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFormData({...formData, jaundice: 'yes'})}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.jaundice === 'yes' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, jaundice: 'no'})}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.jaundice === 'no' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div className="p-5 bg-slate-800/30 rounded-2xl border border-slate-700">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Is there a family history of autism?</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFormData({...formData, familyHistory: 'yes'})}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.familyHistory === 'yes' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, familyHistory: 'no'})}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.familyHistory === 'no' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-800/30 rounded-2xl border border-slate-700">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Child Photo (Optional)</label>
              <input 
                type="file"
                className="w-full text-slate-400 text-sm"
                onChange={(e) => setFormData({...formData, picture: e.target.files[0]})}
              />
            </div>

            <div className="p-5 bg-slate-800/30 rounded-2xl border border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                  className="mt-1 h-5 w-5 rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800"
                />
                <span className="text-slate-300 text-sm">I confirm that I agree to start the test using my child&apos;s data.</span>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting || !(
                formData.firstName.trim() !== '' &&
                formData.lastName.trim() !== '' &&
                formData.dateOfBirth !== '' &&
                formData.gender !== '' &&
                formData.medicalHistory.trim() !== '' &&
                formData.jaundice !== '' &&
                formData.familyHistory !== '' &&
                formData.consent
              )}
              className="w-full py-5 rounded-xl bg-orange-500 text-white font-bold text-xl shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] hover:bg-orange-600 hover:shadow-[0_10px_30px_-5px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : null}
              {isSubmitting ? 'Creating Profile...' : 'Start Screening'}
              {!isSubmitting && <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
              {!isSubmitting && <ChevronRight className="h-6 w-6 -ml-4 group-hover:translate-x-1 transition-transform delay-75" />}
            </button>
          </div>
        </div>
      </div>
    )
  }


  if (step > totalQuestions && result) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#1e293b] text-white flex flex-col">
        {renderHeader()}
        <div className="max-w-3xl mx-auto px-6 pb-20 w-full fade-in">
          <div className="bg-white rounded-[2rem] p-10 text-slate-800 shadow-2xl border border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 ${result.predictionClass === 'Normal' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                {result.predictionClass === 'Normal' ? (
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-orange-600" />
                )}
              </div>
              <h2 className="text-4xl font-bold mb-2">Screening Result</h2>
              <p className="text-slate-500 mb-8">Detailed analysis based on your child&apos;s behavior profile.</p>

              <div className="grid grid-cols-2 gap-6 w-full mb-10">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Prediction</p>
                  <p className={`text-2xl font-bold ${result.predictionClass === 'Normal' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {result.predictionClass}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {(result.confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="w-full p-6 bg-slate-900 rounded-3xl text-left text-white mb-10">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-orange-400" />
                  What does this mean?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.predictionClass === 'Normal' 
                    ? "Based on the screening, your child is currently showing a typical development pattern for their age group. Continue regular follow-ups to ensure consistency."
                    : "The screening indicates some patterns that may require professional clinical review. We recommend scheduling a detailed session with a specialist for further evaluation."
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => navigate('/parent/home')}
                  className="flex-1 py-4 px-6 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-all"
                >
                  Return Home
                </button>
                <button
                  onClick={() => navigate('/parent/sessions')}
                  className="flex-1 py-4 px-6 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                >
                  Book Specialist Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[step - 1]
  const progress = (step / totalQuestions) * 100
  const currentQId = getQuestionIdNumber(currentQ)
  const isAnswered = currentQId !== null && answers[String(currentQId)] !== undefined

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#1e293b] text-white overflow-x-hidden flex flex-col">
      {renderHeader()}

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pb-20 w-full flex-1 flex flex-col">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 flex-1 flex flex-col slide-up">
           <div className="p-6 sm:p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Question {step} of {totalQuestions}</span>
                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{Math.round(progress)}% complete</span>
              </div>
              
              <div className="h-3 bg-slate-100 rounded-full mb-10 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-10 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                  Q: {currentQ?.text}
                </h3>

                <div className="space-y-4">
                  {currentQ?.options?.map((option, index) => {
                    const isSelected = currentQId !== null && answers[String(currentQId)] === option;
                    
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`w-full text-left p-6 border-2 rounded-2xl font-bold text-lg sm:text-xl transition-all group relative overflow-hidden flex items-center justify-between
                          ${isSelected 
                            ? 'border-orange-500 bg-orange-50/50 shadow-md transform scale-[1.01]' 
                            : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
                          }
                        `}
                        onClick={() => handleAnswer(option)}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <span className={`transition-colors uppercase tracking-widest w-8
                            ${isSelected ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-400'}
                          `}>
                            {String.fromCharCode(65 + index)}:
                          </span>
                          <span className={isSelected ? 'text-orange-700' : 'text-slate-700'}>{option}</span>
                        </div>
                        {isSelected && (
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center fade-in">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <div className="mt-8 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 fade-in">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-10 mt-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-4 rounded-xl bg-slate-100 text-slate-600 font-bold text-lg hover:bg-slate-200 transition-all"
                >
                  {"<< Back"}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting || !isAnswered}
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2
                    ${isAnswered && !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 hover:-translate-y-0.5' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                  {step === totalQuestions ? (isSubmitting ? 'Submitting...' : 'Submit Result') : 'Next >>'}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
