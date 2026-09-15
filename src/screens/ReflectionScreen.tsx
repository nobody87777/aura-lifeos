import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Heart,
  Smartphone,
  BatteryCharging,
  Smile,
  Meh,
  Frown,
  Sun
} from 'lucide-react';
import { DailyReflection, EnergyLevel } from '../types';

export const ReflectionScreen: React.FC = () => {
  const { data, saveReflection, setEnergyLevel } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = data.reflections[todayStr];

  const [mood, setMood] = useState<DailyReflection['mood']>(existingToday?.mood || 'good');
  const [energy, setEnergy] = useState<EnergyLevel>(existingToday?.energy || data.activeEnergy || 'high');
  const [screenTime, setScreenTime] = useState<number>(existingToday?.screenTimeHours || 3.5);
  const [wins, setWins] = useState(existingToday?.wins || '');
  const [improvement, setImprovement] = useState(existingToday?.improvement || '');
  const [gratitude, setGratitude] = useState(existingToday?.gratitude || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveReflection(todayStr, {
      date: todayStr,
      mood,
      energy,
      screenTimeHours: Number(screenTime),
      wins,
      improvement,
      gratitude
    });
    setEnergyLevel(energy);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const moodOptions: { type: DailyReflection['mood']; label: string; icon: string }[] = [
    { type: 'great', label: 'Great', icon: '🚀' },
    { type: 'good', label: 'Good', icon: '😊' },
    { type: 'neutral', label: 'Neutral', icon: '😐' },
    { type: 'tired', label: 'Tired', icon: '🥱' },
    { type: 'stressed', label: 'Stressed', icon: '😤' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
            EVENING WIND DOWN
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Daily Reflection & Awareness</h2>
        <p className="text-xs text-slate-400">
          Empty your mind before sleeping. Acknowledging your wins creates enduring consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reflection Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mood selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-bold">
                How was your general mood today?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setMood(opt.type)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      mood === opt.type
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200 scale-105 shadow-md shadow-purple-500/20'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{opt.icon}</span>
                    <span className="text-[10px] font-mono capitalize">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level & Screen Time row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-bold flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
                  Current Energy Level
                </label>
                <div className="flex gap-2">
                  {(['high', 'medium', 'low'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergy(lvl)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                        energy === lvl
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900/60 border-white/5 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-bold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  Screen-Time Awareness (Hours)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={screenTime}
                    onChange={(e) => setScreenTime(Number(e.target.value))}
                    className="w-28 p-2 rounded-xl glass-input text-xs font-mono"
                  />
                  <span className="text-xs text-slate-400 font-mono">
                    {screenTime > 5 ? '⚠️ High phone usage' : '✅ Mindful usage'}
                  </span>
                </div>
              </div>
            </div>

            {/* Today's Wins */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1.5 font-bold">
                Today's Wins: What went well?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Completed Java streams assignment, hit the gym on time, drank all 8 glasses."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full p-3 rounded-2xl glass-input text-xs"
              />
            </div>

            {/* Tomorrow's improvement */}
            <div>
              <label className="block text-xs font-mono uppercase text-amber-400 mb-1.5 font-bold">
                One adjustment for tomorrow:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Put phone in another room during the 17:00 study block."
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                className="w-full p-3 rounded-2xl glass-input text-xs"
              />
            </div>

            {/* Gratitude */}
            <div>
              <label className="block text-xs font-mono uppercase text-cyan-400 mb-1.5 font-bold">
                Gratitude: What are you thankful for?
              </label>
              <input
                type="text"
                placeholder="e.g. Health, supportive family, and access to modern engineering education."
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="w-full p-3 rounded-2xl glass-input text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Reflection Saved (+20 XP)!
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">
                  {existingToday ? 'Saved for today' : 'Not yet logged today'}
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                Complete Daily Reflection (+20 XP)
              </button>
            </div>

          </form>
        </div>

        {/* Mindset & Guidance Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              WHY REFLECT NIGHTLY?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you write down tomorrow's focus and close out today, your brain stops worrying about unfinished tasks while you sleep.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] font-mono text-cyan-300">
              ⚡ Aligns tomorrow's "What Should I Do Now?" suggestions with your real energy.
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
              PREVIOUS REFLECTION (LOGGED)
            </h3>
            {existingToday ? (
              <div className="space-y-2 text-xs text-slate-300">
                <p><strong>Wins:</strong> {existingToday.wins}</p>
                <p><strong>Focus for tomorrow:</strong> {existingToday.improvement}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No previous entry for today yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
