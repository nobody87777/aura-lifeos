import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Code,
  Award,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileCheck,
  Send
} from 'lucide-react';
import { CareerSkill, CareerItem } from '../types';

export const CareerScreen: React.FC = () => {
  const { data, updateCareerSkill, addCareerItem } = useApp();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Form state
  const [itemTitle, setItemTitle] = useState('');
  const [itemType, setItemType] = useState<CareerItem['type']>('certification');
  const [itemNote, setItemNote] = useState('');

  const handleCreateCareerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    addCareerItem({
      title: itemTitle.trim(),
      type: itemType,
      status: 'in_progress',
      date: new Date().toISOString().split('T')[0],
      linkOrNote: itemNote.trim() || undefined
    });

    setItemTitle('');
    setItemNote('');
    setIsAddItemModalOpen(false);
  };

  const getLevelBadge = (lvl: CareerSkill['level']) => {
    switch (lvl) {
      case 'Advanced':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">Advanced</span>;
      case 'Intermediate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">Intermediate</span>;
      case 'Learning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">Learning</span>;
      case 'Beginner':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">Beginner</span>;
    }
  };

  const getTypeIcon = (type: CareerItem['type']) => {
    switch (type) {
      case 'certification': return <Award className="w-4 h-4 text-amber-400" />;
      case 'project': return <Code className="w-4 h-4 text-purple-400" />;
      case 'resume': return <FileCheck className="w-4 h-4 text-cyan-400" />;
      case 'interview_prep': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'internship': case 'job_application': return <Send className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              CAREER READINESS ENGINE
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Skills, Portfolios & Placements</h2>
          <p className="text-xs text-slate-400">
            Track technical competence, certifications, resumes, and interview preparation for high-impact roles.
          </p>
        </div>

        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Milestone</span>
        </button>
      </div>

      {/* Skills Matrix Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300">
            ENGINEERING SKILL MATRIX
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {data.careerSkills.length} Core Competencies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {data.careerSkills.map((sk) => (
            <div
              key={sk.id}
              className="glass-card rounded-2xl p-4 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                  {getLevelBadge(sk.level)}
                </div>
                <span className="text-[10px] font-mono text-slate-400">{sk.category}</span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-cyan-300 font-bold">{sk.confidencePercent}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${sk.confidencePercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications, Internships, Applications & Resumes */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300">
            CERTIFICATIONS, INTERNSHIPS & APPLICATIONS
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {data.careerItems.length} Active Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.careerItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3.5"
            >
              <div className="p-2 rounded-lg bg-slate-950 border border-white/5">
                {getTypeIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 ml-auto">{item.date}</span>
                </div>

                <h4 className="text-xs font-bold text-white">{item.title}</h4>

                {item.linkOrNote && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {item.linkOrNote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Career Item</h3>
            <form onSubmit={handleCreateCareerItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Type</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input"
                >
                  <option value="certification">Certification</option>
                  <option value="internship">Internship</option>
                  <option value="project">Project Portfolio</option>
                  <option value="resume">Resume / CV</option>
                  <option value="interview_prep">Interview Preparation</option>
                  <option value="job_application">Job Application</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Notes / Verification URL</label>
                <input
                  type="text"
                  placeholder="Optional details, link or company..."
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
