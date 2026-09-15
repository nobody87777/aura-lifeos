// Router Engine (Hash-based, Zero Dependencies, Modular Dynamic Page Mounting)
import { renderHomePage, bindHomePageEvents } from './pages/home.js';
import { renderTasksPage, bindTasksEvents } from './pages/tasks.js';
import { renderFocusPage, bindFocusEvents, setFocusInitialTask } from './pages/focus.js';
import { renderStudyPage, bindStudyEvents } from './pages/study.js';
import { renderProjectsPage, bindProjectsEvents } from './pages/projects.js';
import { renderCareerPage, bindCareerEvents } from './pages/career.js';
import { renderGoalsPage, bindGoalsEvents } from './pages/goals.js';
import { renderAttendancePage, bindAttendanceEvents } from './pages/attendance.js';
import { renderHealthPage, bindHealthEvents } from './pages/health.js';
import { renderFinancePage, bindFinanceEvents } from './pages/finance.js';
import { renderJournalPage, bindJournalEvents } from './pages/journal.js';
import { renderReviewsPage, bindReviewsEvents } from './pages/reviews.js';
import { renderProfilePage, bindProfileEvents } from './pages/profile.js';
import { ModalEngine } from './components/modal.js';

export class Router {
  constructor(state, mainContainer, updateNavCallback) {
    this.state = state;
    this.container = mainContainer;
    this.updateNavCallback = updateNavCallback;
    this.currentRoute = 'home';

    // Page-specific local UI states
    this.tasksTab = 'today';
    this.tasksTier = 'all';
    this.tasksCategory = 'all';
    this.reviewsTab = 'nightly';

    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  getCurrentRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    const valid = ['home', 'tasks', 'focus', 'study', 'projects', 'career', 'goals', 'attendance', 'health', 'finance', 'journal', 'reviews', 'profile'];
    return valid.includes(hash) ? hash : 'home';
  }

  navigate(route) {
    window.location.hash = `#${route}`;
  }

