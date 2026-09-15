import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppData,
  Task,
  Habit,
  TimeBlock,
  Subject,
  AttendanceRecord,
  StudySession,
  ExamDeadline,
  Project,
  FitnessState,
  WaterState,
  SleepState,
  FinanceTransaction,
  DistractionLog,
  CareerSkill,
  CareerItem,
  Goal,
  JournalEntry,
  DailyReflection,
  FocusSessionLog,
  Achievement,
  QuickNote,
  UserStats,
  EnergyLevel,
  AppTheme
} from '../types';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundGenerator';

const STORAGE_KEY = 'aura_life_os_data_v2';

const DEFAULT_SCHEDULE: TimeBlock[] = [
  {
    id: 'block-morning',
    name: 'MORNING',
    startTime: '05:00',
    endTime: '08:30',
    label: 'Wake, Water, Workout & Prep',
    activities: ['Wake up 05:30', 'Drink Water', 'Workout/Stretching', 'Breakfast', 'Commute to College'],
    color: '#06b6d4'
  },
  {
    id: 'block-college',
    name: 'COLLEGE',
    startTime: '09:00',
    endTime: '17:00',
    label: 'Academic Schedule & Practicals',
    activities: ['Computer Engineering Lectures', 'Practical Lab Sessions', 'Peer Discussion', 'Canteen Lunch'],
    color: '#8b5cf6'
  },
  {
    id: 'block-evening',
    name: 'EVENING',
    startTime: '17:00',
    endTime: '21:00',
    label: 'Deep Study, MultitaskCoder & Gym',
    activities: ['Java / DSA Coding', 'MultitaskCoder Development', 'Evening Gym Workout', 'Personal Development'],
    color: '#10b981'
  },
  {
    id: 'block-night',
    name: 'NIGHT',
    startTime: '21:00',
    endTime: '23:00',
    label: 'Review, Wind Down & Sleep Prep',
    activities: ['Daily Reflection', 'Prepare Tomorrow Plan', 'Reading / Relaxation', 'Sleep by 23:00'],
    color: '#f59e0b'
  }
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'subj-java', name: 'Java Programming', code: 'CE-302', totalMinutes: 620, confidence: 78, color: '#f59e0b', icon: 'Coffee' },
  { id: 'subj-python', name: 'Python & Scripting', code: 'CE-204', totalMinutes: 780, confidence: 85, color: '#38bdf8', icon: 'Code' },
  { id: 'subj-c', name: 'C & Systems Programming', code: 'CE-101', totalMinutes: 510, confidence: 80, color: '#94a3b8', icon: 'Cpu' },
  { id: 'subj-dsa', name: 'Data Structures & Algorithms', code: 'CE-301', totalMinutes: 690, confidence: 72, color: '#a855f7', icon: 'Layers' },
  { id: 'subj-web', name: 'Web Development', code: 'CE-305', totalMinutes: 940, confidence: 90, color: '#10b981', icon: 'Globe' },
  { id: 'subj-dbms', name: 'Database Management Systems', code: 'CE-303', totalMinutes: 480, confidence: 75, color: '#ec4899', icon: 'Database' },
  { id: 'subj-networks', name: 'Computer Networks', code: 'CE-304', totalMinutes: 340, confidence: 60, color: '#ef4444', icon: 'Network' },
  { id: 'subj-os', name: 'Operating Systems', code: 'CE-306', totalMinutes: 410, confidence: 65, color: '#6366f1', icon: 'Terminal' },
  { id: 'subj-micro', name: 'Microprocessors & IoT', code: 'CE-401', totalMinutes: 280, confidence: 55, color: '#14b8a6', icon: 'Chip' },
  { id: 'subj-math', name: 'Engineering Mathematics', code: 'BS-102', totalMinutes: 360, confidence: 62, color: '#eab308', icon: 'Sigma' }
];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', subjectName: 'Java Programming', code: 'CE-302', classesHeld: 48, classesAttended: 42, minimumTargetPercent: 75 },
  { id: 'att-2', subjectName: 'Computer Networks', code: 'CE-304', classesHeld: 44, classesAttended: 36, minimumTargetPercent: 75 },
  { id: 'att-3', subjectName: 'Operating Systems', code: 'CE-306', classesHeld: 42, classesAttended: 32, minimumTargetPercent: 75 },
  { id: 'att-4', subjectName: 'Data Structures Lab', code: 'CE-301L', classesHeld: 24, classesAttended: 22, minimumTargetPercent: 75 },
  { id: 'att-5', subjectName: 'Microprocessors & IoT', code: 'CE-401', classesHeld: 40, classesAttended: 28, minimumTargetPercent: 75 }
];

