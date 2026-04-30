import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Users,
  ClipboardList,
  LayoutDashboard,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Baby,
  Activity,
  History,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  Info
} from 'lucide-react'
import { useAuthStore, useUIStore } from '@/store'
import usePageTitle from '@/utils/usePageTitle'
import { getChildren, createChild } from '@/api/children.api'
import { startScreening, getScreeningQuestions, submitScreening } from '@/api/screening.api'
import { predictASD, formatForAI } from '@/api/ai.api'
import { screeningQuestions as localQuestions, generateScreeningInsights } from '@/features/screening/screeningInsights'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

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
    gender: 'Male', // Backend expects "Male" or "Female"
    medicalHistory: '',
    jaundice: '',
    familyHistory: '',
    consent: false,
    picture: null,
  })
  
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')

  const getQuestionIdRaw = (question) => question?.id ?? question?.questionId ?? question?.question_id

  const getQuestionIdNumber = (question) => {
    const raw = getQuestionIdRaw(question)
    return (typeof raw === 'number') ? raw : parseInt(raw, 10)
  }

  const getBackendErrorMessage = (err) => {
    const data = err?.response?.data
    if (!data) return null
    
    // Priority 1: Specific validation errors from backend
    if (data.errors && typeof data.errors === 'object') {
      const errorValues = Object.values(data.errors).flat()
      if (errorValues.length > 0) return errorValues[0]
    }
    
    // Priority 2: Standard message fields
    if (typeof data === 'string') return data
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.detail === 'string') return data.detail
    if (typeof data?.error === 'string') return data.error
    return data?.title || data?.message || null
  }

  const getAnswerValueForQuestion = (question, selectedOption) => {
    if (selectedOption === null || selectedOption === undefined) return null

    // 1. If we have explicit risk answers, use them (returns 1 for risk, 0 for normal)
    if (Array.isArray(question?.riskAnswers)) {
      const isRisk = question.riskAnswers.some(risk => 
        String(risk).toLowerCase().trim() === String(selectedOption).toLowerCase().trim()
      )
      return isRisk ? 1 : 0
    }

    // 2. Try to get the index from options first
    const options = Array.isArray(question?.options) ? question.options : []
    const index = options.findIndex((opt) => String(opt).toLowerCase().trim() === String(selectedOption).toLowerCase().trim())
    if (index >= 0) return index

    // 3. Fallback to boolean-like numbers
    const normalizedSelected = String(selectedOption).trim().toLowerCase()
    if (normalizedSelected === 'yes' || normalizedSelected === 'y' || normalizedSelected === 'true') return 1
    if (normalizedSelected === 'no' || normalizedSelected === 'n' || normalizedSelected === 'false') return 0

    return 0
  }

  useEffect(() => {
    const init = async () => {
      // Safety timeout: stop loading after 6 seconds even if API hangs
      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 6000);

      try {
        const childrenData = await getChildren()
        setChildren(Array.isArray(childrenData) ? childrenData : [])
        if (Array.isArray(childrenData) && childrenData.length > 0) {
          setStep(-1) // Show selection
        } else {
          setStep(0) // No children, show form
        }
      } catch (err) {
        console.error('Failed to fetch children:', err)
        setStep(0)
      } finally {
        clearTimeout(safetyTimer);
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const fetchQuestions = async () => {
    // Safety timeout: stop loading after 8 seconds
    const safetyTimer = setTimeout(() => {
      if (questions.length === 0) setQuestions(localQuestions);
      setStep(1);
      setIsLoading(false);
    }, 8000);

    try {
      setIsLoading(true)
      let data
      try {
        data = await getScreeningQuestions()
      } catch (err) {
        console.warn('API getScreeningQuestions failed, falling back to local questions:', err)
        data = localQuestions
      }
      
      const finalData = (Array.isArray(data) && data.length > 0) ? data : localQuestions;
      setQuestions(finalData)
      setStep(1)
    } catch (err) {
      setQuestions(localQuestions);
      setStep(1);
      addToast({ type: 'warning', title: 'Network Issue', message: 'Loaded offline questions.' })
    } finally {
      clearTimeout(safetyTimer);
      setIsLoading(false)
    }
  }

  const handleStartScreening = async () => {
    if (isSubmitting) return
    
    let childId = selectedChildId
    
    if (step === 0) {
      // Create new child
      try {
        setIsSubmitting(true)
        
        // Calculate age from dateOfBirth
        const birthDate = new Date(formData.dateOfBirth)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          age: Number(age),
          gender: formData.gender, // Already normalized to "Male" or "Female"
          medicalHistory: formData.medicalHistory,
          jaundice: formData.jaundice === 'yes',
          familyHistory: formData.familyHistory === 'yes'
        }

        console.log('Creating child with payload:', payload)
        const newChild = await createChild(payload)
        childId = newChild.id || newChild.child_id
        setSelectedChildId(childId)
      } catch (err) {
        const errorMessage = getBackendErrorMessage(err) || 'Failed to save child profile.'
        addToast({ 
          type: 'error', 
          title: 'Registration Failed', 
          message: errorMessage
        })
        setIsSubmitting(false)
        return // CRITICAL: Stop execution if creation fails
      }
    }

    try {
      setIsSubmitting(true)
      const numericChildId = Number(childId)
      
      // Backend expects: { request: { childId: number } }
      const startPayload = { 
        request: { 
          childId: numericChildId 
        } 
      }
      
      console.log('Starting screening with payload:', startPayload)
      try {
        await startScreening(startPayload)
      } catch (e) {
        console.warn('startScreening API failed, checking if we can proceed:', e)
        // If it's a 400 with "request field is required", we failed the contract. 
        // If it's other error, maybe we can proceed to questions.
      }
      
      await fetchQuestions()
    } catch (err) {
      addToast({ 
        type: 'error', 
        title: 'Error', 
        message: getBackendErrorMessage(err) || 'Failed to load screening questions.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAnswers = async () => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)

      const childId = selectedChildId
      if (!childId) {
        addToast({ type: 'error', title: 'Missing child', message: 'Please select a child before submitting.' })
        setIsSubmitting(false)
        return
      }

      const payloadAnswers = []
      for (const question of questions) {
        const questionId = getQuestionIdNumber(question)
        const selectedOption = answers[String(questionId)]
        
        if (selectedOption === undefined) {
          addToast({ type: 'error', title: 'Incomplete answers', message: 'Please answer all screening questions.' })
          setIsSubmitting(false)
          return
        }

        const answerValue = getAnswerValueForQuestion(question, selectedOption)
        payloadAnswers.push({ 
          questionId, 
          question_id: questionId,
          answerValue,
          answer_value: answerValue
        })
      }

      const payload = { 
        request: {
          childId: Number(selectedChildId),
          answers: payloadAnswers 
        }
      }

      console.log('Submitting answers with payload:', payload)

      let response;
      try {
        response = await submitScreening(payload)
      } catch (backendErr) {
        console.warn('Backend submitScreening failed, falling back to local AI prediction:', backendErr)
        
        // Local fallback logic
        const insights = generateScreeningInsights({ 
          name: formData.firstName || 'Child', 
          dob: formData.dateOfBirth,
          gender: formData.gender 
        }, answers)
        
        try {
          const aiPayload = formatForAI(formData, answers, questions)
          const aiResult = await predictASD(aiPayload)
          response = {
            predictionClass: aiResult.label || insights.riskLevel.label,
            confidenceScore: aiResult.probability ? aiResult.probability / 100 : insights.riskLevel.probability / 100,
            insights: insights
          }
        } catch (aiErr) {
          console.warn('AI prediction also failed, using basic ruleset:', aiErr)
          response = {
            predictionClass: insights.riskLevel.label,
            confidenceScore: insights.riskLevel.probability / 100,
            insights: insights
          }
        }
      }

      setResult(response)
      setStep(questions.length + 1)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission failed',
        message: 'A critical error occurred while processing your test. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalQuestions = questions.length

  const handleNext = () => {
    if (isSubmitting) return
    setError('')
    
    if (step === 0) {
      const isFormValid = 
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.dateOfBirth !== '' &&
        formData.gender !== '' &&
        formData.medicalHistory.trim() !== '' &&
        formData.jaundice !== '' &&
        formData.familyHistory !== '' &&
        formData.consent;

      if (!isFormValid) {
        setError('Please fill all required fields and agree to the consent.')
        return
      }
      handleStartScreening()
      return
    }
    
    if (step === -1) {
      if (!selectedChildId) {
        setError('Please select a child to continue.')
        return
      }
      handleStartScreening()
      return
    }

    if (step > 0 && step <= totalQuestions) {
      const currentQId = getQuestionIdNumber(questions[step - 1])
      if (answers[String(currentQId)] === undefined) {
        setError('Please select an answer before proceeding.')
        return
      }
      
      if (step === totalQuestions) {
        handleSubmitAnswers()
        return
      }
    }

    setStep(current => current + 1)
  }

  const handleBack = () => {
    setError('')
    if (step > 1) {
      setStep(current => current - 1)
    } else if (step === 1) {
      setStep(0)
    } else {
      setStep(-1)
    }
  }

  const handleAnswer = (option) => {
    const currentQId = getQuestionIdNumber(questions[step - 1])
    setAnswers({ ...answers, [String(currentQId)]: option })
    setError('')
  }

  const renderStepper = () => {
    const steps = [
      { id: 0, label: 'About Child', icon: Baby },
      { id: 1, label: 'Behavior', icon: Activity },
      { id: 6, label: 'Details', icon: ClipboardList },
      { id: 11, label: 'Results', icon: CheckCircle2 },
    ]

    return (
      <div className="w-full max-w-4xl mx-auto pt-12 pb-16 px-4">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, (step + 1) / 4 * 100))}%` }}
          />
          
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isActive = step >= s.id || (step === -1 && idx === 0)
            const isCurrent = (step === s.id) || (step > s.id && (idx === steps.length - 1 || step < steps[idx + 1].id))
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 relative z-10">
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110' : 
                  isActive ? 'bg-orange-500' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-slate-400 animate-pulse">Preparing your experience...</p>
        </div>
      </div>
    )
  }

  if (step === -1) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white premium-gradient">
        {renderStepper()}
        <div className="max-w-2xl mx-auto px-6 pb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Welcome back</h2>
            <p className="text-slate-400 mt-3 text-lg">Select a child to begin their screening journey.</p>
          </div>

          <div className="grid gap-6">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-5 p-6 rounded-3xl border-2 transition-all duration-300 group ${
                  selectedChildId === child.id ? 
                  'border-orange-500 bg-orange-500/10 orange-glow' : 
                  'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedChildId === child.id ? 'bg-orange-500' : 'bg-slate-700 group-hover:bg-slate-600'
                }`}>
                  <Baby className="h-8 w-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-xl">{child.firstName} {child.lastName}</p>
                  <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                    <History className="h-3 w-3" />
                    Born {new Date(child.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {selectedChildId === child.id && (
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center animate-fade-in">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </button>
            ))}

            <button
              onClick={() => setStep(0)}
              className="mt-4 flex items-center justify-center gap-4 p-6 rounded-3xl border-2 border-dashed border-slate-700 text-slate-500 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-orange-500/50">
                <Users className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg tracking-wide">Register a New Child</span>
            </button>

            {selectedChildId && (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="mt-10 w-full py-6 rounded-2xl bg-orange-500 text-white font-bold text-xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                <span>{isSubmitting ? 'Initializing...' : 'Continue to Screening'}</span>
                {!isSubmitting && <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white premium-gradient">
        {renderStepper()}
        
        <div className="max-w-3xl mx-auto px-6 pb-24 animate-slide-up">
          <div className="text-center mb-10">
             <h2 className="text-4xl font-bold text-white tracking-tight">Child Profile</h2>
             <p className="text-slate-400 mt-3 text-lg">Tell us a bit about your child to customize the test.</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setFormData({...formData, gender: 'Male'})}
                className={`p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                  formData.gender === 'Male' ? 
                  'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 
                  'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  formData.gender === 'Male' ? 'bg-orange-500 scale-110' : 'bg-slate-700'
                }`}>
                  <User className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-xl tracking-wide">Boy</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, gender: 'Female'})}
                className={`p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                  formData.gender === 'Female' ? 
                  'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 
                  'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  formData.gender === 'Female' ? 'bg-orange-500 scale-110' : 'bg-slate-700'
                }`}>
                  <User className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-xl tracking-wide">Girl</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    className="w-full bg-slate-900/50 border border-slate-700 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white placeholder:text-slate-600"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    className="w-full bg-slate-900/50 border border-slate-700 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white placeholder:text-slate-600"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                <input 
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="w-full bg-slate-900/50 border border-slate-700 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Child Photo (Optional)</label>
                <div className="relative">
                  <input 
                    type="file"
                    id="child-photo"
                    className="hidden"
                    onChange={(e) => setFormData({...formData, picture: e.target.files[0]})}
                  />
                  <label 
                    htmlFor="child-photo"
                    className="w-full bg-slate-900/50 border border-slate-700 border-dashed px-6 py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-800/50 transition-all text-slate-400"
                  >
                    <Camera className="h-5 w-5" />
                    <span>{formData.picture ? formData.picture.name : 'Upload Photo'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="medicalHistory" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Medical History / Concerns</label>
              <textarea 
                id="medicalHistory"
                name="medicalHistory"
                className="w-full bg-slate-900/50 border border-slate-700 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white placeholder:text-slate-600 min-h-[120px]"
                placeholder="Briefly describe any medical history or behavioral concerns..."
                value={formData.medicalHistory}
                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-300">History of Jaundice?</p>
                <div className="flex gap-3">
                  {['yes', 'no'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFormData({...formData, jaundice: opt})}
                      className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all duration-300 ${
                        formData.jaundice === opt ? 
                        'bg-orange-500 text-white shadow-lg' : 
                        'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-300">Family History of Autism?</p>
                <div className="flex gap-3">
                  {['yes', 'no'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFormData({...formData, familyHistory: opt})}
                      className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all duration-300 ${
                        formData.familyHistory === opt ? 
                        'bg-orange-500 text-white shadow-lg' : 
                        'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/20">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative mt-1">
                  <input 
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`h-6 w-6 rounded-md border-2 transition-all flex items-center justify-center ${
                    formData.consent ? 'bg-orange-500 border-orange-500' : 'border-slate-600 group-hover:border-orange-500/50'
                  }`}>
                    {formData.consent && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">
                  I confirm that I agree to start the screening test using my child&apos;s data and understand this is not a medical diagnosis.
                </span>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(-1)}
                className="px-8 py-5 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 py-5 rounded-2xl bg-orange-500 text-white font-bold text-xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                <span>{isSubmitting ? 'Registering...' : 'Start Screening'}</span>
                {!isSubmitting && <ArrowRight className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step > totalQuestions && result) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white premium-gradient flex flex-col">
        {renderStepper()}
        <div className="max-w-3xl mx-auto px-6 pb-24 w-full animate-slide-up">
          <div className="glass-card rounded-[3rem] p-10 sm:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-slate-700/30">
            <div className="flex flex-col items-center">
              <div className={`h-28 w-28 rounded-3xl flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-0 duration-500 ${
                result.predictionClass === 'Normal' ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)]'
              }`}>
                {result.predictionClass === 'Normal' ? (
                  <CheckCircle2 className="h-16 w-16 text-white" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-white" />
                )}
              </div>
              
              <h2 className="text-5xl font-bold mb-4 tracking-tight">Screening Result</h2>
              <p className="text-slate-400 mb-12 text-lg max-w-md mx-auto">
                Detailed analysis based on the behavioral patterns observed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-12">
                <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-700/30">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Prediction</p>
                  <p className={`text-3xl font-bold ${result.predictionClass === 'Normal' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {result.predictionClass}
                  </p>
                </div>
                <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-700/30">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Confidence</p>
                  <p className="text-3xl font-bold text-white">
                    {(result.confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="w-full p-8 bg-slate-900/80 rounded-[2.5rem] text-left border border-slate-700/50 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Info className="h-20 w-20" />
                </div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-orange-400" />
                  </div>
                  Understanding the Result
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  {result.predictionClass === 'Normal' 
                    ? "Your child is showing developmental milestones typical for their age. We recommend regular screenings every 6 months to monitor ongoing progress."
                    : "The screening suggests some developmental markers that warrant a professional review. This is not a diagnosis, but an invitation for further conversation with a specialist."
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 w-full">
                <button
                  onClick={() => navigate('/parent/home')}
                  className="flex-1 py-5 px-8 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all duration-300"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => navigate('/parent/sessions')}
                  className="flex-1 py-5 px-8 rounded-2xl bg-orange-500 text-white font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
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
    <div className="min-h-screen bg-[#0b1220] text-white premium-gradient overflow-x-hidden flex flex-col">
      {renderStepper()}

      <div className="relative mx-auto max-w-3xl px-6 pb-24 w-full flex-1 flex flex-col animate-slide-up">
        <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden flex-1 flex flex-col border border-slate-700/30">
           <div className="p-8 sm:p-12 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Question</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white leading-none">{step}</span>
                    <span className="text-slate-600 font-bold mb-1">/ {totalQuestions}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-500/10 px-3 py-1 rounded-full">{Math.round(progress)}% Complete</span>
                </div>
              </div>
              
              <div className="h-2 bg-slate-900 rounded-full mb-12 relative overflow-hidden border border-slate-800/50">
                <div 
                  className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-12 flex-1 flex flex-col">
                <h3 className="text-2xl sm:text-4xl font-bold text-white leading-[1.2] tracking-tight">
                  {currentQ?.text}
                </h3>

                <div className="grid gap-4">
                  {currentQ?.options?.map((option, index) => {
                    const isSelected = currentQId !== null && answers[String(currentQId)] === option;
                    
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`w-full text-left p-6 sm:p-8 border-2 rounded-[1.5rem] font-bold text-lg sm:text-xl transition-all duration-300 group relative overflow-hidden flex items-center justify-between
                          ${isSelected 
                            ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.15)] scale-[1.02]' 
                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-800/50'
                          }
                        `}
                        onClick={() => handleAnswer(option)}
                      >
                        <div className="flex items-center gap-6 relative z-10">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className={`transition-colors tracking-wide ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {option}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center animate-fade-in shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <div className="mt-8 flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-12 mt-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-5 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-2 group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting || !isAnswered}
                  className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl flex items-center gap-3
                    ${isAnswered && !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-1 shadow-orange-500/30' 
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting && <LoadingSpinner size="sm" />}
                  <span>{step === totalQuestions ? (isSubmitting ? 'Submitting...' : 'Complete Test') : 'Next'}</span>
                  {!isSubmitting && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
