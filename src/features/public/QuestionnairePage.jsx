import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { 
  screeningQuestions as questions,
  generateScreeningInsights,
  saveScreeningResult
} from "../screening/screeningInsights";
import { predictASD, formatForAI } from "@/api/ai.api";
import { useAuthStore, useUIStore } from "@/store";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import usePageTitle from "@/utils/usePageTitle";

const introHighlights = [
  {
    title: "10 quick questions",
    description: "Takes about 3-5 minutes",
    icon: ClipboardList,
  },
  {
    title: "Secure & private",
    description: "Your data stays protected",
    icon: ShieldCheck,
  },
  {
    title: "Personalized insights",
    description: "Tailored guidance after completion",
    icon: Sparkles,
  },
];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  
  const [step, setStep] = useState(0); // 0: Form, 1-10: Questions, 11: Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
    jaundice: '',
    familyHistory: '',
    consent: false,
  });
  const [answers, setAnswers] = useState({});
  const [screeningResult, setScreeningResult] = useState(null);

  usePageTitle('Autism Screening');

  const totalQuestions = questions.length;

  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.dateOfBirth !== '' &&
      formData.gender !== '' &&
      formData.medicalHistory.trim() !== '' &&
      formData.jaundice !== '' &&
      formData.familyHistory !== '' &&
      formData.consent
    );
  }, [formData]);

  const handleNext = () => {
    if (step === 0 && !isFormValid) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleAnswer = async (option) => {
    const nextAnswers = { ...answers, [questions[step - 1].id]: option };
    setAnswers(nextAnswers);
    
    if (step === totalQuestions) {
      await finalizeScreening(nextAnswers);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const finalizeScreening = async (finalAnswers) => {
    setIsSubmitting(true);
    try {
      // 1. Generate local insights
      const insights = generateScreeningInsights(
        { 
          name: `${formData.firstName} ${formData.lastName}`,
          dob: formData.dateOfBirth,
          gender: formData.gender,
          helper: 'parent'
        }, 
        finalAnswers
      );

      // 2. Call AI for prediction (Guest Flow)
      try {
        const aiPayload = formatForAI(formData, finalAnswers, questions);
        const aiResult = await predictASD(aiPayload);
        if (aiResult) {
          insights.aiResult = aiResult;
          // Sync risk level if AI is more confident/specific
          if (aiResult.label) insights.riskLevel.label = aiResult.label;
        }
      } catch (err) {
        console.error("AI prediction failed:", err);
      }

      // 3. Save to local storage
      saveScreeningResult(insights);
      setScreeningResult(insights);
      setStep(totalQuestions + 1);
      
      addToast({ 
        type: 'success', 
        title: 'Complete', 
        message: 'Your screening result is ready!' 
      });
    } catch (err) {
      addToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'Something went wrong while processing results.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERING ---

  // 1. Loading State
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-orange-400 animate-pulse" />
        </div>
        <h2 className="mt-8 text-2xl font-bold">Analyzing Responses...</h2>
        <p className="mt-2 text-slate-400 text-center max-w-xs">
          Our AI is processing the developmental markers to provide personalized insights.
        </p>
      </div>
    );
  }

  // 2. Intro Form Step
  if (step === 0) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center py-12 px-4">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left Column: Info */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-bold text-orange-400">
                <ShieldCheck className="h-4 w-4" />
                Confidential Screening
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
                Early signs <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                  Questionnaire
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md">
                Complete this 5-minute assessment to receive a detailed screening summary and professional recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {introHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="glass-card p-4 flex items-start gap-4 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="glass-card p-1 animate-slide-up">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Child Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Tell us about your child</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-bold text-white">{totalQuestions} Qs</span>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); if (isFormValid) handleNext(); }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">First Name</label>
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      placeholder="e.g. Liam"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      placeholder="e.g. Miller"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Date of Birth</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Gender</label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="" className="bg-slate-900">Select</option>
                      <option value="male" className="bg-slate-900">Male</option>
                      <option value="female" className="bg-slate-900">Female</option>
                      <option value="other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Medical History</label>
                  <textarea
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all min-h-[100px]"
                    placeholder="Describe any developmental concerns or medical history..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Past Jaundice?</p>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(val => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.jaundice === val ? 'border-orange-500 bg-orange-500' : 'border-white/20'}`}>
                            {formData.jaundice === val && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <input 
                            type="radio" 
                            className="hidden" 
                            name="jaundice" 
                            value={val} 
                            checked={formData.jaundice === val}
                            onChange={() => setFormData({ ...formData, jaundice: val })}
                          />
                          <span className={`text-sm font-bold capitalize ${formData.jaundice === val ? 'text-white' : 'text-slate-500'}`}>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Family History?</p>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(val => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.familyHistory === val ? 'border-orange-500 bg-orange-500' : 'border-white/20'}`}>
                            {formData.familyHistory === val && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <input 
                            type="radio" 
                            className="hidden" 
                            name="familyHistory" 
                            value={val} 
                            checked={formData.familyHistory === val}
                            onChange={() => setFormData({ ...formData, familyHistory: val })}
                          />
                          <span className={`text-sm font-bold capitalize ${formData.familyHistory === val ? 'text-white' : 'text-slate-500'}`}>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                  <div className="pt-1">
                    <div 
                      onClick={() => setFormData({ ...formData, consent: !formData.consent })}
                      className={`h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-all ${formData.consent ? 'bg-orange-500 border-orange-500' : 'border-white/20'}`}
                    >
                      {formData.consent && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    I understand this screening is for informational purposes only and does not constitute a clinical diagnosis.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98]"
                >
                  Start Questionnaire
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Result View
  if (step > totalQuestions && screeningResult) {
    const toneClasses = {
      red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
      amber: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    };

    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl animate-slide-up">
           <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 className="h-3 w-3" />
                  Screening Complete
                </div>
                <h1 className="text-4xl font-bold text-white">
                  Assessment Summary
                </h1>
                <p className="text-slate-400 max-w-lg">
                  Based on your responses for <strong>{formData.firstName}</strong>, here is the automated analysis.
                </p>
              </div>

              <div className={`p-6 rounded-[2rem] border bg-gradient-to-br min-w-[240px] text-center ${toneClasses[screeningResult.riskLevel.tone]}`}>
                 <p className="text-xs font-bold uppercase tracking-widest opacity-70">Risk Level</p>
                 <p className="text-4xl font-bold my-2">{screeningResult.riskLevel.label}</p>
                 <p className="text-sm font-bold">{screeningResult.riskLevel.probability}% probability</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                 <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Key Observations
                 </h2>
                 <div className="space-y-6">
                    {screeningResult.domainBreakdown.map((domain, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-white">{domain.domain}</span>
                          <span className="text-slate-500">{domain.flagged}/{domain.total}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${screeningResult.riskLevel.tone === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${domain.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card p-8 bg-slate-900 border border-white/10 rounded-[2.5rem] flex flex-col justify-between">
                 <div>
                   <h2 className="text-xl font-bold text-white mb-6">Next Steps</h2>
                   <div className="space-y-4">
                      {screeningResult.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                          <div className="h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                             <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          </div>
                          {rec}
                        </div>
                      ))}
                   </div>
                 </div>
                 
                 <div className="pt-8 flex flex-col gap-3">
                    <Link 
                      to="/signup" 
                      className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl text-center hover:bg-slate-100 transition-all"
                    >
                      Save Result & Join AutiCare
                    </Link>
                    <button 
                      onClick={() => window.print()}
                      className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                      Print Summary
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 4. Questionnaire View
  const currentQ = questions[step - 1];
  const progress = (step / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[-20%] w-full h-[60%] bg-blue-500 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-3xl animate-fade-in">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleBack}
              className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</p>
               <p className="text-lg font-bold text-white">{Math.round(progress)}%</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
               {step}
            </div>
         </div>

         {/* Progress Bar */}
         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-12">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
         </div>

         {/* Question Card */}
         <div className="glass-card p-1">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
               <div className="flex justify-center mb-8">
                  <div className="h-16 w-16 rounded-3xl bg-orange-500/20 flex items-center justify-center">
                     <HelpCircle className="h-8 w-8 text-orange-400" />
                  </div>
               </div>

               <h3 className="text-2xl sm:text-3xl font-bold text-white text-center leading-tight">
                  {currentQ.text}
               </h3>

               <div className="mt-12 grid grid-cols-1 gap-4">
                  {currentQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="group relative w-full text-left p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-orange-500 transition-all duration-300 flex items-center gap-6"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white/5 group-hover:bg-white/20 flex items-center justify-center text-white font-bold text-xl transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-lg font-bold text-white group-hover:text-white flex-1">{option}</span>
                      <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                         <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="mt-10 flex items-center justify-center gap-3 text-slate-500 italic text-sm">
            <Clock className="h-4 w-4" />
            Remaining time: {Math.max(totalQuestions - step, 1)} min
         </div>
      </div>
    </div>
  );
}
