// Storage Engine: LocalStorage + Validation + JSON/CSV Export/Import (100% Offline, Zero Backend)

const STORAGE_KEY = 'aura_lifeos_data_v1';

export class StorageEngine {
  static load() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.user && parsed.tasks) {
        return parsed;
      }
    } catch (err) {
      console.warn('Storage read warning, falling back to default:', err);
    }
    return null;
  }

  static save(data) {
    try {
      if (typeof localStorage === 'undefined') return false;
      if (!data || typeof data !== 'object') return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Storage save error:', err);
      return false;
    }
  }

  static exportJSON(data) {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return '';
    }
  }

  static importJSON(rawStr) {
    try {
      if (!rawStr || typeof rawStr !== 'string') return { success: false, error: 'Empty data provided' };
      const parsed = JSON.parse(rawStr);
      // Section 60 & 76: Sanitize & Validate
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON structure' };
      }
      if (!parsed.user || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.habits)) {
        return { success: false, error: 'Backup is missing essential user or task entities.' };
      }
      // Save sanitized state
      this.save(parsed);
      return { success: true, data: parsed };
    } catch {
      return { success: false, error: 'Corrupted JSON file. Your existing data remains safe.' };
    }
  }

  static exportCSV(type, data) {
    try {
      if (type === 'expenses') {
        const headers = 'Date,Description,Amount,Type,Category\n';
        const rows = (data.finances?.transactions || []).map(t =>
          `"${t.date}","${(t.description || '').replace(/"/g, '""')}",${t.amount},"${t.type}","${t.category}"`
        ).join('\n');
        return headers + rows;
      } else if (type === 'study') {
        const headers = 'Date,Subject,DurationMinutes,Topics,Difficulty,FocusRating,RevisionNote\n';
        const rows = (data.studySessions || []).map(s =>
          `"${s.date}","${s.subjectName}",${s.durationMinutes},"${(s.topics || '').replace(/"/g, '""')}","${s.difficulty}",${s.focusRating},"${(s.revisionNote || '').replace(/"/g, '""')}"`
        ).join('\n');
        return headers + rows;
      } else if (type === 'habits') {
        const headers = 'Name,Category,Target,Streak,BestStreak,TotalCompletions\n';
        const rows = (data.habits || []).map(h =>
          `"${h.name}","${h.category}","${h.target}",${h.streak},${h.bestStreak},${(h.completedDates || []).length}`
        ).join('\n');
        return headers + rows;
      } else if (type === 'workouts') {
        const headers = 'WorkoutDone,Pushups,Pullups,PlankSeconds,Steps\n';
        const f = data.fitness || {};
        return headers + `${f.todayWorkoutDone},${f.pushupsToday},${f.pullupsToday},${f.plankSecondsToday},${f.stepsToday}`;
      }
    } catch (err) {
      console.error('CSV generation error', err);
    }
    return '';
  }

  static downloadBlob(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