const DEFAULT_CAREER_SKILLS: CareerSkill[] = [
  { id: 'sk-1', name: 'Python', category: 'Languages', level: 'Advanced', confidencePercent: 85 },
  { id: 'sk-2', name: 'Java', category: 'Languages', level: 'Intermediate', confidencePercent: 78 },
  { id: 'sk-3', name: 'C Programming', category: 'Languages', level: 'Intermediate', confidencePercent: 80 },
  { id: 'sk-4', name: 'Git & GitHub', category: 'Tools & Systems', level: 'Advanced', confidencePercent: 88 },
  { id: 'sk-5', name: 'Web Development (React, HTML/CSS)', category: 'Tools & Systems', level: 'Advanced', confidencePercent: 90 },
  { id: 'sk-6', name: 'Database & SQL', category: 'Core CS', level: 'Intermediate', confidencePercent: 75 },
  { id: 'sk-7', name: 'Data Structures & Algorithms', category: 'Core CS', level: 'Intermediate', confidencePercent: 72 },
  { id: 'sk-8', name: 'Computer Networks', category: 'Core CS', level: 'Intermediate', confidencePercent: 62 },
  { id: 'sk-9', name: 'AI & Machine Learning Foundations', category: 'Tools & Systems', level: 'Learning', confidencePercent: 50 },
  { id: 'sk-10', name: 'Communication & Teamwork', category: 'Soft Skills', level: 'Intermediate', confidencePercent: 75 },
  { id: 'sk-11', name: 'Problem Solving & Debugging', category: 'Soft Skills', level: 'Advanced', confidencePercent: 82 }
];

const DEFAULT_CAREER_ITEMS: CareerItem[] = [
  { id: 'ci-1', title: 'MultitaskCoder Flagship Dev Suite', type: 'project', status: 'in_progress', date: '2026-09-15', linkOrNote: 'GitHub repo active, debugger module in development' },
  { id: 'ci-2', title: 'Python for Beginners & Data Structures Cert', type: 'certification', status: 'completed', date: '2026-08-10', linkOrNote: 'Verified course certificate' },
  { id: 'ci-3', title: 'Resume: Tech Intern & Junior Dev Version', type: 'resume', status: 'completed', date: '2026-09-01', linkOrNote: 'Tailored for Kerala tech startups and Bangalore intern roles' },
  { id: 'ci-4', title: 'Technical Interview Preparation (STAR & DSA)', type: 'interview_prep', status: 'in_progress', date: '2026-09-12', linkOrNote: 'LeetCode top 50 array & string problems' }
];

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'g-job-ready',
    title: 'Become Industry Job-Ready for High-Growth Tech Roles',
    category: 'Career',
    deadlineMonths: 12,
    progress: 42,
    yearGoal: 'Secure a high-impact Software Development Engineer / Fullstack role.',
    threeMonthGoal: 'Master Java + DSA basics and ship MultitaskCoder production v1.0.',
    monthGoal: 'Complete Binary Search, Linked Lists & Java Streams.',
    weekGoal: 'Study Arrays & complete 5 LeetCode problems.',
    todayAction: 'Solve 2 Binary Search problems and review Java Stream collectors.',
    milestones: [
      { id: 'gm-1', title: 'Build and deploy MultitaskCoder', completed: true },
      { id: 'gm-2', title: 'Complete 100 LeetCode DSA questions', completed: false },
      { id: 'gm-3', title: 'Publish tech articles on Computer Networks', completed: false },
      { id: 'gm-4', title: 'Clear 3 mock technical interviews', completed: false }
    ]
  },
  {
    id: 'g-fitness',
    title: 'Build Consistent Athletic Physique & Endurance',
    category: 'Fitness',
    deadlineMonths: 6,
    progress: 60,
    yearGoal: 'Maintain 5-day workout consistency and hit 50 pushups/15 pullups clean form.',
    threeMonthGoal: 'Bench press 70kg and run 5km in under 26 mins.',
    monthGoal: 'Zero missed weekday workout sessions.',
    weekGoal: 'Hit all 5 split days (Chest, Back, Shoulders, Arms, Legs).',
    todayAction: 'Complete Chest & Triceps session + 25 pushups.',
    milestones: [
      { id: 'gmf-1', title: '30 consecutive days of workout tracking', completed: true },
      { id: 'gmf-2', title: '15 clean deadhang pullups', completed: false }
    ]
  }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: '7 Day Streak', desc: 'Maintained unbroken consistency for a week', icon: 'Flame', unlocked: true, unlockedAt: '2026-09-15' },
  { id: 'ach-2', title: '30 Day Titan', desc: 'Maintained 30 days of discipline', icon: 'Trophy', unlocked: false },
  { id: 'ach-3', title: '10 Study Blocks', desc: 'Completed 10 deep engineering study sessions', icon: 'BookOpen', unlocked: true, unlockedAt: '2026-09-14' },
  { id: 'ach-4', title: '25 Hours Coding', desc: 'Logged 25+ hours of software engineering', icon: 'Code', unlocked: true, unlockedAt: '2026-09-12' },
  { id: 'ach-5', title: '10 Gym Workouts', desc: 'Crushed 10 intense physical training sessions', icon: 'Dumbbell', unlocked: true, unlockedAt: '2026-09-13' },
  { id: 'ach-6', title: 'Hydration Master', desc: 'Hit 8 glasses of water 7 days in a row', icon: 'Droplets', unlocked: true, unlockedAt: '2026-09-15' },
  { id: 'ach-7', title: 'Century Club', desc: 'Completed 100 tasks on your queue', icon: 'CheckCircle2', unlocked: false },
  { id: 'ach-8', title: 'Mindful Evening', desc: 'Logged 7 consecutive nightly reviews', icon: 'Moon', unlocked: true, unlockedAt: '2026-09-15' }
];

