import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  ShieldCheck,
  Flame,
  Trophy,
  BatteryCharging,
  Search,
  Plus,
  HeartHandshake,
  Moon
} from 'lucide-react';
import { EnergyLevel } from '../types';

interface HeaderProps {
  onOpenSmartAction: () => void;
  onOpenScoreBreakdown: () => void;
  onOpenQuickAdd: () => void;
  onOpenSearch: () => void;
  onOpenNightlyReview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSmartAction,
  onOpenScoreBreakdown,
  onOpenQuickAdd,
  onOpenSearch,
  onOpenNightlyReview
}) => {
  const { data, calculateDailyScore, setEnergyLevel, toggleRecoveryMode } = useApp();
  const [greeting, setGreeting] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('');
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
        setIsNightTime(false);
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon');
        setIsNightTime(false);
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good evening');
        setIsNightTime(false);
      } else {
        setGreeting('Time to wind down');
        setIsNightTime(true);
      }

      setCurrentDateFormatted(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })
      );

      setCurrentTimeFormatted(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const scoreInfo = calculateDailyScore();
  const xpPercent = Math.min(100, Math.round((data.user.xp / data.user.xpToNextLevel) * 100));

  const energyPercentOptions: { pct: 20 | 40 | 60 | 80 | 100; level: EnergyLevel; label: string }[] = [
    { pct: 100, level: 'high', label: '100% Flow' },
    { pct: 80, level: 'high', label: '80% Sharp' },
    { pct: 60, level: 'medium', label: '60% Steady' },
    { pct: 40, level: 'low', label: '40% Fatigued' },
    { pct: 20, level: 'low', label: '20% Drain' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-[#07090e]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Greeting, Date, Live Time */}
        <div className="flex items-start justify-between md:justify-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                SYSTEM ACTIVE
              </span>
              <span className="text-xs text-slate-600">|</span>
              <span className="text-xs font-mono text-slate-400">{currentTimeFormatted}</span>
              {data.recoveryModeActive && (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                  RECOVERY ON
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span>{greeting},</span>
              <span className="text-gradient-cyan">{data.user.name}</span>
              <span className="text-base sm:text-lg">⚡</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {currentDateFormatted}
            </p>
          </div>

          {/* Mobile Right Tools (Search, Quick Add, Do Now) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 active:scale-95"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 active:scale-95"
              title="Quick Add"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSmartAction}
              className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg active:scale-95"
              title="Do Now"
            >
              <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Center/Right: Gamification Badges, Energy Level, Prominent Action Button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* Global Search (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs transition-all"
            title="Search entire system"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-500 border border-white/5">⌘K</kbd>
          </button>

          {/* Quick Add (Desktop) */}
          <button
            onClick={onOpenQuickAdd}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
            title="Universal Quick Add"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>QUICK ADD</span>
          </button>

          {/* Recovery Mode Toggle (Section 34) */}
          <button
            onClick={toggleRecoveryMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              data.recoveryModeActive
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-white/10 hover:text-white'
            }`}
            title="Toggle Recovery Mode for bad/exhausted days"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Recovery</span>
          </button>

          {/* Nightly Review trigger (Section 28) */}
          {onOpenNightlyReview && (
            <button
              onClick={onOpenNightlyReview}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isNightTime
                  ? 'bg-purple-950 text-purple-300 border border-purple-500/50 animate-pulse'
                  : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white'
              }`}
              title="Nightly Shutdown & Review"
            >
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Review</span>
            </button>
          )}

          {/* Energy selector dropdown / chips (Section 21) */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/5 text-xs">
            <span className="text-slate-500 px-1.5 flex items-center gap-1 font-mono hidden xl:inline-flex text-[11px]">
              <BatteryCharging className="w-3 h-3 text-slate-400" />
              ENERGY:
            </span>
            {energyPercentOptions.map(opt => (
              <button
                key={opt.pct}
                onClick={() => setEnergyLevel(opt.level, opt.pct)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                  data.energyPercent === opt.pct
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-500 hover:text-white'
                }`}
                title={opt.label}
              >
                {opt.pct}%
              </button>
            ))}
          </div>

          {/* Daily Score Pill */}
          <button
            onClick={onOpenScoreBreakdown}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs text-slate-200 transition-all hover:scale-[1.02] shadow-sm"
            title="Click to view daily score breakdown"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-mono text-slate-400 leading-none">SCORE</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 leading-tight">
                {scoreInfo.total}<span className="text-slate-500 text-[10px]">/100</span>
              </span>
            </div>
          </button>

          {/* Streak & Protection */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold font-mono text-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-400/30 text-amber-400" />
              <span>{data.user.currentStreak}d</span>
            </div>
            <div
              className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-500/20"
              title={`${data.user.streakProtectionsLeft} Streak recovery protections available`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{data.user.streakProtectionsLeft}</span>
            </div>
          </div>

          {/* Big Desktop Prominent "⚡ WHAT SHOULD I DO NOW?" Button */}
          <button
            onClick={onOpenSmartAction}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all glow-cyan"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
            <span className="tracking-wide">DO NOW</span>
          </button>

        </div>
      </div>
    </header>
  );
};
