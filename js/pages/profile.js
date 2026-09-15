// Profile, Gamification & Settings Module (Sections 4, 5, 59, 60: XP, Achievements, 5 Themes, JSON/CSV Export)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { StorageEngine } from '../storage.js';

export function renderProfilePage(state) {
  const d = state.data;
  const user = d.user || { name: 'Diploma Engineer', level: 4, xp: 1420, xpToNextLevel: 2000, title: 'Algorithm Knight', currentStreak: 7, streakProtectionsLeft: 2 };
  const achievements = d.achievements || [];
  const currentTheme = d.theme || 'dark-neon';

  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  const themes = [
    { id: 'dark-neon', name: 'Dark Neon', desc: 'Futuristic glassmorphism with cyan accents', border: 'var(--neon-cyan)' },
    { id: 'midnight', name: 'Midnight Blue', desc: 'Deep sapphire navy with indigo glow', border: '#818cf8' },
    { id: 'amoled', name: 'AMOLED Black', desc: 'True #000000 OLED battery saver', border: '#ffffff' },
    { id: 'matrix', name: 'Matrix Emerald', desc: 'Cyberpunk emerald terminal phosphor', border: '#34d399' },
    { id: 'minimal-dark', name: 'Minimal Dark', desc: 'Monochrome charcoal slate workspace', border: '#cbd5e1' }
  ];

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">System Profile & Command</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 99px;">
              LEVEL ${user.level}
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Manage gamification progression, custom schedules, theme engine, and data backups.
          </p>
        </div>
      </div>

      <!-- Player Identity & Level Banner -->
      <div class="glass-card" style="padding: 24px; border-color: rgba(0,240,255,0.3); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(20,15,35,0.9));">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple)); display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 10px 25px rgba(0,240,255,0.3);">
              ⚡
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 20px; font-weight: 800; color: #fff;">${user.name}</h2>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-purple); background: rgba(168,85,247,0.15); padding: 2px 8px; border-radius: 6px; font-weight: 700;">
                  ${user.title}
                </span>
              </div>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                Kerala Diploma Computer Engineering · MultitaskCoder Architect
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <div style="padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">ACTIVE STREAK</span>
              <div style="font-size: 18px; font-weight: 800; color: var(--neon-amber); font-family: var(--font-mono);">
                🔥 ${user.currentStreak} days
              </div>
            </div>
            <div style="padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); text-align: center;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">SHIELDS LEFT</span>
              <div style="font-size: 18px; font-weight: 800; color: var(--neon-emerald); font-family: var(--font-mono);">
                🛡️ ${user.streakProtectionsLeft} / 3
              </div>
            </div>
          </div>
        </div>

        <!-- Level XP Progress Bar -->
        <div style="margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); margin-bottom: 6px;">
            <span style="color: var(--neon-cyan); font-weight: 700;">LEVEL ${user.level} PROGRESS</span>
            <span style="color: #fff;">${user.xp} / ${user.xpToNextLevel} XP (${xpPercent}%)</span>
          </div>
          <div style="width: 100%; height: 8px; border-radius: 99px; background: rgba(255,255,255,0.08); overflow: hidden;">
            <div style="width: ${xpPercent}%; height: 100%; background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); border-radius: 99px; transition: width 0.4s ease;"></div>
          </div>
        </div>
      </div>

      <!-- Achievements Gallery (Section 5) -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Unlocked Achievements</h3>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">
            ${achievements.filter(a => a.unlocked).length} / ${achievements.length} UNLOCKED
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
          ${achievements.map(a => `
            <div style="padding: 12px; border-radius: 12px; border: 1px solid ${a.unlocked ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.06)'}; background: ${a.unlocked ? 'rgba(0,240,255,0.05)' : 'rgba(255,255,255,0.01)'}; display: flex; align-items: center; gap: 12px; opacity: ${a.unlocked ? '1' : '0.45'};">
              <span style="font-size: 28px;">${a.icon}</span>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 13px;">${a.title}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${a.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Theme Selector Engine (Section 4) -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 4px;">Visual Design System & Themes</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">Select your preferred aesthetic. Applied instantaneously without reloads.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          ${themes.map(th => `
            <button class="btn-select-theme btn-secondary ${currentTheme === th.id ? 'active-tab' : ''}" data-theme="${th.id}" style="padding: 14px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; ${currentTheme === th.id ? 'border-color: ' + th.border + '; background: rgba(255,255,255,0.04);' : ''}">
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <span style="font-weight: 700; color: #fff; font-size: 13px;">${th.name}</span>
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${th.border}; display: inline-block;"></span>
              </div>
              <span style="font-size: 11px; color: var(--text-dim); line-height: 1.3;">${th.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- System Preferences & Schedules (Section 59) -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Operating Parameters & Schedules</h3>
          <button id="btn-save-settings" class="btn-primary" style="font-size: 11px; padding: 5px 12px;">Save Settings</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">WAKE UP TARGET</label>
            <input type="time" id="set-waketime" class="input-field" value="${user.wakeTime || '05:30'}" style="margin-top: 4px;" />
          </div>
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">SLEEP TARGET (HOURS)</label>
            <input type="number" step="0.5" id="set-sleeptarget" class="input-field" value="${user.sleepTargetHours || 7.5}" style="margin-top: 4px;" />
          </div>
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">COLLEGE START</label>
            <input type="time" id="set-collegestart" class="input-field" value="${user.collegeStart || '09:00'}" style="margin-top: 4px;" />
          </div>
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">COLLEGE END</label>
            <input type="time" id="set-collegeend" class="input-field" value="${user.collegeEnd || '17:00'}" style="margin-top: 4px;" />
          </div>
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">MONTHLY BUDGET (INR ₹)</label>
            <input type="number" id="set-budget" class="input-field" value="${d.finances?.monthlyBudget || 6000}" style="margin-top: 4px;" />
          </div>
        </div>
      </div>

      <!-- Data Backup & CSV Exports (Section 60) -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 4px;">Data Portability & Offline Backup</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">100% client-side data ownership. Export complete JSON snapshots or individual CSV tables.</p>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="btn-export-json" class="btn-primary" style="font-size: 11px; padding: 7px 14px;">
            📥 Download Full JSON Backup
          </button>
          
          <label class="btn-secondary" style="font-size: 11px; padding: 7px 14px; cursor: pointer;">
            📤 Restore from JSON
            <input type="file" id="input-import-json" accept=".json" style="display: none;" />
          </label>

          <button id="btn-export-expenses-csv" class="btn-secondary" style="font-size: 11px; padding: 7px 14px;">
            📊 Export Expenses CSV
          </button>

          <button id="btn-export-study-csv" class="btn-secondary" style="font-size: 11px; padding: 7px 14px;">
            📚 Export Study Sessions CSV
          </button>

          <button id="btn-reset-demo-data" class="btn-secondary" style="font-size: 11px; padding: 7px 14px; color: var(--neon-rose); border-color: rgba(244,63,94,0.3); margin-left: auto;">
            ⚠️ Reset to Factory State
          </button>
        </div>
      </div>

    </div>
  `;
}

export function bindProfileEvents(state, rerender) {
  // Theme selection
  document.querySelectorAll('.btn-select-theme').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.className = `theme-${theme}`;
      state.update(d => {
        d.theme = theme;
      });
      soundSynth.playClick();
      showToast(`Theme switched to ${theme}`);
      rerender();
    });
  });

  // Save Settings
  const saveBtn = document.getElementById('btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const wake = document.getElementById('set-waketime')?.value;
      const sleep = Number(document.getElementById('set-sleeptarget')?.value);
      const cstart = document.getElementById('set-collegestart')?.value;
      const cend = document.getElementById('set-collegeend')?.value;
      const budget = Number(document.getElementById('set-budget')?.value);

      state.update(d => {
        if (wake) d.user.wakeTime = wake;
        if (sleep) d.user.sleepTargetHours = sleep;
        if (cstart) d.user.collegeStart = cstart;
        if (cend) d.user.collegeEnd = cend;
        if (budget && d.finances) d.finances.monthlyBudget = budget;
      });

      soundSynth.playClick();
      showToast('System operating parameters updated!');
      rerender();
    });
  }

  // Export JSON
  const expJsonBtn = document.getElementById('btn-export-json');
  if (expJsonBtn) {
    expJsonBtn.addEventListener('click', () => {
      StorageEngine.exportJSON(state.data);
      showToast('JSON Backup downloaded!');
    });
  }

  // Import JSON
  const impJsonInput = document.getElementById('input-import-json');
  if (impJsonInput) {
    impJsonInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      StorageEngine.importJSON(file, (importedData) => {
        state.data = importedData;
        state.notify();
        soundSynth.playChime();
        showToast('Backup restored successfully!', 'success');
        setTimeout(() => window.location.reload(), 600);
      });
    });
  }

  // Export Expenses CSV
  const expCsvBtn = document.getElementById('btn-export-expenses-csv');
  if (expCsvBtn) {
    expCsvBtn.addEventListener('click', () => {
      StorageEngine.exportCSV('expenses', state.data.finances?.transactions || []);
      showToast('Expenses CSV downloaded!');
    });
  }

  // Export Study CSV
  const expStudyBtn = document.getElementById('btn-export-study-csv');
  if (expStudyBtn) {
    expStudyBtn.addEventListener('click', () => {
      StorageEngine.exportCSV('study', state.data.studySessions || []);
      showToast('Study Sessions CSV downloaded!');
    });
  }

  // Reset to Factory State
  const resetBtn = document.getElementById('btn-reset-demo-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
        localStorage.removeItem('aura_life_os_data');
        localStorage.removeItem('aura_setup_completed');
        window.location.reload();
      }
    });
  }
}
