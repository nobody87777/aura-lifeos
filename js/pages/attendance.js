// Attendance Tracker Module (Section 17: Kerala Diploma 75% Rule, Margin Predictor, 1-Tap Buttons)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';

export function renderAttendancePage(state) {
  const records = state.data.attendance || [];

  let totalHeld = 0;
  let totalAttended = 0;

  const evaluated = records.map(r => {
    const held = r.classesHeld || 0;
    const attended = r.classesAttended || 0;
    totalHeld += held;
    totalAttended += attended;

    const percent = held > 0 ? ((attended / held) * 100).toFixed(1) : '100.0';
    const numPercent = parseFloat(percent);

    let status = 'safe';
    let statusText = 'Safe Margin';
    let advice = '';

    if (numPercent >= 80) {
      status = 'safe';
      const canMiss = Math.floor((attended - 0.75 * held) / 0.75);
      advice = canMiss > 0 ? `You can safely miss ${canMiss} class${canMiss > 1 ? 'es' : ''}` : `Buffer exhausted. Attend all next classes.`;
    } else if (numPercent >= 75) {
      status = 'warning';
      statusText = 'Warning Zone';
      advice = `On the brink. Do not miss any upcoming lectures.`;
    } else {
      status = 'critical';
      statusText = 'Critical Shortage';
      const needAttend = Math.ceil((0.75 * held - attended) / 0.25);
      advice = `Must attend ${needAttend} consecutive class${needAttend > 1 ? 'es' : ''} to recover.`;
    }

    return {
      ...r,
      percent: numPercent,
      status,
      statusText,
      advice
    };
  });

  const overallPercent = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : '100.0';
  const overallNum = parseFloat(overallPercent);

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Attendance Monitor</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: ${overallNum >= 75 ? 'var(--neon-emerald)' : 'var(--neon-rose)'}; background: ${overallNum >= 75 ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}; padding: 2px 8px; border-radius: 99px;">
              75% DIPLOMA RULE
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Kerala Technical Board mandates 75% minimum to avoid exam condonation fees or year-back.
          </p>
        </div>

        <button id="btn-add-attendance-subject" class="btn-primary" style="font-size: 12px; padding: 7px 16px;">
          + Track New Subject
        </button>
      </div>

      <!-- Aggregate Status Banner -->
      <div class="glass-card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; border-color: ${overallNum >= 75 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'};">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 54px; height: 54px; border-radius: 16px; background: ${overallNum >= 75 ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}; border: 1px solid ${overallNum >= 75 ? 'var(--neon-emerald)' : 'var(--neon-rose)'}; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            📋
          </div>
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">SEMESTER AGGREGATE</span>
            <h2 style="font-size: 24px; font-weight: 800; color: ${overallNum >= 75 ? 'var(--neon-emerald)' : 'var(--neon-rose)'};">
              ${overallPercent}% <span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">(${totalAttended} / ${totalHeld} lectures)</span>
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              ${overallNum >= 75 ? '✓ You are in good standing across academic modules.' : '⚠️ Condonation alert: Aggregate below 75% criterion.'}
            </p>
          </div>
        </div>
      </div>

      <!-- Subject-by-Subject List -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${evaluated.map((sub, idx) => {
          const color = sub.status === 'safe' ? 'var(--neon-emerald)' : sub.status === 'warning' ? 'var(--neon-amber)' : 'var(--neon-rose)';
          const bgBadge = sub.status === 'safe' ? 'rgba(16,185,129,0.15)' : sub.status === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.15)';

          return `
            <div class="glass-card" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; border-left: 4px solid ${color};">
              
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div>
                  <h3 style="font-size: 16px; font-weight: 800; color: #fff;">${sub.subjectName}</h3>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                    Attended: <strong style="color: #fff;">${sub.classesAttended}</strong> of <strong style="color: #fff;">${sub.classesHeld}</strong> lectures
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: ${color}; background: ${bgBadge}; padding: 3px 10px; border-radius: 99px;">
                    ${sub.statusText.toUpperCase()}
                  </span>
                  <div style="text-align: right;">
                    <span style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: ${color};">${sub.percent}%</span>
                  </div>
                </div>
              </div>

              <!-- Progress bar with 75% target notch -->
              <div style="position: relative; width: 100%; height: 8px; border-radius: 99px; background: rgba(255,255,255,0.08); overflow: hidden;">
                <div style="width: ${Math.min(100, sub.percent)}%; height: 100%; background: ${color}; border-radius: 99px; transition: width 0.3s ease;"></div>
              </div>

              <!-- Prediction Advice & 1-Tap Buttons -->
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                <div style="font-size: 12px; font-family: var(--font-mono); color: ${color};">
                  💡 ${sub.advice}
                </div>

                <div style="display: flex; gap: 8px;">
                  <button class="btn-secondary btn-mark-attended" data-idx="${idx}" style="padding: 5px 12px; font-size: 11px; color: var(--neon-emerald); border-color: rgba(16,185,129,0.4);">
                    + Attended
                  </button>
                  <button class="btn-secondary btn-mark-missed" data-idx="${idx}" style="padding: 5px 12px; font-size: 11px; color: var(--neon-rose); border-color: rgba(244,63,94,0.4);">
                    - Missed
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

export function bindAttendanceEvents(state, rerender) {
  // Mark Attended
  document.querySelectorAll('.btn-mark-attended').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        const item = d.attendance?.[idx];
        if (item) {
          item.classesHeld = (item.classesHeld || 0) + 1;
          item.classesAttended = (item.classesAttended || 0) + 1;
        }
      });
      soundSynth.playChime();
      state.addXP(10, 'Lecture Attended');
      showToast('Marked lecture present (+10 XP)!');
      rerender();
    });
  });

  // Mark Missed
  document.querySelectorAll('.btn-mark-missed').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        const item = d.attendance?.[idx];
        if (item) {
          item.classesHeld = (item.classesHeld || 0) + 1;
        }
      });
      soundSynth.playClick();
      showToast('Marked lecture missed.', 'info');
      rerender();
    });
  });

  // Add Subject
  const addBtn = document.getElementById('btn-add-attendance-subject');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = prompt('Enter subject name (e.g. Microprocessors Lab):');
      if (name && name.trim()) {
        state.update(d => {
          if (!d.attendance) d.attendance = [];
          d.attendance.push({
            id: `att-${Date.now()}`,
            subjectName: name.trim(),
            classesHeld: 10,
            classesAttended: 9,
            minimumTargetPercent: 75
          });
        });
        soundSynth.playClick();
        showToast(`Tracking attendance for ${name}!`);
        rerender();
      }
    });
  }
}
