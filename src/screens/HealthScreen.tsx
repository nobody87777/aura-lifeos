import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Droplets,
  Moon,
  Dumbbell,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  Flame,
  RotateCcw
} from 'lucide-react';

export const HealthScreen: React.FC = () => {
  const {
    data,
    addWaterGlass,
    resetWater,
    setWaterTarget,
    updateFitnessCounters,
    toggleTodayWorkout,
    updateSleep
  } = useApp();

  // Exercise log form
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState(3);
  const [exerciseReps, setExerciseReps] = useState(10);
  const [exerciseWeight, setExerciseWeight] = useState(20);

  // Sleep logger form state
  const [sleepBedtime, setSleepBedtime] = useState(data.sleep.bedtime);
  const [sleepWakeTime, setSleepWakeTime] = useState(data.sleep.wakeTime);
  const [sleepQuality, setSleepQuality] = useState(data.sleep.quality);
  const [sleepNotes, setSleepNotes] = useState(data.sleep.notes || '');
  const [isEditingSleep, setIsEditingSleep] = useState(false);

  // Water calculation
  const totalWaterMl = data.water.currentGlasses * data.water.glassMl;
  const targetWaterMl = data.water.targetGlasses * data.water.glassMl;
  const waterPercent = Math.min(100, Math.round((data.water.currentGlasses / data.water.targetGlasses) * 100));

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    // compute duration from bedtime & waketime
    const [bH, bM] = sleepBedtime.split(':').map(Number);
    const [wH, wM] = sleepWakeTime.split(':').map(Number);
    let diffMins = (wH * 60 + wM) - (bH * 60 + bM);
    if (diffMins < 0) diffMins += 24 * 60;
    const hours = Math.round((diffMins / 60) * 10) / 10;

    updateSleep({
      bedtime: sleepBedtime,
      wakeTime: sleepWakeTime,
      totalHours: hours,
      quality: sleepQuality,
      notes: sleepNotes
    });
    setIsEditingSleep(false);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    const newEx = {
      id: `ex-${Date.now()}`,
      name: exerciseName.trim(),
      sets: Number(exerciseSets),
      reps: Number(exerciseReps),
      weightKg: Number(exerciseWeight)
    };

    updateFitnessCounters({
      exercises: [...data.fitness.exercises, newEx]
    });

    setExerciseName('');
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            VITALITY & WELLNESS
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Health, Fitness & Recovery</h2>
        <p className="text-xs text-slate-400">
          Peak mental performance requires a strong physical foundation. Keep habits frictionless.
        </p>
      </div>

      {/* 1. Large Visual Water Tracker */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              HYDRATION ENGINE
            </span>

            <h3 className="text-3xl sm:text-4xl font-black font-mono text-white">
              {data.water.currentGlasses}{' '}
              <span className="text-slate-500 text-xl font-normal">
                / {data.water.targetGlasses} glasses
              </span>
            </h3>

            <p className="text-sm font-mono text-cyan-300">
              {totalWaterMl} ml logged of {targetWaterMl} ml daily target ({waterPercent}%)
            </p>

            <p className="text-xs text-slate-400 max-w-md">
              Tap anywhere on a glass or use the quick buttons below. Keeps your brain energized for long coding sessions.
            </p>
          </div>

          {/* Interactive Glasses Bar */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              {Array.from({ length: data.water.targetGlasses }).map((_, i) => {
                const filled = i < data.water.currentGlasses;
                return (
                  <button
                    key={i}
                    onClick={addWaterGlass}
                    className={`w-10 sm:w-12 h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-end p-1 transition-all transform active:scale-95 ${
                      filled
                        ? 'bg-gradient-to-t from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-lg shadow-cyan-500/30 scale-105'
                        : 'bg-slate-900/80 border border-white/10 hover:border-cyan-500/40'
                    }`}
                    title={`Glass #${i + 1}`}
                  >
                    <Droplets className={`w-4 h-4 mb-1 ${filled ? 'text-white' : 'text-slate-600'}`} />
                    <span className={`text-[10px] font-mono font-bold ${filled ? 'text-white' : 'text-slate-500'}`}>
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={addWaterGlass}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1.5 glow-cyan"
              >
                <Plus className="w-4 h-4" />
                <span>Drink Glass (+250ml)</span>
              </button>

              <button
                onClick={resetWater}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                title="Reset water count"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Sleep Tracker & Last Night Summary */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Sleep Architecture & Recovery</h3>
          </div>
          <button
            onClick={() => setIsEditingSleep(!isEditingSleep)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-mono text-xs border border-purple-500/30 self-start sm:self-auto"
          >
            {isEditingSleep ? 'Close Editor' : 'Log Last Night Sleep'}
          </button>
        </div>

        {isEditingSleep ? (
          <form onSubmit={handleSaveSleep} className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-mono text-slate-400 mb-1">Bedtime</label>
                <input
                  type="time"
                  value={sleepBedtime}
                  onChange={(e) => setSleepBedtime(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-400 mb-1">Wake Time</label>
                <input
                  type="time"
                  value={sleepWakeTime}
                  onChange={(e) => setSleepWakeTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-400 mb-1">Sleep Quality (1-5)</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl glass-input"
                >
                  <option value={5}>5 - Completely Recharged ⚡</option>
                  <option value={4}>4 - Well Rested 👍</option>
                  <option value={3}>3 - Average Sleep</option>
                  <option value={2}>2 - Woke Up Tired</option>
                  <option value={1}>1 - Broken / Poor Sleep</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-slate-400 text-xs mb-1">Sleep Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Slept without phone, woke up refreshed"
                value={sleepNotes}
                onChange={(e) => setSleepNotes(e.target.value)}
                className="w-full p-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs"
              >
                Save Sleep Log
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">TOTAL SLEEP</span>
              <span className="text-2xl font-black font-mono text-purple-300 mt-1 block">
                {data.sleep.totalHours} hrs
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {data.sleep.bedtime} → {data.sleep.wakeTime}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">QUALITY SCORE</span>
              <div className="flex items-center gap-1 text-amber-400 mt-1 text-lg">
                {Array.from({ length: data.sleep.quality }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Deep recovery</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">ROUTINE CONSISTENCY</span>
              <span className="text-2xl font-black font-mono text-cyan-300 mt-1 block">
                {data.sleep.consistencyScore}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">Bedtime consistency</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block">LAST NIGHT NOTES</span>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {data.sleep.notes || 'No notes logged'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Fitness System & Weekly Workout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Split Planner */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              WEEKLY SPLIT
            </span>
            <span className="text-xs font-mono text-slate-400">Gym Blueprint</span>
          </div>

          <div className="space-y-2">
            {days.map((d) => {
              const isToday = d === todayDayName;
              const split = data.fitness.weeklySplit[d] || 'Rest';
              return (
                <div
                  key={d}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isToday
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isToday ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {d}
                    </span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-400 text-black">
                        TODAY
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {split}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <button
              onClick={toggleTodayWorkout}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                data.fitness.todayWorkoutDone
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{data.fitness.todayWorkoutDone ? 'Workout Completed Today (+30 XP)' : 'Mark Today’s Workout Done'}</span>
            </button>
          </div>
        </div>

        {/* Mini Fitness Counters (Pushups, Pullups, Plank, Steps) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              DAILY CALISTHENICS & MINI TRACKERS
            </span>
            <span className="text-xs font-mono text-slate-400">100% Offline Logging</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Pushups */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">PUSHUPS</span>
              <span className="text-3xl font-black font-mono text-emerald-300 my-1 block">
                {data.fitness.pushupsToday}
              </span>
              <div className="flex justify-center gap-1 mt-2">
                <button
                  onClick={() => updateFitnessCounters({ pushupsToday: Math.max(0, data.fitness.pushupsToday - 5) })}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateFitnessCounters({ pushupsToday: data.fitness.pushupsToday + 5 })}
                  className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pullups */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">PULLUPS</span>
              <span className="text-3xl font-black font-mono text-emerald-300 my-1 block">
                {data.fitness.pullupsToday}
              </span>
              <div className="flex justify-center gap-1 mt-2">
                <button
                  onClick={() => updateFitnessCounters({ pullupsToday: Math.max(0, data.fitness.pullupsToday - 1) })}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateFitnessCounters({ pullupsToday: data.fitness.pullupsToday + 1 })}
                  className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Plank */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">PLANK SECONDS</span>
              <span className="text-3xl font-black font-mono text-emerald-300 my-1 block">
                {data.fitness.plankSecondsToday}s
              </span>
              <div className="flex justify-center gap-1 mt-2">
                <button
                  onClick={() => updateFitnessCounters({ plankSecondsToday: Math.max(0, data.fitness.plankSecondsToday - 15) })}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateFitnessCounters({ plankSecondsToday: data.fitness.plankSecondsToday + 15 })}
                  className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">DAILY STEPS</span>
              <span className="text-2xl font-black font-mono text-emerald-300 my-1.5 block">
                {data.fitness.stepsToday.toLocaleString()}
              </span>
              <div className="flex justify-center gap-1 mt-2">
                <button
                  onClick={() => updateFitnessCounters({ stepsToday: data.fitness.stepsToday + 500 })}
                  className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold"
                >
                  +500
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Log Form */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-300 font-bold">
              LOG SPECIFIC EXERCISE SETS
            </h4>

            <form onSubmit={handleAddExercise} className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="col-span-2 sm:col-span-2">
                <input
                  type="text"
                  placeholder="Exercise (e.g. Incline DB Press)"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Sets"
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(Number(e.target.value))}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Reps"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(Number(e.target.value))}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                >
                  Add Set
                </button>
              </div>
            </form>

            {/* Exercise Set List */}
            <div className="space-y-1.5 pt-2">
              {data.fitness.exercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 text-xs">
                  <span className="font-semibold text-white">{ex.name}</span>
                  <span className="font-mono text-emerald-400">
                    {ex.sets} sets × {ex.reps} reps {ex.weightKg ? `@ ${ex.weightKg}kg` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
