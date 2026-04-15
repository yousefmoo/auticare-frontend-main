import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Stethoscope,
  Users,
  MessageCircle,
  Sparkles,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import usePageTitle from "../../utils/usePageTitle";
import heroAutism from "../../Pics/autism.png";
import heroKid from "../../Pics/kid.png";
import heroKids from "../../Pics/kids.png";

const features = [
  {
    title: "For Doctors",
    description:
      "Coordinate diagnostics, assessments, and care plans in a unified workspace.",
    icon: Stethoscope,
  },
  {
    title: "For Therapists",
    description:
      "Track sessions, goals, and progress with clarity across disciplines.",
    icon: HeartHandshake,
  },
  {
    title: "For Parents",
    description:
      "Stay connected with daily guidance, progress updates, and resources.",
    icon: Users,
  },
];

const testimonials = [
  {
    quote:
      "AutiCare keeps our team aligned and helps families feel supported between sessions.",
    name: "Dr. Priya Rao",
    role: "Pediatric Neurologist",
  },
  {
    quote:
      "The daily insights make it easier to tailor therapy exercises for each child.",
    name: "Jasmine Lee",
    role: "Speech Therapist",
  },
  {
    quote:
      "We finally have one place to see progress, plans, and resources in plain language.",
    name: "Michael Johnson",
    role: "Parent Advocate",
  },
];

const heroGallery = [
  {
    src: heroAutism,
    alt: "Therapist and child learning together",
    label: "Guided support",
  },
  {
    src: heroKid,
    alt: "Child engaged in a learning activity",
    label: "Belonging matters",
  },
  {
    src: heroKids,
    alt: "Caregiver and child building skills together",
    label: "Interactive learning",
  },
];

const careMoments = [
  {
    src: heroKids,
    alt: "Caregiver and child practicing skills together",
    label: "Guided play",
  },
  {
    src: heroAutism,
    alt: "Therapy session focused on communication",
    label: "Supportive sessions",
  },
];

const serviceHighlights = [
  {
    title: "Care plans that feel human",
    description:
      "Personalized plans with clear next steps, shared across the whole care team.",
    icon: ClipboardList,
  },
  {
    title: "Progress that families can see",
    description:
      "Simple summaries, milestones, and weekly reports that are easy to follow.",
    icon: Sparkles,
  },
  {
    title: "Resources for everyday moments",
    description:
      "Activity ideas, routines, and learning tools aligned with your child’s goals.",
    icon: BookOpen,
  },
];

