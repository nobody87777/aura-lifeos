import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  Heart,
  Save
} from 'lucide-react';
import { JournalEntry } from '../types';

export const JournalScreen: React.FC = () => {
  const { data, saveJournal } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = data.journalEntries[todayStr];

  const [howWasToday, setHowWasToday] = useState(existingToday?.howWasToday || '');
  const [accomplishments, setAccomplishments] = useState(existingToday?.accomplishments || '');
  const [whatWentWrong, setWhatWentWrong] = useState(existingToday?.whatWentWrong || '');
  const [whatToDoDifferently, setWhatToDoDifferently] = useState(existingToday?.whatToDoDifferently || '');
  const [gratitude, setGratitude] = useState(existingToday?.gratitude || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveJournal(todayStr, {
      id: `j-${todayStr}`,
      date: todayStr,
      howWasToday,
      accomplishments,
      whatWentWrong,
      whatToDoDifferently,
      gratitude
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const pastEntries = Object.values(data.journalEntries).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            DECOMPRESSION & CLARITY
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Daily Journal</h2>
        <p className="text-xs text-slate-400">
          Unfiltered space to log thoughts, accomplishments, and reset your mind. 100% private and offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Journal Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            <div>
              <label className="block font-mono uppercase text-slate-300 font-bold mb-1.5 text-xs">
                How was today?
              </label>
              <textarea
                rows={3}
                placeholder="Free write: How did the day feel? What did you think about during college or coding?"
                value={howWasToday}
                onChange={(e) => setHowWasToday(e.target.value)}
                className="w-full p-3.5 rounded-2xl glass-input text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-emerald-400 font-bold mb-1.5 text-xs">
                What did I accomplish?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Cleared OS lab exam viva questions, wrote 120 lines on MultitaskCoder"
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                className="w-full p-3.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-rose-400 font-bold mb-1.5 text-xs">
                  What went wrong?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Lost 45 minutes to reels during canteen break"
                  value={whatWentWrong}
                  onChange={(e) => setWhatWentWrong(e.target.value)}
                  className="w-full p-3.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-amber-400 font-bold mb-1.5 text-xs">
                  What should I do differently?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Keep phone in bag between 2 PM and 4 PM"
                  value={whatToDoDifferently}
                  onChange={(e) => setWhatToDoDifferently(e.target.value)}
                  className="w-full p-3.5 rounded-2xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase text-purple-400 font-bold mb-1.5 text-xs">
                One thing I'm grateful for:
              </label>
              <input
                type="text"
                placeholder="e.g. A good cup of tea and steady internet connection"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="w-full p-3.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Journal saved (+20 XP)!
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  {existingToday ? 'Saved for today' : 'Not yet saved'}
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </button>
            </div>

          </form>
        </div>

        {/* Past Entries */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            PAST JOURNAL LOGS
          </h3>

          {pastEntries.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No past entries recorded yet.</p>
          ) : (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {pastEntries.map((j) => (
                <div key={j.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold">{j.date}</span>
                  </div>
                  {j.howWasToday && <p className="text-slate-300 line-clamp-2">"{j.howWasToday}"</p>}
                  {j.accomplishments && (
                    <span className="text-[11px] text-emerald-400 block font-mono">
                      ✓ {j.accomplishments}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
