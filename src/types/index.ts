export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'skipped' | 'deferred';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type PomodoroPhase = 'focus' | 'short-break' | 'long-break';
export type AppTheme = 'dark-neon' | 'midnight' | 'amoled' | 'matrix' | 'minimal-dark';
export type PriorityTier = 'must-do' | 'should-do' | 'could-do';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  tier?: PriorityTier; // Section 55: Must do, Should do, Could do
  category: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedMinutes: number;
  difficulty: Difficulty;
  energyRequired: EnergyLevel;
  status: TaskStatus;
  isTop3?: boolean;
  recurring?: boolean;
  projectId?: string;
  goalId?: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  target: string;
  frequency: HabitFrequency;
  customDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  category: 'health' | 'study' | 'coding' | 'routine' | 'mind';
  color: string;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ['2026-09-15', ...]
  isCore?: boolean;
}

export interface TimeBlock {
  id: string;
  name: string;
  startTime: string; // '05:00'
  endTime: string;   // '08:30'
  label: string;
  activities: string[];
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  totalMinutes: number;
  confidence: number; // 0 - 100
  color: string;
  icon: string;
}

export interface AttendanceRecord {
  id: string;
  subjectName: string;
  code?: string;
  classesHeld: number;
  classesAttended: number;
  minimumTargetPercent: number; // default 75%
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  topics: string;
  difficulty: Difficulty;
  focusRating: number; // 1 - 5
  revisionNote?: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

export interface ExamDeadline {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'project' | 'presentation' | 'practical';
  subjectName: string;
  dueDate: string; // YYYY-MM-DD
  prepPercentage: number;
  notes?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  type: 'task' | 'bug' | 'feature';
  status: 'todo' | 'in-progress' | 'done';
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  status: 'planning' | 'development' | 'testing' | 'released';
  progress: number; // 0 - 100
  hoursInvested: number;
  minutesInvested: number;
  nextTask: string;
  milestones: ProjectMilestone[];
  items: ProjectItem[];
  githubUrl?: string;
  category: string;
}

export interface ExerciseLog {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface FitnessState {
  weeklySplit: Record<string, string>;
  todayWorkoutDone: boolean;
  todayWorkoutName: string;
  exercises: ExerciseLog[];
  pushupsToday: number;
  pullupsToday: number;
  plankSecondsToday: number;
  stepsToday: number;
}

export interface WaterState {
  currentGlasses: number;
  targetGlasses: number;
  glassMl: number;
}

export interface SleepState {
  bedtime: string;
  wakeTime: string;
  totalHours: number;
  quality: number; // 1 - 5
  consistencyScore: number; // 0 - 100
  targetHours: number; // default 7.5
  weeklyAverageHours: number; // e.g. 6.7
  notes?: string;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  category: 'Food' | 'Travel' | 'Education' | 'Subscriptions' | 'Shopping' | 'Phone/Internet' | 'Entertainment' | 'Other';
}

export interface DistractionLog {
  id: string;
  distraction: 'Social Media' | 'Gaming' | 'YouTube' | 'Browsing' | 'Chatting' | 'Procrastination' | 'Unplanned study' | 'Other';
  durationMinutes: number;
  note?: string;
  date: string;
  timestamp: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  category: 'Languages' | 'Core CS' | 'Tools & Systems' | 'Soft Skills';
  level: 'Beginner' | 'Learning' | 'Intermediate' | 'Advanced';
  confidencePercent: number;
}

export interface CareerItem {
  id: string;
  title: string;
  type: 'certification' | 'internship' | 'project' | 'resume' | 'interview_prep' | 'job_application';
  status: 'planning' | 'in_progress' | 'completed' | 'applied';
  date: string;
  linkOrNote?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Education' | 'Career' | 'Fitness' | 'Finance' | 'Personal' | 'Projects';
  deadlineMonths: number;
  progress: number;
  // Goal breakdown engine (Section 26)
  yearGoal: string;
  threeMonthGoal: string;
  monthGoal: string;
  weekGoal: string;
  todayAction: string;
  milestones: GoalMilestone[];
}

export interface JournalEntry {
  id: string;
  date: string;
  howWasToday: string;
  accomplishments: string;
  whatWentWrong: string;
  whatToDoDifferently: string;
  gratitude: string;
}

export interface DailyReflection {
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  energyPercent: 20 | 40 | 60 | 80 | 100;
  energy: EnergyLevel;
  screenTimeHours: number;
  wins: string;
  improvement: string;
  gratitude: string;
  whatAffectedYourDay?: string;
}

export interface FocusSessionLog {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  completed: boolean;
  focusRating?: number; // 1 - 5
  timestamp: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'College' | 'MultitaskCoder' | 'Idea';
}

export interface UserStats {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  currentStreak: number;
  bestStreak: number;
  streakProtectionsLeft: number;
  maxStreakProtections: number;
  focusScoreToday: number;
}

export interface AppData {
  user: UserStats;
  tasks: Task[];
  habits: Habit[];
  scheduleBlocks: TimeBlock[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  studySessions: StudySession[];
  exams: ExamDeadline[];
  projects: Project[];
  fitness: FitnessState;
  water: WaterState;
  sleep: SleepState;
  finances: {
    monthlyBudget: number;
    monthlySavingsTarget: number;
    transactions: FinanceTransaction[];
  };
  distractions: DistractionLog[];
  careerSkills: CareerSkill[];
  careerItems: CareerItem[];
  goals: Goal[];
  journalEntries: Record<string, JournalEntry>;
  reflections: Record<string, DailyReflection>;
  focusLogs: FocusSessionLog[];
  achievements: Achievement[];
  notes: QuickNote[];
  activeEnergy: EnergyLevel;
  energyPercent: 20 | 40 | 60 | 80 | 100;
  theme: AppTheme;
  recoveryModeActive: boolean;
  nightlyReviewCompletedDate?: string;
  dashboardWidgetOrder?: string[];
}
