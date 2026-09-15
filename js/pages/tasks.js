// Tasks Module (Sections 8-11: Today/Tomorrow/Later grouping, Must/Should/Could tiers, Top 3 focus)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';

export function renderTasksPage(state, activeTab = 'today', activeTier = 'all', activeCategory = 'all') {
  const todayStr = getLocalDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);

  const tasks = state.data.tasks || [];

  // Filter tasks based on view tab
  let filtered = tasks.filter(t => {
    if (activeTab === 'today') return t.dueDate === todayStr && t.status !== 'completed';
    if (activeTab === 'tomorrow') return t.dueDate === tomorrowStr && t.status !== 'completed';
    if (activeTab === 'upcoming') return t.dueDate > tomorrowStr && t.status !== 'completed';
    if (activeTab === 'later') return !t.dueDate && t.status !== 'completed';
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  if (activeTier !== 'all') {
    filtered = filtered.filter(t => t.tier === activeTier);
  }

  if (activeCategory !== 'all') {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 18px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Task Matrix</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 99px;">
              ${filtered.length} items
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Organized by priority tiers. Max 3 "Must-Dos" per day to prevent cognitive burnout.
          </p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-tasks-add" class="btn-primary" style="font-size: 12px; padding: 7px 14px;">
            + Add Task
          </button>
        </div>
      </div>

      <!-- Quick Add Inline Bar -->
      <div class="glass-card" style="padding: 10px 14px; display: flex; align-items: center; gap: 10px;">
        <span style="color: var(--neon-cyan); font-size: 16px;">⚡</span>
        <input
          type="text"
          id="input-inline-task"
          placeholder="Quick add: 'Revise Java Interfaces' or 'Finish MultitaskCoder test'... (Press Enter)"
          style="flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 13px;"
        />
        <select id="select-inline-tier" class="input-field" style="width: auto; padding: 4px 8px; font-size: 11px;">
          <option value="must-do">🔴 Must-Do</option>
          <option value="should-do" selected>🟡 Should-Do</option>
          <option value="could-do">🟢 Could-Do</option>
        </select>
        <button id="btn-inline-task-save" class="btn-secondary" style="padding: 4px 10px; font-size: 11px;">
          Add
        </button>
      </div>

      <!-- View Navigation Tabs -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
        <button class="btn-secondary task-view-btn ${activeTab === 'today' ? 'active-tab' : ''}" data-tab="today" style="padding: 6px 14px; font-size: 12px;">
          Today (${tasks.filter(t => t.dueDate === todayStr && t.status !== 'completed').length})
        </button>
        <button class="btn-secondary task-view-btn ${activeTab === 'tomorrow' ? 'active-tab' : ''}" data-tab="tomorrow" style="padding: 6px 14px; font-size: 12px;">
          Tomorrow (${tasks.filter(t => t.dueDate === tomorrowStr && t.status !== 'completed').length})
        </button>
        <button class="btn-secondary task-view-btn ${activeTab === 'upcoming' ? 'active-tab' : ''}" data-tab="upcoming" style="padding: 6px 14px; font-size: 12px;">
          Upcoming
        </button>
        <button class="btn-secondary task-view-btn ${activeTab === 'later' ? 'active-tab' : ''}" data-tab="later" style="padding: 6px 14px; font-size: 12px;">
          Someday / Later
        </button>
        <button class="btn-secondary task-view-btn ${activeTab === 'completed' ? 'active-tab' : ''}" data-tab="completed" style="padding: 6px 14px; font-size: 12px;">
          Completed (${tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      <!-- Tier Filters -->
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">FILTER TIER:</span>
        <button class="btn-secondary tier-filter-btn ${activeTier === 'all' ? 'active-tab' : ''}" data-tier="all" style="padding: 4px 10px; font-size: 11px;">All</button>
        <button class="btn-secondary tier-filter-btn ${activeTier === 'must-do' ? 'active-tab' : ''}" data-tier="must-do" style="padding: 4px 10px; font-size: 11px; color: #f43f5e;">🔴 Must-Do</button>
        <button class="btn-secondary tier-filter-btn ${activeTier === 'should-do' ? 'active-tab' : ''}" data-tier="should-do" style="padding: 4px 10px; font-size: 11px; color: #f59e0b;">🟡 Should-Do</button>
        <button class="btn-secondary tier-filter-btn ${activeTier === 'could-do' ? 'active-tab' : ''}" data-tier="could-do" style="padding: 4px 10px; font-size: 11px; color: #10b981;">🟢 Could-Do</button>
      </div>

      <!-- Task Cards List -->
      <div id="tasks-container" style="display: flex; flex-direction: column; gap: 10px;">
        ${filtered.length === 0 ? `
          <div class="glass-card" style="padding: 36px; text-align: center;">
            <span style="font-size: 32px; display: block; margin-bottom: 8px;">🎉</span>
            <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Zero tasks in this view</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              You're all caught up or no tasks match this filter. Take a break or add a new one.
            </p>
          </div>
        ` : filtered.map(t => {
          const isDone = t.status === 'completed';
          const tierBadge = t.tier === 'must-do' ? '<span style="color:#f43f5e; font-size:10px; font-weight:700;">🔴 MUST</span>' : t.tier === 'should-do' ? '<span style="color:#f59e0b; font-size:10px; font-weight:700;">🟡 SHOULD</span>' : '<span style="color:#10b981; font-size:10px; font-weight:700;">🟢 COULD</span>';

          return `
            <div class="glass-card task-card-item" data-id="${t.id}" style="padding: 14px 18px; border-left: 4px solid ${t.tier === 'must-do' ? '#f43f5e' : t.tier === 'should-do' ? '#f59e0b' : '#10b981'}; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
              
              <!-- Checkbox & Title -->
              <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0;">
                <button class="btn-check-task" data-id="${t.id}" style="margin-top: 2px; width: 22px; height: 22px; border-radius: 6px; border: 2px solid ${isDone ? 'var(--neon-emerald)' : 'rgba(255,255,255,0.2)'}; background: ${isDone ? 'var(--neon-emerald)' : 'transparent'}; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #000; font-size: 12px; font-weight: 800; shrink-0;">
                  ${isDone ? '✓' : ''}
                </button>

                <div style="min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-weight: 700; font-size: 14px; color: ${isDone ? 'var(--text-dim)' : '#fff'}; ${isDone ? 'text-decoration: line-through;' : ''}">
                      ${t.title}
                    </span>
                    ${t.isTop3 ? '<span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-amber); background: rgba(245,158,11,0.15); padding: 1px 6px; border-radius: 4px; font-weight: 700;">⭐ TOP 3</span>' : ''}
                    ${tierBadge}
                  </div>

                  ${t.description ? `
                    <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
                      ${t.description}
                    </p>
                  ` : ''}

                  <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 11px; color: var(--text-dim); flex-wrap: wrap;">
                    <span style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">🏷️ ${t.category || 'General'}</span>
                    ${t.estimatedMinutes ? `<span>⏱️ ${t.estimatedMinutes}m</span>` : ''}
                    ${t.dueTime ? `<span>⏰ ${t.dueTime}</span>` : ''}
                    ${t.dueDate ? `<span>📅 ${t.dueDate}</span>` : ''}
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div style="display: flex; align-items: center; gap: 6px; shrink-0;">
                ${!isDone ? `
                  <button class="btn-secondary btn-task-pin" data-id="${t.id}" title="${t.isTop3 ? 'Unpin from Top 3' : 'Pin to Top 3'}" style="padding: 4px 8px; font-size: 12px; color: ${t.isTop3 ? 'var(--neon-amber)' : 'var(--text-dim)'};">
                    ${t.isTop3 ? '★' : '☆'}
                  </button>
                  <button class="btn-secondary btn-task-focus" data-id="${t.id}" data-title="${t.title}" data-duration="${t.estimatedMinutes || 25}" title="Start Focus Session" style="padding: 4px 10px; font-size: 11px; color: var(--neon-cyan); border-color: rgba(0,240,255,0.3);">
                    ⚡ Focus
                  </button>
                ` : ''}
                <button class="btn-secondary btn-task-delete" data-id="${t.id}" title="Delete Task" style="padding: 4px 8px; font-size: 12px; color: var(--neon-rose); opacity: 0.6;">
                  🗑️
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

export function bindTasksEvents(state, onStartFocus, rerender) {
  const todayStr = getLocalDateString();

  // Inline Quick Add
  const inlineInput = document.getElementById('input-inline-task');
  const inlineTier = document.getElementById('select-inline-tier');
  const inlineSaveBtn = document.getElementById('btn-inline-task-save');

  const addInlineTask = () => {
    const title = inlineInput?.value.trim();
    if (!title) return;
    const tier = inlineTier?.value || 'should-do';

    state.update(d => {
      d.tasks.unshift({
        id: `task-${Date.now()}`,
        title,
        tier,
        category: 'Personal',
        dueDate: todayStr,
        estimatedMinutes: 25,
        status: 'todo',
        difficulty: 'medium',
        energyRequired: 'medium'
      });
    });

    soundSynth.playClick();
    state.addXP(10, 'Task Created');
    showToast(`Added task: "${title}" (+10 XP)`);
    inlineInput.value = '';
    rerender();
  };

  if (inlineSaveBtn) inlineSaveBtn.addEventListener('click', addInlineTask);
  if (inlineInput) {
    inlineInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addInlineTask();
    });
  }

  // Add Task Modal button
  const addTaskBtn = document.getElementById('btn-tasks-add');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      import('../components/quickaction.js').then(m => {
        m.QuickActionEngine.open(state, 'task');
      });
    });
  }

  // Toggle Task Checkbox
  document.querySelectorAll('.btn-check-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const t = d.tasks.find(x => x.id === id);
        if (t) {
          t.status = t.status === 'completed' ? 'todo' : 'completed';
          if (t.status === 'completed') {
            soundSynth.playChime();
          } else {
            soundSynth.playClick();
          }
        }
      });
      state.addXP(15, 'Task Checked Off');
      showToast('Task updated (+15 XP)');
      rerender();
    });
  });

  // Pin / Unpin Top 3
  document.querySelectorAll('.btn-task-pin').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.update(d => {
        const t = d.tasks.find(x => x.id === id);
        if (t) {
          const currentTop3 = d.tasks.filter(x => x.isTop3 && x.status !== 'completed').length;
          if (!t.isTop3 && currentTop3 >= 3) {
            showToast('Max 3 Top Priority tasks allowed. Finish one first!', 'info');
            return;
          }
          t.isTop3 = !t.isTop3;
        }
      });
      soundSynth.playClick();
      rerender();
    });
  });

  // Start Focus
  document.querySelectorAll('.btn-task-focus').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const duration = Number(btn.getAttribute('data-duration')) || 25;
      onStartFocus(title, duration);
    });
  });

  // Delete Task
  document.querySelectorAll('.btn-task-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this task?')) {
        state.update(d => {
          d.tasks = d.tasks.filter(x => x.id !== id);
        });
        showToast('Task deleted');
        rerender();
      }
    });
  });
}