  handleHashChange() {
    this.currentRoute = this.getCurrentRoute();
    this.render();
    if (typeof this.updateNavCallback === 'function') {
      this.updateNavCallback(this.currentRoute);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  startFocusOnTask(title, minutes = 25) {
    setFocusInitialTask(title, minutes);
    this.navigate('focus');
  }

  openDailyScoreModal() {
    const isLife = this.state.data.showLifeScore;
    const scoreInfo = isLife ? this.state.calculateLifeScore() : this.state.calculateDailyScore();
    const modalHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">⚡</span>
            <div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">
                ${isLife ? 'PERSONAL LIFE SCORE' : 'DAILY SYSTEM SCORE'}
              </span>
              <h2 style="font-size: 22px; font-weight: 800; color: #fff;">${scoreInfo.total} / 100 Points</h2>
            </div>
          </div>
          <button id="btn-close-score-modal" style="background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer;">✕</button>
        </div>

        <div style="padding: 10px 14px; border-radius: 10px; background: rgba(0,240,255,0.06); border: 1px solid rgba(0,240,255,0.2); font-size: 12px; color: #e2e8f0;">
          💡 <em>${scoreInfo.guidance || 'Indicator, not judgment. Reset, continue, today still counts.'}</em>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto;">
          ${scoreInfo.breakdown.map(b => `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                <span style="color: #fff;">${b.label}</span>
                <span style="font-family: var(--font-mono); color: var(--neon-cyan);">${b.points} / ${b.max} pts</span>
              </div>
              <div style="width: 100%; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.08); overflow: hidden;">
                <div style="width: ${(b.points / b.max) * 100}%; height: 100%; background: var(--neon-cyan); border-radius: 99px;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
          <button id="btn-toggle-score-modal-type" class="btn-secondary" style="font-size: 11px; padding: 6px 12px;">
            Switch to ${isLife ? 'Daily' : 'Life'} Score
          </button>
          <button id="btn-done-score" class="btn-primary" style="font-size: 11px; padding: 6px 16px;">
            Got it
          </button>
        </div>
      </div>
    `;

    ModalEngine.open('modal-score-breakdown', modalHTML, (dialog) => {
      dialog.querySelector('#btn-close-score-modal')?.addEventListener('click', () => ModalEngine.close());
      dialog.querySelector('#btn-done-score')?.addEventListener('click', () => ModalEngine.close());
      dialog.querySelector('#btn-toggle-score-modal-type')?.addEventListener('click', () => {
        this.state.update(d => { d.showLifeScore = !d.showLifeScore; });
        ModalEngine.close();
        this.openDailyScoreModal();
      });
    });
  }

  openMoreModulesModal() {
    const modules = [
      { id: 'study', label: 'Study Hub', icon: '📚', desc: 'Computer Engineering syllabus, notes, spaced repetition' },
      { id: 'projects', label: 'Projects & MultitaskCoder', icon: '💻', desc: 'Flagship engineering development & milestones' },
      { id: 'career', label: 'Career & Skills Matrix', icon: '💼', desc: 'Technical proficiencies, certifications, placements' },
      { id: 'goals', label: 'Goal Breakdown Cascade', icon: '🎯', desc: 'Year ➔ 3M ➔ Month ➔ Week ➔ Today action' },
      { id: 'attendance', label: 'Attendance Monitor', icon: '📋', desc: 'Kerala Diploma 75% rule & margin predictor' },
      { id: 'health', label: 'Vitality & Health', icon: '⚡', desc: 'Water 8-glasses, sleep, gym weekly split' },
      { id: 'finance', label: 'Student Finance', icon: '💸', desc: 'INR ₹ monthly budget, canteen fast logging' },
      { id: 'journal', label: 'Daily Journal & Mood', icon: '📝', desc: '4 decompression prompts & energy tracking' },
      { id: 'reviews', label: 'Reviews & Protocols', icon: '🌙', desc: 'Nightly shutdown protocol & weekly report' },
      { id: 'profile', label: 'Profile & Settings', icon: '⚙️', desc: 'Themes, levels, achievements, data backup' }
    ];

    const content = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">☰</span>
            <h2 style="font-size: 18px; font-weight: 800; color: #fff;">System Modules Directory</h2>
          </div>
          <button id="btn-close-more-modal" style="background: none; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer;">✕</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; max-height: 440px; overflow-y: auto;">
          ${modules.map(m => `
            <button class="btn-module-jump btn-secondary" data-route="${m.id}" style="text-align: left; padding: 12px 14px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">${m.icon}</span>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 14px;">${m.label}</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">${m.desc}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    ModalEngine.open('modal-more-modules', content, (dialog) => {
      dialog.querySelector('#btn-close-more-modal')?.addEventListener('click', () => ModalEngine.close());
      dialog.querySelectorAll('.btn-module-jump').forEach(btn => {
        btn.addEventListener('click', () => {
          const route = btn.getAttribute('data-route');
          ModalEngine.close();
          this.navigate(route);
        });
      });
    });
  }

  render() {
    const route = this.getCurrentRoute();
    let html = '';

    const rerenderCurrent = () => this.render();

    switch (route) {
      case 'home':
        html = renderHomePage(
          this.state,
          (task, dur) => this.startFocusOnTask(task, dur),
          (tab) => this.navigate(tab),
          () => this.openDoNowRecommendation(),
          () => this.openDailyScoreModal()
        );
        this.container.innerHTML = html;
        bindHomePageEvents(
          this.state,
          (task, dur) => this.startFocusOnTask(task, dur),
          (tab) => this.navigate(tab),
          () => this.openDoNowRecommendation(),
          () => this.openDailyScoreModal()
        );
        break;

      case 'tasks':
        html = renderTasksPage(this.state, this.tasksTab, this.tasksTier, this.tasksCategory);
        this.container.innerHTML = html;
        bindTasksEvents(this.state, (task, dur) => this.startFocusOnTask(task, dur), rerenderCurrent);

        // Bind view switcher
        document.querySelectorAll('.task-view-btn').forEach(b => {
          b.addEventListener('click', () => {
            this.tasksTab = b.getAttribute('data-tab');
            this.render();
          });
        });
        document.querySelectorAll('.tier-filter-btn').forEach(b => {
          b.addEventListener('click', () => {
            this.tasksTier = b.getAttribute('data-tier');
            this.render();
          });
        });
        break;

      case 'focus':
        html = renderFocusPage(this.state);
        this.container.innerHTML = html;
        bindFocusEvents(this.state, rerenderCurrent);
        break;

      case 'study':
        html = renderStudyPage(this.state);
        this.container.innerHTML = html;
        bindStudyEvents(this.state, rerenderCurrent);
        break;

      case 'projects':
        html = renderProjectsPage(this.state);
        this.container.innerHTML = html;
        bindProjectsEvents(this.state, (task, dur) => this.startFocusOnTask(task, dur), rerenderCurrent);
        break;

      case 'career':
        html = renderCareerPage(this.state);
        this.container.innerHTML = html;
        bindCareerEvents(this.state, rerenderCurrent);
        break;

      case 'goals':
        html = renderGoalsPage(this.state);
        this.container.innerHTML = html;
        bindGoalsEvents(this.state, rerenderCurrent);
        break;

      case 'attendance':
        html = renderAttendancePage(this.state);
        this.container.innerHTML = html;
        bindAttendanceEvents(this.state, rerenderCurrent);
        break;

      case 'health':
        html = renderHealthPage(this.state);
        this.container.innerHTML = html;
        bindHealthEvents(this.state, rerenderCurrent);
        break;

      case 'finance':
        html = renderFinancePage(this.state);
        this.container.innerHTML = html;
        bindFinanceEvents(this.state, rerenderCurrent);
        break;

      case 'journal':
        html = renderJournalPage(this.state);
        this.container.innerHTML = html;
        bindJournalEvents(this.state, rerenderCurrent);
        break;

      case 'reviews':
        html = renderReviewsPage(this.state, this.reviewsTab);
        this.container.innerHTML = html;
        bindReviewsEvents(
          this.state,
          (newTab) => {
            this.reviewsTab = newTab;
            this.render();
          },
          rerenderCurrent
        );
        break;

      case 'profile':
        html = renderProfilePage(this.state);
        this.container.innerHTML = html;
        bindProfileEvents(this.state, rerenderCurrent);
        break;

      default:
        this.navigate('home');
        break;
    }
  }

  openDoNowRecommendation() {
    import('./modules/smartengine.js').then(m => {
      const rec = m.getSmartRecommendations(this.state.data, new Date())[0];
      if (!rec) return;

      const modalHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px; text-align: center;">
          <span style="font-size: 36px;">⚡</span>
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
              OPTIMAL ACTION RECOMMENDATION
            </span>
            <h2 style="font-size: 20px; font-weight: 800; color: #fff; margin-top: 4px;">
              ${rec.title}
            </h2>
          </div>

          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
            ${rec.reason}
          </p>

          <div style="padding: 12px; border-radius: 12px; background: rgba(0,240,255,0.06); border: 1px solid rgba(0,240,255,0.2); font-size: 12px; color: var(--neon-cyan); font-family: var(--font-mono);">
            Estimated Duration: ${rec.duration} minutes · Single focus
          </div>

          <button id="btn-accept-donow" class="btn-primary" style="padding: 12px; justify-content: center; font-size: 14px; margin-top: 6px;">
            Start Right Now ➔
          </button>
        </div>
      `;

      ModalEngine.open('modal-donow-recommendation', modalHTML, (dialog) => {
        dialog.querySelector('#btn-accept-donow')?.addEventListener('click', () => {
          ModalEngine.close();
          if (rec.actionTab === 'focus') {
            this.startFocusOnTask(rec.title, rec.duration || 25);
          } else {
            this.navigate(rec.actionTab || 'home');
          }
        });
      });
    });
  }
}
