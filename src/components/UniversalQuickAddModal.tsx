import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  CheckSquare,
  Sparkles,
  Droplets,
  BookOpen,
  DollarSign,
  Dumbbell,
  FileText,
  Target,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { Priority } from '../types';

interface UniversalQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus?: (title: string, durationMinutes: number) => void;
}

type QuickAddType = 'task' | 'expense' | 'study' | 'note' | 'distraction' | 'attendance' | 'habit';

export const UniversalQuickAddModal: React.FC<UniversalQuickAddModalProps> = ({
  isOpen,
  onClose,
  onStartFocus
}) => {
  const {
    addTask,
    addTransaction,
    logStudySession,
    addNote,
    logDistraction,
    markAttendance,
    addHabit,
    data,
    suggestTaskTime
  } = useApp();

  const [activeType, setActiveType] = useState<QuickAddType>('task');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('College');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDuration, setTaskDuration] = useState(30);
  const [taskDueTime, setTaskDueTime] = useState('18:00');
  const [taskAutoSchedule, setTaskAutoSchedule] = useState(false);

  // Expense state
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseCat, setExpenseCat] = useState<'Food' | 'Travel' | 'Education' | 'Subscriptions' | 'Shopping' | 'Phone/Internet' | 'Entertainment' | 'Other'>('Food');

  // Study state
  const [studySubject, setStudySubject] = useState(data.subjects[0]?.name || 'Java');
  const [studyMinutes, setStudyMinutes] = useState(30);
  const [studyTopics, setStudyTopics] = useState('');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Distraction state
  const [distractionType, setDistractionType] = useState<any>('Social Media');
  const [distractionMinutes, setDistractionMinutes] = useState(20);
  const [distractionNote, setDistractionNote] = useState('');

  // Attendance state
  const [attendanceSubjId, setAttendanceSubjId] = useState(data.attendance[0]?.id || '');
  const [attendanceAttended, setAttendanceAttended] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];

    if (activeType === 'task' && taskTitle.trim()) {
      const scheduledTime = taskAutoSchedule ? suggestTaskTime(taskDuration, taskPriority) : taskDueTime;
      addTask({
        title: taskTitle.trim(),
        category: taskCategory,
        priority: taskPriority,
        tier: taskPriority === 'critical' || taskPriority === 'high' ? 'must-do' : 'should-do',
        dueDate: todayStr,
        dueTime: scheduledTime,
        estimatedMinutes: Number(taskDuration),
        difficulty: 'medium',
        energyRequired: 'medium',
        status: 'todo'
      });
      setTaskTitle('');
    } else if (activeType === 'expense' && expenseDesc.trim() && expenseAmount) {
      addTransaction({
        date: todayStr,
        description: expenseDesc.trim(),
        amount: Number(expenseAmount),
        type: 'expense',
        category: expenseCat
      });
      setExpenseDesc('');
      setExpenseAmount('');
    } else if (activeType === 'study' && studyTopics.trim()) {
      const subj = data.subjects.find(s => s.name === studySubject) || data.subjects[0];
      logStudySession({
        subjectId: subj ? subj.id : 'subj-1',
        subjectName: studySubject,
        durationMinutes: Number(studyMinutes),
        topics: studyTopics.trim(),
        difficulty: 'medium',
        focusRating: 4,
        date: todayStr,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      });
      setStudyTopics('');
    } else if (activeType === 'note' && noteTitle.trim()) {
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: 'General'
      });
      setNoteTitle('');
      setNoteContent('');
    } else if (activeType === 'distraction') {
      logDistraction(distractionType, Number(distractionMinutes), distractionNote.trim() || undefined);
      setDistractionNote('');
    } else if (activeType === 'attendance' && attendanceSubjId) {
      markAttendance(attendanceSubjId, attendanceAttended);
    }

    onClose();
  };

  const tabs: { type: QuickAddType; label: string; icon: React.ReactNode }[] = [
    { type: 'task', label: 'Task', icon: <CheckSquare className="w-4 h-4" /> },
    { type: 'expense', label: 'Expense', icon: <DollarSign className="w-4 h-4" /> },
    { type: 'study', label: 'Study', icon: <BookOpen className="w-4 h-4" /> },
    { type: 'distraction', label: 'Distraction', icon: <ShieldAlert className="w-4 h-4" /> },
    { type: 'attendance', label: 'Attendance', icon: <UserCheck className="w-4 h-4" /> },
    { type: 'note', label: 'Note', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl glow-cyan">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Universal Quick Capture</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveType(tab.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeType === tab.type
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* TASK FORM */}
          {activeType === 'task' && (
            <>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study Java Streams & Collectors"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  >
                    <option value="College">College</option>
                    <option value="MultitaskCoder">MultitaskCoder</option>
                    <option value="Coding">Coding</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full p-2 rounded-xl glass-input text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white block">Auto-Schedule For Me</span>
                    <span className="text-[10px] text-slate-400">Finds optimal evening slot after college</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={taskAutoSchedule}
                  onChange={(e) => setTaskAutoSchedule(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </div>
            </>
          )}

          {/* EXPENSE FORM */}
          {activeType === 'expense' && (
            <>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canteen lunch & tea"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 80"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl glass-input font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Category</label>
                  <select
                    value={expenseCat}
                    onChange={(e) => setExpenseCat(e.target.value as any)}
                    className="w-full p-2 rounded-xl glass-input"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* Quick amount chips */}
              <div className="flex gap-2 pt-1">
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setExpenseAmount(amt)}
                    className="flex-1 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STUDY FORM */}
          {activeType === 'study' && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Subject</label>
                  <select
                    value={studySubject}
                    onChange={(e) => setStudySubject(e.target.value)}
                    className="w-full p-2 rounded-xl glass-input"
                  >
                    {data.subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Minutes</label>
                  <input
                    type="number"
                    value={studyMinutes}
                    onChange={(e) => setStudyMinutes(Number(e.target.value))}
                    className="w-full p-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Topics Studied *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OSI 7 Layers & IP addressing"
                  value={studyTopics}
                  onChange={(e) => setStudyTopics(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </>
          )}

          {/* DISTRACTION LOG FORM */}
          {activeType === 'distraction' && (
            <>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">What pulled you away?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-2">
                  {['Social Media', 'Gaming', 'YouTube', 'Browsing', 'Chatting', 'Procrastination', 'Unplanned study', 'Other'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDistractionType(d)}
                      className={`p-1.5 rounded-lg text-[11px] font-medium border text-center ${
                        distractionType === d
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-900 text-slate-400 border-white/5'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Duration (mins)</label>
                  <input
                    type="number"
                    value={distractionMinutes}
                    onChange={(e) => setDistractionMinutes(Number(e.target.value))}
                    className="w-full p-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1 uppercase">Optional Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Scrolled reels while tired"
                    value={distractionNote}
                    onChange={(e) => setDistractionNote(e.target.value)}
                    className="w-full p-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Zero shame. Tracking distractions builds awareness and protects your focus time.
              </p>
            </>
          )}

          {/* ATTENDANCE FORM */}
          {activeType === 'attendance' && (
            <>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Subject</label>
                <select
                  value={attendanceSubjId}
                  onChange={(e) => setAttendanceSubjId(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                >
                  {data.attendance.map(a => (
                    <option key={a.id} value={a.id}>{a.subjectName} ({a.classesAttended}/{a.classesHeld})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAttendanceAttended(true)}
                  className={`py-2.5 rounded-xl font-bold border transition-all ${
                    attendanceAttended
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/5'
                  }`}
                >
                  Present (+1 Attended)
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceAttended(false)}
                  className={`py-2.5 rounded-xl font-bold border transition-all ${
                    !attendanceAttended
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/5'
                  }`}
                >
                  Absent (+1 Missed)
                </button>
              </div>
            </>
          )}

          {/* NOTE FORM */}
          {activeType === 'note' && (
            <>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Viva question reminder or MultitaskCoder idea"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-400 mb-1 uppercase">Content</label>
                <textarea
                  rows={3}
                  placeholder="Quick thoughts, links, code snippets..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2 rounded-xl glass-input"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold shadow-lg shadow-cyan-500/20"
            >
              Save Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
