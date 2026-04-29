export const doctorPatients = [
  {
    id: 'p-001',
    name: 'Omar Ahmed',
    age: 6,
    diagnosis: 'ASD Level 1',
    therapist: 'Ther. Amany Ebrahim',
    lastVisit: '2026-04-01',
    risk: 'high',
    progress: 70,
  },
  {
    id: 'p-002',
    name: 'Lina Samir',
    age: 5,
    diagnosis: 'Speech Delay',
    therapist: 'Ther. Rania Fikrat',
    lastVisit: '2026-03-29',
    risk: 'moderate',
    progress: 78,
  },
  {
    id: 'p-003',
    name: 'Youssef Khaled',
    age: 7,
    diagnosis: 'ADHD + Social Delay',
    therapist: 'Ther. Maha Salem',
    lastVisit: '2026-03-27',
    risk: 'stable',
    progress: 82,
  },
]

export const treatmentPlans = [
  {
    id: 'tp-101',
    title: 'Communication Boost Plan',
    child: 'Omar Ahmed',
    therapyType: 'Speech + Behavioral',
    frequency: '3 sessions / week',
    owner: 'Dr. Ahmed Mostafa',
    status: 'active',
    updatedAt: '2026-04-02',
  },
  {
    id: 'tp-102',
    title: 'Joint Attention Starter',
    child: 'Lina Samir',
    therapyType: 'Speech Therapy',
    frequency: '2 sessions / week',
    owner: 'Dr. Osama Mohamed',
    status: 'review',
    updatedAt: '2026-03-31',
  },
]

export const reportItems = [
  {
    id: 'rp-1',
    title: 'Monthly Development Report',
    child: 'Omar Ahmed',
    author: 'Ther. Amany Ebrahim',
    category: 'Progress',
    status: 'ready',
    createdAt: '2026-04-02',
  },
  {
    id: 'rp-2',
    title: 'Behavior Observation Summary',
    child: 'Lina Samir',
    author: 'Ther. Rania Fikrat',
    category: 'Behavior',
    status: 'pending',
    createdAt: '2026-04-01',
  },
]

export const screeningQueue = [
  {
    id: 'as-1',
    child: 'Omar Ahmed',
    type: 'Follow-up Screening',
    date: '2026-04-05',
    owner: 'Dr. Ahmed Mostafa',
    priority: 'high',
  },
  {
    id: 'as-2',
    child: 'Mariam Hany',
    type: 'Quarterly Review',
    date: '2026-04-07',
    owner: 'Dr. Osama Mohamed',
    priority: 'medium',
  },
]

export const therapistPatients = doctorPatients.map((patient) => ({
  ...patient,
  weeklyFocus:
    patient.name === 'Omar Ahmed'
      ? 'Joint attention and imitation'
      : patient.name === 'Lina Samir'
        ? 'Expressive language'
        : 'Routine regulation',
}))

export const weeklyPlans = [
  {
    id: 'wp-1',
    child: 'Omar Ahmed',
    goal: 'Improve eye contact during structured play',
    sessions: 3,
    homeTask: '10-minute naming game',
    status: 'in_progress',
  },
  {
    id: 'wp-2',
    child: 'Lina Samir',
    goal: 'Expand 2-word requests to 3-word phrases',
    sessions: 2,
    homeTask: 'Picture card repetition',
    status: 'ready',
  },
]

export const sessionNotes = [
  {
    id: 'sn-1',
    child: 'Omar Ahmed',
    date: '2026-04-02',
    sessionType: 'Behavior Session',
    summary: 'Responded better to visual prompts and tolerated turn-taking for 6 minutes.',
    nextStep: 'Increase wait-time practice at home.',
  },
  {
    id: 'sn-2',
    child: 'Lina Samir',
    date: '2026-04-01',
    sessionType: 'Speech Session',
    summary: 'Produced five target words independently.',
    nextStep: 'Introduce short phrase combinations.',
  },
]

export const therapistStats = [
  { label: 'Completion Rate', value: '91%', sub: 'Session plans completed' },
  { label: 'Notes Submitted', value: '18', sub: 'Last 7 days' },
  { label: 'Avg Engagement', value: '84%', sub: 'Across active clients' },
]

export const dailyFeedbackEntries = [
  {
    id: 'fb-1',
    date: '2026-04-03',
    activity: 'Picture matching',
    status: 'completed',
    mood: 'engaged',
    note: 'Focused for 12 minutes and asked for the same game again.',
  },
  {
    id: 'fb-2',
    date: '2026-04-02',
    activity: 'Turn-taking game',
    status: 'partial',
    mood: 'mixed',
    note: 'Needed support to wait but completed two rounds.',
  },
]

