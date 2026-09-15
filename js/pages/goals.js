// Goals Module (Section 24: Goal Breakdown Engine: Year ➔ 3-Month ➔ Month ➔ Week ➔ Today Action)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { ChartEngine } from '../components/charts.js';
import { getLocalDateString } from '../state.js';

export function renderGoalsPage(state) {
  const goals = state.data.goals || [];
  const primaryGoal = goals[0] || {
    id: 'g-job-ready',
    title: 'Become Industry Job-Ready for Top IT Roles',
    category: 'Career',
    progress: 42,
    yearGoal: 'Secure a high-impact Software Development Engineer role upon graduation.',
    threeMonthGoal: 'Master Java + DSA basics and ship MultitaskCoder production v1.',
    monthGoal: 'Complete Binary Search, Linked Lists & Java Streams.',
    weekGoal: 'Study Arrays & complete 5 LeetCode problems.',
    todayAction: 'Solve 2 Binary Search problems and review Java Stream collectors.',
    milestones: [
      { id: 'gm-1', title: 'Build and deploy MultitaskCoder', completed: true },
      { id: 'gm-2', title: 'Complete 100 LeetCode questions', completed: false }
    ]
  };

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Goal Breakdown Engine</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.12); padding: 2px 8px; border-radius: 99px;">
              CASCADE SYSTEM
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Turn grand multi-year aspirations into small, non-threatening daily execution steps.
          </p>
        </div>

        <button id="btn-add-goal" class="btn-primary" style="font-size: 12px; padding: 7px 16px;">
          + New Goal Cascade
        </button>
      </div>

      <!-- Main Goal Overview Banner -->
      <div class="glass-card" style="padding: 24px; border-color: rgba(0,240,255,0.4); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(7,14,28,0.9));">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
              🎯 PRIMARY STRATEGIC ASPIRATION
            </span>
            <h2 style="font-size: 22px; font-weight: 800; color: #fff; margin-top: 4px;">
              ${primaryGoal.title}
            </h2>
            <div style="display: flex; gap: 10px; margin-top: 8px; font-size: 11px; color: var(--text-muted);">
              <span>Domain: <strong style="color:#fff;">${primaryGoal.category}</strong></span> ·
              <span>Status: <strong style="color:var(--neon-emerald);">In Active Execution</strong></span>
            </div>
          </div>

          <div style="text-align: center;">
            ${ChartEngine.renderProgressRing(primaryGoal.progress || 42, 100, 9, 'var(--neon-cyan)')}
            <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); margin-top: 4px;">STRATEGY PROGRESS</div>
          </div>
        </div>
      </div>

      <!-- The 5-Tier Cascade Flowchart Cards -->
      <div style="display: flex; flex-direction: column; gap: 14px; position: relative;">
        
        <!-- Tier 1: Year -->
        <div class="glass-card" style="padding: 18px 20px; border-left: 4px solid var(--neon-purple); background: rgba(168,85,247,0.04);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🏛️</span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-purple); font-weight: 700;">TIER 1: 1-YEAR VISION</span>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">12 MONTH HORIZON</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #fff;">
            ${primaryGoal.yearGoal}
          </div>
        </div>

        <div style="text-align: center; color: var(--neon-purple); font-size: 16px; margin: -8px 0;">↓</div>

        <!-- Tier 2: 3-Month -->
        <div class="glass-card" style="padding: 18px 20px; border-left: 4px solid var(--neon-cyan); background: rgba(0,240,255,0.04);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🏆</span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">TIER 2: 3-MONTH QUARTERLY MILESTONE</span>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">QUARTER HORIZON</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #fff;">
            ${primaryGoal.threeMonthGoal}
          </div>
        </div>

        <div style="text-align: center; color: var(--neon-cyan); font-size: 16px; margin: -8px 0;">↓</div>

        <!-- Tier 3: 1-Month -->
        <div class="glass-card" style="padding: 18px 20px; border-left: 4px solid var(--neon-emerald); background: rgba(16,185,129,0.04);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">📅</span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700;">TIER 3: 1-MONTH TARGET</span>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">30 DAY HORIZON</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #fff;">
            ${primaryGoal.monthGoal}
          </div>
        </div>

        <div style="text-align: center; color: var(--neon-emerald); font-size: 16px; margin: -8px 0;">↓</div>

        <!-- Tier 4: 1-Week -->
        <div class="glass-card" style="padding: 18px 20px; border-left: 4px solid var(--neon-amber); background: rgba(245,158,11,0.04);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">⚡</span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber); font-weight: 700;">TIER 4: THIS WEEK'S SPRINT</span>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">7 DAY HORIZON</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #fff;">
            ${primaryGoal.weekGoal}
          </div>
        </div>

        <div style="text-align: center; color: var(--neon-amber); font-size: 16px; margin: -8px 0;">↓</div>

        <!-- Tier 5: Today's Action Step -->
        <div class="glass-card" style="padding: 22px; border: 2px solid var(--neon-cyan); background: linear-gradient(135deg, rgba(0,240,255,0.08), rgba(15,23,42,0.95)); box-shadow: 0 10px 30px rgba(0,240,255,0.15);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 22px;">🎯</span>
              <div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 800; text-transform: uppercase;">
                  TIER 5: TODAY'S SINGLE ACTION STEP
                </span>
                <h3 style="font-size: 16px; font-weight: 800; color: #fff;">
                  ${primaryGoal.todayAction}
                </h3>
              </div>
            </div>
            <button id="btn-convert-goal-to-task" class="btn-primary" style="font-size: 11px; padding: 6px 14px;">
              ⚡ Add to Today's Tasks
            </button>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
            By completing this concrete 40-minute action today, you tangibly advance toward your 1-year Software Engineer aspiration.
          </p>
        </div>

      </div>

    </div>
  `;
}

export function bindGoalsEvents(state, rerender) {
  // Convert Today's action to task
  const convertBtn = document.getElementById('btn-convert-goal-to-task');
  if (convertBtn) {
    convertBtn.addEventListener('click', () => {
      const todayAction = state.data.goals?.[0]?.todayAction || 'Complete today goal step';
      const todayStr = getLocalDateString();

      state.update(d => {
        d.tasks.unshift({
          id: `task-${Date.now()}`,
          title: todayAction,
          tier: 'must-do',
          category: 'Coding',
          dueDate: todayStr,
          estimatedMinutes: 40,
          status: 'todo',
          isTop3: true,
          difficulty: 'medium',
          energyRequired: 'high'
        });
      });

      soundSynth.playChime();
      state.addXP(15, 'Goal Action Activated');
      showToast(`Added "${todayAction}" to Top 3 tasks (+15 XP)!`, 'xp');
      convertBtn.textContent = '✓ Added to Tasks';
      convertBtn.disabled = true;
    });
  }

  // Add goal cascade
  const addGoalBtn = document.getElementById('btn-add-goal');
  if (addGoalBtn) {
    addGoalBtn.addEventListener('click', () => {
      const title = prompt('Enter primary goal aspiration (e.g. Master Backend Engineering):');
      if (title && title.trim()) {
        const todayAction = prompt('What is 1 tiny concrete action you can do TODAY for this goal?') || 'Read 1 article or write 20 lines of code';
        state.update(d => {
          if (!d.goals) d.goals = [];
          d.goals.unshift({
            id: `g-${Date.now()}`,
            title: title.trim(),
            category: 'Personal',
            progress: 10,
            yearGoal: title.trim(),
            threeMonthGoal: 'Build functional demo prototype',
            monthGoal: 'Complete core fundamentals',
            weekGoal: 'Set up development workspace & initial tutorials',
            todayAction: todayAction.trim()
          });
        });
        soundSynth.playClick();
        showToast('New Goal Cascade created!', 'success');
        rerender();
      }
    });
  }
}
