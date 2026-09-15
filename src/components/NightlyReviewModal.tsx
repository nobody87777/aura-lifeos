import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon,
  X,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  Target
} from 'lucide-react';

interface NightlyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NightlyReviewModal: React.FC<NightlyReviewModalProps> = ({ isOpen, onClose }) => {
  const { data, calculateDailyScore, saveReflection, addTask } = useApp();

  const [top3Done, setTop3Done] = useState(true);
  const [studyDone, setStudyDone] = useState(true);
  const [exerciseDone, setExerciseDone] = useState(data.fitness.todayWorkoutDone);
  const [habitsDone, setHabitsDone] = useState(true);
  const [goalsDone, setGoalsDone] = useState(true);

  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatShouldChange, setWhatShouldChange] = useState('');
  const [tomorrowTop1, setTomorrowTop1] = useState('Continue MultitaskCoder debugger module');
  const [tomorrowTop2, setTomorrowTop2] = useState('Study Java Concurrency (30 min)');
  const [tomorrowTop3, setTomorrowTop3] = useState('Gym: Back & Biceps workout');

  if (!isOpen) return null;

  const scoreInfo = calculateDailyScore();
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleFinishReview = () => {
    // Save reflection
    saveReflection(todayStr, {
      date: todayStr,
      mood: 'good',
      energyPercent: 60,
      energy: 'medium',
      screenTimeHours: 3.8,
      wins: whatWentWell || 'Maintained steady progress and hit core priorities.',
      improvement: whatShouldChange || 'Start study earlier in the evening.',
      gratitude: 'Grateful for clean health and engineering curiosity.'
    });

    // Seed tomorrow's Top 3 tasks
    if (tomorrowTop1.trim()) {
      addTask({
        title: tomorrowTop1.trim(),
        category: 'MultitaskCoder',
        priority: 'high',
        tier: 'must-do',
        dueDate: tomorrowStr,
        estimatedMinutes: 40,
        difficulty: 'medium',
        energyRequired: 'high',
        status: 'todo',
        isTop3: true
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Nightly Shutdown & Review</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs">
          
          {/* Daily Score Display */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">TODAY'S DAILY SCORE</span>
              <div className="text-3xl font-black font-mono text-cyan-300">
                {scoreInfo.total}%
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Ready for Sleep
            </span>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <span className="font-mono text-slate-400 uppercase block font-bold">
              DAILY INTEGRITY CHECK
            </span>

            {[
              { label: 'Completed your Top 3 priorities?', state: top3Done, set: setTop3Done },
              { label: 'Studied engineering / syllabus?', state: studyDone, set: setStudyDone },
              { label: 'Exercised or completed basic movement?', state: exerciseDone, set: setExerciseDone },
              { label: 'Completed your important habits?', state: habitsDone, set: setHabitsDone },
              { label: 'Spent focused time on your goals?', state: goalsDone, set: setGoalsDone }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => item.set(!item.state)}
                className="w-full p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:bg-slate-800 transition-all text-left"
              >
                <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                {item.state ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </button>
            ))}
          </div>

          {/* Wins & Improvements */}
          <div className="space-y-3">
            <div>
              <label className="block font-mono text-emerald-400 uppercase font-bold mb-1">
                What went well today?
              </label>
              <input
                type="text"
                placeholder="e.g. Good focus during Java practical and gym session"
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block font-mono text-amber-400 uppercase font-bold mb-1">
                What should change tomorrow?
              </label>
              <input
                type="text"
                placeholder="e.g. Stop scrolling social media during afternoon break"
                value={whatShouldChange}
                onChange={(e) => setWhatShouldChange(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          {/* Tomorrow's Top 3 Confirmation */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="font-mono text-cyan-400 uppercase block font-bold flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              LOCK TOMORROW'S TOP 3 PRIORITIES
            </span>
            <input
              type="text"
              value={tomorrowTop1}
              onChange={(e) => setTomorrowTop1(e.target.value)}
              className="w-full p-2 rounded-xl glass-input font-medium text-xs"
              placeholder="1. Top Priority"
            />
            <input
              type="text"
              value={tomorrowTop2}
              onChange={(e) => setTomorrowTop2(e.target.value)}
              className="w-full p-2 rounded-xl glass-input font-medium text-xs"
              placeholder="2. Top Priority"
            />
            <input
              type="text"
              value={tomorrowTop3}
              onChange={(e) => setTomorrowTop3(e.target.value)}
              className="w-full p-2 rounded-xl glass-input font-medium text-xs"
              placeholder="3. Top Priority"
            />
          </div>

          {/* Complete Button */}
          <div className="pt-2">
            <button
              onClick={handleFinishReview}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
            >
              Complete Review & Shut Down (+20 XP)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
