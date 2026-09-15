import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateSmartRecommendations, SmartRecommendation } from '../utils/smartEngine';
import { Zap, ArrowRight, SkipForward, RefreshCw, X, Sparkles, Clock, Target, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/soundGenerator';

interface WhatShouldIDoNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (taskTitle: string, durationMinutes: number) => void;
}

export const WhatShouldIDoNowModal: React.FC<WhatShouldIDoNowModalProps> = ({
  isOpen,
  onClose,
  onStartFocus
}) => {
  const { data, toggleHabitToday, toggleTodayWorkout, addWaterGlass } = useApp();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const recs = generateSmartRecommendations(data, new Date());
      setRecommendations(recs);
      setCurrentIndex(0);
      soundEngine.playClick();
    }
  }, [isOpen, data.activeEnergy]);

  if (!isOpen) return null;

  const currentRec = recommendations[currentIndex] || recommendations[0];

  const handleNext = () => {
    if (recommendations.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
      soundEngine.playClick();
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    if (recommendations.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    } else {
      onClose();
    }
  };

  const handleStart = () => {
    if (!currentRec) return;

    if (currentRec.actionType === 'focus' || currentRec.category === 'study' || currentRec.category === 'project' || currentRec.category === 'task') {
      onClose();
      onStartFocus(currentRec.title, currentRec.durationMinutes);
    } else if (currentRec.actionType === 'habit') {
      if (currentRec.targetId === 'water') {
        addWaterGlass();
      } else if (currentRec.targetId) {
        toggleHabitToday(currentRec.targetId);
      }
      onClose();
    } else if (currentRec.actionType === 'fitness') {
      toggleTodayWorkout();
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 glow-cyan">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* AI System Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            DECISION ENGINE • ZERO FATIGUE
          </span>
          {currentRec?.priorityText && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {currentRec.priorityText}
            </span>
          )}
        </div>

        {/* Header */}
        <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-1">
          DO THIS NOW
        </h2>

        {currentRec ? (
          <div className="space-y-4">
            {/* Title & Duration */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {currentRec.title}
                </h3>
                <div className="shrink-0 flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentRec.durationLabel}</span>
                </div>
              </div>
            </div>

            {/* Why section */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-mono font-semibold uppercase text-cyan-400 flex items-center gap-1.5 mb-1.5">
                <Target className="w-3.5 h-3.5" />
                WHY CHOSEN?
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentRec.reason}
              </p>
            </div>

            {/* Energy Context Pill */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Current Energy: <strong className="text-cyan-300 capitalize">{data.activeEnergy}</strong></span>
              <span>Option {currentIndex + 1} of {recommendations.length}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleStart}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all glow-cyan"
              >
                <span>START</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                  title="Cycle to next smart recommendation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CHANGE</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="flex-1 sm:flex-none py-3 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-white/5 flex items-center justify-center gap-1.5 transition-all"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>SKIP</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
            <p>All core goals are on track. You are in free flow mode!</p>
          </div>
        )}

      </div>
    </div>
  );
};
