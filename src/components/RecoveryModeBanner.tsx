import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  CheckCircle2,
  Droplets,
  BookOpen,
  Moon,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';

interface RecoveryModeBannerProps {
  onStartFocus: (title: string, durationMinutes: number) => void;
}

export const RecoveryModeBanner: React.FC<RecoveryModeBannerProps> = ({ onStartFocus }) => {
  const { data, toggleRecoveryMode, addWaterGlass, toggleTaskStatus } = useApp();

  if (!data.recoveryModeActive) return null;

  const miniTask = data.tasks.find(t => t.isTop3 && t.status !== 'completed') || data.tasks.find(t => t.status !== 'completed') || data.tasks[0];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-[#070b14] border border-indigo-500/40 shadow-2xl space-y-6 animate-fadeIn">
      
      {/* Recovery Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              RECOVERY MODE // ACTIVE
            </span>
            <h3 className="text-xl font-bold text-white">Zero-Pressure Sanctuary</h3>
          </div>
        </div>

        <button
          onClick={toggleRecoveryMode}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-white/10 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Exit Recovery Mode</span>
        </button>
      </div>

      {/* The Core Compassionate Philosophy Message */}
      <div className="p-4 rounded-2xl bg-black/40 border border-indigo-500/30 text-indigo-100 text-sm leading-relaxed font-medium">
        "You don't need a perfect day. You just need to avoid giving up. Take a deep breath, do the bare minimum essentials, and rest guilt-free."
      </div>

      {/* Reduced Day: ONLY the 5 Essentials */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
          TODAY'S 5 GENTLE ESSENTIALS
        </span>

        {/* 1. Mini: One important task */}
        {miniTask && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => toggleTaskStatus(miniTask.id)}
                className="text-slate-500 hover:text-emerald-400"
              >
                <CheckCircle2 className={`w-5 h-5 ${miniTask.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'}`} />
              </button>
              <div className="truncate">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">1. MINI TASK</span>
                <h4 className={`text-xs font-bold truncate ${miniTask.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                  {miniTask.title}
                </h4>
              </div>
            </div>
            {miniTask.status !== 'completed' && (
              <button
                onClick={() => onStartFocus(miniTask.title, 15)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30"
              >
                15m Focus
              </button>
            )}
          </div>
        )}

        {/* 2. 20 min study */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase">2. LIGHT STUDY</span>
              <h4 className="text-xs font-bold text-white">20 min light reading or video review</h4>
            </div>
          </div>
          <button
            onClick={() => onStartFocus('Light Engineering Reading / Review', 20)}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30"
          >
            Start 20m
          </button>
        </div>

        {/* 3. Water Target */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">3. HYDRATION TARGET</span>
              <h4 className="text-xs font-bold text-white">
                {data.water.currentGlasses} / {data.water.targetGlasses} glasses drank
              </h4>
            </div>
          </div>
          <button
            onClick={addWaterGlass}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30"
          >
            +1 Glass
          </button>
        </div>

        {/* 4. Basic Movement */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">4. BASIC MOVEMENT</span>
              <h4 className="text-xs font-bold text-white">10 min walk or gentle stretching</h4>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">Done ✓</span>
        </div>

        {/* 5. Sleep Preparation */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase">5. SLEEP PREPARATION</span>
              <h4 className="text-xs font-bold text-white">Wind down early, screen off by 22:30</h4>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Tonight</span>
        </div>

      </div>

    </div>
  );
};
