import { STORAGE_KEYS } from '../../utils/constants'

export const screeningQuestions = [
  {
    id: 1,
    text: 'Does your child look at you when you call his/her name?',
    options: ['YES', 'NO'],
    domain: 'Social engagement',
    riskAnswers: ['NO'],
  },
  {
    id: 2,
    text: 'How easy is it for you to get eye contact with your child?',
    options: ['EASY', 'DIFFICULT'],
    domain: 'Social engagement',
    riskAnswers: ['DIFFICULT'],
  },
  {
    id: 3,
    text: 'Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach).',
    options: ['YES', 'NO'],
    domain: 'Joint attention',
    riskAnswers: ['NO'],
  },
  {
    id: 4,
    text: 'Does your child point to share interest with you? (e.g. pointing at an interesting sight).',
    options: ['YES', 'NO'],
    domain: 'Joint attention',
    riskAnswers: ['NO'],
  },
  {
    id: 5,
    text: 'Does your child pretend? (e.g. care for dolls, talk on a toy phone).',
    options: ['YES', 'NO'],
    domain: 'Play & imagination',
    riskAnswers: ['NO'],
  },
  {
    id: 6,
    text: 'Does your child follow where you are looking?',
    options: ['YES', 'NO'],
    domain: 'Social engagement',
    riskAnswers: ['NO'],
  },
  {
    id: 7,
    text: 'If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them?',
    options: ['YES', 'NO'],
    domain: 'Emotional response',
    riskAnswers: ['NO'],
  },
  {
    id: 8,
    text: "Would you describe your child's first words as:",
    options: [
      "YES (simple words like 'mama', 'bye')",
      'NO (more complex words or phrases)',
    ],
    domain: 'Language development',
    riskAnswers: ["YES (simple words like 'mama', 'bye')"],
  },
  {
    id: 9,
    text: 'Does your child use simple gestures? (e.g. wave goodbye)',
    options: ['YES', 'NO'],
    domain: 'Communication',
    riskAnswers: ['NO'],
  },
  {
    id: 10,
    text: 'Does your child stare at nothing with no apparent purpose?',
    options: ['YES', 'NO'],
    domain: 'Behavior regulation',
    riskAnswers: ['YES'],
  },
]

const recommendedTeam = {
  doctor: [
    {
      id: 'doc-1',
      name: 'Dr. Ahmed Ali',
      specialty: 'Child Neurologist',
      experience: '5 years',
      cases: 25,
      rating: 4.8,
      availability: 'Sun - Tue',
      recommendedFor: 'Clinical screening review',
      channel: 'Doctor',
    },
    {
      id: 'doc-2',
      name: 'Dr. Osama Mohamed',
      specialty: 'Developmental Pediatrician',
      experience: '6 years',
      cases: 19,
      rating: 4.9,
      availability: 'Mon - Wed',
      recommendedFor: 'Diagnostic follow-up',
      channel: 'Doctor',
    },
  ],
  therapist: [
    {
      id: 'ther-1',
      name: 'Ther. Amany Ebrahim',
      specialty: 'Behavior Therapist',
      experience: '4 years',
      cases: 15,
      rating: 4.7,
      availability: 'Sun - Thu',
      recommendedFor: 'Parent coaching and behavior support',
      channel: 'Therapist',
    },
    {
      id: 'ther-2',
      name: 'Ther. Rania Fikrat',
      specialty: 'Speech Therapist',
      experience: '5 years',
      cases: 18,
      rating: 4.8,
      availability: 'Mon - Thu',
      recommendedFor: 'Language and communication support',
      channel: 'Therapist',
    },
  ],
}

const scoreToRiskLevel = (score) => {
  if (score >= 7) {
    return { label: 'High', tone: 'red', probability: 82 }
  }
  if (score >= 4) {
    return { label: 'Moderate', tone: 'amber', probability: 68 }
  }
  return { label: 'Low', tone: 'emerald', probability: 28 }
}

const buildDomainBreakdown = (questionResults) => {
  const grouped = questionResults.reduce((acc, item) => {
    if (!acc[item.domain]) {
      acc[item.domain] = { flagged: 0, total: 0 }
    }
    acc[item.domain].total += 1
    if (item.isFlagged) {
      acc[item.domain].flagged += 1
    }
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([domain, value]) => ({
      domain,
      flagged: value.flagged,
      total: value.total,
      percent: Math.round((value.flagged / value.total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent)
}

const buildRecommendations = (riskLevel, domainBreakdown) => {
  const topDomains = domainBreakdown
    .filter((item) => item.flagged > 0)
    .slice(0, 3)
    .map((item) => item.domain)

  const base = [
    'Share the screening summary with your care team before the next session.',
    'Track the same behaviors over the next 2 weeks to compare patterns.',
  ]

  if (riskLevel.label === 'High') {
    return [
      'Book a doctor review soon for a more detailed clinical screening review.',
      'Begin therapist follow-up focused on communication and social response.',
      ...base,
    ]
  }

  if (riskLevel.label === 'Moderate') {
    return [
      'Discuss these results with a therapist to prioritize the most affected skills.',
      `Pay extra attention to ${topDomains.join(', ') || 'social engagement'} during home routines.`,
      ...base,
    ]
  }

  return [
    'Continue observing development through everyday play and communication routines.',
    `Keep strengthening ${topDomains.join(', ') || 'current strengths'} with short guided activities.`,
    ...base,
  ]
}

export function generateScreeningInsights(profile = {}, answers = {}) {
  const questionResults = screeningQuestions.map((question) => {
    const answer = answers[question.id] || null
    const isFlagged = question.riskAnswers.includes(answer)

    return {
      id: question.id,
      question: question.text,
      domain: question.domain,
      answer,
      isFlagged,
    }
  })

  const score = questionResults.filter((item) => item.isFlagged).length
  const riskLevel = scoreToRiskLevel(score)
  const domainBreakdown = buildDomainBreakdown(questionResults)

  return {
    profile: {
      name: profile.name || 'Omar Ahmed',
      age: profile.age || '6',
      gender: profile.gender || 'male',
      caregiver: profile.helper || 'parent',
      dob: profile.dob || '',
    },
    completedAt: new Date().toISOString(),
    score,
    totalQuestions: screeningQuestions.length,
    riskLevel,
    questionResults,
    domainBreakdown,
    recommendations: buildRecommendations(riskLevel, domainBreakdown),
    specialists: [...recommendedTeam.doctor, ...recommendedTeam.therapist],
  }
}

export function saveScreeningResult(result) {
  localStorage.setItem(STORAGE_KEYS.SCREENING_RESULT, JSON.stringify(result))
}

export function getStoredScreeningResult() {
  const raw = localStorage.getItem(STORAGE_KEYS.SCREENING_RESULT)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getDemoScreeningResult() {
  return generateScreeningInsights(
    {
      name: 'Omar Ahmed',
      age: '6',
      gender: 'male',
      helper: 'parent',
      dob: '2020-07-15',
    },
    {
      1: 'NO',
      2: 'DIFFICULT',
      3: 'NO',
      4: 'NO',
      5: 'YES',
      6: 'NO',
      7: 'NO',
      8: "YES (simple words like 'mama', 'bye')",
      9: 'NO',
      10: 'YES',
    }
  )
}