const getInitialData = (): AppData => {
  const todayStr = new Date().toISOString().split('T')[0];

  const defaultHabits: Habit[] = [
    { id: 'h-wake', name: 'Wake up on time (05:30 AM)', icon: 'Sunrise', target: 'Daily at 05:30 AM', frequency: 'daily', category: 'routine', color: '#f59e0b', streak: 7, bestStreak: 21, completedDates: [todayStr], isCore: true },
    { id: 'h-water', name: 'Drink enough water (8 glasses)', icon: 'Droplets', target: '8 glasses / 2L', frequency: 'daily', category: 'health', color: '#06b6d4', streak: 7, bestStreak: 14, completedDates: [todayStr], isCore: true },
    { id: 'h-study', name: 'Engineering study (45m+)', icon: 'BookOpen', target: '45 mins minimum', frequency: 'daily', category: 'study', color: '#a855f7', streak: 6, bestStreak: 19, completedDates: [], isCore: true },
    { id: 'h-workout', name: 'Gym / Workout session', icon: 'Dumbbell', target: '45 mins workout', frequency: 'weekdays', category: 'health', color: '#10b981', streak: 5, bestStreak: 14, completedDates: [], isCore: true },
    { id: 'h-multitask', name: 'Work on MultitaskCoder project', icon: 'Laptop', target: '30 mins active coding', frequency: 'daily', category: 'coding', color: '#38bdf8', streak: 7, bestStreak: 18, completedDates: [], isCore: true },
    { id: 'h-sleep', name: 'Sleep on time (by 23:00 PM)', icon: 'Moon', target: 'Wind down by 22:45', frequency: 'daily', category: 'routine', color: '#818cf8', streak: 4, bestStreak: 12, completedDates: [], isCore: true }
  ];

  const defaultTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Study Java Streams & Exception Handling',
      description: 'Focus on stream map, filter, collect, and custom checked exceptions',
      priority: 'critical',
      tier: 'must-do',
      category: 'College',
      dueDate: todayStr,
      dueTime: '18:30',
      estimatedMinutes: 45,
      difficulty: 'medium',
      energyRequired: 'high',
      status: 'todo',
      isTop3: true,
      goalId: 'subj-java'
    },
    {
      id: 'task-2',
      title: 'MultitaskCoder: Finish debugger module',
      description: 'Implement step-in / step-over execution pointer logic',
      priority: 'high',
      tier: 'must-do',
      category: 'MultitaskCoder',
      dueDate: todayStr,
      dueTime: '20:00',
      estimatedMinutes: 40,
      difficulty: 'hard',
      energyRequired: 'high',
      status: 'in-progress',
      isTop3: true,
      projectId: 'proj-multitaskcoder'
    },
    {
      id: 'task-3',
      title: 'Gym: Chest & Triceps workout',
      description: 'Bench press 4x8, Incline dumbbell 3x10, Dips 3x12',
      priority: 'high',
      tier: 'should-do',
      category: 'Fitness',
      dueDate: todayStr,
      dueTime: '17:30',
      estimatedMinutes: 50,
      difficulty: 'medium',
      energyRequired: 'high',
      status: 'todo',
      isTop3: true
    },
    {
      id: 'task-4',
      title: 'Computer Networks: Review OSI 7 Layers & TCP/IP',
      description: 'Prepare revision notes for upcoming semester exam',
      priority: 'medium',
      tier: 'should-do',
      category: 'College',
      dueDate: todayStr,
      estimatedMinutes: 30,
      difficulty: 'medium',
      energyRequired: 'medium',
      status: 'todo',
      goalId: 'subj-networks'
    },
    {
      id: 'task-5',
      title: 'Solve 2 DSA problems on LeetCode (Binary Search)',
      description: 'Clean recursion and iterative binary search implementations',
      priority: 'medium',
      tier: 'could-do',
      category: 'Coding',
      dueDate: todayStr,
      estimatedMinutes: 35,
      difficulty: 'medium',
      energyRequired: 'medium',
      status: 'todo',
      goalId: 'subj-dsa'
    }
  ];

  return {
    user: {
      name: 'Diploma Engineer',
      level: 4,
      xp: 1420,
      xpToNextLevel: 2000,
      title: 'Algorithm Knight',
      currentStreak: 7,
      bestStreak: 21,
      streakProtectionsLeft: 2,
      maxStreakProtections: 3,
      focusScoreToday: 78
    },
    tasks: defaultTasks,
    habits: defaultHabits,
    scheduleBlocks: DEFAULT_SCHEDULE,
    subjects: DEFAULT_SUBJECTS,
    attendance: DEFAULT_ATTENDANCE,
    studySessions: [
      {
        id: 'sess-1',
        subjectId: 'subj-python',
        subjectName: 'Python & Scripting',
        durationMinutes: 30,
        topics: 'List Comprehensions & Generator Functions',
        difficulty: 'easy',
        focusRating: 5,
        revisionNote: 'Review yield vs return syntax differences',
        date: todayStr,
        timestamp: '14:30'
      }
    ],
    exams: [
      {
        id: 'exam-cn',
        title: 'Computer Networks Semester Exam',
        type: 'exam',
        subjectName: 'Computer Networks',
        dueDate: new Date(Date.now() + 27 * 86400000).toISOString().split('T')[0],
        prepPercentage: 42,
        notes: 'Focus on Subnetting, Routing algorithms (Dijkstra, Bellman-Ford), and TCP flow control'
      }
    ],
    projects: [
      {
        id: 'proj-multitaskcoder',
        name: 'MultitaskCoder',
        tagline: 'Flagship Developer Productivity & Learning Suite',
        status: 'development',
        progress: 72,
        hoursInvested: 31,
        minutesInvested: 20,
        nextTask: 'Fix mobile navigation overflow & polish debugger module',
        category: 'Full-Stack / Tooling',
        githubUrl: 'https://github.com/jamun/MultitaskCoder',
        milestones: [
          { id: 'm1', title: 'Data layer & Local storage schemas', completed: true },
          { id: 'm2', title: 'Interactive Theory content engine', completed: true },
          { id: 'm3', title: 'Timed Quizzes with scoring', completed: true },
          { id: 'm4', title: 'Debugger step-through sandbox module', completed: false },
          { id: 'm5', title: 'Final UI neon-glass aesthetic polish', completed: false },
          { id: 'm6', title: 'PWA offline caching & mobile testing', completed: false },
          { id: 'm7', title: 'Production release & deployment', completed: false }
        ],
        items: [
          { id: 'i1', title: 'Debugger: Handle stack trace rendering for nested calls', type: 'feature', status: 'in-progress' },
          { id: 'i2', title: 'Fix mobile bottom bar overflow on smaller screens', type: 'bug', status: 'in-progress' },
          { id: 'i3', title: 'Add keyboard shortcut (Ctrl+Enter) to run debugger code', type: 'feature', status: 'todo' }
        ]
      }
    ],
    fitness: {
      weeklySplit: {
        Monday: 'Chest & Triceps',
        Tuesday: 'Back & Biceps',
        Wednesday: 'Shoulders & Traps',
        Thursday: 'Arms & Forearms',
        Friday: 'Legs & Calves',
        Saturday: 'Core & Cardio',
        Sunday: 'Rest & Recovery'
      },
      todayWorkoutDone: false,
      todayWorkoutName: 'Chest & Triceps',
      exercises: [
        { id: 'ex-1', name: 'Barbell Bench Press', sets: 4, reps: 8, weightKg: 55 },
        { id: 'ex-2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weightKg: 18 }
      ],
      pushupsToday: 25,
      pullupsToday: 5,
      plankSecondsToday: 130,
      stepsToday: 6400
    },
    water: {
      currentGlasses: 5,
      targetGlasses: 8,
      glassMl: 250
    },
    sleep: {
      bedtime: '23:30',
      wakeTime: '06:15',
      totalHours: 6.75,
      quality: 4,
      consistencyScore: 84,
      targetHours: 7.5,
      weeklyAverageHours: 6.7,
      notes: 'Felt well rested, woke up naturally right before alarm'
    },
    finances: {
      monthlyBudget: 6000,
      monthlySavingsTarget: 1500,
      transactions: [
        { id: 'tx-1', date: todayStr, description: 'College Canteen Lunch & Tea', amount: 80, type: 'expense', category: 'Food' },
        { id: 'tx-2', date: todayStr, description: 'Bus commute travel pass', amount: 30, type: 'expense', category: 'Travel' },
        { id: 'tx-3', date: '2026-09-12', description: 'Domain renewal / Cloud dev hosting', amount: 450, type: 'expense', category: 'Subscriptions' }
      ]
    },
    distractions: [
      { id: 'dist-1', distraction: 'Social Media', durationMinutes: 25, note: 'Scrolled Instagram reels between lectures', date: todayStr, timestamp: '13:40' },
      { id: 'dist-2', distraction: 'YouTube', durationMinutes: 40, note: 'Tech podcast detour', date: todayStr, timestamp: '15:10' }
    ],
    careerSkills: DEFAULT_CAREER_SKILLS,
    careerItems: DEFAULT_CAREER_ITEMS,
    goals: DEFAULT_GOALS,
    journalEntries: {},
    reflections: {
      [todayStr]: {
        date: todayStr,
        mood: 'good',
        energyPercent: 80,
        energy: 'high',
        screenTimeHours: 4.2,
        wins: 'Made solid progress on college lab practical and maintained hydration.',
        improvement: 'Stay off social media during afternoon college breaks.',
        gratitude: 'Grateful for good health, family support, and learning tech every day.',
        whatAffectedYourDay: 'Good morning workout energized the day.'
      }
    },
    focusLogs: [
      { id: 'f-1', taskTitle: 'Python Generators Study', durationMinutes: 30, completed: true, focusRating: 5, timestamp: '14:30', date: todayStr }
    ],
    achievements: DEFAULT_ACHIEVEMENTS,
    notes: [
      { id: 'n-1', title: 'Computer Networks Viva Questions', content: 'Subnet masks, 3-way TCP handshake, sliding window protocol.', date: todayStr, category: 'College' },
      { id: 'n-2', title: 'MultitaskCoder Architecture Idea', content: 'Add offline IndexedDB worker to handle large code quizzes seamlessly.', date: todayStr, category: 'MultitaskCoder' }
    ],
    activeEnergy: 'high',
    energyPercent: 80,
    theme: 'dark-neon',
    recoveryModeActive: false
  };
};

