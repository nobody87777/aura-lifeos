import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';
import { Difficulty, Subject, ExamDeadline } from '../types';

interface StudyScreenProps {
  onStartFocus: (title: string, durationMinutes: number) => void;
}

export const StudyScreen: React.FC<StudyScreenProps> = ({ onStartFocus }) => {
  const { data, logStudySession, addSubject } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Study log form
  const [selectedSubjectId, setSelectedSubjectId] = useState(data.subjects[0]?.id || '');
  const [sessionDuration, setSessionDuration] = useState(30);
  const [sessionTopics, setSessionTopics] = useState('');
  const [sessionDifficulty, setSessionDifficulty] = useState<Difficulty>('medium');
  const [sessionFocusRating, setSessionFocusRating] = useState(4);
  const [sessionRevisionNote, setSessionRevisionNote] = useState('');

  // Add subject form
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's study by subject
  const todaySessions = data.studySessions.filter((s) => s.date === todayStr);
  const totalStudyMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Calculate week's total study minutes
  const totalStudyMinutesAll = data.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0) + 480; // include week baseline
  const weekHours = Math.floor(totalStudyMinutesAll / 60);
  const weekRemainingMins = totalStudyMinutesAll % 60;

  const handleSaveStudyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopics.trim()) return;

    const subj = data.subjects.find((s) => s.id === selectedSubjectId);
    const now = new Date();

    logStudySession({
      subjectId: selectedSubjectId,
      subjectName: subj ? subj.name : 'Engineering Study',
      durationMinutes: Number(sessionDuration),
      topics: sessionTopics.trim(),
      difficulty: sessionDifficulty,
      focusRating: sessionFocusRating,
      revisionNote: sessionRevisionNote.trim() || undefined,
      date: todayStr,
      timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    setSessionTopics('');
    setSessionRevisionNote('');
    setIsLogModalOpen(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;
    addSubject({
      name: newSubjName.trim(),
      code: newSubjCode.trim() || undefined,
      totalMinutes: 0,
      confidence: 50,
      color: '#38bdf8',
      icon: 'BookOpen'
    });
    setNewSubjName('');
    setNewSubjCode('');
    setIsAddSubjectModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              COMPUTER ENGINEERING
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Academic & Tech Study Hub</h2>
          <p className="text-xs text-slate-400">
            Track syllabus coverage, log study logs with auto-revision reminders, and monitor exam deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 transition-all glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Log Study Session</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Today's Study Breakdown Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              STUDY TODAY
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {totalStudyMinutesToday} minutes total
            </span>
          </div>

          {todaySessions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No study sessions logged yet today.</p>
          ) : (
            <div className="space-y-2">
              {todaySessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-white block">{s.subjectName}</span>
                    <span className="text-[11px] text-slate-400">{s.topics}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-cyan-300 font-bold">{s.durationMinutes} min</span>
                    <span className="text-[10px] text-slate-500 block">Diff: {s.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Volume Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              THIS WEEK'S VOLUME
            </span>
            <div className="text-4xl font-black font-mono text-purple-300 my-2">
              {weekHours}h {weekRemainingMins}m
            </div>
            <p className="text-xs text-slate-400">
              Consistent daily study prevents semester exam cramming and keeps your engineering GPA high.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Weekly Target: 10h 00m</span>
            <span className="text-emerald-400 font-bold">87% reached</span>
          </div>
        </div>

      </div>

      {/* Upcoming Exam & Deadline System */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Upcoming Exams & Submissions</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
            Countdown Tracker
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {data.exams.map((exam) => {
            const daysRemaining = Math.max(
              0,
              Math.ceil((new Date(exam.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            );

            return (
              <div
                key={exam.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-amber-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                      {exam.type}
                    </span>
                    <span className="font-mono text-xs text-slate-300 font-bold">
                      {daysRemaining} days left
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1 mb-2 leading-snug">
                    {exam.title}
                  </h4>

                  {exam.notes && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                      {exam.notes}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Preparation</span>
                    <span className="text-cyan-300 font-bold">{exam.prepPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${exam.prepPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diploma Computer Engineering Subjects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Course Subjects & Mastery</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {data.subjects.length} Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {data.subjects.map((subj) => (
            <div
              key={subj.id}
              className="glass-card rounded-2xl p-4 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{subj.name}</h4>
                    {subj.code && (
                      <span className="text-[10px] font-mono text-slate-400">{subj.code}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onStartFocus(`Study ${subj.name}`, 30)}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                    title={`Start study focus for ${subj.name}`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="flex items-center gap-3 my-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {Math.floor(subj.totalMinutes / 60)}h {subj.totalMinutes % 60}m logged
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-emerald-400 font-bold">{subj.confidence}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${subj.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Session Logger Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Log Study Session</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Reflect on what you just studied. If you add a revision note, the system will automatically create a spaced repetition reminder for tomorrow!
            </p>

            <form onSubmit={handleSaveStudyLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Subject *</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  >
                    {data.subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">How Long? (min)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-400 uppercase mb-1">What did you study? *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Streams, Lambdas & Optional API"
                  value={sessionTopics}
                  onChange={(e) => setSessionTopics(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">How difficult?</label>
                  <select
                    value={sessionDifficulty}
                    onChange={(e) => setSessionDifficulty(e.target.value as Difficulty)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">How focused were you? (1-5)</label>
                  <select
                    value={sessionFocusRating}
                    onChange={(e) => setSessionFocusRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  >
                    <option value={5}>5 - Hyper Focus 🔥</option>
                    <option value={4}>4 - Solid Focus 🚀</option>
                    <option value={3}>3 - Good 👍</option>
                    <option value={2}>2 - Some Distractions</option>
                    <option value={1}>1 - Struggled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-400 uppercase mb-1">
                  What should you revise later? (Auto-creates reminder)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Re-check parallel stream pitfalls"
                  value={sessionRevisionNote}
                  onChange={(e) => setSessionRevisionNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Save Log (+25 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Engineering Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-slate-400 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & ML"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-400 mb-1">Course Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CE-405"
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
