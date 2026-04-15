import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const questions = [
  {
    id: 1,
    text: "Does your child look at you when you call his/her name?",
    options: ["YES", "NO"],
  },
  {
    id: 2,
    text: "How easy is it for you to get eye contact with your child?",
    options: ["EASY", "DIFFICULT"],
  },
  {
    id: 3,
    text: "Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach).",
    options: ["YES", "NO"],
  },
  {
    id: 4,
    text: "Does your child point to share interest with you? (e.g. pointing at an interesting sight).",
    options: ["YES", "NO"],
  },
  {
    id: 5,
    text: "Does your child pretend? (e.g. care for dolls, talk on a toy phone).",
    options: ["YES", "NO"],
  },
  {
    id: 6,
    text: "Does your child follow where you are looking?",
    options: ["YES", "NO"],
  },
  {
    id: 7,
    text: "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them?",
    options: ["YES", "NO"],
  },
  {
    id: 8,
    text: "Would you describe your child's first words as:",
    options: [
      "YES (simple words like 'mama', 'bye')",
      "NO (more complex words or phrases)",
    ],
  },
  {
    id: 9,
    text: "Does your child use simple gestures? (e.g. wave goodbye)",
    options: ["YES", "NO"],
  },
  {
    id: 10,
    text: "Does your child stare at nothing with no apparent purpose?",
    options: ["YES", "NO"],
  },
];

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
  const [step, setStep] = useState(0); // 0 is Intro Form, 1-10 are questions
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    dob: "",
    helper: "",
    agreed: false,
  });
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    if (step === 0 && !formData.agreed) return;
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[step - 1].id]: option });
    handleNext();
  };

  const totalQuestions = questions.length;

  // --- Intro Component ---
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
                Share your child&apos;s details to personalize the screening.
                This is not a diagnosis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {introHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--muted-2)] mt-1">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Child profile
                  </p>
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
                  event.preventDefault();
                  handleNext();
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--muted)]">
                      Child full name
                    </label>
                    <input
                      className="input-field mt-2"
                      placeholder="e.g. Lina Ahmed"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--muted)]">
                      Age
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="18"
                      inputMode="numeric"
                      className="input-field mt-2"
                      placeholder="e.g. 4"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--muted)]">
                      Gender
                    </label>
                    <select
                      className="input-field mt-2"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--muted)]">
                      Caregiver role
                    </label>
                    <select
                      className="input-field mt-2"
                      value={formData.helper}
                      onChange={(e) =>
                        setFormData({ ...formData, helper: e.target.value })
                      }
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
                  <label className="text-sm font-medium text-[var(--muted)]">
                    Date of birth (optional)
                  </label>
                  <input
                    type="date"
                    className="input-field mt-2"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>

                <label
                  htmlFor="child-photo"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-emerald-100 bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]"
                >
                  Upload photo (optional)
                  <span className="text-xs font-semibold text-emerald-700">
                    Choose file
                  </span>
                  <input id="child-photo" type="file" className="hidden" />
                </label>

                <div className="rounded-2xl border border-emerald-100 bg-[var(--card)] p-4">
                  <label className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={formData.agreed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreed: e.target.checked,
                        })
                      }
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
    );
  }

  // --- Quiz Component ---
  const currentQ = questions[step - 1];
  const progress = (step / totalQuestions) * 100;

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

            <div className="space-y-4 mt-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={option}
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
                onClick={handleBack}
                className="px-6 py-3 rounded-full border border-[var(--border)] text-[var(--muted)] font-semibold hover:border-[var(--border)] hover:text-[var(--ink)] transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--surface)] font-semibold hover:opacity-90 transition-colors ml-auto"
            >
              {step === totalQuestions ? "Finish" : "Next"}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--muted-2)]">
            <Clock className="h-3.5 w-3.5" />
            Estimated time remaining: {Math.max(totalQuestions - step, 1)}{" "}
            minutes
          </div>
        </div>
      </div>
    </div>
  );
}
