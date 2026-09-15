import React from 'react';
import { useApp } from '../context/AppContext';
import { DailyPlanTimeline } from '../components/DailyPlanTimeline';
import {
  Zap,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Droplets,
  Moon,
  Dumbbell,
  ArrowRight,
  Flame,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

interface HomeScreenProps {
  onOpenSmartAction: () => void;
  onOpenScoreBreakdown: () => void;
  onStartFocus: (title: string, durationMinutes: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenSmartAction,
  onOpenScoreBreakdown,
  onStartFocus,
  onNavigateTab
}) => {
  const {
    data,
    toggleTaskStatus,
    toggleHabitToday,
    addWaterGlass,
    toggleTodayWorkout,
    calculateDailyScore
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const scoreInfo = calculateDailyScore();

  // Top 3 tasks
  const top3Tasks = data.tasks.filter((t) => t.isTop3).slice(0, 3);

  // Core habits
  const coreHabits = data.habits.filter((h) => h.isCore);

  // Weekly calendar bar (Monday through Sunday)
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Convert Sun=0 to Mon=0 index

  // Focus score calculation
  const totalFocusMinutes = data.focusLogs
    .filter((f) => f.date === todayStr)
    .reduce((acc, f) => acc + f.durationMinutes, 0);
  const focusScore = Math.min(100, Math.round((totalFocusMinutes / 60) * 100)) || 72;

  // Completion % calculation
  const todayTasks = data.tasks.filter((t) => t.dueDate === todayStr);
  const completedTodayTasks = todayTasks.filter((t) => t.status === 'completed');
  const completionPercent = todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 68;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      
      {/* 1. Horizontal Weekly Calendar Row */}
      <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-4 w-full justify-between">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayDayIndex;
            const isPast = idx < todayDayIndex;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-cyan-500/25 to-cyan-500/10 border border-cyan-400/50 shadow-md shadow-cyan-500/10 scale-105'
                    : isPast
                    ? 'bg-slate-900/60 border border-white/5'
                    : 'bg-transparent text-slate-500'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold uppercase ${isToday ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {day}
                </span>
                <span className={`text-sm sm:text-base font-bold font-mono my-0.5 ${isToday ? 'text-white' : 'text-slate-300'}`}>
                  {15 - todayDayIndex + idx}
                </span>
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isToday ? 'bg-cyan-400 animate-pulse' : isPast ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Primary Smart Decision & Performance Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main "⚡ WHAT SHOULD I DO NOW?" Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#0d1424] to-[#0a182e] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-3">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>DECISION FATIGUE SHIELD</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Focus on the <span className="text-gradient-cyan">few things</span> that actually matter today.
              </h2>
              
              <p className="text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
                You don't need to juggle 25 chaotic tasks. Let the intelligence engine analyze your Kerala college schedule, energy level, and diploma goals to give you <strong>one exact next step</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenSmartAction}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2.5 active:scale-95 transition-all glow-cyan"
              >
                <Zap className="w-4 h-4 fill-current text-white" />
                <span>WHAT SHOULD I DO NOW?</span>
              </button>

              <button
                onClick={() => onStartFocus('Java Streams Deep Focus Block', 25)}
                className="px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Quick 25m Focus</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Score & Metrics Card */}
        <div
          onClick={onOpenScoreBreakdown}
          className="cursor-pointer glass-card rounded-3xl p-6 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                DAILY SCORE
              </span>
              <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Breakdown <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black font-mono text-white tracking-tight">
                {scoreInfo.total}
              </span>
              <span className="text-slate-500 text-xl font-mono">/ 100</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Based on habits (+{scoreInfo.breakdown[0].points}), study (+{scoreInfo.breakdown[1].points}), focus (+{scoreInfo.breakdown[2].points}), fitness (+{scoreInfo.breakdown[3].points}), and tasks.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Today's Focus Score</span>
              <span className="font-mono font-bold text-cyan-300">{focusScore}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Daily Completion</span>
              <span className="font-mono font-bold text-emerald-400">{completionPercent}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Streak Status</span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> {data.user.currentStreak} Days (Protected)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Today's Top 3 & Core Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Today's Top 3 Priority Items */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  FOCUS ON 3
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Today's Top 3</h3>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
            >
              View All Tasks →
            </button>
          </div>

          <div className="space-y-3">
            {top3Tasks.map((task, idx) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-950/40 border-emerald-500/20 text-slate-400 opacity-80'
                      : 'bg-slate-900/70 border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {task.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                      </div>

                      <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => onStartFocus(task.title, task.estimatedMinutes)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/30 flex items-center gap-1 transition-all"
                        title="Start Focus Mode on this task"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>FOCUS</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Habits Quick Check */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  DAILY MOMENTUM
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Core Habits</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {coreHabits.filter((h) => h.completedDates.includes(todayStr)).length} / {coreHabits.length} Done
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {coreHabits.map((habit) => {
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitToday(habit.id)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/50 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-slate-600 bg-slate-950'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isDone ? 'text-emerald-100' : 'text-slate-200'}`}>
                        {habit.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        🔥 {habit.streak}d streak
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Daily Plan Schedule Block */}
      <DailyPlanTimeline />

      {/* 5. Quick Health & Routine Mini-Trackers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Large Water Tracker Widget */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
              <Droplets className="w-4 h-4" />
              WATER INTAKE
            </span>
            <span className="text-xs font-mono text-slate-400">
              {data.water.currentGlasses * data.water.glassMl}ml / 2000ml
            </span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <span className="text-3xl font-black font-mono text-cyan-300">
              {data.water.currentGlasses} <span className="text-slate-500 text-lg font-normal">/ {data.water.targetGlasses} glasses</span>
            </span>
            <button
              onClick={addWaterGlass}
              className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>+1 Glass</span>
            </button>
          </div>

          {/* Visual glasses dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: data.water.targetGlasses }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < data.water.currentGlasses
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Last Night Sleep Widget */}
        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              LAST NIGHT SLEEP
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              {data.sleep.consistencyScore}% consistent
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-purple-300">
              {data.sleep.totalHours}h
            </span>
            <span className="text-slate-400 text-xs font-mono">
              ({data.sleep.bedtime} → {data.sleep.wakeTime})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quality Rating: {'⭐'.repeat(data.sleep.quality)}</span>
            <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{data.sleep.notes}</span>
          </div>
        </div>

        {/* Fitness Mini Counters Widget */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4" />
              FITNESS QUICK
            </span>
            <button
              onClick={toggleTodayWorkout}
              className={`text-xs font-mono px-2 py-0.5 rounded border transition-all ${
                data.fitness.todayWorkoutDone
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {data.fitness.todayWorkoutDone ? 'Workout Done ✓' : '+ Log Workout'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2 text-center">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">PUSHUPS</span>
              <span className="text-lg font-bold font-mono text-emerald-300">{data.fitness.pushupsToday}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">PULLUPS</span>
              <span className="text-lg font-bold font-mono text-emerald-300">{data.fitness.pullupsToday}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">PLANK</span>
              <span className="text-lg font-bold font-mono text-emerald-300">2m 10s</span>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 truncate">
            Today: <strong>{data.fitness.weeklySplit[new Date().toLocaleDateString('en-US', { weekday: 'long' })] || 'Chest Day'}</strong>
          </p>
        </div>

      </div>

    </div>
  );
};
