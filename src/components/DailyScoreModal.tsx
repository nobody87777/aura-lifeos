import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, HeartHandshake, Shield, Sparkles } from 'lucide-react';

interface DailyScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyScoreModal: React.FC<DailyScoreModalProps> = ({ isOpen, onClose }) => {
  const { calculateDailyScore, data } = useApp();

  if (!isOpen) return null;

  const scoreInfo = calculateDailyScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-900/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            SCORE BREAKDOWN
          </span>
        </div>

        {/* Large Score Display */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-white/10 mb-5">
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Today's Total Performance</p>
            <div className="text-3xl font-black font-mono text-cyan-300">
              {scoreInfo.total} <span className="text-slate-500 text-lg font-normal">/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Optimal Track
            </span>
          </div>
        </div>

        {/* Explainable itemized breakdown */}
        <div className="space-y-2.5 mb-5">
          {scoreInfo.breakdown.map((item, idx) => {
            const percent = Math.round((item.points / item.max) * 100);
            return (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-white/5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{item.label}</span>
                  <span className="font-mono font-semibold text-cyan-400">
                    +{item.points} <span className="text-slate-500">/ {item.max}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Compassionate / Non-punishing Philosophy Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900/70 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white mb-0.5">Mindful Progress Principle</p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Missing an activity never diminishes your worth. Your {data.user.streakProtectionsLeft} Streak Recovery shields protect you on tough days. Today is always an opportunity to build consistency.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
