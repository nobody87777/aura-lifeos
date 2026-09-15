import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Edit2, Check, Sun, BookOpen, Dumbbell, Moon, Sparkles } from 'lucide-react';
import { TimeBlock } from '../types';

export const DailyPlanTimeline: React.FC = () => {
  const { data, updateScheduleBlock } = useApp();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  // Determine which block is currently active based on system time
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  const getBlockIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'MORNING':
        return <Sun className="w-4 h-4 text-cyan-400" />;
      case 'COLLEGE':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'EVENING':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'NIGHT':
        return <Moon className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const isBlockActive = (block: TimeBlock) => {
    const [startH, startM] = block.startTime.split(':').map(Number);
    const [endH, endM] = block.endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (startMins <= endMins) {
      return currentTotalMinutes >= startMins && currentTotalMinutes < endMins;
    } else {
      // Overnight block
      return currentTotalMinutes >= startMins || currentTotalMinutes < endMins;
    }
  };

  const handleStartEdit = (block: TimeBlock) => {
    setEditingBlockId(block.id);
    setEditStartTime(block.startTime);
    setEditEndTime(block.endTime);
  };

  const handleSaveEdit = (id: string) => {
    updateScheduleBlock(id, {
      startTime: editStartTime,
      endTime: editEndTime
    });
    setEditingBlockId(null);
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              DAILY STRUCTURE
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Daily Time Architecture</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5">
          Automatic Adaptive Split
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {data.scheduleBlocks.map((block) => {
          const active = isBlockActive(block);
          const isEditing = editingBlockId === block.id;

          return (
            <div
              key={block.id}
              className={`relative p-4 rounded-xl transition-all ${
                active
                  ? 'bg-slate-900/90 border border-cyan-500/50 shadow-lg shadow-cyan-500/10 glow-cyan'
                  : 'bg-slate-950/40 border border-white/5 hover:border-white/10'
              }`}
            >
              {/* Active Indicator Badge */}
              {active && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-[10px] font-bold font-mono tracking-wider shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  CURRENT TIME
                </div>
              )}

              {/* Block Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                    {getBlockIcon(block.name)}
                  </div>
                  <span className="font-bold text-sm text-white tracking-wide">
                    {block.name}
                  </span>
                </div>

                {/* Edit Button */}
                {!isEditing ? (
                  <button
                    onClick={() => handleStartEdit(block)}
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Edit block times"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveEdit(block.id)}
                    className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    title="Save times"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Time Range */}
              {isEditing ? (
                <div className="flex items-center gap-1.5 my-2">
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full bg-slate-900 text-cyan-300 text-xs font-mono p-1.5 rounded border border-cyan-500/40 focus:outline-none"
                  />
                  <span className="text-slate-500 text-xs">-</span>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full bg-slate-900 text-cyan-300 text-xs font-mono p-1.5 rounded border border-cyan-500/40 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="text-xs font-mono text-cyan-300/90 font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{block.startTime} — {block.endTime}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 font-medium mb-3 line-clamp-1">
                {block.label}
              </p>

              {/* Suggested Activities */}
              <div className="space-y-1">
                {block.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] text-slate-300 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.04] flex items-center gap-1.5 truncate"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-400/60 shrink-0" />
                    <span className="truncate">{act}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
