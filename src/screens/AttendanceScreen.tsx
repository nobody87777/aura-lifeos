import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const AttendanceScreen: React.FC = () => {
  const { data, markAttendance } = useApp();

  const getAttendanceStatus = (pct: number, minTarget: number = 75) => {
    if (pct >= minTarget) {
      return { label: 'Safe', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> };
    } else if (pct >= minTarget - 5) {
      return { label: 'Warning', color: 'bg-amber-950/60 text-amber-400 border-amber-500/40', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> };
    } else {
      return { label: 'Critical', color: 'bg-rose-950/60 text-rose-400 border-rose-500/40', icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> };
    }
  };

  // Overall average
  const totalHeld = data.attendance.reduce((acc, a) => acc + a.classesHeld, 0);
  const totalAttended = data.attendance.reduce((acc, a) => acc + a.classesAttended, 0);
  const overallPct = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : '100.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            ACADEMIC COMPLIANCE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">College Attendance Tracker</h2>
        <p className="text-xs text-slate-400">
          Maintain 75%+ mandatory attendance criteria effortlessly. Tap to mark each class.
        </p>
      </div>

      {/* Overall Summary Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-slate-400 block">OVERALL ATTENDANCE</span>
          <div className="text-4xl font-black font-mono text-cyan-300 mt-1">
            {overallPct}%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {totalAttended} attended of {totalHeld} total lectures held
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/5 text-xs font-mono text-center">
            <span className="text-slate-400 block">THRESHOLD</span>
            <span className="text-emerald-400 font-bold">75.0% Minimum</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-center">
            <span className="text-slate-400 block">EXAM ELIGIBILITY</span>
            <span className="text-emerald-300 font-bold">Approved ✓</span>
          </div>
        </div>
      </div>

      {/* Subject Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.attendance.map((record) => {
          const pct = record.classesHeld > 0 ? (record.classesAttended / record.classesHeld) * 100 : 100;
          const roundedPct = pct.toFixed(1);
          const status = getAttendanceStatus(pct, record.minimumTargetPercent);

          // Bunk / Recovery math:
          // How many more classes can you miss and stay >= 75%?
          // (Attended) / (Held + x) >= 0.75 => x <= (Attended / 0.75) - Held
          const canMiss = Math.max(0, Math.floor((record.classesAttended / (record.minimumTargetPercent / 100)) - record.classesHeld));

          // If below 75%, how many to attend consecutively?
          // (Attended + y) / (Held + y) >= 0.75 => y >= (0.75*Held - Attended) / (1 - 0.75)
          const mustAttend = Math.max(0, Math.ceil((0.75 * record.classesHeld - record.classesAttended) / 0.25));

          return (
            <div
              key={record.id}
              className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 hover:border-cyan-500/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-white">{record.subjectName}</h4>
                    {record.code && (
                      <span className="text-[10px] font-mono text-slate-400">{record.code}</span>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${status.color}`}>
                    {status.icon}
                    <span>{status.label} ({roundedPct}%)</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-black font-mono text-white">
                    {record.classesAttended}{' '}
                    <span className="text-slate-500 text-lg font-normal">/ {record.classesHeld}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 75 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                {/* Smart Margin Advice */}
                <p className="text-[11px] font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  {pct >= 75 ? (
                    canMiss > 0 ? (
                      <span>🛡️ You can miss <strong className="text-cyan-300">{canMiss}</strong> more classes safely.</span>
                    ) : (
                      <span className="text-amber-300">⚠️ On the edge. Do not miss the next lecture!</span>
                    )
                  ) : (
                    <span className="text-rose-300">🚨 Must attend <strong className="text-rose-200">{mustAttend}</strong> lectures in a row to reach 75%.</span>
                  )}
                </p>
              </div>

              {/* Action Buttons: Present vs Absent */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => markAttendance(record.id, true)}
                  className="py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Present (+1)</span>
                </button>

                <button
                  onClick={() => markAttendance(record.id, false)}
                  className="py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
