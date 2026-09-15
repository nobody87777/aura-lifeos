import { getSmartRecommendations } from '../modules/smartengine.js';
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';
import { ModalEngine } from '../components/modal.js';

export function renderHomePage(state) {
  const todayStr = getLocalDateString();
  const now = new Date();
  const currentHour = now.getHours();
  const dayOfWeek = now.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isCollegeHours = isWeekday && currentHour >= 9 && currentHour < 17;

  // Greetings
  let greeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) greeting = 'Good afternoon';
  else if (currentHour >= 17 && currentHour < 22) greeting = 'Good evening';
  else if (currentHour >= 22 || currentHour < 5) greeting = 'Time to wind down';

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeek];
  const shortDay = dayName.slice(0, 3);
  const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Scores
  const dailyScore = state.calculateDailyScore(todayStr);
  const lifeScore = state.calculateLifeScore(todayStr);
  const activeScore = state.data.showLifeScore ? lifeScore : dailyScore;

  // Top 3 Tasks (Section 86)
  const top3Tasks = (state.data.tasks || []).filter(t => t.isTop3 && t.status !== 'completed').slice(0, 3);
  const overdueTasks = (state.data.tasks || []).filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr);

  // Core Habits (Section 86)
  const habits = state.data.habits || [];

  // Single Current Action recommendation (Section 86)
  const smartRec = getSmartRecommendations(state.data, now)[0] || {
    title: '25 min Java Focus',
    reason: 'Eliminate decision fatigue by taking 1 single step.',
    duration: 25,
    durationLabel: '25 min'
  };

  // Today's Quick Numbers
  const todayFocusMinutes = (state.data.focusLogs || [])
    .filter(f => f.date === todayStr)
    .reduce((acc, f) => acc + (f.durationMinutes || 0), 0);
  const focusHrs = Math.floor(todayFocusMinutes / 60);
  const focusMins = todayFocusMinutes % 60;
  const focusDisplay = focusHrs > 0 ? `${focusHrs}h ${focusMins}m` : `${focusMins}m`;

  const waterGlasses = state.data.water?.currentGlasses || 0;
  const targetWater = state.data.water?.targetGlasses || 8;
  const workoutDone = state.data.fitness?.todayWorkoutDone || false;

  // Upcoming Exam Deadlines (Section 86)
  const upcomingExams = [
    { title: 'Computer Networks Exam', code: 'CE-304', daysLeft: 27 },
    { title: 'Java Programming Lab', code: 'CE-302P', daysLeft: 31 },
    { title: 'Data Structures Exam', code: 'CE-301', daysLeft: 35 }
  ];

  const vis = state.data.homeSectionsVisibility || {
    score: true,
    top3: true,
    currentAction: true,
    habits: true,
    todayQuick: true,
    upcoming: true,
    blocks: true,
    goals: true
  };

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 18px;">
      
      <!-- 1. GREETING & DATE BAR (Section 84 & 86) -->
      <div class="glass-card" style="padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-color: rgba(0,240,255,0.25);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
              ${shortDay} · ${dateFormatted}
            </span>
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--neon-cyan);" class="pulse-glow"></span>
          </div>
          <h1 style="font-size: 22px; font-weight: 800; color: #fff; margin-top: 2px;">
            ${greeting}, <span style="color: var(--neon-cyan);">${state.data.user.name}</span>
          </h1>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            "This is your command center. Follow the next step, one action at a time."
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="btn-secondary" style="padding: 6px 12px; font-family: var(--font-mono); font-size: 12px; color: var(--neon-amber);">
            🔥 <strong>${state.data.user.currentStreak} Day Streak</strong>
            <span style="font-size: 10px; color: var(--neon-emerald); background: rgba(16,185,129,0.15); padding: 1px 6px; border-radius: 4px; margin-left: 4px;">
              🛡️ ${state.data.user.streakProtectionsLeft} save
            </span>
          </div>

          <button id="btn-home-customize" class="btn-secondary" style="padding: 6px 10px; font-size: 11px;" title="Customize Home Screen Sections">
            ⚙️ Customize
          </button>
        </div>
      </div>

      <!-- Recovery Mode Banner (if active - Section 34) -->
      ${state.data.recoveryModeActive ? `
        <div class="glass-card" style="padding: 16px 20px; border-color: rgba(99,102,241,0.5); background: linear-gradient(135deg, rgba(30,27,75,0.7), rgba(15,20,32,0.85)); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">🛡️</span>
            <div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: #a5b4fc; font-weight: 700;">RECOVERY MODE ACTIVE</span>
              <h3 style="font-size: 14px; font-weight: 800; color: #fff;">Zero-Guilt Sanctuary — "You don't need a perfect day. You just need to avoid giving up."</h3>
            </div>
          </div>
          <button id="btn-exit-recovery-home" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">Exit Recovery</button>
        </div>
      ` : ''}

      <!-- College Mode Banner (if active - Section 37) -->
      ${isCollegeHours && !state.data.recoveryModeActive ? `
        <div class="glass-card" style="padding: 14px 18px; border-color: rgba(168,85,247,0.4); background: linear-gradient(135deg, rgba(46,16,101,0.35), rgba(15,20,34,0.85)); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">🏛️</span>
            <div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700;">COLLEGE ACADEMIC HOURS (09:00 AM — 05:00 PM)</span>
              <div style="font-size: 13px; font-weight: 700; color: #fff;">Computer Engineering Lectures & Labs</div>
            </div>
          </div>
          <button class="btn-secondary" onclick="window.location.hash='#attendance'" style="font-size: 11px; padding: 4px 10px;">Mark Attendance</button>
        </div>
      ` : ''}

      <!-- Overdue Tasks Notice (Section 82 & 88: Zero Guilt) -->
      ${overdueTasks.length > 0 ? `
        <div class="glass-card" style="padding: 14px 18px; border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.05); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🌱</span>
            <div style="font-size: 12px; color: #fff;">
              You have <strong style="color: var(--neon-amber);">${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''}</strong> from previous days. Today still counts — one task at a time.
            </div>
          </div>
          <button id="btn-roll-overdue-today" class="btn-secondary" style="font-size: 11px; padding: 4px 12px; border-color: var(--neon-amber); color: var(--neon-amber);">
            ➔ Roll to Today
          </button>
        </div>
      ` : ''}

      <!-- 2. DAILY SCORE / LIFE SCORE (Section 84, 85, 86) -->
      ${vis.score ? `
        <div class="glass-card" style="padding: 22px; border-color: rgba(0,240,255,0.35); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(8,18,34,0.9));">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
                  ${state.data.showLifeScore ? 'PERSONAL LIFE SCORE' : 'DAILY SYSTEM SCORE'}
                </span>
                <button id="btn-toggle-score-mode" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 10px; font-family: var(--font-mono); text-decoration: underline;">
                  [Switch to ${state.data.showLifeScore ? 'Daily' : 'Life'} Score]
                </button>
              </div>
              <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 4px;">
                <span style="font-size: 42px; font-weight: 800; color: #fff; font-family: var(--font-mono); line-height: 1;">
                  ${activeScore.total}
                </span>
                <span style="font-size: 14px; color: var(--text-dim); font-family: var(--font-mono);">/ 100</span>
              </div>
              <p style="font-size: 12px; color: #e2e8f0; margin-top: 4px;">
                💡 <em>${activeScore.guidance || 'One task at a time. Progress over perfection.'}</em>
              </p>
            </div>

            <!-- Breakdown Pills & View Modal Button -->
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
              <button id="btn-view-score-breakdown" class="btn-secondary" style="font-size: 11px; padding: 6px 12px;">
                View Breakdown Breakdown ➔
              </button>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end;">
                ${activeScore.breakdown.slice(0, 3).map(b => `
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); background: rgba(255,255,255,0.04); padding: 2px 8px; border-radius: 6px;">
                    ${b.label}: ${b.points}/${b.max}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- 3. TODAY'S TOP 3 (Section 84 & 86) -->
      ${vis.top3 ? `
        <div class="glass-card" style="padding: 20px; border-color: rgba(245,158,11,0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">⭐</span>
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-amber); font-weight: 700; text-transform: uppercase;">FOCUS ON 3 (MAX)</span>
                <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Today's Top 3 Priorities</h3>
              </div>
            </div>
            <button onclick="window.location.hash='#tasks'" style="background:none; border:none; color:var(--neon-cyan); font-size:11px; cursor:pointer; font-weight:600;">
              Manage Tasks ➔
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${top3Tasks.length === 0 ? `
              <div style="padding: 14px; border-radius: 10px; background: rgba(16,185,129,0.1); border: 1px solid var(--neon-emerald); color: var(--neon-emerald); font-size: 13px; font-weight: 600; text-align: center;">
                🎉 All Top 3 priorities crushed today! Take a break or select another target.
              </div>
            ` : top3Tasks.map(t => `
              <div class="glass-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(255,255,255,0.02);">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <button class="btn-check-task" data-id="${t.id}" style="width: 22px; height: 22px; border-radius: 6px; border: 2px solid rgba(255,255,255,0.25); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; shrink-0;" title="Check off (+15 XP)"></button>
                  <div style="min-width: 0;">
                    <div style="font-size: 13px; font-weight: 700; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${t.title}
                    </div>
                    <div style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                      ${t.category} · ${t.estimatedMinutes || 25}m
                    </div>
                  </div>
                </div>

                <button class="btn-secondary btn-focus-task" data-title="${t.title}" data-duration="${t.estimatedMinutes || 25}" style="padding: 4px 10px; font-size: 11px; color: var(--neon-cyan); border-color: rgba(0,240,255,0.3); shrink-0;">
                  ⚡ Focus
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 4. CURRENT ACTION HERO (Section 84 & 86) -->
      ${vis.currentAction ? `
        <div class="glass-card" style="padding: 24px; border-color: rgba(0,240,255,0.4); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(7,14,28,0.95)); position: relative; overflow: hidden;">
          <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(0,240,255,0.12); border-radius: 50%; filter: blur(50px); pointer-events: none;"></div>

          <div style="display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1;">
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 99px; background: rgba(0,240,255,0.15); border: 1px solid rgba(0,240,255,0.3); font-size: 10px; font-family: var(--font-mono); font-weight: 700; color: var(--neon-cyan); align-self: flex-start;">
              <span>⚡ WHAT SHOULD I DO NOW?</span>
            </div>

            <div>
              <h2 style="font-size: 20px; font-weight: 800; color: #fff;">
                ${smartRec.title}
              </h2>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.5;">
                ${smartRec.reason}
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px;">
              <button id="btn-hero-start" class="btn-primary" style="padding: 10px 22px; font-size: 13px;">
                ▶ START FOCUS (${smartRec.durationLabel || '25 min'})
              </button>
              <button id="btn-hero-donow" class="btn-secondary" style="font-size: 12px; padding: 10px 14px;">
                Different Action
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- 5. HABITS (Section 84 & 86) -->
      ${vis.habits ? `
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🔥</span>
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700; text-transform: uppercase;">DAILY CADENCE</span>
                <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Habits Checklist</h3>
              </div>
            </div>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">
              ${habits.filter(h => h.completedDates?.includes(todayStr)).length} / ${habits.length} Done
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px;">
            ${habits.map(h => {
              const isChecked = h.completedDates?.includes(todayStr);
              return `
                <button class="btn-toggle-habit glass-card" data-id="${h.id}" style="padding: 10px 12px; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 8px; cursor: pointer; ${isChecked ? 'border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08);' : 'background: rgba(255,255,255,0.02);'}">
                  <div style="min-width: 0;">
                    <div style="font-weight: 700; font-size: 12px; color: ${isChecked ? 'var(--neon-emerald)' : '#fff'}; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${h.name}
                    </div>
                    <div style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                      🔥 ${h.streak || 0}d streak
                    </div>
                  </div>
                  <span style="width: 20px; height: 20px; border-radius: 6px; border: 2px solid ${isChecked ? 'var(--neon-emerald)' : 'rgba(255,255,255,0.2)'}; background: ${isChecked ? 'var(--neon-emerald)' : 'transparent'}; display: flex; align-items: center; justify-content: center; color: #000; font-size: 11px; font-weight: 800; shrink-0;">
                    ${isChecked ? '✓' : ''}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 6. TODAY'S QUICK STATS (Section 84 & 86) -->
      ${vis.todayQuick ? `
        <div class="glass-card" style="padding: 18px 20px;">
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: block;">
            TODAY AT A GLANCE
          </span>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
            <div style="padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">FOCUS TIME</span>
              <div style="font-size: 18px; font-weight: 800; color: #fff; font-family: var(--font-mono); margin-top: 2px;">
                ${focusDisplay}
              </div>
            </div>

            <div style="padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">WORKOUT</span>
                <div style="font-size: 14px; font-weight: 700; color: ${workoutDone ? 'var(--neon-emerald)' : 'var(--text-muted)'}; margin-top: 2px;">
                  ${workoutDone ? '✓ Completed' : 'Pending'}
                </div>
              </div>
              <button id="btn-quick-workout-toggle" class="btn-secondary" style="padding: 2px 8px; font-size: 10px;">
                ${workoutDone ? 'Undo' : '✓ Done'}
              </button>
            </div>

            <div style="padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">WATER</span>
                <div style="font-size: 18px; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono); margin-top: 2px;">
                  ${waterGlasses} / ${targetWater}
                </div>
              </div>
              <button id="btn-quick-water-add" class="btn-secondary" style="padding: 2px 8px; font-size: 10px; color: var(--neon-cyan);">
                + 1
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- 7. UPCOMING DEADLINES & EXAMS (Section 84 & 86) -->
      ${vis.upcoming ? `
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">📅</span>
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-rose); font-weight: 700; text-transform: uppercase;">ACADEMIC CALENDAR</span>
                <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Upcoming Exams & Milestones</h3>
              </div>
            </div>
            <button onclick="window.location.hash='#study'" style="background:none; border:none; color:var(--neon-cyan); font-size:11px; cursor:pointer;">
              Study Hub ➔
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${upcomingExams.map(ex => `
              <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 13px;">${ex.title}</div>
                  <div style="font-size: 11px; color: var(--text-dim);">${ex.code}</div>
                </div>
                <div style="text-align: right;">
                  <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: ${ex.daysLeft <= 30 ? 'var(--neon-rose)' : 'var(--neon-amber)'};">${ex.daysLeft}d</span>
                  <span style="display: block; font-size: 8px; color: var(--text-dim); text-transform: uppercase;">REMAINING</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 8. DAILY 4-BLOCK FLOW (Section 10) -->
      ${vis.blocks ? `
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700; text-transform: uppercase;">CIRCADIAN ARCHITECTURE</span>
              <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Daily 4-Block Schedule</h3>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${(state.data.scheduleBlocks || []).map(b => {
              const isActive = (b.name === 'COLLEGE' && isCollegeHours) || (b.name === 'MORNING' && currentHour < 9) || (b.name === 'EVENING' && currentHour >= 17 && currentHour < 21) || (b.name === 'NIGHT' && currentHour >= 21);
              return `
                <div style="padding: 12px 14px; border-radius: 10px; ${isActive ? 'background: rgba(0,240,255,0.08); border: 1px solid var(--neon-cyan);' : 'background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);'}">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-weight: 800; font-size: 12px; color: ${isActive ? 'var(--neon-cyan)' : '#fff'};">${b.name}</span>
                    <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">${b.startTime} - ${b.endTime}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${b.label}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 9. STRATEGIC GOALS PREVIEW (Section 84) -->
      ${vis.goals ? `
        <div class="glass-card" style="padding: 20px; border-color: rgba(168,85,247,0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700; text-transform: uppercase;">STRATEGIC CASCADE</span>
            <button onclick="window.location.hash='#goals'" style="background:none; border:none; color:var(--neon-purple); font-size:11px; cursor:pointer;">
              View Cascade ➔
            </button>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-size: 14px; font-weight: 700; color: #fff;">
                🎯 ${state.data.goals?.[0]?.todayAction || 'Solve 2 Binary Search problems & review streams'}
              </div>
              <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                Advances your 1-Year Goal: "${state.data.goals?.[0]?.yearGoal || 'Industry Job-Ready Engineer'}"
              </p>
            </div>
            <button class="btn-secondary btn-focus-task" data-title="${state.data.goals?.[0]?.todayAction || 'Goal Action'}" data-duration="35" style="padding: 4px 10px; font-size: 11px; color: var(--neon-purple); border-color: rgba(168,85,247,0.4);">
              ⚡ Execute Goal Step
            </button>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function bindHomePageEvents(state, onStartFocus, onNavigateTab, onOpenDoNow, onOpenScore) {
  const todayStr = getLocalDateString();

  // Exit Recovery Mode
  const exitRec = document.getElementById('btn-exit-recovery-home');
  if (exitRec) {
    exitRec.addEventListener('click', () => {
      state.update(d => { d.recoveryModeActive = false; });
      showToast('Recovery Mode deactivated.');
    });
  }

  // Roll Overdue Tasks to Today
  const rollOverdueBtn = document.getElementById('btn-roll-overdue-today');
  if (rollOverdueBtn) {
    rollOverdueBtn.addEventListener('click', () => {
      const rolled = state.rollOverdueTasksToToday();
      soundSynth.playClick();
      showToast(`Rescheduled ${rolled} tasks for today. Today still counts!`, 'info');
    });
  }

  // Score mode toggle (Daily vs Life)
  const toggleScoreMode = document.getElementById('btn-toggle-score-mode');
  if (toggleScoreMode) {
    toggleScoreMode.addEventListener('click', () => {
      state.update(d => {
        d.showLifeScore = !d.showLifeScore;
      });
      soundSynth.playClick();
    });
  }

  // View Score Breakdown Modal
  const viewScoreBtn = document.getElementById('btn-view-score-breakdown');
  if (viewScoreBtn) {
    viewScoreBtn.addEventListener('click', () => {
      onOpenScore();
    });
  }

  // Hero Start Focus
  const heroStartBtn = document.getElementById('btn-hero-start');
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', () => {
      const smartRec = getSmartRecommendations(state.data, new Date())[0];
      const title = smartRec ? smartRec.title : '25 min Java Focus';
      const duration = smartRec ? smartRec.duration : 25;
      onStartFocus(title, duration);
    });
  }

  // Hero Change Recommendation
  const heroDoNowBtn = document.getElementById('btn-hero-donow');
  if (heroDoNowBtn) {
    heroDoNowBtn.addEventListener('click', () => {
      onOpenDoNow();
    });
  }

  // Task checkoffs from Top 3
  document.querySelectorAll('.btn-check-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const t = d.tasks.find(x => x.id === id);
        if (t) {
          t.status = t.status === 'completed' ? 'todo' : 'completed';
          if (t.status === 'completed') {
            soundSynth.playChime();
          }
        }
      });
      state.addXP(15, 'Task Completed');
      showToast('Task checked off (+15 XP)!');
    });
  });

  // Focus on specific task
  document.querySelectorAll('.btn-focus-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const duration = Number(btn.getAttribute('data-duration')) || 25;
      onStartFocus(title, duration);
    });
  });

  // Habit checkoffs
  document.querySelectorAll('.btn-toggle-habit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const h = d.habits.find(x => x.id === id);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          if (h.completedDates.includes(todayStr)) {
            h.completedDates = h.completedDates.filter(x => x !== todayStr);
            h.streak = Math.max(0, (h.streak || 1) - 1);
          } else {
            h.completedDates.push(todayStr);
            h.streak = (h.streak || 0) + 1;
            h.bestStreak = Math.max(h.bestStreak || 0, h.streak);
            soundSynth.playClick();
          }
        }
      });
      state.addXP(10, 'Habit Recorded');
      showToast('Habit recorded (+10 XP)');
    });
  });

  // Quick 1-tap water add
  const quickWaterAdd = document.getElementById('btn-quick-water-add');
  if (quickWaterAdd) {
    quickWaterAdd.addEventListener('click', () => {
      state.update(d => {
        if (!d.water) d.water = { currentGlasses: 0, targetGlasses: 8, glassMl: 250 };
        d.water.currentGlasses += 1;
      });
      soundSynth.playClick();
      state.addXP(5, 'Hydration Glass');
      showToast(`Logged 1 glass of water (${state.data.water.currentGlasses}/${state.data.water.targetGlasses})`);
    });
  }

  // Quick workout toggle
  const quickWorkoutToggle = document.getElementById('btn-quick-workout-toggle');
  if (quickWorkoutToggle) {
    quickWorkoutToggle.addEventListener('click', () => {
      state.update(d => {
        if (!d.fitness) d.fitness = {};
        d.fitness.todayWorkoutDone = !d.fitness.todayWorkoutDone;
        if (d.fitness.todayWorkoutDone) soundSynth.playChime();
      });
      state.addXP(30, 'Workout Completed');
      showToast(state.data.fitness.todayWorkoutDone ? 'Workout marked complete (+30 XP)!' : 'Workout reset');
    });
  }

  // Home Screen Customization Modal (Section 84: Allow customization)
  const customizeBtn = document.getElementById('btn-home-customize');
  if (customizeBtn) {
    customizeBtn.addEventListener('click', () => {
      const vis = state.data.homeSectionsVisibility || {};
      const sections = [
        { key: 'score', label: 'Daily / Life Score Banner' },
        { key: 'top3', label: "Today's Top 3 Priorities" },
        { key: 'currentAction', label: 'Current Action Recommendation' },
        { key: 'habits', label: 'Daily Habits Checklist' },
        { key: 'todayQuick', label: "Today's Quick Numbers (Focus, Workout, Water)" },
        { key: 'upcoming', label: 'Upcoming Exam Countdown' },
        { key: 'blocks', label: 'Daily 4-Block Circadian Schedule' },
        { key: 'goals', label: 'Strategic Goal Step' }
      ];

      const modalHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">⚙️</span>
              <h2 style="font-size: 18px; font-weight: 800; color: #fff;">Customize Home Screen</h2>
            </div>
            <button id="btn-close-customize-modal" style="background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer;">✕</button>
          </div>

          <p style="font-size: 12px; color: var(--text-muted);">
            Toggle visibility for sections on your personal dashboard. Tailor it to your daily routine.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${sections.map(s => {
              const isChecked = vis[s.key] !== false;
              return `
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); cursor: pointer;">
                  <span style="font-size: 13px; font-weight: 600; color: #fff;">${s.label}</span>
                  <input type="checkbox" class="chk-section-vis" data-key="${s.key}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--neon-cyan);" />
                </label>
              `;
            }).join('')}
          </div>

          <button id="btn-save-home-customization" class="btn-primary" style="margin-top: 8px; justify-content: center;">
            Save Preferences
          </button>
        </div>
      `;

      ModalEngine.open('modal-customize-home', modalHTML, (dialog) => {
        dialog.querySelector('#btn-close-customize-modal')?.addEventListener('click', () => ModalEngine.close());
        dialog.querySelector('#btn-save-home-customization')?.addEventListener('click', () => {
          state.update(d => {
            if (!d.homeSectionsVisibility) d.homeSectionsVisibility = {};
            dialog.querySelectorAll('.chk-section-vis').forEach(chk => {
              const key = chk.getAttribute('data-key');
              d.homeSectionsVisibility[key] = chk.checked;
            });
          });
          soundSynth.playClick();
          showToast('Dashboard sections customized!');
          ModalEngine.close();
        });
      });
    });
  }
}
