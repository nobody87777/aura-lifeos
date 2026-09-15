// Projects Module (Section 25: MultitaskCoder Project Hub, Milestones, Bugs/Features, Time Tracking)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { ChartEngine } from '../components/charts.js';

export function renderProjectsPage(state) {
  const projects = state.data.projects || [];
  const primaryProject = projects[0] || {
    id: 'proj-multitaskcoder',
    name: 'MultitaskCoder',
    tagline: 'Flagship Developer Productivity & Learning Suite',
    progress: 72,
    hoursInvested: 31,
    minutesInvested: 20,
    nextTask: 'Fix mobile navigation overflow & polish debugger module',
    milestones: [],
    items: []
  };

  const completedMilestones = (primaryProject.milestones || []).filter(m => m.completed).length;
  const totalMilestones = (primaryProject.milestones || []).length || 1;

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Project Forge</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 99px;">
              FLAGSHIP DEV
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Build real software systems that stand out on resumes and job portfolios.
          </p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-project-log-time" class="btn-primary" style="font-size: 12px; padding: 7px 14px;">
            + Log 30m Coding
          </button>
        </div>
      </div>

      <!-- MultitaskCoder Flagship Showcase Hero Card -->
      <div class="glass-card" style="padding: 24px; border-color: rgba(0,240,255,0.4); background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(20,15,35,0.9)); position: relative; overflow: hidden;">
        <div style="position: absolute; right: -40px; top: -40px; width: 220px; height: 220px; background: rgba(168,85,247,0.15); border-radius: 50%; filter: blur(50px); pointer-events: none;"></div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;" class="md-grid-2">
          
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 6px; background: rgba(0,240,255,0.15); font-size: 10px; font-family: var(--font-mono); font-weight: 700; color: var(--neon-cyan); margin-bottom: 8px;">
              ⭐ ACTIVE PRIORITY PROJECT
            </div>

            <h2 style="font-size: 22px; font-weight: 800; color: #fff;">${primaryProject.name}</h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
              ${primaryProject.tagline}
            </p>

            <!-- Next Concrete Action (Anti-procrastination) -->
            <div style="margin-top: 14px; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
              <span style="font-size: 9px; font-family: var(--font-mono); color: var(--neon-amber); font-weight: 700; text-transform: uppercase;">IMMEDIATE NEXT ACTION</span>
              <div style="font-size: 13px; font-weight: 700; color: #fff; margin-top: 2px;">
                ${primaryProject.nextTask || 'Implement debugger module execution logic'}
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <button id="btn-sprint-multitask" class="btn-primary" style="font-size: 12px; padding: 8px 16px;">
                ⚡ Launch 45m Focus Sprint
              </button>
              <button id="btn-edit-project" class="btn-secondary" style="font-size: 12px; padding: 8px 12px;">
                ✏️ Edit Details
              </button>
            </div>
          </div>

          <!-- Progress Ring & Stats -->
          <div style="display: flex; align-items: center; justify-content: space-around; background: rgba(0,0,0,0.25); border-radius: 16px; padding: 18px; border: 1px solid var(--border-subtle);">
            <div style="text-align: center;">
              ${ChartEngine.renderProgressRing(primaryProject.progress || 72, 110, 10, 'var(--neon-cyan)')}
              <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-top: 6px;">COMPLETION</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-family: var(--font-mono);">
              <div>
                <span style="font-size: 10px; color: var(--text-dim);">INVESTED TIME</span>
                <div style="font-size: 18px; font-weight: 800; color: #fff;">
                  ${primaryProject.hoursInvested || 31}h ${primaryProject.minutesInvested || 20}m
                </div>
              </div>
              <div>
                <span style="font-size: 10px; color: var(--text-dim);">MILESTONES</span>
                <div style="font-size: 18px; font-weight: 800; color: var(--neon-purple);">
                  ${completedMilestones} / ${totalMilestones}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Milestones Roadmap Checklist -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Production Roadmap & Milestones</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Step-by-step path to shipping version 1.0</p>
          </div>
          <button id="btn-add-milestone" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">+ Add Milestone</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(primaryProject.milestones || []).map((m, idx) => `
            <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-toggle-milestone" data-idx="${idx}" style="width: 20px; height: 20px; border-radius: 6px; border: 2px solid ${m.completed ? 'var(--neon-emerald)' : 'rgba(255,255,255,0.2)'}; background: ${m.completed ? 'var(--neon-emerald)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #000; font-size: 11px; font-weight: 800;">
                  ${m.completed ? '✓' : ''}
                </button>
                <span style="font-size: 13px; font-weight: 600; color: ${m.completed ? 'var(--text-dim)' : '#fff'}; ${m.completed ? 'text-decoration: line-through;' : ''}">
                  ${m.title}
                </span>
              </div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: ${m.completed ? 'var(--neon-emerald)' : 'var(--text-dim)'};">
                ${m.completed ? 'SHIPPED' : 'PENDING'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Feature & Bug Tracker -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Features & Bug Backlog</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Track granular technical tasks</p>
          </div>
          <button id="btn-add-issue" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">+ Add Feature / Bug</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(primaryProject.items || []).map((item, idx) => `
            <div style="padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 10px; font-family: var(--font-mono); font-weight: 700; padding: 2px 6px; border-radius: 4px; ${item.type === 'bug' ? 'background: rgba(244,63,94,0.15); color: #f43f5e;' : 'background: rgba(0,240,255,0.15); color: var(--neon-cyan);'}">
                  ${item.type === 'bug' ? '🐛 BUG' : '✨ FEAT'}
                </span>
                <span style="font-size: 13px; font-weight: 600; color: #fff;">
                  ${item.title}
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">${item.status}</span>
                <button class="btn-item-resolve btn-secondary" data-idx="${idx}" style="padding: 3px 8px; font-size: 11px;">✓</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindProjectsEvents(state, onStartFocus, rerender) {
  // Log 30m coding
  const logTimeBtn = document.getElementById('btn-project-log-time');
  if (logTimeBtn) {
    logTimeBtn.addEventListener('click', () => {
      state.update(d => {
        if (!d.projects?.[0]) return;
        const p = d.projects[0];
        p.minutesInvested = (p.minutesInvested || 0) + 30;
        if (p.minutesInvested >= 60) {
          p.hoursInvested = (p.hoursInvested || 0) + Math.floor(p.minutesInvested / 60);
          p.minutesInvested = p.minutesInvested % 60;
        }
      });
      soundSynth.playChime();
      state.addXP(20, 'MultitaskCoder Coding Session');
      showToast('Logged 30m of software development (+20 XP)!', 'xp');
      rerender();
    });
  }

  // Launch focus sprint
  const sprintBtn = document.getElementById('btn-sprint-multitask');
  if (sprintBtn) {
    sprintBtn.addEventListener('click', () => {
      const task = state.data.projects?.[0]?.nextTask || 'MultitaskCoder Development';
      onStartFocus(task, 45);
    });
  }

  // Toggle milestone
  document.querySelectorAll('.btn-toggle-milestone').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        const m = d.projects?.[0]?.milestones?.[idx];
        if (m) {
          m.completed = !m.completed;
          const total = d.projects[0].milestones.length;
          const comp = d.projects[0].milestones.filter(x => x.completed).length;
          d.projects[0].progress = Math.round((comp / total) * 100);
        }
      });
      soundSynth.playClick();
      rerender();
    });
  });

  // Resolve issue
  document.querySelectorAll('.btn-item-resolve').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        d.projects?.[0]?.items?.splice(idx, 1);
      });
      soundSynth.playClick();
      showToast('Issue resolved!');
      rerender();
    });
  });

  // Add issue
  const addIssueBtn = document.getElementById('btn-add-issue');
  if (addIssueBtn) {
    addIssueBtn.addEventListener('click', () => {
      const title = prompt('Enter feature or bug title:');
      if (title && title.trim()) {
        const isBug = confirm('Is this a BUG? (Click OK for Bug, Cancel for Feature)');
        state.update(d => {
          if (!d.projects?.[0].items) d.projects[0].items = [];
          d.projects[0].items.push({
            id: `i-${Date.now()}`,
            title: title.trim(),
            type: isBug ? 'bug' : 'feature',
            status: 'todo'
          });
        });
        soundSynth.playClick();
        rerender();
      }
    });
  }

  // Add milestone
  const addMilestoneBtn = document.getElementById('btn-add-milestone');
  if (addMilestoneBtn) {
    addMilestoneBtn.addEventListener('click', () => {
      const title = prompt('Enter new milestone description:');
      if (title && title.trim()) {
        state.update(d => {
          if (!d.projects?.[0].milestones) d.projects[0].milestones = [];
          d.projects[0].milestones.push({
            id: `m-${Date.now()}`,
            title: title.trim(),
            completed: false
          });
        });
        soundSynth.playClick();
        rerender();
      }
    });
  }
}
