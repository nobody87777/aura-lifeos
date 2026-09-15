import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Trophy,
  Flame,
  ShieldCheck,
  Palette,
  Download,
  Bell,
  Sparkles,
  Check,
  Briefcase,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import { AppTheme } from '../types';

export const ProfileScreen: React.FC = () => {
  const { data, setTheme, exportCSV, exportDataJSON } = useApp();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const xpPercent = Math.min(100, Math.round((data.user.xp / data.user.xpToNextLevel) * 100));

  const handleDownloadCSV = (type: 'expenses' | 'study' | 'habits' | 'workouts') => {
    const csvContent = exportCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadMsg(`Exported ${type}.csv successfully!`);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  const handleRequestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationEnabled(true);
        new Notification('AURA OS Active', {
          body: 'Smart study & focus reminders are now enabled.'
        });
      }
    }
  };

  const themes: { id: AppTheme; label: string; bg: string; border: string; accent: string }[] = [
    { id: 'dark-neon', label: 'Dark Neon (Default)', bg: 'bg-[#07090e]', border: 'border-cyan-500', accent: 'text-cyan-400' },
    { id: 'midnight', label: 'Midnight Blue', bg: 'bg-[#0a0f1d]', border: 'border-indigo-500', accent: 'text-indigo-400' },
    { id: 'amoled', label: 'Pure AMOLED Black', bg: 'bg-black', border: 'border-white/20', accent: 'text-slate-100' },
    { id: 'matrix', label: 'Matrix Cyber', bg: 'bg-[#040d08]', border: 'border-emerald-500', accent: 'text-emerald-400' },
    { id: 'minimal-dark', label: 'Minimal Dark', bg: 'bg-[#0f1117]', border: 'border-slate-500', accent: 'text-slate-300' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            USER SOVEREIGNTY
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Profile & System Configuration</h2>
        <p className="text-xs text-slate-400">
          Personal identity, cosmetic themes, CSV exports, achievements, and notifications.
        </p>
      </div>

      {/* Avatar & Player Profile Hero */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-cyan-500/25 border border-white/10 shrink-0">
          DE
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LEVEL {data.user.level}
            </span>
            <span className="text-xs font-mono text-purple-400 font-semibold">
              {data.user.title}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">{data.user.name}</h3>
          <p className="text-xs text-slate-400 font-medium">
            Diploma Computer Engineering Student • Kerala, India • MultitaskCoder Architect
          </p>

          {/* XP Bar */}
          <div className="max-w-md space-y-1 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">XP Progress</span>
              <span className="text-cyan-300 font-bold">{data.user.xp} / {data.user.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streaks Callout */}
        <div className="flex sm:flex-col gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">ACTIVE STREAK</span>
            <span className="text-2xl font-black font-mono text-amber-400 flex items-center justify-center gap-1 my-0.5">
              <Flame className="w-4 h-4 fill-current" /> {data.user.currentStreak}d
            </span>
            <span className="text-[9px] font-mono text-emerald-400">Best: {data.user.bestStreak}d</span>
          </div>
        </div>
      </div>

      {/* Theme Picker & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Theme System (Section 49) */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              VISUAL THEME SELECTION
            </h3>
          </div>

          <div className="space-y-2.5">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  data.theme === th.id
                    ? `${th.border} bg-white/5 shadow-md shadow-cyan-500/10`
                    : 'border-white/5 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${th.bg} border ${th.border}`} />
                  <span className={`text-xs font-bold ${th.accent}`}>{th.label}</span>
                </div>
                {data.theme === th.id && (
                  <Check className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications & CSV Export */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5 space-y-5 flex flex-col justify-between">
          
          {/* Notifications */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                SMART NOTIFICATIONS
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables polite browser alerts before study blocks, workout sessions, and nightly shutdown.
            </p>
            <button
              onClick={handleRequestNotifications}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                notificationEnabled
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40'
              }`}
            >
              {notificationEnabled ? 'Notifications Active ✓' : 'Enable PWA / Browser Notifications'}
            </button>
          </div>

          {/* CSV Data Exports (Section 47) */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                EXPORT DATA AS CSV
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Download your logs for spreadsheet analysis in Excel or Google Sheets.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleDownloadCSV('expenses')}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Expenses.csv
              </button>
              <button
                onClick={() => handleDownloadCSV('study')}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Study.csv
              </button>
              <button
                onClick={() => handleDownloadCSV('habits')}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Habits.csv
              </button>
              <button
                onClick={() => handleDownloadCSV('workouts')}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Workouts.csv
              </button>
            </div>

            {downloadMsg && (
              <span className="text-xs font-mono text-emerald-400 block pt-1">{downloadMsg}</span>
            )}
          </div>

        </div>

      </div>

      {/* Achievements Showcase (Section 33) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              ACHIEVEMENTS & TROPHIES
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.achievements.filter(a => a.unlocked).length} / {data.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-amber-500/15 to-slate-900/80 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950/40 border-white/5 opacity-40 text-slate-500'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 mx-auto flex items-center justify-center mb-2 border border-white/5">
                <Trophy className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
              <h4 className="text-xs font-bold">{ach.title}</h4>
              <p className="text-[10px] mt-0.5 line-clamp-1">{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
