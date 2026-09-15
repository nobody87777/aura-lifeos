import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Sparkles,
  Calendar,
  Star,
  Trash2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Task, Priority, EnergyLevel, Difficulty, TaskStatus } from '../types';

interface TasksScreenProps {
  onStartFocus: (title: string, durationMinutes: number) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({ onStartFocus }) => {
  const { data, addTask, updateTask, deleteTask, toggleTaskStatus } = useApp();
  const [activeGroup, setActiveGroup] = useState<'today' | 'tomorrow' | 'week' | 'later'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState('College');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueTime, setNewDueTime] = useState('18:00');
  const [newDuration, setNewDuration] = useState(30);
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [newEnergy, setNewEnergy] = useState<EnergyLevel>('medium');
  const [newIsTop3, setNewIsTop3] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Natural grouping calculation
  const getTasksForGroup = (group: 'today' | 'tomorrow' | 'week' | 'later') => {
    return data.tasks.filter((task) => {
      // Category filter
      if (selectedCategory !== 'All' && task.category !== selectedCategory) {
        return false;
      }

      const taskDate = task.dueDate;
      if (group === 'today') {
        return taskDate <= todayStr;
      } else if (group === 'tomorrow') {
        return taskDate === tomorrowStr;
      } else if (group === 'week') {
        const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        return taskDate > tomorrowStr && taskDate <= weekAhead;
      } else {
        const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        return taskDate > weekAhead || !taskDate;
      }
    });
  };

  const currentTasks = getTasksForGroup(activeGroup);

  const categories = ['All', 'College', 'MultitaskCoder', 'Coding', 'Fitness', 'Personal'];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      dueTime: newDueTime,
      estimatedMinutes: Number(newDuration) || 25,
      difficulty: newDifficulty,
      energyRequired: newEnergy,
      status: 'todo',
      isTop3: newIsTop3
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">LOW</span>;
    }
  };

  const getEnergyBadge = (e: EnergyLevel) => {
    switch (e) {
      case 'high':
        return <span className="text-[10px] font-mono text-emerald-400">⚡ High Energy</span>;
      case 'medium':
        return <span className="text-[10px] font-mono text-cyan-400">⚡ Balanced</span>;
      case 'low':
        return <span className="text-[10px] font-mono text-amber-400">🌱 Low Fatigue</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              TASK PIPELINE
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Daily Tasks & Actions</h2>
          <p className="text-xs text-slate-400">
            Intelligently organized so you never feel buried under an endless list.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Natural Grouping Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {(['today', 'tomorrow', 'week', 'later'] as const).map((grp) => {
          const count = getTasksForGroup(grp).length;
          const active = activeGroup === grp;
          const labels = {
            today: 'Today',
            tomorrow: 'Tomorrow',
            week: 'This Week',
            later: 'Later'
          };
          return (
            <button
              key={grp}
              onClick={() => setActiveGroup(grp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                active
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{labels[grp]}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-cyan-400 text-black font-bold' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {currentTasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h4 className="text-base font-bold text-white mb-1">Queue Clear for {activeGroup.toUpperCase()}</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No pending tasks matching this filter. Enjoy the mental calm or add a new action.
            </p>
          </div>
        ) : (
          currentTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`glass-card rounded-2xl p-4 sm:p-5 border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/40 border-emerald-500/20 opacity-70'
                    : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Status Toggle Checkbox */}
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

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {getPriorityBadge(task.priority)}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                        {task.category}
                      </span>
                      {task.isTop3 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          TOP 3
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        {getEnergyBadge(task.energyRequired)}
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {task.estimatedMinutes}m
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-mono">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due {task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                        </span>
                      )}
                      <span>Diff: <strong className="text-slate-300 capitalize">{task.difficulty}</strong></span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => onStartFocus(task.title, task.estimatedMinutes)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                        title="Focus on this task now"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">FOCUS</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Create New Task</span>
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-400 uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study Java Streams & Lambdas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 uppercase mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional details, key concepts to cover..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  >
                    <option value="College">College</option>
                    <option value="MultitaskCoder">MultitaskCoder</option>
                    <option value="Coding">Coding</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Energy Required</label>
                  <select
                    value={newEnergy}
                    onChange={(e) => setNewEnergy(e.target.value as EnergyLevel)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  >
                    <option value="high">High Energy</option>
                    <option value="medium">Medium Energy</option>
                    <option value="low">Low Energy</option>
                  </select>
                </div>
              </div>

              {/* Lock to Top 3 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Lock to Today's Top 3</span>
                  <span className="text-[11px] text-slate-400">Highlights this task on your home screen dashboard</span>
                </div>
                <input
                  type="checkbox"
                  checked={newIsTop3}
                  onChange={(e) => setNewIsTop3(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
