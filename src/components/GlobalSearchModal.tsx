import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  CheckSquare,
  Repeat,
  FileText,
  Target,
  FolderGit2,
  BookOpen,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (type: string, id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const { data } = useApp();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const items: {
      type: 'Task' | 'Habit' | 'Note' | 'Goal' | 'Project' | 'Study' | 'Expense';
      title: string;
      subtitle: string;
      id: string;
    }[] = [];

    // Search tasks
    data.tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        items.push({ type: 'Task', title: t.title, subtitle: `${t.category} • ${t.status} • Due ${t.dueDate}`, id: t.id });
      }
    });

    // Search habits
    data.habits.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)) {
        items.push({ type: 'Habit', title: h.name, subtitle: `${h.category} • ${h.streak}d streak`, id: h.id });
      }
    });

    // Search notes
    data.notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        items.push({ type: 'Note', title: n.title, subtitle: `${n.category} • ${n.date}`, id: n.id });
      }
    });

    // Search goals
    data.goals.forEach((g) => {
      if (g.title.toLowerCase().includes(q) || g.todayAction.toLowerCase().includes(q)) {
        items.push({ type: 'Goal', title: g.title, subtitle: `${g.category} • ${g.progress}% progress`, id: g.id });
      }
    });

    // Search projects
    data.projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)) {
        items.push({ type: 'Project', title: p.name, subtitle: `${p.progress}% progress • Next: ${p.nextTask}`, id: p.id });
      }
    });

    // Search study sessions
    data.studySessions.forEach((s) => {
      if (s.subjectName.toLowerCase().includes(q) || s.topics.toLowerCase().includes(q)) {
        items.push({ type: 'Study', title: `${s.subjectName}: ${s.topics}`, subtitle: `${s.durationMinutes}m • ${s.date}`, id: s.id });
      }
    });

    // Search expenses
    data.finances.transactions.forEach((tx) => {
      if (tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q)) {
        items.push({ type: 'Expense', title: tx.description, subtitle: `₹${tx.amount} • ${tx.category} • ${tx.date}`, id: tx.id });
      }
    });

    return items.slice(0, 15);
  }, [query, data]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Task': return <CheckSquare className="w-4 h-4 text-cyan-400" />;
      case 'Habit': return <Repeat className="w-4 h-4 text-emerald-400" />;
      case 'Note': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'Goal': return <Target className="w-4 h-4 text-purple-400" />;
      case 'Project': return <FolderGit2 className="w-4 h-4 text-indigo-400" />;
      case 'Study': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Expense': return <DollarSign className="w-4 h-4 text-rose-400" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center mb-4">
          <Search className="w-5 h-5 text-cyan-400 absolute left-3.5" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, habits, notes, goals, study, expenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl glass-input text-sm font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
          {query && results.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No results found matching "{query}"
            </div>
          ) : (
            results.map((res, i) => (
              <div
                key={i}
                onClick={() => {
                  if (onSelectResult) onSelectResult(res.type, res.id);
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/5">
                    {getIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                        {res.type}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{res.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{res.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-2" />
              </div>
            ))
          )}

          {!query && (
            <div className="py-6 text-center text-slate-500 text-xs">
              Type to instantly search your entire Personal Operating System.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs"
          >
            Esc to Close
          </button>
        </div>

      </div>
    </div>
  );
};
