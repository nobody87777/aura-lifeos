import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Plus,
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Goal } from '../types';

interface GoalsScreenProps {
  onStartFocus: (title: string, durationMinutes: number) => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ onStartFocus }) => {
  const { data, addGoal, toggleGoalMilestone, addTask } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Goal['category']>('Career');
  const [deadlineMonths, setDeadlineMonths] = useState(12);
  const [yearGoal, setYearGoal] = useState('');
  const [threeMonthGoal, setThreeMonthGoal] = useState('');
  const [monthGoal, setMonthGoal] = useState('');
  const [weekGoal, setWeekGoal] = useState('');
  const [todayAction, setTodayAction] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      category,
      deadlineMonths: Number(deadlineMonths),
      progress: 10,
      yearGoal: yearGoal.trim() || title.trim(),
      threeMonthGoal: threeMonthGoal.trim() || 'Advance core foundations',
      monthGoal: monthGoal.trim() || 'Build key projects',
      weekGoal: weekGoal.trim() || 'Daily practice blocks',
      todayAction: todayAction.trim() || 'Complete 1 focused step',
      milestones: [
        { id: `gm-${Date.now()}-1`, title: 'Foundation block completed', completed: false },
        { id: `gm-${Date.now()}-2`, title: 'Applied project / test completed', completed: false }
      ]
    });

    setTitle('');
    setYearGoal('');
    setThreeMonthGoal('');
    setMonthGoal('');
    setWeekGoal('');
    setTodayAction('');
    setIsAddModalOpen(false);
  };

  const handleSendTodayActionToTasks = (actionTitle: string) => {
    addTask({
      title: actionTitle,
      category: 'Goal Action',
      priority: 'high',
      tier: 'must-do',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 30,
      difficulty: 'medium',
      energyRequired: 'medium',
      status: 'todo',
      isTop3: true
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              VISION TO EXECUTION
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Goals & Breakdown Engine</h2>
          <p className="text-xs text-slate-400">
            Vague dreams fail. The breakdown engine transforms multi-year ambitions into today's small action.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Strategic Goal</span>
        </button>
      </div>

      {/* Goal Cards with Breakdown Cascade */}
      <div className="space-y-6">
        {data.goals.map((goal) => (
          <div
            key={goal.id}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 relative overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {goal.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {goal.deadlineMonths} Months Horizon
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{goal.title}</h3>
              </div>

              <div className="sm:text-right min-w-[140px]">
                <span className="text-xs font-mono text-slate-400 block">GOAL PROGRESS</span>
                <span className="text-2xl font-black font-mono text-cyan-300">{goal.progress}%</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Goal Breakdown Hierarchy (Year -> 3 Month -> Month -> Week -> Today) */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                ACTION CASCADE ARCHITECTURE
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-1">
                
                {/* Year */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] font-mono text-purple-400 uppercase block font-bold">1. YEAR GOAL</span>
                  <p className="text-xs text-slate-200 mt-1">{goal.yearGoal}</p>
                </div>

                {/* 3 Month */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase block font-bold">2. 3-MONTH GOAL</span>
                  <p className="text-xs text-slate-200 mt-1">{goal.threeMonthGoal}</p>
                </div>

                {/* Month */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase block font-bold">3. MONTH GOAL</span>
                  <p className="text-xs text-slate-200 mt-1">{goal.monthGoal}</p>
                </div>

                {/* Week */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">4. WEEK GOAL</span>
                  <p className="text-xs text-slate-200 mt-1">{goal.weekGoal}</p>
                </div>

                {/* Today */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase block font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> 5. TODAY ACTION
                    </span>
                    <p className="text-xs text-white font-bold mt-1">{goal.todayAction}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => onStartFocus(goal.todayAction, 25)}
                      className="px-2 py-1 rounded bg-cyan-500 text-black text-[10px] font-mono font-bold hover:bg-cyan-400"
                    >
                      Focus
                    </button>
                    <button
                      onClick={() => handleSendTodayActionToTasks(goal.todayAction)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-mono hover:text-white"
                      title="Add to today's task list"
                    >
                      +Task
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                STRATEGIC MILESTONES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goal.milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleGoalMilestone(goal.id, m.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      m.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-slate-900/60 border-white/5 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        m.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-600'
                      }`}
                    >
                      {m.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-xs font-medium truncate ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {m.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1">Create Goal with Breakdown Cascade</h3>
            <p className="text-xs text-slate-400 mb-4">
              Break your big target into concrete steps so you can act today without overwhelm.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Goal Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Fullstack Engineering & Get Placed"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl glass-input"
                  >
                    <option value="Career">Career</option>
                    <option value="Education">Education</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Finance">Finance</option>
                    <option value="Projects">Projects</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">1. Year Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Get job-ready at high technical bar"
                  value={yearGoal}
                  onChange={(e) => setYearGoal(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">2. 3-Month Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Complete MultitaskCoder and DSA fundamentals"
                  value={threeMonthGoal}
                  onChange={(e) => setThreeMonthGoal(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">3. Month Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Finish Binary Search, Trees and Java Streams"
                  value={monthGoal}
                  onChange={(e) => setMonthGoal(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">4. Week Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Study arrays & practice 5 problems"
                  value={weekGoal}
                  onChange={(e) => setWeekGoal(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-mono text-cyan-300 mb-1 uppercase font-bold">5. Today's Concrete Action</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 2 binary search problems"
                  value={todayAction}
                  onChange={(e) => setTodayAction(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input border-cyan-500/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl"
                >
                  Create Goal (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
