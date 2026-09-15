import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Bug,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';
import { Project, ProjectItem } from '../types';

interface ProjectsScreenProps {
  onStartFocus: (title: string, durationMinutes: number) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onStartFocus }) => {
  const {
    data,
    toggleProjectMilestone,
    addProjectItem,
    toggleProjectItem,
    updateProjectProgress
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState<string>(
    data.projects[0]?.id || 'proj-multitaskcoder'
  );

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'task' | 'bug' | 'feature'>('task');

  const currentProject = data.projects.find((p) => p.id === activeProjectId) || data.projects[0];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !currentProject) return;

    addProjectItem(currentProject.id, {
      title: newItemTitle.trim(),
      type: newItemType,
      status: 'todo'
    });

    setNewItemTitle('');
  };

  if (!currentProject) {
    return <div className="p-8 text-white">No projects found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              ENGINEERING LAB
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Personal Projects & MultitaskCoder</h2>
          <p className="text-xs text-slate-400">
            Ship real-world software, build your developer portfolio, and track coding hours.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-white/5 overflow-x-auto">
          {data.projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setActiveProjectId(proj.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeProjectId === proj.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {proj.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flagship Project Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#130e26] to-[#0d1424] border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {currentProject.status.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentProject.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentProject.name}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentProject.tagline}
            </p>

            {/* Next Task Callout */}
            <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Target className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-300 truncate">
                  Next Up: <strong className="text-white">{currentProject.nextTask}</strong>
                </span>
              </div>
              <button
                onClick={() => onStartFocus(`Work on ${currentProject.name}: ${currentProject.nextTask}`, 35)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono font-bold flex items-center gap-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>BUILD NOW</span>
              </button>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-3 min-w-[220px]">
            <div className="flex-1 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs font-mono text-slate-400 block">COMPLETION PROGRESS</span>
              <div className="text-3xl font-black font-mono text-cyan-300 my-1">
                {currentProject.progress}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full"
                  style={{ width: `${currentProject.progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-xs font-mono text-slate-400 block">HOURS INVESTED</span>
              <div className="text-2xl font-black font-mono text-purple-300 mt-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>{currentProject.hoursInvested}h {currentProject.minutesInvested || 0}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Breakdown: Milestones vs Work Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Milestones Roadmap */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                ROADMAP
              </span>
              <h4 className="text-base font-bold text-white">Strategic Milestones</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {currentProject.milestones.filter((m) => m.completed).length} / {currentProject.milestones.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {currentProject.milestones.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => toggleProjectMilestone(currentProject.id, m.id)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  m.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/15 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      m.completed
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-slate-600 bg-slate-950'
                    }`}
                  >
                    {m.completed && <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 mr-2">Phase {idx + 1}</span>
                    <span className={`text-xs font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {m.title}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${m.completed ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {m.completed ? 'Done' : 'Pending'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks, Bugs & Features Board */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  DEVELOPMENT QUEUE
                </span>
                <h4 className="text-base font-bold text-white">Features & Bugs</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {currentProject.items.length} Items
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {currentProject.items.map((item) => {
                const isDone = item.status === 'done';
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isDone
                        ? 'bg-slate-950/40 border-emerald-500/20 opacity-70'
                        : 'bg-slate-900/60 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleProjectItem(currentProject.id, item.id)}
                        className="text-slate-500 hover:text-emerald-400"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                      </button>

                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          item.type === 'bug'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : item.type === 'feature'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.type}
                      </span>

                      <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.title}
                      </span>
                    </div>

                    {!isDone && (
                      <button
                        onClick={() => onStartFocus(`Code ${currentProject.name}: ${item.title}`, 25)}
                        className="p-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30"
                        title="Focus on this feature"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Item Quick Form */}
          <form onSubmit={handleAddItem} className="mt-4 pt-3 border-t border-white/5 flex gap-2">
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as any)}
              className="p-2 rounded-xl glass-input text-xs"
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="task">Task</option>
            </select>
            <input
              type="text"
              placeholder="e.g. Add dark theme toggle"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="flex-1 p-2 rounded-xl glass-input text-xs"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold"
            >
              Add
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
