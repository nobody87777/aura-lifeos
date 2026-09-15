// Daily Reflection & Journal Module (Sections 21 & 31: Mood, Energy, 4 Decompression Prompts)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';

export function renderJournalPage(state) {
  const todayStr = getLocalDateString();
  const entries = state.data.journalEntries || {};
  const todayEntry = entries[todayStr] || {
    mood: 4,
    energy: state.data.energyPercent || 80,
    wins: '',
    struggles: '',
    learnings: '',
    gratitude: ''
  };

  const moods = [
    { val: 1, label: 'Exhausted', icon: '😫' },
    { val: 2, label: 'Low', icon: '😕' },
    { val: 3, label: 'Neutral', icon: '😐' },
    { val: 4, label: 'Focused', icon: '😊' },
    { val: 5, label: 'Peak Energy', icon: '🔥' }
  ];

  const energies = [20, 40, 60, 80, 100];

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Daily Decompression & Journal</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-purple); background: rgba(168,85,247,0.15); padding: 2px 8px; border-radius: 99px;">
              REFLECTION
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Empty mental buffers before sleep. No pressure, just honest awareness.
          </p>
        </div>

        <button id="btn-save-journal" class="btn-primary" style="font-size: 12px; padding: 7px 18px;">
          Save Reflection (+15 XP)
        </button>
      </div>

      <!-- Mood & Energy Check-in (Section 21) -->
      <div class="glass-card" style="padding: 22px;">
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;" class="md-grid-2">
          
          <!-- Mood Selection -->
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700; text-transform: uppercase;">HOW ARE YOU FEELING TODAY?</span>
            <div style="display: flex; gap: 8px; margin-top: 10px; justify-content: space-between;">
              ${moods.map(m => `
                <button class="btn-select-mood btn-secondary ${todayEntry.mood === m.val ? 'active-tab' : ''}" data-val="${m.val}" style="flex: 1; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; ${todayEntry.mood === m.val ? 'border-color: var(--neon-purple); color: #fff;' : ''}">
                  <span style="font-size: 20px;">${m.icon}</span>
                  <span style="font-size: 10px; font-family: var(--font-mono);">${m.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Energy Level Selection -->
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">ENERGY LEVEL TODAY</span>
            <div style="display: flex; gap: 8px; margin-top: 10px; justify-content: space-between;">
              ${energies.map(e => `
                <button class="btn-select-energy btn-secondary ${todayEntry.energy === e ? 'active-tab' : ''}" data-val="${e}" style="flex: 1; padding: 10px 4px; font-size: 13px; font-family: var(--font-mono); font-weight: 800; ${todayEntry.energy === e ? 'border-color: var(--neon-cyan); color: var(--neon-cyan);' : ''}">
                  ${e}%
                </button>
              `).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- 4 Guided Reflection Prompts (Section 31) -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Prompt 1: Wins -->
        <div class="glass-card" style="padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">🏆</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #fff;">1. What went well today? (Wins & Accomplishments)</h3>
          </div>
          <textarea id="journal-wins" class="input-field" rows="3" placeholder="Finished Java homework, solved DSA problem, had good energy in lab...">${todayEntry.wins || ''}</textarea>
        </div>

        <!-- Prompt 2: Struggles -->
        <div class="glass-card" style="padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">🌧️</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #fff;">2. What was difficult or caused distraction? (Awareness without guilt)</h3>
          </div>
          <textarea id="journal-struggles" class="input-field" rows="3" placeholder="Fell into 30 min Instagram scroll, felt sleepy during afternoon Networks lecture...">${todayEntry.struggles || ''}</textarea>
        </div>

        <!-- Prompt 3: Learnings -->
        <div class="glass-card" style="padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">💡</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #fff;">3. What did I learn today? (Engineering or Life Insight)</h3>
          </div>
          <textarea id="journal-learnings" class="input-field" rows="3" placeholder="Learned how HashMap handles hash collisions in Java; discovered that taking a 5m walk prevents afternoon slump...">${todayEntry.learnings || ''}</textarea>
        </div>

        <!-- Prompt 4: Gratitude -->
        <div class="glass-card" style="padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">🙏</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #fff;">4. What is one thing I am grateful for today?</h3>
          </div>
          <textarea id="journal-gratitude" class="input-field" rows="2" placeholder="Good tea at the canteen, productive coding session on MultitaskCoder, calm evening...">${todayEntry.gratitude || ''}</textarea>
        </div>

      </div>

      <!-- Past Reflections Archive -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 12px;">Past Reflection Archive</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${Object.keys(entries).length <= 1 ? `
            <div style="color: var(--text-dim); font-size: 12px;">Your historical journal logs will appear here as you save daily entries.</div>
          ` : Object.entries(entries).filter(([date]) => date !== todayStr).slice(0, 5).map(([date, entry]) => `
            <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-family: var(--font-mono); font-size: 12px; color: var(--neon-cyan); font-weight: 700;">${date}</span>
                <span style="font-size: 12px;">${entry.mood === 5 ? '🔥 Peak' : entry.mood === 4 ? '😊 Focused' : '😐 Neutral'} · Energy: ${entry.energy}%</span>
              </div>
              ${entry.wins ? `<p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">🏆 ${entry.wins}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindJournalEvents(state, rerender) {
  const todayStr = getLocalDateString();
  let selectedMood = state.data.journalEntries?.[todayStr]?.mood || 4;
  let selectedEnergy = state.data.journalEntries?.[todayStr]?.energy || state.data.energyPercent || 80;

  // Mood selection
  document.querySelectorAll('.btn-select-mood').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMood = Number(btn.getAttribute('data-val'));
      document.querySelectorAll('.btn-select-mood').forEach(b => {
        b.classList.remove('active-tab');
        b.style.borderColor = '';
      });
      btn.classList.add('active-tab');
      btn.style.borderColor = 'var(--neon-purple)';
      soundSynth.playClick();
    });
  });

  // Energy selection
  document.querySelectorAll('.btn-select-energy').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedEnergy = Number(btn.getAttribute('data-val'));
      document.querySelectorAll('.btn-select-energy').forEach(b => {
        b.classList.remove('active-tab');
        b.style.borderColor = '';
        b.style.color = '';
      });
      btn.classList.add('active-tab');
      btn.style.borderColor = 'var(--neon-cyan)';
      btn.style.color = 'var(--neon-cyan)';
      soundSynth.playClick();
    });
  });

  // Save journal
  const saveBtn = document.getElementById('btn-save-journal');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const wins = document.getElementById('journal-wins')?.value || '';
      const struggles = document.getElementById('journal-struggles')?.value || '';
      const learnings = document.getElementById('journal-learnings')?.value || '';
      const gratitude = document.getElementById('journal-gratitude')?.value || '';

      state.update(d => {
        if (!d.journalEntries) d.journalEntries = {};
        d.journalEntries[todayStr] = {
          mood: selectedMood,
          energy: selectedEnergy,
          wins,
          struggles,
          learnings,
          gratitude,
          savedAt: new Date().toISOString()
        };
        d.energyPercent = selectedEnergy;
      });

      soundSynth.playChime();
      state.addXP(15, 'Daily Reflection Completed');
      showToast('Daily decompression journal saved (+15 XP)! Sleep well.', 'xp');
      rerender();
    });
  }
}
