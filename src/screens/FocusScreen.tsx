import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Timer,
  Play,
  Sparkles,
  Maximize2,
  Clock,
  Star,
  Coffee,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';
import { PomodoroPhase } from '../types';

interface FocusScreenProps {
  onStartDeepWork: (title: string, durationMinutes: number) => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onStartDeepWork }) => {
  const { data } = useApp();
  const [selectedPreset, setSelectedPreset] = useState<number>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [focusTask, setFocusTask] = useState('Java & Data Structures Engineering Block');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusLogs = data.focusLogs.filter((f) => f.date === todayStr);

  const totalFocusMinutesToday = todayFocusLogs.reduce((acc, f) => acc + f.durationMinutes, 0);
  const avgFocusRating =
    todayFocusLogs.length > 0
      ? (
          todayFocusLogs.reduce((acc, f) => acc + (f.focusRating || 4), 0) /
          todayFocusLogs.length
        ).toFixed(1)
      : '5.0';

  const presets = [
    { label: '25 min', minutes: 25, desc: 'Classic Pomodoro' },
    { label: '45 min', minutes: 45, desc: 'Academic Lecture Block' },
    { label: '60 min', minutes: 60, desc: 'Deep Coding Immersion' },
    { label: 'Custom', minutes: customMinutes, desc: 'Tailored Session' }
  ];

  const handleLaunchSession = () => {
    const duration = selectedPreset === -1 ? customMinutes : selectedPreset;
    onStartDeepWork(focusTask, duration);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            FOCUS ENGINE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Focus & Deep Work Sanctuary</h2>
        <p className="text-xs text-slate-400">
          Shield yourself from distractions. Enter flow state and earn +20 XP per session.
        </p>
      </div>

      {/* Main Focus Control Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto text-center space-y-6">
          
          {/* Phase Switcher (Focus vs Breaks) */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setPhase('focus')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                phase === 'focus'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus Mode
            </button>
            <button
              onClick={() => setPhase('short-break')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                phase === 'short-break'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => setPhase('long-break')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                phase === 'long-break'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Current Task Target Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              What are you focusing on?
            </label>
            <input
              type="text"
              value={focusTask}
              onChange={(e) => setFocusTask(e.target.value)}
              placeholder="e.g. MultitaskCoder Debugger Module or Java Streams"
              className="w-full p-3.5 rounded-2xl glass-input text-sm font-medium border-cyan-500/30"
            />
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((p, idx) => {
              const isSelected = selectedPreset === p.minutes;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPreset(p.minutes)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10 scale-105'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-400'
                  }`}
                >
                  <span className="block text-lg font-mono font-bold text-white">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Duration Slider (if custom selected) */}
          {selectedPreset === customMinutes && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-left">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Custom Duration:</span>
                <span className="text-cyan-300 font-bold">{customMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={customMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomMinutes(val);
                  setSelectedPreset(val);
                }}
                className="w-full accent-cyan-400"
              />
            </div>
          )}

          {/* Enter Deep Work Button */}
          <button
            onClick={handleLaunchSession}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all mx-auto glow-cyan"
          >
            <Maximize2 className="w-4 h-4" />
            <span>ENTER FULLSCREEN DEEP WORK MODE</span>
          </button>
        </div>

      </div>

      {/* Focus Metrics & Today's Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Metric Cards */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-400">
            TODAY'S FOCUS STATS
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-xs text-slate-400 font-mono">TOTAL FOCUS TIME</span>
            <div className="text-3xl font-black font-mono text-cyan-300 mt-1">
              {totalFocusMinutesToday} <span className="text-sm text-slate-500 font-normal">minutes</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-xs text-slate-400 font-mono">AVERAGE FOCUS RATING</span>
            <div className="text-3xl font-black font-mono text-amber-300 mt-1 flex items-center gap-2">
              <span>{avgFocusRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
            <p className="font-semibold text-white mb-0.5">🧠 Cognitive Flow</p>
            <p className="text-[11px] text-slate-300">
              Each completed session logs offline ambient sound data and rewards you with +20 XP.
            </p>
          </div>
        </div>

        {/* History of Completed Sessions */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-400 mb-4">
            COMPLETED FOCUS SESSIONS (TODAY)
          </h3>

          {todayFocusLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <p className="text-xs">No focus blocks recorded yet today. Launch one above!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayFocusLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{log.taskTitle}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Logged at {log.timestamp} • {log.durationMinutes} minutes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-400 text-xs font-mono">
                      {Array.from({ length: log.focusRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      +20 XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
