// Health & Vitality Module (Sections 18-20: Water, Sleep, Gym Split, Calisthenics Counters)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';

export function renderHealthPage(state) {
  const d = state.data;
  const fitness = d.fitness || { weeklySplit: {}, pushupsToday: 0, pullupsToday: 0, plankSecondsToday: 0, stepsToday: 6000 };
  const water = d.water || { currentGlasses: 5, targetGlasses: 8, glassMl: 250 };
  const sleep = d.sleep || { bedtime: '23:30', wakeTime: '06:15', totalHours: 6.75, quality: 4, consistencyScore: 84, targetHours: 7.5 };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayWorkout = fitness.weeklySplit[todayName] || 'Rest & Recovery';

  // Sleep gentle suggestion (Section 20)
  let sleepAdvice = 'Your sleep meets your target. Optimal cognitive capacity unlocked.';
  if (sleep.totalHours < sleep.targetHours) {
    const diff = (sleep.targetHours - sleep.totalHours).toFixed(1);
    sleepAdvice = `Your sleep was ${diff}h shorter than target. Consider reducing late-night screen time and winding down earlier tonight.`;
  }

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Vitality & Physical Training</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 99px;">
              BIO METRICS
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            High engineering cognitive stamina is sustained by consistent hydration, sleep, and physical strength.
          </p>
        </div>
      </div>

      <!-- 1. Hydration & Sleep Dual Overview Grid -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 16px;" class="md-grid-2">
        
        <!-- Water Intake Tracker (Section 19) -->
        <div class="glass-card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; border-color: rgba(0,240,255,0.3);">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 22px;">💧</span>
                <div>
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">DAILY HYDRATION</span>
                  <h3 style="font-size: 16px; font-weight: 800; color: #fff;">Water Balance</h3>
                </div>
              </div>
              <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--neon-cyan);">
                ${water.currentGlasses * water.glassMl} / ${water.targetGlasses * water.glassMl} ml
              </span>
            </div>

            <!-- 8 Glass Graphic Grid (1-tap interaction) -->
            <div style="display: flex; gap: 6px; justify-content: space-between; margin-top: 14px;">
              ${Array.from({ length: water.targetGlasses }).map((_, i) => {
                const isFilled = i < water.currentGlasses;
                return `
                  <button class="btn-water-glass" data-idx="${i}" style="flex: 1; height: 48px; border-radius: 10px; border: 1px solid ${isFilled ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'}; background: ${isFilled ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.02)'}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s;">
                    <span>${isFilled ? '💧' : '🫙'}</span>
                    <span style="font-size: 9px; font-family: var(--font-mono); color: ${isFilled ? '#fff' : 'var(--text-dim)'};">${i + 1}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
            <button id="btn-water-add" class="btn-primary" style="flex: 1; justify-content: center; font-size: 12px; padding: 6px;">
              + 1 Glass (250 ml)
            </button>
            <button id="btn-water-minus" class="btn-secondary" style="font-size: 12px; padding: 6px 14px;">
              - 1
            </button>
          </div>
        </div>

        <!-- Sleep Tracker (Section 20) -->
        <div class="glass-card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; border-color: rgba(168,85,247,0.3);">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 22px;">🌙</span>
                <div>
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700; text-transform: uppercase;">SLEEP & RECOVERY</span>
                  <h3 style="font-size: 16px; font-weight: 800; color: #fff;">Rest Quality</h3>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #fff;">${sleep.totalHours} hrs</span>
                <span style="display: block; font-size: 10px; color: var(--text-dim);">Target: ${sleep.targetHours}h</span>
              </div>
            </div>

            <!-- Sleep Schedule Bar -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; font-size: 11px;">
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                <span style="color: var(--text-dim); display: block;">BEDTIME</span>
                <strong style="color: #fff; font-size: 13px;">${sleep.bedtime}</strong>
              </div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                <span style="color: var(--text-dim); display: block;">WAKE TIME</span>
                <strong style="color: #fff; font-size: 13px;">${sleep.wakeTime}</strong>
              </div>
              <div style="padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                <span style="color: var(--text-dim); display: block;">QUALITY</span>
                <strong style="color: var(--neon-amber); font-size: 13px;">${'★'.repeat(sleep.quality || 4)}</strong>
              </div>
            </div>

            <!-- Sleep Suggestion Note -->
            <p style="font-size: 11px; color: #e0e7ff; margin-top: 10px; padding: 8px 12px; border-radius: 8px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);">
              💡 <em>${sleepAdvice}</em>
            </p>
          </div>

          <button id="btn-edit-sleep" class="btn-secondary" style="justify-content: center; font-size: 11px; padding: 6px;">
            Log / Edit Last Night's Sleep
          </button>
        </div>

      </div>

      <!-- 2. Gym & Calisthenics Section (Section 18) -->
      <div class="glass-card" style="padding: 22px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700; text-transform: uppercase;">TRAINING SPLIT</span>
            <h3 style="font-size: 18px; font-weight: 800; color: #fff;">
              Today: ${todayName} — <span style="color: var(--neon-cyan);">${todayWorkout}</span>
            </h3>
          </div>

          <button id="btn-toggle-workout-complete" class="btn-primary" style="font-size: 12px; padding: 8px 16px; background: ${fitness.todayWorkoutDone ? 'var(--neon-emerald)' : 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'};">
            ${fitness.todayWorkoutDone ? '✓ Workout Completed (+30 XP)' : 'Mark Workout Complete'}
          </button>
        </div>

        <!-- Weekly Split Calendar Schedule -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 20px;">
          ${Object.entries(fitness.weeklySplit).map(([day, workout]) => {
            const isToday = day === todayName;
            return `
              <div style="padding: 10px; border-radius: 10px; ${isToday ? 'background: rgba(0,240,255,0.12); border: 1px solid var(--neon-cyan);' : 'background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);'}">
                <span style="font-size: 10px; font-family: var(--font-mono); font-weight: 700; color: ${isToday ? 'var(--neon-cyan)' : 'var(--text-dim)'};">${day.toUpperCase().slice(0, 3)}</span>
                <div style="font-size: 12px; font-weight: 700; color: #fff; margin-top: 4px;">${workout}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Fast Calisthenics Counters (Pushups, Pullups, Plank) -->
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px;">Calisthenics Fast Counters</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            
            <!-- Pushups -->
            <div style="padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">PUSHUPS TODAY</span>
                <div style="font-size: 22px; font-weight: 800; color: #fff;">${fitness.pushupsToday || 0}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-cal-add btn-secondary" data-type="pushups" data-amount="5" style="padding: 4px 8px; font-size: 11px;">+5</button>
                <button class="btn-cal-add btn-secondary" data-type="pushups" data-amount="10" style="padding: 4px 8px; font-size: 11px;">+10</button>
              </div>
            </div>

            <!-- Pullups -->
            <div style="padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">PULLUPS TODAY</span>
                <div style="font-size: 22px; font-weight: 800; color: #fff;">${fitness.pullupsToday || 0}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-cal-add btn-secondary" data-type="pullups" data-amount="1" style="padding: 4px 8px; font-size: 11px;">+1</button>
                <button class="btn-cal-add btn-secondary" data-type="pullups" data-amount="3" style="padding: 4px 8px; font-size: 11px;">+3</button>
              </div>
            </div>

            <!-- Plank -->
            <div style="padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">PLANK (SECONDS)</span>
                <div style="font-size: 22px; font-weight: 800; color: #fff;">${fitness.plankSecondsToday || 0}s</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-cal-add btn-secondary" data-type="plank" data-amount="30" style="padding: 4px 8px; font-size: 11px;">+30s</button>
                <button class="btn-cal-add btn-secondary" data-type="plank" data-amount="60" style="padding: 4px 8px; font-size: 11px;">+60s</button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;
}

export function bindHealthEvents(state, rerender) {
  // Add 1 water glass
  const addWater = document.getElementById('btn-water-add');
  if (addWater) {
    addWater.addEventListener('click', () => {
      state.update(d => {
        if (!d.water) d.water = { currentGlasses: 0, targetGlasses: 8, glassMl: 250 };
        d.water.currentGlasses += 1;
      });
      soundSynth.playClick();
      state.addXP(5, 'Hydration Glass');
      showToast(`Logged 1 glass of water (${state.data.water.currentGlasses}/${state.data.water.targetGlasses})`);
      rerender();
    });
  }

  // Minus 1 water glass
  const minusWater = document.getElementById('btn-water-minus');
  if (minusWater) {
    minusWater.addEventListener('click', () => {
      state.update(d => {
        if (d.water && d.water.currentGlasses > 0) d.water.currentGlasses -= 1;
      });
      soundSynth.playClick();
      rerender();
    });
  }

  // Water glass direct click
  document.querySelectorAll('.btn-water-glass').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        d.water.currentGlasses = idx + 1;
      });
      soundSynth.playClick();
      rerender();
    });
  });

  // Workout complete toggle
  const workoutBtn = document.getElementById('btn-toggle-workout-complete');
  if (workoutBtn) {
    workoutBtn.addEventListener('click', () => {
      state.update(d => {
        d.fitness.todayWorkoutDone = !d.fitness.todayWorkoutDone;
        if (d.fitness.todayWorkoutDone) soundSynth.playChime();
      });
      state.addXP(30, 'Workout Logged');
      showToast(state.data.fitness.todayWorkoutDone ? 'Workout marked complete (+30 XP)!' : 'Workout status reset.');
      rerender();
    });
  }

  // Calisthenics add
  document.querySelectorAll('.btn-cal-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const amount = Number(btn.getAttribute('data-amount'));

      state.update(d => {
        if (!d.fitness) d.fitness = {};
        if (type === 'pushups') d.fitness.pushupsToday = (d.fitness.pushupsToday || 0) + amount;
        else if (type === 'pullups') d.fitness.pullupsToday = (d.fitness.pullupsToday || 0) + amount;
        else if (type === 'plank') d.fitness.plankSecondsToday = (d.fitness.plankSecondsToday || 0) + amount;
      });

      soundSynth.playClick();
      showToast(`+${amount} ${type} logged!`);
      rerender();
    });
  });

  // Edit Sleep
  const editSleepBtn = document.getElementById('btn-edit-sleep');
  if (editSleepBtn) {
    editSleepBtn.addEventListener('click', () => {
      const hrs = prompt('How many hours did you sleep?', state.data.sleep.totalHours.toString());
      if (hrs && !isNaN(parseFloat(hrs))) {
        const quality = prompt('Sleep quality rating (1 to 5 stars):', state.data.sleep.quality.toString()) || '4';
        state.update(d => {
          d.sleep.totalHours = parseFloat(hrs);
          d.sleep.quality = Math.min(5, Math.max(1, parseInt(quality)));
        });
        soundSynth.playClick();
        showToast('Sleep metrics updated!');
        rerender();
      }
    });
  }
}
