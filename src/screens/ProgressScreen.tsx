import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  ShieldCheck,
  Trophy,
  Award,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  Zap,
  Calendar
} from 'lucide-react';

export const ProgressScreen: React.FC = () => {
  const { data, useStreakProtection } = useApp();

  const xpPercent = Math.min(100, Math.round((data.user.xp / data.user.xpToNextLevel) * 100));

  const ranks = [
    { level: 1, title: 'Novice Student', xp: 0, unlocked: data.user.level >= 1 },
    { level: 2, title: 'Code Apprentice', xp: 500, unlocked: data.user.level >= 2 },
    { level: 3, title: 'Syntax Warrior', xp: 1200, unlocked: data.user.level >= 3 },
    { level: 4, title: 'Algorithm Knight', xp: 2000, unlocked: data.user.level >= 4 },
    { level: 5, title: 'System Architect', xp: 3500, unlocked: data.user.level >= 5 },
    { level: 6, title: 'Engineering Legend', xp: 6000, unlocked: data.user.level >= 6 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            GROWTH & MASTERY
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Progress, XP & Streaks</h2>
        <p className="text-xs text-slate-400">
          Built for sustainable discipline with psychological safety and streak recovery shields.
        </p>
      </div>

      {/* Compassionate Streak Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#181308] to-[#0a1526] border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>STREAK PROTECTION SYSTEM ACTIVE</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
              <span>{data.user.currentStreak} Days Strong</span>
              <span className="text-slate-500 text-base font-normal font-mono">
                (Best: {data.user.bestStreak}d)
              </span>
            </h3>

            {/* Compassionate Safety Quote */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                "Yesterday didn't go as planned. Today is a fresh start. You are not punished for being human. Keep moving forward."
              </p>
            </div>
          </div>

          {/* Protection Shield Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 min-w-[240px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">RECOVERY SHIELDS</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: data.user.maxStreakProtections }).map((_, i) => {
                const active = i < data.user.streakProtectionsLeft;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded-full transition-all ${
                      active
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-sm shadow-emerald-400/50'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-[11px] font-mono text-emerald-300">
              {data.user.streakProtectionsLeft} of {data.user.maxStreakProtections} shields available
            </p>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              If an emergency or exam day interrupts your habits, the system auto-redeems a shield without zeroing your streak.
            </p>
          </div>

        </div>
      </div>

      {/* Gamification: Level, XP & Ranks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Level Profile Card */}
        <div className="glass-card rounded-2xl p-6 border border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                PLAYER PROFILE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ACTIVE TIER
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30">
                {data.user.level}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{data.user.title}</h4>
                <p className="text-xs font-mono text-slate-400">Level {data.user.level} Engineer</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5 my-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Current XP</span>
                <span className="text-cyan-300 font-bold">
                  {data.user.xp} / {data.user.xpToNextLevel} XP
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 block text-right">
                {data.user.xpToNextLevel - data.user.xp} XP to Level {data.user.level + 1}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300">
            <span className="font-semibold text-white block mb-0.5">How to earn XP:</span>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400 mt-1">
              <span>• Finish Task: +15 XP</span>
              <span>• Deep Focus: +20 XP</span>
              <span>• Daily Habit: +10 XP</span>
              <span>• Study Session: +25 XP</span>
              <span>• Gym Workout: +30 XP</span>
              <span>• Daily Reflection: +20 XP</span>
            </div>
          </div>
        </div>

        {/* Engineering Mastery Ranks Ladder */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300 mb-4">
            ENGINEERING TITLES & PROGRESSION
          </h3>

          <div className="space-y-3">
            {ranks.map((r) => (
              <div
                key={r.level}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  r.unlocked
                    ? 'bg-purple-950/20 border-purple-500/30 text-white'
                    : 'bg-slate-950/40 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      r.unlocked ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    L{r.level}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{r.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">Requires Level {r.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.unlocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
