// Reviews Module (Sections 32 & 33: Nightly Shutdown Protocol & Weekly Retrospective)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';

export function renderReviewsPage(state, activeTab = 'nightly') {
  const d = state.data;
  const todayStr = getLocalDateString();
  const pendingTasks = (d.tasks || []).filter(t => t.dueDate === todayStr && t.status !== 'completed');

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Reviews & Protocols</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.12); padding: 2px 8px; border-radius: 99px;">
              SYSTEM CYCLES
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Close open mental loops before sleeping and evaluate weekly trajectory.
          </p>
        </div>

        <div style="display: flex; gap: 6px;">
          <button class="btn-secondary review-tab-btn ${activeTab === 'nightly' ? 'active-tab' : ''}" data-tab="nightly" style="padding: 6px 14px; font-size: 12px;">
            🌙 Nightly Shutdown
          </button>
          <button class="btn-secondary review-tab-btn ${activeTab === 'weekly' ? 'active-tab' : ''}" data-tab="weekly" style="padding: 6px 14px; font-size: 12px;">
            📊 Weekly Retrospective
          </button>
        </div>
      </div>

      <!-- TAB 1: NIGHTLY SHUTDOWN (Section 32) -->
      ${activeTab === 'nightly' ? `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <div class="glass-card" style="padding: 24px; border-color: rgba(99,102,241,0.4); background: linear-gradient(135deg, rgba(30,27,75,0.7), rgba(15,20,32,0.95));">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 28px;">🌙</span>
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: #a5b4fc; font-weight: 700;">EVENING CLOSURE PROTOCOL</span>
                <h2 style="font-size: 18px; font-weight: 800; color: #fff;">Clear Your Mind Before Bed</h2>
              </div>
            </div>
            <p style="font-size: 12px; color: #e0e7ff; margin-top: 8px; line-height: 1.5;">
              "The mind cannot truly rest if open tasks remain unresolved in working memory. Decide what rolls over, declare tomorrow's Top 3, and disconnect."
            </p>
          </div>

          <!-- Step 1: Remaining Tasks Review -->
          <div class="glass-card" style="padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h3 style="font-size: 15px; font-weight: 800; color: #fff;">1. Clear Remaining Tasks (${pendingTasks.length})</h3>
              <button id="btn-rollover-all" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">
                Roll All Over to Tomorrow ➔
              </button>
            </div>

            ${pendingTasks.length === 0 ? `
              <div style="padding: 16px; border-radius: 8px; background: rgba(16,185,129,0.1); border: 1px solid var(--neon-emerald); color: var(--neon-emerald); font-size: 13px; font-weight: 600;">
                ✓ Outstanding tasks zero! Your schedule is completely clear for the night.
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${pendingTasks.map(t => `
                  <div style="padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 13px; color: #fff;">${t.title}</span>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn-secondary btn-task-done-shutdown" data-id="${t.id}" style="font-size: 10px; padding: 3px 8px; color: var(--neon-emerald);">✓ Done</button>
                      <button class="btn-secondary btn-task-rollover" data-id="${t.id}" style="font-size: 10px; padding: 3px 8px; color: var(--neon-cyan);">➔ Tomorrow</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Step 2: Set Tomorrow's Top 3 Priorities -->
          <div class="glass-card" style="padding: 20px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 6px;">2. Lock Tomorrow's Top 3 Priorities</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
              Wake up with zero hesitation. Know exactly what matters before your feet hit the floor.
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <input type="text" id="shutdown-top1" class="input-field" placeholder="Top 1 Must-Do (e.g. Java Streams Practice)" value="${d.tasks.find(t => t.isTop3)?.title || ''}" />
              <input type="text" id="shutdown-top2" class="input-field" placeholder="Top 2 (e.g. MultitaskCoder Debugger Fix)" />
              <input type="text" id="shutdown-top3" class="input-field" placeholder="Top 3 (e.g. Gym Back & Biceps)" />
            </div>
          </div>

          <!-- Step 3: Complete Shutdown Button -->
          <div style="text-align: center; padding: 10px 0;">
            <button id="btn-execute-shutdown" class="btn-primary" style="padding: 14px 36px; font-size: 15px; border-radius: 99px; background: linear-gradient(135deg, var(--neon-indigo), var(--neon-purple));">
              🌙 Complete Shutdown Protocol (+25 XP)
            </button>
          </div>

        </div>
      ` : `
        <!-- TAB 2: WEEKLY RETROSPECTIVE (Section 33) -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <div class="glass-card" style="padding: 24px; border-color: rgba(0,240,255,0.4); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(7,14,28,0.9));">
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">WEEKLY EXECUTIVE REPORT</span>
            <h2 style="font-size: 20px; font-weight: 800; color: #fff; margin-top: 4px;">7-Day Trajectory Health</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              You maintained an unbroken 7-day streak with 2 protection shields remaining.
            </p>
          </div>

          <!-- 4 Core Weekly Pillars Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div class="glass-card" style="padding: 16px;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">STUDY VELOCITY</span>
              <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">17.5 <span style="font-size: 13px; color: var(--text-dim);">hrs</span></div>
              <span style="font-size: 11px; color: var(--neon-emerald);">97% of 18h target</span>
            </div>

            <div class="glass-card" style="padding: 16px;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700;">CODING COMMITS</span>
              <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">8.5 <span style="font-size: 13px; color: var(--text-dim);">hrs</span></div>
              <span style="font-size: 11px; color: var(--text-muted);">MultitaskCoder 72%</span>
            </div>

            <div class="glass-card" style="padding: 16px;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700;">WORKOUT FREQUENCY</span>
              <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">5 / 6 <span style="font-size: 13px; color: var(--text-dim);">days</span></div>
              <span style="font-size: 11px; color: var(--neon-emerald);">Excellent consistency</span>
            </div>

            <div class="glass-card" style="padding: 16px;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-amber); font-weight: 700;">ATTENDANCE STABILITY</span>
              <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">81.2%</div>
              <span style="font-size: 11px; color: var(--neon-emerald);">Safe above 75% rule</span>
            </div>
          </div>

          <!-- Weekly Win Celebration Card -->
          <div class="glass-card" style="padding: 20px; border-color: rgba(245,158,11,0.3);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 24px;">🏆</span>
              <div>
                <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Weekly Keystone Achievement</h3>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                  Shipped the core Interactive Theory engine in MultitaskCoder and maintained 100% attendance in Java Programming!
                </p>
              </div>
            </div>
          </div>

        </div>
      `}

    </div>
  `;
}

export function bindReviewsEvents(state, onTabChange, rerender) {
  const todayStr = getLocalDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);

  // Tab switching
  document.querySelectorAll('.review-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      onTabChange(tab);
    });
  });

  // Roll over all tasks to tomorrow
  const rollAllBtn = document.getElementById('btn-rollover-all');
  if (rollAllBtn) {
    rollAllBtn.addEventListener('click', () => {
      state.update(d => {
        (d.tasks || []).forEach(t => {
          if (t.dueDate === todayStr && t.status !== 'completed') {
            t.dueDate = tomorrowStr;
          }
        });
      });
      soundSynth.playClick();
      showToast('All remaining tasks rescheduled for tomorrow.');
      rerender();
    });
  }

  // Single task done in shutdown
  document.querySelectorAll('.btn-task-done-shutdown').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const t = d.tasks?.find(x => x.id === id);
        if (t) t.status = 'completed';
      });
      soundSynth.playChime();
      state.addXP(15, 'Task Completed');
      rerender();
    });
  });

  // Single task rollover in shutdown
  document.querySelectorAll('.btn-task-rollover').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const t = d.tasks?.find(x => x.id === id);
        if (t) t.dueDate = tomorrowStr;
      });
      soundSynth.playClick();
      rerender();
    });
  });

  // Execute shutdown protocol
  const executeBtn = document.getElementById('btn-execute-shutdown');
  if (executeBtn) {
    executeBtn.addEventListener('click', () => {
      const t1 = document.getElementById('shutdown-top1')?.value.trim();
      const t2 = document.getElementById('shutdown-top2')?.value.trim();
      const t3 = document.getElementById('shutdown-top3')?.value.trim();

      state.update(d => {
        // Add tomorrow tasks if entered
        [t1, t2, t3].filter(Boolean).forEach(title => {
          const exists = d.tasks.some(x => x.title === title && x.dueDate === tomorrowStr);
          if (!exists) {
            d.tasks.unshift({
              id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              title,
              tier: 'must-do',
              category: 'Personal',
              dueDate: tomorrowStr,
              estimatedMinutes: 30,
              status: 'todo',
              isTop3: true
            });
          }
        });
      });

      soundSynth.playChime();
      state.addXP(25, 'Nightly Shutdown Protocol');
      showToast('Shutdown Complete (+25 XP). Put devices away and rest well! 🌙', 'xp');
      executeBtn.textContent = '✓ System Shutdown Complete';
      executeBtn.disabled = true;
    });
  }
}
