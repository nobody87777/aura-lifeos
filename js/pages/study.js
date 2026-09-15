// Study Tracker Module (Sections 13-16: Computer Engineering Syllabus, Spaced Repetition, Exam Countdowns)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { ChartEngine } from '../components/charts.js';
import { getLocalDateString } from '../state.js';

export function renderStudyPage(state) {
  const subjects = state.data.subjects || [];
  const sessions = state.data.studySessions || [];
  const todayStr = getLocalDateString();

  const todayMinutes = sessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Weekly study data for SVG bar chart
  const weeklyData = [
    { label: 'Mon', value: 2.5 },
    { label: 'Tue', value: 3.0 },
    { label: 'Wed', value: 1.5 },
    { label: 'Thu', value: 2.0 },
    { label: 'Fri', value: 3.5 },
    { label: 'Sat', value: 4.0 },
    { label: 'Sun', value: parseFloat((todayMinutes / 60).toFixed(1)) || 1.0, isCurrent: true }
  ];

  // Exam countdowns
  const exams = [
    { name: 'Computer Networks Theory', code: 'CE-304', date: '2026-10-12', daysLeft: 27 },
    { name: 'Java Programming Practical Lab', code: 'CE-302P', date: '2026-10-16', daysLeft: 31 },
    { name: 'Data Structures & Algorithms Exam', code: 'CE-301', date: '2026-10-20', daysLeft: 35 }
  ];

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Engineering Study Hub</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.12); padding: 2px 8px; border-radius: 99px;">
              DIPLOMA CE
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Master your core curriculum through active recall, spaced repetition, and deep focus.
          </p>
        </div>

        <button id="btn-study-log-new" class="btn-primary" style="font-size: 12px; padding: 7px 16px;">
          + Log Study Session
        </button>
      </div>

      <!-- Top Metric Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div class="glass-card" style="padding: 16px;">
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">TODAY'S STUDY</span>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">
            ${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">Target: 2h 00m</span>
        </div>

        <div class="glass-card" style="padding: 16px;">
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700;">TOTAL ALL-TIME</span>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">
            ${totalHours} <span style="font-size: 14px; color: var(--text-dim);">hours</span>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">${sessions.length} sessions logged</span>
        </div>

        <div class="glass-card" style="padding: 16px;">
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700;">SPACED REVISION</span>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-emerald); margin-top: 4px;">
            3 Topics
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">Ready for recall today</span>
        </div>
      </div>

      <!-- Weekly Trend & Exam Countdown Grid -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 16px;" class="md-grid-2">
        
        <!-- Weekly SVG Chart -->
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 14px; font-weight: 800; color: #fff;">Weekly Study Velocity (Hours)</h3>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">Goal: 18h/wk</span>
          </div>
          ${ChartEngine.renderBarChart(weeklyData, 340, 150)}
        </div>

        <!-- Exam Countdowns (Section 16) -->
        <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h3 style="font-size: 14px; font-weight: 800; color: #fff;">Upcoming Exams & Practicals</h3>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">COUNTDOWN</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${exams.map(ex => `
                <div style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 13px;">${ex.name}</div>
                    <div style="font-size: 11px; color: var(--text-dim);">${ex.code} · ${ex.date}</div>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: ${ex.daysLeft <= 30 ? 'var(--neon-rose)' : 'var(--neon-amber)'};">${ex.daysLeft}d</span>
                    <span style="display: block; font-size: 9px; color: var(--text-dim); text-transform: uppercase;">REMAINING</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <button id="btn-add-exam-btn" class="btn-secondary" style="font-size: 11px; margin-top: 14px; justify-content: center;">
            + Add Exam Date
          </button>
        </div>

      </div>

      <!-- Computer Engineering Subjects Grid -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff;">Computer Engineering Subjects</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Track hours invested and topic confidence rating.</p>
          </div>
          <button id="btn-add-subject" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">+ Add Subject</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
          ${subjects.map(s => {
            const hrs = (s.totalMinutes / 60).toFixed(1);
            const conf = s.confidence || 70;
            const confColor = conf >= 80 ? 'var(--neon-emerald)' : conf >= 65 ? 'var(--neon-cyan)' : 'var(--neon-amber)';

            return `
              <div class="glass-card" style="padding: 14px 16px; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-weight: 800; font-size: 14px; color: #fff;">${s.name}</span>
                    <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">${s.code || 'CE'}</span>
                  </div>
                  
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; font-size: 11px;">
                    <span style="color: var(--text-muted);">Confidence:</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: ${confColor};">${conf}%</span>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div style="width: 100%; height: 5px; border-radius: 99px; background: rgba(255,255,255,0.08); margin-top: 4px; overflow: hidden;">
                    <div style="width: ${conf}%; height: 100%; background: ${confColor}; border-radius: 99px;"></div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                  <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">
                    ⏱️ ${hrs} hrs studied
                  </span>
                  <button class="btn-secondary btn-quick-study-subject" data-subject="${s.name}" style="padding: 3px 8px; font-size: 10px; color: var(--neon-cyan); border-color: rgba(0,240,255,0.3);">
                    + Log
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Spaced Repetition Due Today (Section 15) -->
      <div class="glass-card" style="padding: 20px; border-color: rgba(16,185,129,0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">🧠</span>
            <div>
              <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Spaced Repetition Review Queue</h3>
              <p style="font-size: 11px; color: var(--text-muted);">Science-backed 1-3-7-14 day retention algorithm</p>
            </div>
          </div>
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 99px;">
            READY TO REVIEW
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 13px;">Java: Collections Framework (ArrayList vs LinkedList)</div>
              <div style="font-size: 11px; color: var(--text-dim);">Last studied 3 days ago · Repetition #2</div>
            </div>
            <button class="btn-primary btn-review-complete" style="font-size: 11px; padding: 4px 12px;">Review 10m (+15 XP)</button>
          </div>

          <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 13px;">Data Structures: Binary Search Tree In-order Traversal</div>
              <div style="font-size: 11px; color: var(--text-dim);">Last studied 7 days ago · Repetition #3</div>
            </div>
            <button class="btn-primary btn-review-complete" style="font-size: 11px; padding: 4px 12px;">Review 10m (+15 XP)</button>
          </div>
        </div>
      </div>

      <!-- Recent Study Sessions Log -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 12px;">Recent Study Sessions</h3>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${sessions.length === 0 ? `
            <div style="text-align:center; padding: 20px; color: var(--text-dim); font-size: 12px;">No sessions logged yet. Hit "+ Log Study Session" to record your work!</div>
          ` : sessions.slice(0, 8).map(s => `
            <div style="padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 700; color: #fff; font-size: 13px;">${s.subjectName}</span>
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 1px 6px; border-radius: 4px;">${s.durationMinutes}m</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">
                  ${s.topics || 'Engineering practice'}
                </div>
                ${s.revisionNote ? `<div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">📝 ${s.revisionNote}</div>` : ''}
              </div>
              
              <div style="text-align: right; font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
                <div>${s.date}</div>
                <div>${s.timestamp || ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindStudyEvents(state, rerender) {
  // New Study session modal
  const logBtn = document.getElementById('btn-study-log-new');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      import('../components/quickaction.js').then(m => {
        m.QuickActionEngine.open(state, 'study');
      });
    });
  }

  // Quick log on subject card
  document.querySelectorAll('.btn-quick-study-subject').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-subject');
      state.update(d => {
        if (!d.studySessions) d.studySessions = [];
        d.studySessions.unshift({
          id: `sess-${Date.now()}`,
          subjectName: subject,
          durationMinutes: 45,
          topics: 'Subject module review',
          date: getLocalDateString(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        });
        const subj = (d.subjects || []).find(s => s.name === subject);
        if (subj) subj.totalMinutes = (subj.totalMinutes || 0) + 45;
      });

      soundSynth.playChime();
      state.addXP(20, 'Study Logged');
      showToast(`Logged 45m study for ${subject} (+20 XP)!`, 'xp');
      rerender();
    });
  });

  // Review Complete button
  document.querySelectorAll('.btn-review-complete').forEach(btn => {
    btn.addEventListener('click', () => {
      soundSynth.playChime();
      state.addXP(15, 'Spaced Repetition Review');
      showToast('Spaced repetition topic reviewed (+15 XP)! Next review in 7 days.', 'xp');
      btn.textContent = '✓ Done';
      btn.style.background = 'var(--neon-emerald)';
      btn.disabled = true;
    });
  });

  // Add Subject button
  const addSubjBtn = document.getElementById('btn-add-subject');
  if (addSubjBtn) {
    addSubjBtn.addEventListener('click', () => {
      const name = prompt('Enter new subject name (e.g. AI & Machine Learning):');
      if (name && name.trim()) {
        const code = prompt('Enter subject code (optional, e.g. CE-402):') || 'CE';
        state.update(d => {
          if (!d.subjects) d.subjects = [];
          d.subjects.push({
            id: `s-${Date.now()}`,
            name: name.trim(),
            code: code.trim(),
            totalMinutes: 0,
            confidence: 60
          });
        });
        soundSynth.playClick();
        showToast(`Subject "${name}" added to syllabus!`, 'success');
        rerender();
      }
    });
  }
}
