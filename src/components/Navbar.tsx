import React, { useState } from 'react';
import {
  Home,
  CheckSquare,
  Timer,
  BookOpen,
  FolderGit2,
  Activity,
  MoreHorizontal,
  Wallet,
  Compass,
  LineChart,
  Settings,
  X,
  Zap,
  Briefcase,
  Target,
  UserCheck,
  BookMarked,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';

export type TabType =
  | 'home'
  | 'tasks'
  | 'focus'
  | 'study'
  | 'projects'
  | 'career'
  | 'goals'
  | 'attendance'
  | 'health'
  | 'finance'
  | 'journal'
  | 'reflection'
  | 'weekly-review'
  | 'progress'
  | 'profile'
  | 'settings';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSmartAction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenSmartAction }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems: { tab: TabType; label: string; icon: React.ReactNode }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'focus', label: 'Focus', icon: <Timer className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'study', label: 'Study', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'career', label: 'Career', icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'goals', label: 'Goals', icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'attendance', label: 'Attendance', icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { tab: 'health', label: 'Health', icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ];

  const moreItems: { tab: TabType; label: string; desc: string; icon: React.ReactNode; category: string }[] = [
    { tab: 'finance', label: 'Finance (₹ INR)', desc: 'Student budget & expense tracking', icon: <Wallet className="w-5 h-5 text-amber-400" />, category: 'Finances' },
    { tab: 'journal', label: 'Daily Journal', desc: 'Accomplishments, gratitude & reflections', icon: <BookMarked className="w-5 h-5 text-cyan-400" />, category: 'Mindfulness' },
    { tab: 'reflection', label: 'Evening Wind-Down', desc: 'Mood, energy, screen-time awareness', icon: <Compass className="w-5 h-5 text-purple-400" />, category: 'Mindfulness' },
    { tab: 'weekly-review', label: 'Weekly Retrospective', desc: 'Performance report & wins analysis', icon: <Calendar className="w-5 h-5 text-blue-400" />, category: 'Analytics' },
    { tab: 'progress', label: 'Progress & Streaks', desc: 'XP levels, badges & streak shields', icon: <LineChart className="w-5 h-5 text-emerald-400" />, category: 'Gamification' },
    { tab: 'profile', label: 'User Profile & Themes', desc: 'Identity, theme picker & CSV exports', icon: <User className="w-5 h-5 text-pink-400" />, category: 'System' },
    { tab: 'settings', label: 'Settings & Data Sovereignty', desc: 'Schedule block timings & JSON backup', icon: <Settings className="w-5 h-5 text-slate-400" />, category: 'System' }
  ];

  const handleSelectMoreTab = (tab: TabType) => {
    onSelectTab(tab);
    setShowMoreMenu(false);
  };

  const isMoreTabActive = ['finance', 'journal', 'reflection', 'weekly-review', 'progress', 'profile', 'settings'].includes(currentTab);

  return (
    <>
      {/* Desktop Top Sub-Navigation Bar */}
      <nav className="hidden md:flex items-center justify-center border-b border-white/5 bg-[#090d16]/90 backdrop-blur-md px-4 py-2 sticky top-[61px] z-20 overflow-x-auto">
        <div className="flex items-center gap-1">
          {mainNavItems.map((item) => {
            const active = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

          {/* More Dropdown Trigger */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              isMoreTabActive
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More Modules</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (5 Primary + Do Now + More) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'home' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('tasks')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'tasks' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Tasks</span>
          </button>

          {/* Center Smart Action Button */}
          <button
            onClick={onOpenSmartAction}
            className="flex flex-col items-center justify-center -mt-5"
            title="What should I do now?"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40 active:scale-95 transition-all glow-cyan">
              <Zap className="w-5 h-5 text-white fill-current animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-cyan-300 font-bold mt-1 uppercase">DO NOW</span>
          </button>

          <button
            onClick={() => onSelectTab('focus')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'focus' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-500'
            }`}
          >
            <Timer className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Focus</span>
          </button>

          {/* More trigger */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isMoreTabActive ? 'text-purple-400 font-bold scale-105' : 'text-slate-500'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* More Modules Modal / Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0d121f] rounded-t-3xl md:rounded-3xl border border-white/10 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-base">Full Operating System Directory</h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Quick direct access to main tabs if in mobile */}
              <button
                onClick={() => handleSelectMoreTab('study')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Engineering Study</span>
                  <span className="text-[10px] text-slate-400">Syllabus & Exams</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMoreTab('projects')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <FolderGit2 className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-bold text-white block">MultitaskCoder</span>
                  <span className="text-[10px] text-slate-400">Flagship project board</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMoreTab('career')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Career & Skills</span>
                  <span className="text-[10px] text-slate-400">Skill matrix & resumes</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMoreTab('goals')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <Target className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Goals Breakdown</span>
                  <span className="text-[10px] text-slate-400">Year to today cascade</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMoreTab('attendance')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Attendance 75%</span>
                  <span className="text-[10px] text-slate-400">College lecture compliance</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMoreTab('health')}
                className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800"
              >
                <Activity className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Health & Gym</span>
                  <span className="text-[10px] text-slate-400">Water, sleep & workouts</span>
                </div>
              </button>

              {/* Extended More Items */}
              {moreItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleSelectMoreTab(item.tab)}
                  className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-left flex items-center gap-3 hover:bg-slate-800 sm:col-span-1"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
