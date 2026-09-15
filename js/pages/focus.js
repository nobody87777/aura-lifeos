// Focus & Deep Work Mode Module (Sections 11 & 12: Pomodoro, Fullscreen Deep Work, Native Web Audio soundscapes)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { ModalEngine } from '../components/modal.js';
import { getLocalDateString } from '../state.js';

let focusTimerInterval = null;
let focusTimeRemaining = 25 * 60;
let focusTotalDuration = 25 * 60;
let focusIsRunning = false;
let focusTaskTitle = 'MultitaskCoder: Debugger module';
let activeSoundType = 'none'; // 'none' | 'lofi' | 'rain' | 'whitenoise'
let isDeepWorkFullscreen = false;

export function setFocusInitialTask(title, minutes) {
  focusTaskTitle = title || 'Focused Deep Work';
  focusTotalDuration = (minutes || 25) * 60;
  focusTimeRemaining = focusTotalDuration;
}

export function renderFocusPage() {
  const focusMinutes = Math.floor(focusTimeRemaining / 60);
  const focusSeconds = focusTimeRemaining % 60;
  const timeFormatted = `${String(focusMinutes).padStart(2, '0')}:${String(focusSeconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((focusTotalDuration - focusTimeRemaining) / focusTotalDuration) * 100);

  const circumference = 2 * Math.PI * 110;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Normal Header (hidden if deep work) -->
      <div id="focus-header-panel" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Deep Work Hub</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-purple); background: rgba(168,85,247,0.15); padding: 2px 8px; border-radius: 99px;">
              POMODORO & FLOW
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Eliminate cognitive fragmentation. Zero distractions, synthesis audio, single focus.
          </p>
        </div>

        <button id="btn-toggle-deepwork" class="btn-primary" style="font-size: 12px; padding: 7px 16px; background: linear-gradient(135deg, var(--neon-purple), #7c3aed);">
          🛡️ Fullscreen Deep Work Mode
        </button>
      </div>

      <!-- Main Focus Center Stage -->
      <div class="glass-card" id="focus-main-card" style="padding: 36px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; position: relative; overflow: hidden;">
        
        <div style="position: absolute; top: -80px; width: 280px; height: 280px; background: rgba(0, 240, 255, 0.08); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>

        <!-- Task Selector / Display -->
        <div style="text-align: center; max-width: 480px; width: 100%; z-index: 1;">
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
            ACTIVE TARGET
          </span>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px;">
            <h2 id="display-focus-title" style="font-size: 18px; font-weight: 800; color: #fff;">
              ${focusTaskTitle}
            </h2>
            <button id="btn-change-focus-task" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 14px;" title="Change Task">✏️</button>
          </div>
        </div>

        <!-- Circular Big Countdown Timer -->
        <div style="position: relative; width: 260px; height: 260px; display: flex; align-items: center; justify-content: center;">
          <svg width="260" height="260" viewBox="0 0 260 260" style="transform: rotate(-90deg);">
            <!-- Background track -->
            <circle cx="130" cy="130" r="110" stroke="rgba(255, 255, 255, 0.06)" stroke-width="12" fill="transparent" />
            <!-- Active progress -->
            <circle
              id="svg-timer-circle"
              cx="130"
              cy="130"
              r="110"
              stroke="var(--neon-cyan)"
              stroke-width="12"
              stroke-linecap="round"
              fill="transparent"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${strokeOffset}"
              style="transition: stroke-dashoffset 1s linear;"
            />
          </svg>

          <!-- Inside Timer Text -->
          <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span id="display-timer-text" style="font-family: var(--font-mono); font-size: 44px; font-weight: 800; color: #fff; letter-spacing: -1px;">
              ${timeFormatted}
            </span>
            <span id="display-timer-status" style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase; margin-top: 4px;">
              ${focusIsRunning ? '⚡ IN PROGRESS' : 'PAUSED'}
            </span>
          </div>
        </div>

        <!-- Timer Controls (Play / Pause / Reset / Complete) -->
        <div style="display: flex; align-items: center; gap: 14px; z-index: 1;">
          <button id="btn-focus-toggle" class="btn-primary" style="padding: 12px 28px; font-size: 15px; border-radius: 99px;">
            ${focusIsRunning ? '⏸ Pause' : '▶ Start Focus'}
          </button>
          <button id="btn-focus-finish" class="btn-secondary" style="padding: 12px 20px; font-size: 13px; border-radius: 99px; border-color: var(--neon-emerald); color: var(--neon-emerald);">
            ✓ Finish (+20 XP)
          </button>
          <button id="btn-focus-reset" class="btn-secondary" style="padding: 12px 16px; font-size: 13px; border-radius: 99px;" title="Reset Timer">
            🔄
          </button>
        </div>

        <!-- Presets -->
        <div id="focus-presets-row" style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; z-index: 1;">
          <button class="btn-secondary btn-preset ${focusTotalDuration === 25 * 60 ? 'active-tab' : ''}" data-mins="25" style="padding: 6px 14px; font-size: 11px; font-family: var(--font-mono);">25m Pomodoro</button>
          <button class="btn-secondary btn-preset ${focusTotalDuration === 45 * 60 ? 'active-tab' : ''}" data-mins="45" style="padding: 6px 14px; font-size: 11px; font-family: var(--font-mono);">45m Deep Work</button>
          <button class="btn-secondary btn-preset ${focusTotalDuration === 60 * 60 ? 'active-tab' : ''}" data-mins="60" style="padding: 6px 14px; font-size: 11px; font-family: var(--font-mono);">60m Sprint</button>
          <button class="btn-secondary btn-preset ${focusTotalDuration === 15 * 60 ? 'active-tab' : ''}" data-mins="15" style="padding: 6px 14px; font-size: 11px; font-family: var(--font-mono);">15m Quick</button>
        </div>

        <!-- Ambient Sound Synthesizer (Native Web Audio API - Section 12) -->
        <div class="glass-card" id="focus-sound-panel" style="width: 100%; max-width: 480px; padding: 14px 18px; border-color: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🎧</span>
            <div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">LOCAL AUDIO SYNTH</span>
              <div style="font-size: 12px; font-weight: 700; color: #fff;">Ambient Soundscape</div>
            </div>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="btn-secondary btn-sound-toggle ${activeSoundType === 'lofi' ? 'active-tab' : ''}" data-sound="lofi" style="padding: 4px 10px; font-size: 11px;">🎹 Lo-Fi</button>
            <button class="btn-secondary btn-sound-toggle ${activeSoundType === 'rain' ? 'active-tab' : ''}" data-sound="rain" style="padding: 4px 10px; font-size: 11px;">🌧️ Rain</button>
            <button class="btn-secondary btn-sound-toggle ${activeSoundType === 'whitenoise' ? 'active-tab' : ''}" data-sound="whitenoise" style="padding: 4px 10px; font-size: 11px;">📻 Noise</button>
            <button class="btn-secondary btn-sound-toggle ${activeSoundType === 'none' ? 'active-tab' : ''}" data-sound="none" style="padding: 4px 10px; font-size: 11px;">🔇 Mute</button>
          </div>
        </div>

      </div>

      <!-- Recent Focus Sessions History -->
      <div class="glass-card" style="padding: 20px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 12px;">Recent Focus Sessions</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(state.data.focusLogs || []).slice(0, 5).map(f => `
            <div style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 13px;">${f.taskTitle}</div>
                <div style="font-size: 11px; color: var(--text-dim);">${f.date || 'Today'} · ${f.timestamp || 'Recent'}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-family: var(--font-mono); font-size: 12px; color: var(--neon-cyan); font-weight: 700;">${f.durationMinutes}m</span>
                <span style="font-size: 12px; color: var(--neon-amber);">${'★'.repeat(f.focusRating || 5)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindFocusEvents(state, rerender) {
  const updateTimerDisplay = () => {
    const minutes = Math.floor(focusTimeRemaining / 60);
    const seconds = focusTimeRemaining % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const progress = Math.round(((focusTotalDuration - focusTimeRemaining) / focusTotalDuration) * 100);

    const timerText = document.getElementById('display-timer-text');
    const timerStatus = document.getElementById('display-timer-status');
    const timerCircle = document.getElementById('svg-timer-circle');

    if (timerText) timerText.textContent = timeFormatted;
    if (timerStatus) timerStatus.textContent = focusIsRunning ? '⚡ IN PROGRESS' : 'PAUSED';

    if (timerCircle) {
      const circumference = 2 * Math.PI * 110;
      const strokeOffset = circumference - (progress / 100) * circumference;
      timerCircle.style.strokeDashoffset = strokeOffset;
    }
  };

  const startTimer = () => {
    if (focusIsRunning) return;
    focusIsRunning = true;
    const toggleBtn = document.getElementById('btn-focus-toggle');
    if (toggleBtn) toggleBtn.textContent = '⏸ Pause';

    soundSynth.playClick();
    if (activeSoundType !== 'none') {
      soundSynth.playAmbient(activeSoundType);
    }

    focusTimerInterval = setInterval(() => {
      if (focusTimeRemaining > 0) {
        focusTimeRemaining -= 1;
        updateTimerDisplay();
      } else {
        finishSession();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    focusIsRunning = false;
    clearInterval(focusTimerInterval);
    const toggleBtn = document.getElementById('btn-focus-toggle');
    if (toggleBtn) toggleBtn.textContent = '▶ Start Focus';
    soundSynth.stopAmbient();
    updateTimerDisplay();
  };

  const finishSession = () => {
    pauseTimer();
    soundSynth.playChime();

    // Show rating modal (Section 11)
    const modalHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; text-align: center;">
        <span style="font-size: 36px;">🎉</span>
        <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Focus Session Complete!</h2>
        <p style="font-size: 13px; color: var(--text-muted);">
          Great work committing to "${focusTaskTitle}".
        </p>

        <div>
          <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">HOW FOCUSED WERE YOU? (1 — 5)</label>
          <div style="display: flex; justify-content: center; gap: 12px; margin-top: 8px;">
            ${[1, 2, 3, 4, 5].map(n => `
              <button class="btn-focus-rate btn-secondary" data-val="${n}" style="width: 44px; height: 44px; font-size: 16px; font-weight: 800; border-radius: 12px;">
                ${n}★
              </button>
            `).join('')}
          </div>
        </div>

        <input type="text" id="input-focus-notes" class="input-field" placeholder="Optional reflection note (e.g. Cleared 2 bug tickets)..." style="margin-top: 6px;" />

        <button id="btn-submit-focus-rating" class="btn-primary" style="margin-top: 8px; justify-content: center;">
          Claim +20 XP & Save
        </button>
      </div>
    `;

    ModalEngine.open('modal-focus-rating', modalHTML, (dialog) => {
      let selectedRating = 5;

      dialog.querySelectorAll('.btn-focus-rate').forEach(b => {
        b.addEventListener('click', () => {
          selectedRating = Number(b.getAttribute('data-val'));
          dialog.querySelectorAll('.btn-focus-rate').forEach(btn => {
            btn.style.borderColor = '';
            btn.style.color = '';
          });
          b.style.borderColor = 'var(--neon-amber)';
          b.style.color = 'var(--neon-amber)';
        });
      });

      dialog.querySelector('#btn-submit-focus-rating').addEventListener('click', () => {
        const note = dialog.querySelector('#input-focus-notes').value.trim();
        const durationMins = Math.max(1, Math.round((focusTotalDuration - focusTimeRemaining) / 60));

        state.update(d => {
          if (!d.focusLogs) d.focusLogs = [];
          d.focusLogs.unshift({
            id: `f-${Date.now()}`,
            taskTitle: focusTaskTitle,
            durationMinutes: durationMins,
            focusRating: selectedRating,
            note,
            completed: true,
            date: getLocalDateString(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          });
        });

        state.addXP(20, 'Pomodoro Completed');
        showToast(`Focus session saved (+20 XP)! Rating: ${selectedRating}★`, 'xp');
        ModalEngine.close();
        focusTimeRemaining = focusTotalDuration;
        rerender();
      });
    });
  };

  // Toggle button
  const toggleBtn = document.getElementById('btn-focus-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (focusIsRunning) pauseTimer();
      else startTimer();
    });
  }

  // Finish button
  const finishBtn = document.getElementById('btn-focus-finish');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => finishSession());
  }

  // Reset button
  const resetBtn = document.getElementById('btn-focus-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pauseTimer();
      focusTimeRemaining = focusTotalDuration;
      updateTimerDisplay();
    });
  }

  // Presets
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = Number(btn.getAttribute('data-mins'));
      pauseTimer();
      focusTotalDuration = mins * 60;
      focusTimeRemaining = focusTotalDuration;
      document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');
      updateTimerDisplay();
    });
  });

  // Sound selection
  document.querySelectorAll('.btn-sound-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = btn.getAttribute('data-sound');
      activeSoundType = sound;
      document.querySelectorAll('.btn-sound-toggle').forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');

      if (focusIsRunning) {
        if (sound === 'none') soundSynth.stopAmbient();
        else soundSynth.playAmbient(sound);
      }
    });
  });

  // Change Task button
  const changeTaskBtn = document.getElementById('btn-change-focus-task');
  if (changeTaskBtn) {
    changeTaskBtn.addEventListener('click', () => {
      const modalHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <h3 style="font-size: 16px; font-weight: 800; color: #fff;">Select Focus Target</h3>
          
          <input type="text" id="input-custom-focus-task" class="input-field" placeholder="Or type a custom focus target..." value="${focusTaskTitle}" />

          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 240px; overflow-y: auto;">
            ${(state.data.tasks || []).filter(t => t.status !== 'completed').map(t => `
              <button class="btn-select-task btn-secondary" data-title="${t.title}" style="text-align: left; padding: 10px 14px; font-size: 12px; justify-content: space-between;">
                <span>${t.title}</span>
                <span style="color: var(--neon-cyan); font-family: var(--font-mono);">${t.estimatedMinutes || 25}m</span>
              </button>
            `).join('')}
          </div>

          <button id="btn-confirm-focus-task" class="btn-primary" style="justify-content: center;">
            Set Target
          </button>
        </div>
      `;

      ModalEngine.open('modal-select-focus-task', modalHTML, (dialog) => {
        dialog.querySelectorAll('.btn-select-task').forEach(b => {
          b.addEventListener('click', () => {
            const title = b.getAttribute('data-title');
            focusTaskTitle = title;
            ModalEngine.close();
            rerender();
          });
        });

        dialog.querySelector('#btn-confirm-focus-task').addEventListener('click', () => {
          const custom = dialog.querySelector('#input-custom-focus-task').value.trim();
          if (custom) focusTaskTitle = custom;
          ModalEngine.close();
          rerender();
        });
      });
    });
  }

  // Fullscreen Deep Work Mode toggle (Section 12)
  const toggleDeepWorkBtn = document.getElementById('btn-toggle-deepwork');
  if (toggleDeepWorkBtn) {
    toggleDeepWorkBtn.addEventListener('click', () => {
      isDeepWorkFullscreen = !isDeepWorkFullscreen;
      if (isDeepWorkFullscreen) {
        if (!focusIsRunning) startTimer();
        document.body.classList.add('deep-work-mode');
        showToast('Deep Work Fullscreen Activated. Press Esc to exit.');
      } else {
        document.body.classList.remove('deep-work-mode');
      }
      rerender();
    });
  }
}