export const parentWeeklySchedule = [
  {
    id: 'bk-1',
    therapist: 'Ther. Amany Ebrahim',
    specialty: 'Behavior Therapist',
    date: 'Sun 10',
    time: '09:00 AM',
    sessionType: 'Private Session',
  },
  {
    id: 'bk-2',
    therapist: 'Dr. Ahmed Ali',
    specialty: 'Child Neurologist',
    date: 'Mon 11',
    time: '11:00 AM',
    sessionType: 'Doctor Review',
  },
]

export const sessionWorkflowByRole = {
  doctor: {
    heading: 'Clinical session overview',
    description: 'Doctors review outcomes, approve treatment changes, and keep the care pathway aligned.',
    cards: [
      {
        title: 'Before the session',
        points: ['Review screening and progress reports', 'Confirm goals with therapist notes', 'Flag cases that need screening changes'],
      },
      {
        title: 'During the session cycle',
        points: ['Track outcomes from therapist delivery', 'Review parent observations', 'Adjust treatment plans when needed'],
      },
      {
        title: 'After the session',
        points: ['Approve next steps', 'Send summary to family and therapist', 'Prepare next review date'],
      },
    ],
  },
  therapist: {
    heading: 'Therapy session workflow',
    description: 'Therapists turn clinical goals into weekly plans, live sessions, and parent-ready notes.',
    cards: [
      {
        title: 'Before the session',
        points: ['Open the weekly plan', 'Check parent notes and doctor guidance', 'Prepare exercises for the child focus area'],
      },
      {
        title: 'During the session cycle',
        points: ['Run the session activities', 'Capture behavior and engagement', 'Mark progress against session goals'],
      },
      {
        title: 'After the session',
        points: ['Write session notes', 'Send parent guidance', 'Escalate concerns to the doctor when needed'],
      },
    ],
  },
  parent: {
    heading: 'Family session journey',
    description: 'Parents book sessions, add home notes, and stay connected with both therapist and doctor.',
    cards: [
      {
        title: 'Before the session',
        points: ['Check the weekly plan and booking slots', 'Add a note about the child’s mood or routine', 'Review the care recommendations'],
      },
      {
        title: 'During the session cycle',
        points: ['Join or attend the scheduled session', 'Follow therapist instructions', 'Track child comfort and response'],
      },
      {
        title: 'After the session',
        points: ['Read the therapist note', 'Message the doctor or therapist if needed', 'Log daily feedback for follow-up'],
      },
    ],
  },
}

export const liveSessionScenarios = {
  doctor: {
    title: 'Doctor review call',
    time: 'Today • 11:00 AM',
    sessionType: 'Clinical Follow-up',
    focus: 'Review therapist notes, parent concerns, and next treatment adjustment.',
    participants: [
      { id: 'doctor', name: 'Dr. Ahmed Mostafa', role: 'Doctor', status: 'speaking', tone: 'bg-blue-100 text-blue-700' },
      { id: 'therapist', name: 'Ther. Sara Ahmed', role: 'Therapist', status: 'connected', tone: 'bg-purple-100 text-purple-700' },
      { id: 'parent', name: 'Omar’s Parent', role: 'Parent', status: 'connected', tone: 'bg-emerald-100 text-emerald-700' },
      { id: 'child', name: 'Omar Ahmed', role: 'Child', status: 'observing', tone: 'bg-amber-100 text-amber-700' },
    ],
    checkpoints: [
      'Therapist summarizes the last session outcome.',
      'Parent shares changes noticed at home this week.',
      'Doctor confirms the next screening and treatment direction.',
    ],
  },
  therapist: {
    title: 'Therapy session room',
    time: 'Today • 09:00 AM',
    sessionType: 'Private Therapy Session',
    focus: 'Run the exercise, guide the parent, and record what the child tolerated well.',
    participants: [
      { id: 'therapist', name: 'Ther. Sara Ahmed', role: 'Therapist', status: 'speaking', tone: 'bg-purple-100 text-purple-700' },
      { id: 'parent', name: 'Omar’s Parent', role: 'Parent', status: 'connected', tone: 'bg-emerald-100 text-emerald-700' },
      { id: 'child', name: 'Omar Ahmed', role: 'Child', status: 'engaged', tone: 'bg-amber-100 text-amber-700' },
      { id: 'doctor', name: 'Dr. Ahmed Mostafa', role: 'Doctor', status: 'standby', tone: 'bg-blue-100 text-blue-700' },
    ],
    checkpoints: [
      'Start with the targeted exercise for joint attention.',
      'Record child response and comfort level live.',
      'Send a short handoff note to the doctor after the call.',
    ],
  },
  parent: {
    title: 'Family session room',
    time: 'Today • 09:00 AM',
    sessionType: 'Parent + Child Session',
    focus: 'Join the therapist, support the child, and keep communication open with the doctor when needed.',
    participants: [
      { id: 'parent', name: 'Omar’s Parent', role: 'Parent', status: 'speaking', tone: 'bg-emerald-100 text-emerald-700' },
      { id: 'child', name: 'Omar Ahmed', role: 'Child', status: 'engaged', tone: 'bg-amber-100 text-amber-700' },
      { id: 'therapist', name: 'Ther. Sara Ahmed', role: 'Therapist', status: 'connected', tone: 'bg-purple-100 text-purple-700' },
      { id: 'doctor', name: 'Dr. Ahmed Mostafa', role: 'Doctor', status: 'available', tone: 'bg-blue-100 text-blue-700' },
    ],
    checkpoints: [
      'Parent shares the child’s mood before starting.',
      'Therapist guides the live activity and observes engagement.',
      'Doctor can join or review the summary after the session.',
    ],
  },
}