interface AppContextType {
  data: AppData;
  // Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  suggestTaskTime: (estimatedMinutes: number, priority: string) => string;
  // Habits
  toggleHabitToday: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  // Gamification & XP
  addXP: (amount: number, reason?: string) => void;
  useStreakProtection: () => void;
  // Focus & Deep work
  logFocusSession: (session: Omit<FocusSessionLog, 'id'>) => void;
  // Study
  logStudySession: (session: Omit<StudySession, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  // Attendance
  markAttendance: (subjectId: string, attended: boolean) => void;
  // Career & Skills
  updateCareerSkill: (id: string, level: CareerSkill['level'], confidencePercent: number) => void;
  addCareerItem: (item: Omit<CareerItem, 'id'>) => void;
  // Goals
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  // Distraction
  logDistraction: (distraction: DistractionLog['distraction'], durationMinutes: number, note?: string) => void;
  // Projects
  updateProjectProgress: (projectId: string, progress: number, hoursInvested?: number) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  addProjectItem: (projectId: string, item: Omit<Project['items'][0], 'id'>) => void;
  toggleProjectItem: (projectId: string, itemId: string) => void;
  // Fitness & Health
  addWaterGlass: () => void;
  resetWater: () => void;
  setWaterTarget: (target: number) => void;
  updateSleep: (sleep: Partial<SleepState>) => void;
  updateFitnessCounters: (updates: Partial<FitnessState>) => void;
  toggleTodayWorkout: () => void;
  // Finances
  addTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  // Notes & Journal
  addNote: (note: Omit<QuickNote, 'id' | 'date'>) => void;
  deleteNote: (id: string) => void;
  saveJournal: (date: string, entry: JournalEntry) => void;
  saveReflection: (date: string, reflection: DailyReflection) => void;
  // System State & Modes
  setEnergyLevel: (energy: EnergyLevel, percent?: 20 | 40 | 60 | 80 | 100) => void;
  toggleRecoveryMode: () => void;
  setTheme: (theme: AppTheme) => void;
  updateScheduleBlock: (id: string, updates: Partial<TimeBlock>) => void;
  // Score calculator
  calculateDailyScore: () => { total: number; breakdown: { label: string; points: number; max: number }[] };
  // Data management
  exportDataJSON: () => string;
  exportCSV: (type: 'expenses' | 'study' | 'habits' | 'workouts') => string;
  importDataJSON: (jsonStr: string) => boolean;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load stored state', e);
    }
    return getInitialData();
  });

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, [data]);

  // Apply active theme class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark-neon', 'theme-midnight', 'theme-amoled', 'theme-matrix', 'theme-minimal-dark');
    root.classList.add(`theme-${data.theme || 'dark-neon'}`);
  }, [data.theme]);

  // Daily score calculation
  const calculateDailyScore = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Core Habits (Max 20 pts)
    const coreHabits = data.habits.filter(h => h.isCore);
    const completedCore = coreHabits.filter(h => h.completedDates.includes(todayStr)).length;
    const habitPoints = coreHabits.length > 0 ? Math.round((completedCore / coreHabits.length) * 20) : 15;

    // 2. Study Tracking (Max 20 pts)
    const todayStudyMinutes = data.studySessions
      .filter(s => s.date === todayStr)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    const studyPoints = Math.min(20, Math.round((todayStudyMinutes / 60) * 20));

    // 3. Focus & Deep Work (Max 15 pts)
    const todayFocusMinutes = data.focusLogs
      .filter(f => f.date === todayStr)
      .reduce((acc, f) => acc + f.durationMinutes, 0);
    const focusPoints = Math.min(15, Math.round((todayFocusMinutes / 50) * 15));

    // 4. Fitness / Exercise (Max 15 pts)
    let fitnessPoints = data.fitness.todayWorkoutDone ? 12 : 0;
    if (data.fitness.pushupsToday >= 20 || data.fitness.pullupsToday >= 5 || data.fitness.plankSecondsToday >= 60) {
      fitnessPoints = Math.min(15, fitnessPoints + 5);
    }

    // 5. Sleep Quality & Consistency (Max 10 pts)
    const sleepPoints = Math.min(10, Math.round((data.sleep.quality / 5) * 5 + (data.sleep.totalHours >= 6.5 ? 5 : 2)));

    // 6. Tasks Completed (Max 10 pts)
    const completedTodayTasks = data.tasks.filter(t => t.status === 'completed' && t.dueDate === todayStr).length;
    const totalTodayTasks = data.tasks.filter(t => t.dueDate === todayStr).length;
    const taskPoints = totalTodayTasks > 0 ? Math.min(10, Math.round((completedTodayTasks / totalTodayTasks) * 10)) : 8;

    // 7. Personal Goals / MultitaskCoder (Max 10 pts)
    const projectActive = data.projects.some(p => p.progress > 0);
    const goalPoints = projectActive ? 10 : 5;

    const total = Math.min(100, habitPoints + studyPoints + focusPoints + fitnessPoints + sleepPoints + taskPoints + goalPoints);

    return {
      total,
      breakdown: [
        { label: 'Core Habits', points: habitPoints, max: 20 },
        { label: 'Engineering Study', points: studyPoints, max: 20 },
        { label: 'Deep Focus & Pomodoro', points: focusPoints, max: 15 },
        { label: 'Workout & Physical', points: fitnessPoints, max: 15 },
        { label: 'Sleep & Recovery', points: sleepPoints, max: 10 },
        { label: 'Daily Tasks & Top 3', points: taskPoints, max: 10 },
        { label: 'Projects & Goals', points: goalPoints, max: 10 }
      ]
    };
  };

  const addXP = (amount: number, reason?: string) => {
    setData(prev => {
      let newXP = prev.user.xp + amount;
      let newLevel = prev.user.level;
      let newXPToNext = prev.user.xpToNextLevel;
      let leveledUp = false;

      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = Math.round(newXPToNext * 1.35);
        leveledUp = true;
      }

      if (leveledUp) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        soundEngine.playChime();
      }

      const titles = [
        'Novice Student',
        'Code Apprentice',
        'Syntax Warrior',
        'Algorithm Knight',
        'System Architect',
        'Tech Overlord',
        'Engineering Legend'
      ];
      const newTitle = titles[Math.min(titles.length - 1, newLevel - 1)];

      return {
        ...prev,
        user: {
          ...prev.user,
          level: newLevel,
          xp: newXP,
          xpToNextLevel: newXPToNext,
          title: newTitle
        }
      };
    });
  };

  // Section 56: Task Auto-scheduling deterministic engine
  const suggestTaskTime = (estimatedMinutes: number, priority: string): string => {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    // College hours: 09:00 - 17:00
    if (isWeekday && currentHour < 17) {
      // Propose evening slots
      if (priority === 'critical' || priority === 'high') {
        return '17:30';
      } else {
        return '19:00';
      }
    } else if (currentHour >= 17 && currentHour < 21) {
      const nextSlotMinutes = (now.getMinutes() > 30 ? 60 : 30);
      const targetHour = currentHour + (now.getMinutes() > 30 ? 1 : 0);
      return `${String(targetHour).padStart(2, '0')}:${String(nextSlotMinutes % 60).padStart(2, '0')}`;
    } else {
      // Tomorrow morning or evening
      return '17:30';
    }
  };

  const toggleTaskStatus = (id: string) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      const isNowCompleted = task.status !== 'completed';
      const newStatus = isNowCompleted ? 'completed' : 'todo';

      if (isNowCompleted) {
        soundEngine.playChime();
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }

      return {
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === id
            ? { ...t, status: newStatus, completedAt: isNowCompleted ? new Date().toISOString() : undefined }
            : t
        )
      };
    });

    addXP(15, 'Task Completed');
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    soundEngine.playClick();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const toggleHabitToday = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setData(prev => {
      const habit = prev.habits.find(h => h.id === id);
      if (!habit) return prev;
      const isCompleted = habit.completedDates.includes(todayStr);

      let newCompletedDates: string[];
      let newStreak = habit.streak;

      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== todayStr);
        newStreak = Math.max(0, newStreak - 1);
      } else {
        newCompletedDates = [...habit.completedDates, todayStr];
        newStreak = newStreak + 1;
        soundEngine.playClick();
      }

      const bestStreak = Math.max(habit.bestStreak, newStreak);

      return {
        ...prev,
        habits: prev.habits.map(h =>
          h.id === id
            ? { ...h, completedDates: newCompletedDates, streak: newStreak, bestStreak }
            : h
        )
      };
    });

    addXP(10, 'Habit Logged');
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      completedDates: []
    };
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
  };

  const useStreakProtection = () => {
    setData(prev => {
      if (prev.user.streakProtectionsLeft <= 0) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          streakProtectionsLeft: prev.user.streakProtectionsLeft - 1
        }
      };
    });
  };

  const logFocusSession = (sessionData: Omit<FocusSessionLog, 'id'>) => {
    const newLog: FocusSessionLog = {
      ...sessionData,
      id: `f-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      focusLogs: [newLog, ...prev.focusLogs]
    }));

    addXP(20, 'Focus Session Finished');
  };

  const logStudySession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `study-${Date.now()}`
    };

    setData(prev => {
      const updatedSubjects = prev.subjects.map(s => {
        if (s.name.toLowerCase() === sessionData.subjectName.toLowerCase() || s.id === sessionData.subjectId) {
          return {
            ...s,
            totalMinutes: s.totalMinutes + sessionData.durationMinutes,
            confidence: Math.min(100, s.confidence + 1)
          };
        }
        return s;
      });

      let updatedTasks = prev.tasks;
      if (sessionData.revisionNote && sessionData.revisionNote.trim().length > 0) {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const revisionTask: Task = {
          id: `task-rev-${Date.now()}`,
          title: `Revise ${sessionData.subjectName}: ${sessionData.revisionNote}`,
          description: `Auto-generated spaced repetition reminder from study session on ${sessionData.topics}`,
          priority: 'medium',
          category: 'College',
          dueDate: tomorrow,
          estimatedMinutes: 15,
          difficulty: sessionData.difficulty,
          energyRequired: 'low',
          status: 'todo'
        };
        updatedTasks = [revisionTask, ...updatedTasks];
      }

      return {
        ...prev,
        subjects: updatedSubjects,
        studySessions: [newSession, ...prev.studySessions],
        tasks: updatedTasks
      };
    });

    addXP(25, 'Study Session Completed');
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `subj-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
  };

  // Section 39: Attendance tracking
  const markAttendance = (subjectId: string, attended: boolean) => {
    setData(prev => ({
      ...prev,
      attendance: prev.attendance.map(a => {
        if (a.id === subjectId || a.subjectName.toLowerCase() === subjectId.toLowerCase()) {
          return {
            ...a,
            classesHeld: a.classesHeld + 1,
            classesAttended: attended ? a.classesAttended + 1 : a.classesAttended
          };
        }
        return a;
      })
    }));
    soundEngine.playClick();
  };

  // Section 24: Career & Skills
  const updateCareerSkill = (id: string, level: CareerSkill['level'], confidencePercent: number) => {
    setData(prev => ({
      ...prev,
      careerSkills: prev.careerSkills.map(sk =>
        sk.id === id ? { ...sk, level, confidencePercent } : sk
      )
    }));
  };

  const addCareerItem = (item: Omit<CareerItem, 'id'>) => {
    const newItem: CareerItem = { ...item, id: `ci-${Date.now()}` };
    setData(prev => ({
      ...prev,
      careerItems: [newItem, ...prev.careerItems]
    }));
  };

  // Section 25 & 26: Goals & Goal Breakdown Engine
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goal, id: `g-${Date.now()}` };
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    addXP(50, 'Goal Created');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const updated = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completed = updated.filter(m => m.completed).length;
        const prog = Math.round((completed / updated.length) * 100);
        return { ...g, milestones: updated, progress: prog };
      })
    }));
    addXP(25, 'Milestone Finished');
  };

  // Section 22: Distraction logging
  const logDistraction = (distraction: DistractionLog['distraction'], durationMinutes: number, note?: string) => {
    const now = new Date();
    const newDistraction: DistractionLog = {
      id: `dist-${Date.now()}`,
      distraction,
      durationMinutes,
      note,
      date: now.toISOString().split('T')[0],
      timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setData(prev => ({
      ...prev,
      distractions: [newDistraction, ...prev.distractions]
    }));
  };

  // Projects
  const updateProjectProgress = (projectId: string, progress: number, hoursInvested?: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, progress, hoursInvested: hoursInvested !== undefined ? hoursInvested : p.hoursInvested }
          : p
      )
    }));
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const autoProgress = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...p,
          milestones: updatedMilestones,
          progress: autoProgress
        };
      })
    }));
    soundEngine.playClick();
  };

  const addProjectItem = (projectId: string, itemData: Omit<Project['items'][0], 'id'>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const newItem = { ...itemData, id: `item-${Date.now()}` };
        return {
          ...p,
          items: [...p.items, newItem]
        };
      })
    }));
  };

  const toggleProjectItem = (projectId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          items: p.items.map(item =>
            item.id === itemId ? { ...item, status: item.status === 'done' ? 'todo' : 'done' } : item
          )
        };
      })
    }));
  };

  // Water & Fitness
  const addWaterGlass = () => {
    setData(prev => {
      const nextGlasses = prev.water.currentGlasses + 1;
      soundEngine.playClick();
      if (nextGlasses === prev.water.targetGlasses) {
        confetti({ particleCount: 40, spread: 60 });
        soundEngine.playChime();
      }
      return {
        ...prev,
        water: { ...prev.water, currentGlasses: nextGlasses }
      };
    });
    addXP(5, 'Hydration');
  };

  const resetWater = () => {
    setData(prev => ({
      ...prev,
      water: { ...prev.water, currentGlasses: 0 }
    }));
  };

  const setWaterTarget = (target: number) => {
    setData(prev => ({
      ...prev,
      water: { ...prev.water, targetGlasses: target }
    }));
  };

  const updateSleep = (sleepUpdates: Partial<SleepState>) => {
    setData(prev => ({
      ...prev,
      sleep: { ...prev.sleep, ...sleepUpdates }
    }));
  };

  const updateFitnessCounters = (updates: Partial<FitnessState>) => {
    setData(prev => ({
      ...prev,
      fitness: { ...prev.fitness, ...updates }
    }));
  };

  const toggleTodayWorkout = () => {
    setData(prev => {
      const nextDone = !prev.fitness.todayWorkoutDone;
      if (nextDone) {
        confetti({ particleCount: 50, spread: 60 });
        soundEngine.playChime();
      }
      return {
        ...prev,
        fitness: { ...prev.fitness, todayWorkoutDone: nextDone }
      };
    });
    addXP(30, 'Workout Logged');
  };

  // Finances
  const addTransaction = (tx: Omit<FinanceTransaction, 'id'>) => {
    const newTx: FinanceTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        transactions: [newTx, ...prev.finances.transactions]
      }
    }));
    soundEngine.playClick();
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        transactions: prev.finances.transactions.filter(t => t.id !== id)
      }
    }));
  };

  // Notes & Journal
  const addNote = (note: Omit<QuickNote, 'id' | 'date'>) => {
    const newNote: QuickNote = {
      ...note,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const saveJournal = (date: string, entry: JournalEntry) => {
    setData(prev => ({
      ...prev,
      journalEntries: {
        ...prev.journalEntries,
        [date]: entry
      }
    }));
    addXP(20, 'Journal Entry Logged');
  };

  const saveReflection = (date: string, reflection: DailyReflection) => {
    setData(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [date]: reflection
      }
    }));
    addXP(20, 'Daily Reflection Completed');
  };

  // Modes & Settings
  const setEnergyLevel = (energy: EnergyLevel, percent?: 20 | 40 | 60 | 80 | 100) => {
    setData(prev => ({
      ...prev,
      activeEnergy: energy,
      energyPercent: percent || (energy === 'high' ? 80 : energy === 'medium' ? 60 : 40)
    }));
  };

  // Section 34: Recovery Mode
  const toggleRecoveryMode = () => {
    setData(prev => {
      const next = !prev.recoveryModeActive;
      if (next) soundEngine.playClick();
      return { ...prev, recoveryModeActive: next };
    });
  };

  // Section 49: Theme system
  const setTheme = (theme: AppTheme) => {
    setData(prev => ({ ...prev, theme }));
  };

  const updateScheduleBlock = (id: string, updates: Partial<TimeBlock>) => {
    setData(prev => ({
      ...prev,
      scheduleBlocks: prev.scheduleBlocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  // Section 47: Export CSV
  const exportCSV = (type: 'expenses' | 'study' | 'habits' | 'workouts'): string => {
    if (type === 'expenses') {
      const headers = 'Date,Description,Amount,Type,Category\n';
      const rows = data.finances.transactions.map(t => `"${t.date}","${t.description}",${t.amount},"${t.type}","${t.category}"`).join('\n');
      return headers + rows;
    } else if (type === 'study') {
      const headers = 'Date,Subject,DurationMinutes,Topics,Difficulty,FocusRating,RevisionNote\n';
      const rows = data.studySessions.map(s => `"${s.date}","${s.subjectName}",${s.durationMinutes},"${s.topics}","${s.difficulty}",${s.focusRating},"${s.revisionNote || ''}"`).join('\n');
      return headers + rows;
    } else if (type === 'habits') {
      const headers = 'HabitName,Category,Target,Streak,BestStreak,CompletedCount\n';
      const rows = data.habits.map(h => `"${h.name}","${h.category}","${h.target}",${h.streak},${h.bestStreak},${h.completedDates.length}`).join('\n');
      return headers + rows;
    } else {
      const headers = 'WorkoutDone,Pushups,Pullups,PlankSeconds,Steps\n';
      return headers + `${data.fitness.todayWorkoutDone},${data.fitness.pushupsToday},${data.fitness.pullupsToday},${data.fitness.plankSecondsToday},${data.fitness.stepsToday}`;
    }
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.user && parsed.tasks) {
        setData(parsed);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const resetToSampleData = () => {
    const sample = getInitialData();
    setData(sample);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        suggestTaskTime,
        toggleHabitToday,
        addHabit,
        addXP,
        useStreakProtection,
        logFocusSession,
        logStudySession,
        addSubject,
        markAttendance,
        updateCareerSkill,
        addCareerItem,
        addGoal,
        updateGoal,
        toggleGoalMilestone,
        logDistraction,
        updateProjectProgress,
        toggleProjectMilestone,
        addProjectItem,
        toggleProjectItem,
        addWaterGlass,
        resetWater,
        setWaterTarget,
        updateSleep,
        updateFitnessCounters,
        toggleTodayWorkout,
        addTransaction,
        deleteTransaction,
        addNote,
        deleteNote,
        saveJournal,
        saveReflection,
        setEnergyLevel,
        toggleRecoveryMode,
        setTheme,
        updateScheduleBlock,
        calculateDailyScore,
        exportDataJSON,
        exportCSV,
        importDataJSON,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
