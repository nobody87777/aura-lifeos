import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  User,
  Clock,
  Check,
  Sparkles,
  Database
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    data,
    updateScheduleBlock,
    exportDataJSON,
    importDataJSON,
    resetToSampleData
  } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_life_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyExport = () => {
    const jsonStr = exportDataJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importDataJSON(importJsonText.trim());
    if (success) {
      setImportMessage('Data imported successfully!');
      setImportJsonText('');
    } else {
      setImportMessage('Error: Invalid JSON format.');
    }
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all data to default Kerala Diploma Engineering student sample data?')) {
      resetToSampleData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Settings & Data Sovereignty</h2>
        <p className="text-xs text-slate-400">
          Tailor your daily schedule, streak recovery allowances, and full local backup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Context & College Schedule */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Profile & Academic Schedule</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Profile:</span>
              <span className="text-white font-bold">Diploma Computer Engineering (Kerala, India)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weekday College Hours:</span>
              <span className="text-cyan-300 font-mono font-bold">09:00 AM — 05:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Flagship Project:</span>
              <span className="text-purple-300 font-bold">MultitaskCoder</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Streak Recovery Shields:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {data.user.streakProtectionsLeft} / {data.user.maxStreakProtections} Active
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono uppercase text-slate-400 block font-bold">
              SCHEDULE BLOCK TIMINGS
            </span>
            {data.scheduleBlocks.map((block) => (
              <div key={block.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{block.name}</span>
                  <span className="text-slate-400 text-[11px] block">{block.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <input
                    type="time"
                    value={block.startTime}
                    onChange={(e) => updateScheduleBlock(block.id, { startTime: e.target.value })}
                    className="p-1 rounded bg-slate-900 border border-white/10 text-cyan-300 text-xs"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="time"
                    value={block.endTime}
                    onChange={(e) => updateScheduleBlock(block.id, { endTime: e.target.value })}
                    className="p-1 rounded bg-slate-900 border border-white/10 text-cyan-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Ownership & Backup */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Zero-Lockin Local Data Sovereignty</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              All your tasks, focus logs, habits, projects, and fitness data are saved in your browser’s localStorage. You can export a JSON backup at any time or transfer to another device.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-4">
              <button
                onClick={handleExport}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON File</span>
              </button>

              <button
                onClick={handleCopyExport}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
              >
                {copiedExport ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                <span>{copiedExport ? 'Copied to Clipboard!' : 'Copy JSON String'}</span>
              </button>
            </div>

            {/* Import JSON */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
                Restore / Import Backup JSON
              </label>
              <textarea
                rows={3}
                placeholder="Paste backup JSON data here..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
              />
              <div className="flex items-center justify-between">
                {importMessage && (
                  <span className="text-xs font-mono text-cyan-300">{importMessage}</span>
                )}
                <button
                  onClick={handleImport}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs ml-auto"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>

          {/* Reset to Sample Data */}
          <div className="pt-4 border-t border-rose-500/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 block">Reset to Sample State</span>
                <span className="text-[11px] text-slate-400">Restore MultitaskCoder & Computer Engineering defaults</span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