export const connectedSessionTimeline = [
  {
    step: '1. Screening or progress trigger',
    owner: 'Parent and Doctor',
    detail: 'Questionnaire results, progress changes, or reports trigger a new review cycle.',
  },
  {
    step: '2. Plan alignment',
    owner: 'Doctor and Therapist',
    detail: 'The doctor confirms the care direction and the therapist turns it into weekly session goals.',
  },
  {
    step: '3. Booking and preparation',
    owner: 'Parent and Therapist',
    detail: 'The family books the session and adds context while the therapist prepares materials.',
  },
  {
    step: '4. Session delivery',
    owner: 'Therapist',
    detail: 'The therapist runs the session, tracks observations, and documents outcomes.',
  },
  {
    step: '5. Follow-up loop',
    owner: 'Doctor, Therapist, Parent',
    detail: 'Notes, messages, and treatment updates connect everyone before the next session.',
  },
]

export const resourceCollections = [
  {
    id: 'rs-1',
    title: 'Communication At Home',
    category: 'Parent Guide',
    format: 'PDF',
    description: 'Simple routines to support turn-taking, eye contact, and naming.',
  },
  {
    id: 'rs-2',
    title: 'Sensory Regulation Toolkit',
    category: 'Worksheet',
    format: 'Checklist',
    description: 'A practical checklist for spotting triggers and calming patterns.',
  },
  {
    id: 'rs-3',
    title: 'First Specialist Visit Prep',
    category: 'Video',
    format: 'Video',
    description: 'What to bring, what to ask, and how to summarize your child’s progress.',
  },
]

export const profileByRole = {
  doctor: {
    title: 'Doctor Profile',
    team: 'Clinical Review Team',
    fields: [
      ['Full Name', 'Dr. Ahmed Mostafa'],
      ['Specialty', 'Developmental Neurology'],
      ['License', 'MED-20419'],
      ['Years of Experience', '9 years'],
      ['Primary Focus', 'Autism screening and treatment planning'],
    ],
  },
  therapist: {
    title: 'Therapist Profile',
    team: 'Therapy Delivery Team',
    fields: [
      ['Full Name', 'Ther. Sara Ahmed'],
      ['Specialty', 'Behavior Therapy'],
      ['License', 'TH-10021'],
      ['Years of Experience', '6 years'],
      ['Primary Focus', 'Session notes, weekly plans, parent coaching'],
    ],
  },
  parent: {
    title: 'Parent Profile',
    team: 'Family Workspace',
    fields: [
      ['Parent Name', 'John Parent'],
      ['Child Name', 'Omar Ahmed'],
      ['Child Age', '6 years'],
      ['Primary Therapist', 'Ther. Amany Ebrahim'],
      ['Primary Doctor', 'Dr. Ahmed Ali'],
    ],
  },
}

export const settingsByRole = {
  doctor: {
    title: 'Doctor Settings',
    sections: [
      {
        title: 'Notifications',
        items: ['New report alerts', 'Screening reminders', 'Parent message notifications'],
      },
      {
        title: 'Clinical Defaults',
        items: ['Default report visibility', 'Plan approval workflow', 'Screening summary template'],
      },
    ],
  },
  therapist: {
    title: 'Therapist Settings',
    sections: [
      {
        title: 'Notifications',
        items: ['Daily session reminders', 'New parent messages', 'Pending notes alerts'],
      },
      {
        title: 'Session Workflow',
        items: ['Auto-save note drafts', 'Weekly plan reminders', 'Parent guidance prompts'],
      },
    ],
  },
  parent: {
    title: 'Parent Settings',
    sections: [
      {
        title: 'Notifications',
        items: ['Upcoming sessions', 'New doctor replies', 'Therapist guidance reminders'],
      },
      {
        title: 'Family Preferences',
        items: ['Daily log reminder time', 'Preferred contact method', 'Resource recommendations'],
      },
    ],
  },
}
