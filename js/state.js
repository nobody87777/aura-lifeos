import { StorageEngine } from './storage.js';

/**
 * Robust Local Timezone Date Formatter (Section 83)
 * Avoids UTC boundary drift (e.g. IST +5:30 midnight issues).
 * @param {Date|number|string} date
 * @returns {string} YYYY-MM-DD
 */
export function getLocalDateString(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class AppState {
  constructor() {
    this.listeners = [];
    this.data = StorageEngine.load() || this.getDefaultState();
    
    // Ensure all state structures exist (migration safety)
    this.sanitizeLoadedData();

    // Execute daily automation check at startup (Section 82)
    this.checkDailyRollover();
  }

  sanitizeLoadedData() {
    const todayStr = getLocalDateString();
    if (!this.data.dailyHistory) this.data.dailyHistory = {};
    if (!this.data.lastActiveDate) this.data.lastActiveDate = todayStr;
    if (this.data.showLifeScore === undefined) this.data.showLifeScore = true;
    if (!this.data.homeSectionsVisibility) {
      this.data.homeSectionsVisibility = {
        score: true,
        top3: true,
        currentAction: true,
        habits: true,
        todayQuick: true,
        upcoming: true,
        blocks: true,
        goals: true
      };
    }
  }

  getDefaultState() {
    const todayStr = getLocalDateString();

    return {
      isFirstRun: typeof localStorage !== 'undefined' ? !localStorage.getItem('aura_setup_completed') : false,
      theme: 'dark-neon',
      recoveryModeActive: false,
      winTheDayActive: false,
      winTheDayCompleted: false,
      energyPercent: 80,
      activeEnergy: 'high', // 'high' | 'medium' | 'low'
      lastActiveDate: todayStr,
      showLifeScore: true,
      
      homeSectionsVisibility: {
        score: true,
        top3: true,
        currentAction: true,
        habits: true,
        todayQuick: true,
        upcoming: true,
        blocks: true,
        goals: true
      },

      dailyHistory: {},
      
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
        wakeTime: '05:30',
        sleepTargetHours: 7.5,
        collegeStart: '09:00',
        collegeEnd: '17:00'
      },

      tasks: [
        {
          id: 'task-1',
          title: 'Complete Java lesson & practice Exception Handling',
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
          isTop3: true
        },
        {
          id: 'task-2',
          title: 'Work on MultitaskCoder: Finish debugger module',
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
          isTop3: true
        },
        {
          id: 'task-3',
          title: 'Workout: Chest & Triceps gym session',
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
          status: 'todo'
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
          status: 'todo'
        }
      ],

      habits: [
        { id: 'h-wake', name: 'Wake up on time (05:30 AM)', target: 'Daily at 05:30 AM', category: 'routine', streak: 7, bestStreak: 21, completedDates: [todayStr], isCore: true },
        { id: 'h-water', name: 'Drink enough water (8 glasses)', target: '8 glasses / 2L', category: 'health', streak: 7, bestStreak: 14, completedDates: [todayStr], isCore: true },
        { id: 'h-study', name: 'Engineering study (45m+)', target: '45 mins minimum', category: 'study', streak: 6, bestStreak: 19, completedDates: [], isCore: true },
        { id: 'h-workout', name: 'Gym / Workout session', target: '45 mins workout', category: 'health', streak: 5, bestStreak: 14, completedDates: [], isCore: true },
        { id: 'h-multitask', name: 'Work on MultitaskCoder project', target: '30 mins active coding', category: 'coding', streak: 7, bestStreak: 18, completedDates: [], isCore: true },
        { id: 'h-sleep', name: 'Sleep on time (by 23:00 PM)', target: 'Wind down by 22:45', category: 'routine', streak: 4, bestStreak: 12, completedDates: [], isCore: true }
      ],

      scheduleBlocks: [
        { id: 'sb-1', name: 'MORNING', startTime: '05:00', endTime: '08:30', label: 'Wake, Water, Workout & Prep', activities: ['Wake up 05:30', 'Drink Water', 'Workout', 'Commute'] },
        { id: 'sb-2', name: 'COLLEGE', startTime: '09:00', endTime: '17:00', label: 'Academic Schedule & Practicals', activities: ['Lectures', 'Lab Practicals', 'Peer study'] },
        { id: 'sb-3', name: 'EVENING', startTime: '17:00', endTime: '21:00', label: 'Deep Study, MultitaskCoder & Gym', activities: ['Java/DSA', 'MultitaskCoder', 'Evening Gym'] },
        { id: 'sb-4', name: 'NIGHT', startTime: '21:00', endTime: '23:00', label: 'Review, Wind Down & Sleep Prep', activities: ['Reflection', 'Plan Tomorrow', 'Sleep by 23:00'] }
      ],

      subjects: [
        { id: 's-java', name: 'Java Programming', code: 'CE-302', totalMinutes: 620, confidence: 78 },
        { id: 's-python', name: 'Python & Scripting', code: 'CE-204', totalMinutes: 780, confidence: 85 },
        { id: 's-c', name: 'C & Systems Programming', code: 'CE-101', totalMinutes: 510, confidence: 80 },
        { id: 's-dsa', name: 'Data Structures & Algorithms', code: 'CE-301', totalMinutes: 690, confidence: 72 },
        { id: 's-web', name: 'Web Development', code: 'CE-305', totalMinutes: 940, confidence: 90 },
        { id: 's-dbms', name: 'Database Management Systems', code: 'CE-303', totalMinutes: 480, confidence: 75 },
        { id: 's-networks', name: 'Computer Networks', code: 'CE-304', totalMinutes: 340, confidence: 60 },
        { id: 's-os', name: 'Operating Systems', code: 'CE-306', totalMinutes: 410, confidence: 65 },
        { id: 's-micro', name: 'Microprocessors & IoT', code: 'CE-401', totalMinutes: 280, confidence: 55 },
        { id: 's-math', name: 'Engineering Mathematics', code: 'BS-102', totalMinutes: 360, confidence: 62 }
      ],

      attendance: [
        { id: 'att-1', subjectName: 'Java Programming', classesHeld: 48, classesAttended: 42, minimumTargetPercent: 75 },
        { id: 'att-2', subjectName: 'Computer Networks', classesHeld: 44, classesAttended: 36, minimumTargetPercent: 75 },
        { id: 'att-3', subjectName: 'Operating Systems', classesHeld: 42, classesAttended: 32, minimumTargetPercent: 75 },
        { id: 'att-4', subjectName: 'Data Structures Lab', classesHeld: 24, classesAttended: 22, minimumTargetPercent: 75 },
        { id: 'att-5', subjectName: 'Microprocessors & IoT', classesHeld: 40, classesAttended: 28, minimumTargetPercent: 75 }
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
          milestones: [
            { id: 'm1', title: 'Data layer & Local storage schemas', completed: true },
            { id: 'm2', title: 'Interactive Theory content engine', completed: true },
            { id: 'm3', title: 'Timed Quizzes with scoring', completed: true },
            { id: 'm4', title: 'Debugger step-through sandbox module', completed: false },
            { id: 'm5', title: 'Final UI neon-glass polish', completed: false },
            { id: 'm6', title: 'PWA offline caching & mobile testing', completed: false }
          ],
          items: [
            { id: 'i1', title: 'Debugger: Stack trace rendering logic', type: 'feature', status: 'in-progress' },
            { id: 'i2', title: 'Fix mobile navigation bar overflow on 360px', type: 'bug', status: 'in-progress' },
            { id: 'i3', title: 'Keyboard shortcut (Ctrl+Enter) to run debugger', type: 'feature', status: 'todo' }
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
        notes: 'Well rested, woke up naturally before alarm'
      },

      finances: {
        monthlyBudget: 6000,
        transactions: [
          { id: 'tx-1', date: todayStr, description: 'College Canteen Lunch & Tea', amount: 80, type: 'expense', category: 'Food' },
          { id: 'tx-2', date: todayStr, description: 'Bus commute travel pass', amount: 30, type: 'expense', category: 'Travel' },
          { id: 'tx-3', date: '2026-09-12', description: 'Domain renewal / Cloud dev hosting', amount: 450, type: 'expense', category: 'Subscriptions' }
        ]
      },

      distractions: [
        { id: 'dist-1', distraction: 'Social Media', durationMinutes: 25, note: 'Instagram reels between lectures', date: todayStr, timestamp: '13:40' }
      ],

      careerSkills: [
        { id: 'sk-1', name: 'Python', category: 'Languages', level: 'Advanced', confidencePercent: 85 },
        { id: 'sk-2', name: 'Java', category: 'Languages', level: 'Intermediate', confidencePercent: 78 },
        { id: 'sk-3', name: 'C Programming', category: 'Languages', level: 'Intermediate', confidencePercent: 80 },
        { id: 'sk-4', name: 'Git & GitHub', category: 'Tools & Systems', level: 'Advanced', confidencePercent: 88 },
        { id: 'sk-5', name: 'Web Development', category: 'Tools & Systems', level: 'Advanced', confidencePercent: 90 },
        { id: 'sk-6', name: 'Data Structures & Algorithms', category: 'Core CS', level: 'Intermediate', confidencePercent: 72 },
        { id: 'sk-7', name: 'Database & SQL', category: 'Core CS', level: 'Intermediate', confidencePercent: 75 }
      ],

      careerItems: [
        { id: 'ci-1', title: 'MultitaskCoder Flagship Dev Suite', type: 'project', status: 'in_progress', date: '2026-09-15', linkOrNote: 'Debugger module active' },
        { id: 'ci-2', title: 'Python for Beginners & Data Structures Cert', type: 'certification', status: 'completed', date: '2026-08-10' }
      ],

      goals: [
        {
          id: 'g-job-ready',
          title: 'Become Industry Job-Ready for Top IT Roles',
          category: 'Career',
          deadlineMonths: 12,
          progress: 42,
          yearGoal: 'Secure a high-impact Software Development Engineer role.',
          threeMonthGoal: 'Master Java + DSA basics and ship MultitaskCoder production v1.',
          monthGoal: 'Complete Binary Search, Linked Lists & Java Streams.',
          weekGoal: 'Study Arrays & complete 5 LeetCode problems.',
          todayAction: 'Solve 2 Binary Search problems and review Java Stream collectors.',
          milestones: [
            { id: 'gm-1', title: 'Build and deploy MultitaskCoder', completed: true },
            { id: 'gm-2', title: 'Complete 100 LeetCode questions', completed: false }
          ]
        }
      ],

      notes: [
        { id: 'n-1', title: 'Computer Networks Viva Questions', content: 'Subnet masks, 3-way TCP handshake, sliding window protocol.', date: todayStr, category: 'College' }
      ],

      studySessions: [
        {
          id: 'sess-1',
          subjectName: 'Python & Scripting',
          durationMinutes: 30,
          topics: 'List Comprehensions & Generators',
          difficulty: 'easy',
          focusRating: 5,
          revisionNote: 'Review yield vs return syntax differences',
          date: todayStr,
          timestamp: '14:30'
        }
      ],

      focusLogs: [
        { id: 'f-1', taskTitle: 'Python Generators Study', durationMinutes: 30, completed: true, focusRating: 5, timestamp: '14:30', date: todayStr }
      ],

      journalEntries: {},
      reflections: {},

      achievements: [
        { id: 'ach-1', title: '7 Day Streak', desc: 'Maintained unbroken consistency for a week', icon: '🔥', unlocked: true },
        { id: 'ach-2', title: '30 Day Titan', desc: 'Maintained 30 days of discipline', icon: '🏆', unlocked: false },
        { id: 'ach-3', title: '10 Study Blocks', desc: 'Completed 10 deep engineering study sessions', icon: '📚', unlocked: true },
        { id: 'ach-4', title: '25 Hours Coding', desc: 'Logged 25+ hours of software engineering', icon: '💻', unlocked: true },
        { id: 'ach-5', title: '10 Gym Workouts', desc: 'Crushed 10 physical training sessions', icon: '🏋️', unlocked: true },
        { id: 'ach-6', title: 'Hydration Master', desc: 'Hit 8 glasses of water 7 days in a row', icon: '💧', unlocked: true }
      ]
    };
  }

  // Daily Automation Protocol (Section 82 & 83)
  checkDailyRollover() {
    const todayStr = getLocalDateString();
    const lastActive = this.data.lastActiveDate;

    if (!lastActive) {
      this.data.lastActiveDate = todayStr;
      this.notify();
      return { isNewDay: false };
    }

    if (lastActive === todayStr) {
      return { isNewDay: false };
    }

    // A new calendar day has arrived!
    const previousDate = lastActive;
    const d = this.data;

    // 1. Preserve historical data for previousDate (Never lose yesterday's data)
    const prevScore = this.calculateDailyScore(previousDate);
    const prevCoreHabits = d.habits.filter(h => h.completedDates?.includes(previousDate)).length;
    const prevStudyMins = (d.studySessions || []).filter(s => s.date === previousDate).reduce((a, b) => a + b.durationMinutes, 0);
    const prevFocusMins = (d.focusLogs || []).filter(f => f.date === previousDate).reduce((a, b) => a + b.durationMinutes, 0);
    
    if (!d.dailyHistory) d.dailyHistory = {};
    d.dailyHistory[previousDate] = {
      date: previousDate,
      score: prevScore.total,
      breakdown: prevScore.breakdown,
      completedHabitsCount: prevCoreHabits,
      studyMinutes: prevStudyMins,
      focusMinutes: prevFocusMins,
      workoutDone: d.fitness?.todayWorkoutDone || false,
      waterGlasses: d.water?.currentGlasses || 0,
      recordedAt: new Date().toISOString()
    };

    // 2. Calculate Streaks & Psychological Streak Protections (Section 34 & 82)
    const hadActivity = prevCoreHabits > 0 || prevStudyMins > 0 || prevFocusMins > 0 || d.fitness?.todayWorkoutDone;
    let streakSaved = false;
    let streakIncreased = false;

    if (hadActivity) {
      d.user.currentStreak += 1;
      d.user.bestStreak = Math.max(d.user.bestStreak, d.user.currentStreak);
      streakIncreased = true;

      // Bonus shield rewarded every 7 days (max 3)
      if (d.user.currentStreak % 7 === 0 && d.user.streakProtectionsLeft < d.user.maxStreakProtections) {
        d.user.streakProtectionsLeft += 1;
      }
    } else {
      // User was inactive on previous date: evaluate streak protection shield
      if (d.user.streakProtectionsLeft > 0) {
        d.user.streakProtectionsLeft -= 1;
        streakSaved = true;
        // Streak remains protected!
      } else {
        // Fresh start without guilt
        d.user.currentStreak = 1;
      }
    }

    // 3. Reset Today's Containers (Section 82)
    if (d.water) d.water.currentGlasses = 0;
    if (d.fitness) {
      d.fitness.todayWorkoutDone = false;
      d.fitness.pushupsToday = 0;
      d.fitness.pullupsToday = 0;
      d.fitness.plankSecondsToday = 0;
    }
    d.winTheDayCompleted = false;

    // 4. Identify Overdue Tasks
    let overdueCount = 0;
    (d.tasks || []).forEach(t => {
      if (t.status !== 'completed' && t.dueDate && t.dueDate < todayStr) {
        t.isOverdue = true;
        overdueCount += 1;
      }
    });

    // 5. Generate Suggested Top 3 Tasks for Today (Section 82)
    this.ensureSuggestedTop3(todayStr);

    // 6. Award Daily Consistency XP (+20 XP)
    this.addXP(20, 'Daily Morning Rise');

    // 7. Update Last Active Date
    d.lastActiveDate = todayStr;
    this.notify();

    return {
      isNewDay: true,
      previousDate,
      streakSaved,
      streakIncreased,
      currentStreak: d.user.currentStreak,
      overdueCount
    };
  }

  ensureSuggestedTop3(todayStr) {
    const d = this.data;
    const currentTop3 = (d.tasks || []).filter(t => t.isTop3 && t.status !== 'completed');

    if (currentTop3.length < 3) {
      const candidates = (d.tasks || []).filter(t => t.status !== 'completed' && !t.isTop3);
      for (const t of candidates) {
        if (currentTop3.length >= 3) break;
        t.isTop3 = true;
        t.dueDate = todayStr;
        currentTop3.push(t);
      }
    }
  }

  rollOverdueTasksToToday() {
    const todayStr = getLocalDateString();
    let count = 0;
    this.update(d => {
      (d.tasks || []).forEach(t => {
        if (t.status !== 'completed' && t.dueDate && t.dueDate < todayStr) {
          t.dueDate = todayStr;
          t.isOverdue = false;
          count += 1;
        }
      });
    });
    return count;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    StorageEngine.save(this.data);
    this.listeners.forEach(fn => fn(this.data));
  }

  update(fn) {
    fn(this.data);
    this.notify();
  }

  addXP(amount, _reason = '') {
    this.update(data => {
      let newXP = data.user.xp + amount;
      let newLevel = data.user.level;
      let newXPToNext = data.user.xpToNextLevel;

      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = Math.round(newXPToNext * 1.35);
      }

      const titles = [
        'Novice Student', 'Code Apprentice', 'Syntax Warrior',
        'Algorithm Knight', 'System Architect', 'Tech Overlord', 'Engineering Legend'
      ];

      data.user.level = newLevel;
      data.user.xp = newXP;
      data.user.xpToNextLevel = newXPToNext;
      data.user.title = titles[Math.min(titles.length - 1, newLevel - 1)];
    });
  }

  // Combined Holistic Life Score (Section 85)
  calculateLifeScore(forDate = null) {
    const dateStr = forDate || getLocalDateString();
    const d = this.data;

    // 1. Focus (15 max)
    const focusMins = (d.focusLogs || []).filter(f => f.date === dateStr).reduce((a, b) => a + b.durationMinutes, 0);
    const focusScore = Math.min(15, Math.round((focusMins / 50) * 15));

    // 2. Study (20 max)
    const studyMins = (d.studySessions || []).filter(s => s.date === dateStr).reduce((a, b) => a + b.durationMinutes, 0);
    const studyScore = Math.min(20, Math.round((studyMins / 60) * 20));

    // 3. Health (15 max: water + sleep + workout)
    let healthScore = 0;
    if (d.water?.currentGlasses >= 6) healthScore += 5;
    else if (d.water?.currentGlasses >= 3) healthScore += 3;
    if (d.fitness?.todayWorkoutDone) healthScore += 6;
    if (d.sleep?.totalHours >= 6.5) healthScore += 4;
    healthScore = Math.min(15, healthScore);

    // 4. Habits (20 max)
    const coreHabits = d.habits.filter(h => h.isCore);
    const completedCore = coreHabits.filter(h => h.completedDates?.includes(dateStr)).length;
    const habitsScore = coreHabits.length > 0 ? Math.round((completedCore / coreHabits.length) * 20) : 15;

    // 5. Tasks (10 max)
    const todayTasks = (d.tasks || []).filter(t => t.dueDate === dateStr);
    const doneTasks = todayTasks.filter(t => t.status === 'completed').length;
    const tasksScore = todayTasks.length > 0 ? Math.min(10, Math.round((doneTasks / todayTasks.length) * 10)) : 8;

    // 6. Goals (10 max)
    const goalsScore = 10;

    // 7. Finance Discipline (5 max)
    const todayExpenses = (d.finances?.transactions || []).filter(t => t.date === dateStr && t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const financeScore = todayExpenses < 300 ? 5 : todayExpenses < 600 ? 3 : 2;

    // 8. Sleep Consistency (5 max)
    const sleepDiff = Math.abs((d.sleep?.totalHours || 7) - (d.sleep?.targetHours || 7.5));
    const sleepConsistencyScore = sleepDiff <= 1 ? 5 : 3;

    const total = Math.min(100, focusScore + studyScore + healthScore + habitsScore + tasksScore + goalsScore + financeScore + sleepConsistencyScore);

    // Supportive zero-guilt message (Section 88)
    let guidance = 'Today still counts. One task at a time.';
    if (total >= 85) guidance = 'Peak harmony. Operating at high flow.';
    else if (total >= 70) guidance = 'Solid momentum. Building steady discipline.';
    else if (total >= 50) guidance = 'Building rhythm. Every small action moves the needle.';
    else guidance = 'Reset. Take a deep breath. Focus on your next small step.';

    return {
      total,
      guidance,
      breakdown: [
        { label: 'Engineering Study', points: studyScore, max: 20 },
        { label: 'Core Habits', points: habitsScore, max: 20 },
        { label: 'Deep Focus & Pomodoro', points: focusScore, max: 15 },
        { label: 'Health & Training', points: healthScore, max: 15 },
        { label: 'Task Execution', points: tasksScore, max: 10 },
        { label: 'Strategic Goals', points: goalsScore, max: 10 },
        { label: 'Finance Discipline', points: financeScore, max: 5 },
        { label: 'Sleep Consistency', points: sleepConsistencyScore, max: 5 }
      ]
    };
  }

  calculateDailyScore(forDate = null) {
    const targetDate = forDate || getLocalDateString();
    const d = this.data;

    const coreHabits = d.habits.filter(h => h.isCore);
    const completedCore = coreHabits.filter(h => h.completedDates?.includes(targetDate)).length;
    const habitPoints = coreHabits.length > 0 ? Math.round((completedCore / coreHabits.length) * 20) : 15;

    const todayStudyMinutes = (d.studySessions || [])
      .filter(s => s.date === targetDate)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    const studyPoints = Math.min(20, Math.round((todayStudyMinutes / 60) * 20));

    const todayFocusMinutes = (d.focusLogs || [])
      .filter(f => f.date === targetDate)
      .reduce((acc, f) => acc + f.durationMinutes, 0);
    const focusPoints = Math.min(15, Math.round((todayFocusMinutes / 50) * 15));

    let fitnessPoints = d.fitness?.todayWorkoutDone ? 12 : 0;
    if ((d.fitness?.pushupsToday || 0) >= 20 || (d.fitness?.pullupsToday || 0) >= 5) {
      fitnessPoints = Math.min(15, fitnessPoints + 5);
    }

    const sleepPoints = Math.min(10, Math.round(((d.sleep?.quality || 4) / 5) * 5 + ((d.sleep?.totalHours || 7) >= 6.5 ? 5 : 2)));

    const todayTasks = (d.tasks || []).filter(t => t.dueDate === targetDate);
    const completedTasks = todayTasks.filter(t => t.status === 'completed');
    const taskPoints = todayTasks.length > 0 ? Math.min(10, Math.round((completedTasks.length / todayTasks.length) * 10)) : 8;

    const goalPoints = 10;
    const total = Math.min(100, habitPoints + studyPoints + focusPoints + fitnessPoints + sleepPoints + taskPoints + goalPoints);

    return {
      total,
      breakdown: [
        { label: 'Core Habits', points: habitPoints, max: 20 },
        { label: 'Engineering Study', points: studyPoints, max: 20 },
        { label: 'Deep Focus & Pomodoro', points: focusPoints, max: 15 },
        { label: 'Gym & Calisthenics', points: fitnessPoints, max: 15 },
        { label: 'Sleep & Recovery', points: sleepPoints, max: 10 },
        { label: 'Daily Tasks & Top 3', points: taskPoints, max: 10 },
        { label: 'Projects & Goals', points: goalPoints, max: 10 }
      ]
    };
  }
}

export const appState = new AppState();
