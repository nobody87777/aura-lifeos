import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  Dumbbell,
  CheckCircle2,
  Moon,
  DollarSign,
  FolderGit2,
  AlertTriangle,
  Target,
  Sparkles
} from 'lucide-react';

export const WeeklyReviewScreen: React.FC = () => {
  const { data } = useApp();

  const [nextWeekGoal1, setNextWeekGoal1] = useState('Ship MultitaskCoder debugger module v1');
  const [nextWeekGoal2, setNextWeekGoal2] = useState('Clear Computer Networks chapter 3 & 4 revision');
  const [nextWeekGoal3, setNextWeekGoal3] = useState('Maintain 5 gym days and 7.5h sleep schedule');
  const [savedGoals, setSavedGoals] = useState(false);

  // Computations
  const totalFocusMins = data.focusLogs.reduce((acc, f) => acc + f.durationMinutes, 0) + 380;
  const focusH = Math.floor(totalFocusMins / 60);
  const focusM = totalFocusMins % 60;

  const totalStudyMins = data.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0) + 520;
  const studyH = Math.floor(totalStudyMins / 60);
  const studyM = totalStudyMins % 60;

  const totalSpent = data.finances.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            WEEKLY RETROSPECTIVE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Weekly Performance Report</h2>
        <p className="text-xs text-slate-400">
          Synthesize wins, address friction points, and lock in next week's Top 3 priorities.
        </p>
      </div>

      {/* Big Metric Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">PRODUCTIVITY SCORE</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 mt-1 block">
            78%
          </span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Top 15% consistency</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" /> FOCUS TIME
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-purple-300 mt-1 block">
            {focusH}h {focusM}m
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Deep flow blocks</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-blue-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-blue-400" /> STUDY VOLUME
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-blue-300 mt-1 block">
            {studyH}h {studyM}m
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Diploma syllabus</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-emerald-400" /> WORKOUTS
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 mt-1 block">
            5 sessions
          </span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Hit all split days</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400" /> HABIT COMPLETION
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-1 block">
            82%
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Core routines locked</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-indigo-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <Moon className="w-3 h-3 text-indigo-400" /> SLEEP AVERAGE
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-300 mt-1 block">
            6h 48m
          </span>
          <span className="text-[10px] font-mono text-amber-400 mt-1 block">Below 7h 30m target</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-rose-400" /> MONEY SPENT
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-rose-300 mt-1 block">
            ₹{totalSpent}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Within monthly budget</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase block flex items-center gap-1">
            <FolderGit2 className="w-3 h-3 text-purple-400" /> PROJECT TIME
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-purple-300 mt-1 block">
            6h 30m
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">MultitaskCoder & Tools</span>
        </div>

      </div>

      {/* Wins vs Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Wins */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-500/30 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            THIS WEEK'S WINS
          </span>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Completed 5 gym workouts and logged 25+ pushups daily</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Logged 8 study sessions covering Java Streams, OSI Model & DSA</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hit 5 project coding blocks on MultitaskCoder debugger module</span>
            </div>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            AREAS FOR CALIBRATION
          </span>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20 text-amber-200">
              <p className="font-semibold text-white">Sleep below target (6h 48m vs 7h 30m)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Wind down 30 minutes earlier on weeknights.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20 text-amber-200">
              <p className="font-semibold text-white">Afternoon screen-time spikes</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Instagram / YouTube between college lectures.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Next Week's Top 3 Goals */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Next Week's Top 3 Strategic Goals</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-mono text-cyan-400 uppercase font-bold mb-1">Goal 1 (Academic / MultitaskCoder)</label>
            <input
              type="text"
              value={nextWeekGoal1}
              onChange={(e) => setNextWeekGoal1(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-mono text-purple-400 uppercase font-bold mb-1">Goal 2 (Study / Exam Prep)</label>
            <input
              type="text"
              value={nextWeekGoal2}
              onChange={(e) => setNextWeekGoal2(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-mono text-emerald-400 uppercase font-bold mb-1">Goal 3 (Health / Habit Discipline)</label>
            <input
              type="text"
              value={nextWeekGoal3}
              onChange={(e) => setNextWeekGoal3(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setSavedGoals(true);
              setTimeout(() => setSavedGoals(false), 2500);
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg"
          >
            {savedGoals ? 'Next Week Goals Locked!' : 'Lock Next Week Goals'}
          </button>
        </div>
      </div>

    </div>
  );
};
