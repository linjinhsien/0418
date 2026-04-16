const en = {
  nav: {
    climbs: 'Climbs',
    dashboard: 'Dashboard',
    suggestions: 'Suggestions',
    profile: 'Profile',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    retry: 'Retry',
    loading: 'Loading...',
    error: 'Error',
  },
  climbForm: {
    title: 'Log a Climb',
    routeName: 'Route Name',
    grade: 'Grade',
    date: 'Date',
    location: 'Location (optional)',
    result: 'Result',
    notes: 'Notes (optional)',
    submit: 'Save Climb',
    sent: 'Sent',
    attempt: 'Attempt',
    validation: {
      required: 'This field is required',
      invalidDate: 'Please enter a valid date',
      gradeWarning: 'Unrecognised grade format — saved as freetext',
    },
  },
  climbList: {
    title: 'Climb History',
    empty: 'No climbs logged yet. Tap "Log a Climb" to get started!',
    sent: 'Sent',
    attempt: 'Attempt',
  },
  dashboard: {
    title: 'Dashboard',
    totalClimbs: 'Total Climbs',
    totalSends: 'Sends',
    totalAttempts: 'Attempts',
    gradeBreakdown: 'By Grade',
    empty: 'No data yet. Log some climbs to see your progress!',
  },
  suggestions: {
    title: 'AI Suggestions',
    maxGrade: 'Your Max Grade',
    style: 'Climbing Style',
    submit: 'Get Suggestions',
    offline: 'You are offline. Connect to the internet to get AI suggestions.',
    apiError: 'Could not reach the AI service. Please try again.',
    noHistory: 'Log at least one climb before requesting suggestions.',
    styles: {
      bouldering: 'Bouldering',
      sport: 'Sport',
      trad: 'Trad',
    },
  },
  profile: {
    title: 'Profile',
    name: 'Name',
    homeGym: 'Home Gym',
    climbingSince: 'Climbing Since',
    goals: 'Goals',
    save: 'Save Profile',
    empty: 'Fill in your profile to personalise your experience.',
  },
};

export default en;
export type TranslationKeys = typeof en;