export default function LandingPage() {
  usePageTitle("Home");

  return (
    <div className="bg-[var(--surface)] text-[var(--ink)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-surface" />
        <div className="absolute inset-0 hero-radial" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full hero-glow-1 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full hero-glow-2 blur-3xl" />

        <div className="relative w-full mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="flex flex-col gap-12">
            <div className="space-y-6 slide-up text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--card)]/90 px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                HIPAA-ready, comfort-first care
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[var(--ink)] leading-tight">
                Calm, confident autism care for every family
              </h1>
              <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
                AutiCare brings clinicians, therapists, and caregivers together
                with gentle workflows, shared progress, and clear next steps for
                every child.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <NavLink
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-[var(--surface)] font-semibold shadow-lg hover:opacity-90 transition-colors"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-[var(--muted)] font-semibold hover:border-[var(--border)] hover:text-[var(--ink)] transition-colors"
                >
                  Login
                </NavLink>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-emerald-500" />
                  Progress tracking
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-sky-500" />
                  Secure messaging
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-amber-500" />
                  Family-centered plans
                </div>
              </div>
            </div>

            <div className="space-y-5 max-w-3xl mx-auto w-full">
              <div
                className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-3xl p-4 sm:p-5 slide-up"
                style={{ animationDelay: "120ms" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    AutiCare in action
                  </p>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    Photos
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {heroGallery.map((photo) => (
                    <figure
                      key={photo.label}
                      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-md aspect-[5/4]"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent opacity-80" />
                      <figcaption className="absolute bottom-3 left-3 z-10 text-[11px] font-semibold text-white bg-[var(--ink)] bg-opacity-70 px-2 py-1 rounded-full">
                        {photo.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <div
                className="bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-3xl p-6 slide-up"
                style={{ animationDelay: "220ms" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      Gentle progress insights
                    </p>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      Updated today
                    </span>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 p-5 text-[var(--surface)]">
                    <p className="text-sm text-white/80">Weekly growth</p>
                    <p className="text-3xl font-bold mt-1">+18%</p>
                    <p className="text-xs text-white/80 mt-2">
                      Communication, social, and motor milestones
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[var(--border)] p-4">
                      <p className="text-xs text-[var(--muted-2)]">
                        Sessions this week
                      </p>
                      <p className="text-xl font-semibold text-[var(--ink)]">
                        12
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border)] p-4">
                      <p className="text-xs text-[var(--muted-2)]">
                        Active families
                      </p>
                      <p className="text-xl font-semibold text-[var(--ink)]">
                        1,042
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] p-4">
                    <p className="text-xs text-[var(--muted-2)]">
                      Recent activity
                    </p>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      3 treatment plans updated
                    </p>
                    <p className="text-xs text-[var(--muted-2)] mt-1">
                      Within the last 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full -mt-8 sm:-mt-14 pb-12">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">
                  Our services
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
                  Evidence-based support that feels warm and practical
                </h2>
                <p className="text-[var(--muted)]">
                  AutiCare blends clinical rigor with family-friendly guidance,
                  giving every caregiver a clear, calm path forward.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {serviceHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] p-4"
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
                <div className="flex flex-wrap gap-3">
                  <NavLink
                    to="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[var(--surface)] text-sm font-semibold shadow-lg hover:opacity-90 transition-colors"
                  >
                    Our Services
                    <ArrowRight className="h-4 w-4" />
                  </NavLink>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">
                    “We finally have one place for plans, progress, and
                    support.”
                  </span>
                </div>
              </div>

              <div className="rounded-3xl bg-[var(--card-alt)] p-4 sm:p-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {heroGallery.map((photo) => (
                    <figure
                      key={photo.label}
                      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm aspect-[5/4]"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <figcaption className="absolute bottom-2 left-2 text-[11px] font-semibold text-white bg-[var(--ink)] bg-opacity-70 px-2 py-1 rounded-full">
                        {photo.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-alt)]">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">
              Comfort first
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
              A safe space to grow, play, and learn together
            </h2>
            <p className="text-[var(--muted)]">
              From gentle visuals to clear next steps, every screen is designed
              to feel calm and supportive for families, clinicians, and
              therapists.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full bg-[var(--card)] border border-emerald-100 px-3 py-1">
                Sensory-friendly visuals
              </span>
              <span className="rounded-full bg-[var(--card)] border border-emerald-100 px-3 py-1">
                Simple language
              </span>
              <span className="rounded-full bg-[var(--card)] border border-emerald-100 px-3 py-1">
                Predictable routines
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careMoments.map((moment) => (
              <figure
                key={moment.label}
                className="group relative overflow-hidden rounded-3xl border border-[var(--border)] shadow-lg bg-[var(--card)] aspect-[4/3]"
              >
                <img
                  src={moment.src}
                  alt={moment.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent opacity-80" />
                <figcaption className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-[var(--ink)] bg-opacity-70 px-2 py-1 rounded-full">
                  {moment.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
              Built for every role
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
              One platform, three tailored experiences
            </h2>
            <p className="text-[var(--muted)]">
              AutiCare organizes every stage of care so clinicians and families
              stay aligned.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg"
                >
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)] mt-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[var(--surface)] via-[var(--surface)] to-[var(--surface-alt)]">
        <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
              Built on trust and measurable outcomes
            </h2>
            <p className="text-[var(--muted)]">
              Track goals, align schedules, and surface insights with dashboards
              designed for clinical rigor and family clarity.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--card)] p-4 border border-[var(--border)] shadow-sm">
                <p className="text-xs text-[var(--muted-2)]">
                  Families supported
                </p>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  1,000+
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--card)] p-4 border border-[var(--border)] shadow-sm">
                <p className="text-xs text-[var(--muted-2)]">Care providers</p>
                <p className="text-2xl font-semibold text-[var(--ink)]">240+</p>
              </div>
              <div className="rounded-2xl bg-[var(--card)] p-4 border border-[var(--border)] shadow-sm">
                <p className="text-xs text-[var(--muted-2)]">Plan completion</p>
                <p className="text-2xl font-semibold text-[var(--ink)]">92%</p>
              </div>
              <div className="rounded-2xl bg-[var(--card)] p-4 border border-[var(--border)] shadow-sm">
                <p className="text-xs text-[var(--muted-2)]">
                  Avg. response time
                </p>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  2 hrs
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[var(--ink)]">
              Care coordination snapshot
            </h3>
            <div className="mt-4 space-y-4">
              {[
                { label: "Assessment completion", value: 86 },
                { label: "Therapy adherence", value: 78 },
                { label: "Family engagement", value: 92 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)] font-medium">
                      {item.label}
                    </span>
                    <span className="text-[var(--muted-2)]">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--card-alt)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--ink)]">
              Voices from the AutiCare community
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-[var(--border)] p-6 shadow-lg bg-[var(--card)]"
              >
                <p className="text-sm text-[var(--muted)]">
                  &quot;{item.quote}&quot;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--muted-2)]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16 py-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Ready to build a connected care journey?
          </h2>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">
            Start with our quick questionnaire and receive a tailored setup for
            your role.
          </p>
          <NavLink
            to="/signup"
            className="inline-flex items-center gap-2 mt-6 rounded-full bg-white text-slate-900 font-semibold px-6 py-3 shadow-lg hover:bg-slate-100 transition-colors"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>
      </section>
    </div>
  );
}
