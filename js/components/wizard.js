// First-Run Onboarding Setup Wizard (Sections 69-70)
import { ModalEngine } from './modal.js';
import { soundSynth } from '../modules/sound.js';
import { showToast } from './toast.js';

export class SetupWizardEngine {
  static open(state, onComplete) {
    let currentStep = 1;
    const totalSteps = 8;

    const renderStepContent = (step) => {
      switch (step) {
        case 1:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px; display: inline-block; margin-bottom: 8px;">⚡</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Welcome to AURA LifeOS</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Your personal daily operating system engineered for computer engineering students.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">WHAT SHOULD AURA CALL YOU?</label>
                <input type="text" id="wiz-name" class="input-field" value="${state.data.user.name || 'Diploma Engineer'}" style="margin-top: 4px;" />
              </div>
            </div>
          `;
        case 2:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">🌅</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Daily Circadian Rhythm</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Consistency begins with sleep and wake anchors.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">WAKE UP TARGET TIME</label>
                <input type="time" id="wiz-waketime" class="input-field" value="${state.data.user.wakeTime || '05:30'}" style="margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">TARGET SLEEP DURATION (HOURS)</label>
                <input type="number" step="0.5" id="wiz-sleep" class="input-field" value="${state.data.user.sleepTargetHours || 7.5}" style="margin-top: 4px;" />
              </div>
            </div>
          `;
        case 3:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">🏛️</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">College Schedule</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                AURA switches automatically to College Mode during academic lecture hours.
              </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">START TIME</label>
                <input type="time" id="wiz-collegestart" class="input-field" value="${state.data.user.collegeStart || '09:00'}" style="margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">END TIME</label>
                <input type="time" id="wiz-collegeend" class="input-field" value="${state.data.user.collegeEnd || '17:00'}" style="margin-top: 4px;" />
              </div>
            </div>
          `;
        case 4:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">💻</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Flagship Engineering Project</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Your primary software project where you build real-world credibility.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">PROJECT NAME</label>
                <input type="text" id="wiz-project" class="input-field" value="${state.data.projects?.[0]?.name || 'MultitaskCoder'}" style="margin-top: 4px;" />
              </div>
            </div>
          `;
        case 5:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">📚</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Engineering Syllabus Priorities</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Core Diploma Computer Engineering subjects loaded automatically:
              </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">☕ Java Programming</div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">🐍 Python & Scripting</div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">⚙️ C Programming</div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">🧩 Data Structures</div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">🌐 Web Development</div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); color: var(--neon-cyan);">🗄️ DBMS & SQL</div>
            </div>
          `;
        case 6:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">🏋️</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Physical Training & Health</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                A healthy mind requires physical vitality.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
              <div style="padding: 10px; border-radius: 8px; background: rgba(16,185,129,0.1); border: 1px solid var(--neon-emerald);">
                💧 <strong>Hydration Target:</strong> 8 glasses (2,000 ml) daily
              </div>
              <div style="padding: 10px; border-radius: 8px; background: rgba(0,240,255,0.1); border: 1px solid var(--neon-cyan);">
                🏋️ <strong>Gym Split:</strong> 6-Day Push/Pull/Legs + Sunday Rest
              </div>
              <div style="padding: 10px; border-radius: 8px; background: rgba(168,85,247,0.1); border: 1px solid var(--neon-purple);">
                🤸 <strong>Calisthenics:</strong> Daily pushups & pullups counters
              </div>
            </div>
          `;
        case 7:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">💸</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Kerala Student Budget</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Track monthly allowance, canteen expenses, travel, and personal savings.
              </p>
            </div>
            <div>
              <label style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">MONTHLY BUDGET (INR ₹)</label>
              <input type="number" id="wiz-budget" class="input-field" value="${state.data.finances?.monthlyBudget || 6000}" style="margin-top: 4px;" />
            </div>
          `;
        case 8:
          return `
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 36px;">🎨</span>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Choose Your Visual Theme</h2>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Tailor the aesthetic of your terminal operating system.
              </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="btn-secondary wiz-theme-opt ${state.data.theme === 'dark-neon' ? 'active-tab' : ''}" data-theme="dark-neon" style="padding: 12px; font-size: 12px; font-weight: 700; border-color: var(--neon-cyan);">
                💎 Dark Neon
              </button>
              <button class="btn-secondary wiz-theme-opt ${state.data.theme === 'midnight' ? 'active-tab' : ''}" data-theme="midnight" style="padding: 12px; font-size: 12px; font-weight: 700;">
                🌌 Midnight Blue
              </button>
              <button class="btn-secondary wiz-theme-opt ${state.data.theme === 'amoled' ? 'active-tab' : ''}" data-theme="amoled" style="padding: 12px; font-size: 12px; font-weight: 700;">
                🖤 AMOLED Black
              </button>
              <button class="btn-secondary wiz-theme-opt ${state.data.theme === 'matrix' ? 'active-tab' : ''}" data-theme="matrix" style="padding: 12px; font-size: 12px; font-weight: 700;">
                ⚡ Matrix Emerald
              </button>
            </div>
          `;
        default:
          return '';
      }
    };

    const updateDialog = (dialog) => {
      dialog.querySelector('#wiz-step-content').innerHTML = renderStepContent(currentStep);
      dialog.querySelector('#wiz-step-indicator').textContent = `STEP ${currentStep} OF ${totalSteps}`;
      dialog.querySelector('#btn-wiz-next').textContent = currentStep === totalSteps ? 'Launch AURA (+50 XP) 🚀' : 'Continue ➔';
      dialog.querySelector('#btn-wiz-prev').style.visibility = currentStep === 1 ? 'hidden' : 'visible';

      // Attach theme preview handlers if step 8
      if (currentStep === 8) {
        dialog.querySelectorAll('.wiz-theme-opt').forEach(btn => {
          btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.className = `theme-${theme}`;
            state.update(d => { d.theme = theme; });
            dialog.querySelectorAll('.wiz-theme-opt').forEach(b => {
              b.classList.remove('active-tab');
              b.style.borderColor = '';
            });
            btn.classList.add('active-tab');
            btn.style.borderColor = 'var(--neon-cyan)';
          });
        });
      }
    };

    const modalHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
          <span id="wiz-step-indicator" style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">STEP 1 OF 8</span>
          <button id="btn-wiz-skip" style="background: none; border: none; font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); cursor: pointer; text-decoration: underline;">
            Skip Setup ✕
          </button>
        </div>

        <div id="wiz-step-content" style="min-height: 220px; display: flex; flex-direction: column; justify-content: center;">
          ${renderStepContent(1)}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <button id="btn-wiz-prev" class="btn-secondary" style="font-size: 12px; visibility: hidden;">
            ⬅ Back
          </button>
          <button id="btn-wiz-next" class="btn-primary" style="font-size: 12px; padding: 8px 18px;">
            Continue ➔
          </button>
        </div>
      </div>
    `;

    ModalEngine.open('modal-setup-wizard', modalHTML, (dialog) => {
      const saveStepData = () => {
        if (currentStep === 1) {
          const name = dialog.querySelector('#wiz-name')?.value.trim();
          if (name) state.update(d => { d.user.name = name; });
        } else if (currentStep === 2) {
          const wake = dialog.querySelector('#wiz-waketime')?.value;
          const sleep = Number(dialog.querySelector('#wiz-sleep')?.value);
          state.update(d => {
            if (wake) d.user.wakeTime = wake;
            if (sleep) d.user.sleepTargetHours = sleep;
          });
        } else if (currentStep === 3) {
          const cstart = dialog.querySelector('#wiz-collegestart')?.value;
          const cend = dialog.querySelector('#wiz-collegeend')?.value;
          state.update(d => {
            if (cstart) d.user.collegeStart = cstart;
            if (cend) d.user.collegeEnd = cend;
          });
        } else if (currentStep === 4) {
          const projName = dialog.querySelector('#wiz-project')?.value.trim();
          if (projName) {
            state.update(d => {
              if (d.projects?.[0]) d.projects[0].name = projName;
            });
          }
        } else if (currentStep === 7) {
          const budget = Number(dialog.querySelector('#wiz-budget')?.value);
          if (budget) {
            state.update(d => {
              if (d.finances) d.finances.monthlyBudget = budget;
            });
          }
        }
      };

      const finishWizard = () => {
        saveStepData();
        localStorage.setItem('aura_setup_completed', 'true');
        state.update(d => { d.isFirstRun = false; });
        state.addXP(50, 'Onboarding Complete');
        soundSynth.playChime();
        showToast('Welcome to AURA LifeOS! (+50 XP)', 'xp');
        ModalEngine.close();
        if (typeof onComplete === 'function') onComplete();
      };

      dialog.querySelector('#btn-wiz-next').addEventListener('click', () => {
        saveStepData();
        soundSynth.playClick();
        if (currentStep < totalSteps) {
          currentStep += 1;
          updateDialog(dialog);
        } else {
          finishWizard();
        }
      });

      dialog.querySelector('#btn-wiz-prev').addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep -= 1;
          updateDialog(dialog);
        }
      });

      dialog.querySelector('#btn-wiz-skip').addEventListener('click', () => {
        localStorage.setItem('aura_setup_completed', 'true');
        state.update(d => { d.isFirstRun = false; });
        ModalEngine.close();
        if (typeof onComplete === 'function') onComplete();
      });
    });
  }
}
