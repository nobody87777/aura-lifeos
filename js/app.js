// AURA Personal LifeOS - Main Orchestrator & Application Bootstrap
import { appState, getLocalDateString } from './state.js';
import { Router } from './router.js';
import { renderHeader, renderBottomNav, renderDesktopNav } from './components/navbar.js';
import { QuickActionEngine } from './components/quickaction.js';
import { GlobalSearchEngine } from './components/search.js';
import { SetupWizardEngine } from './components/wizard.js';
import { soundSynth } from './modules/sound.js';
import { showToast } from './components/toast.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app');
    if (!this.appRoot) {
      console.error('Root element #app not found in document.');
      return;
    }

    this.state = appState;
    this.applyTheme(this.state.data.theme || 'dark-neon');
    this.initDOM();
    this.router = new Router(this.state, this.mainContainer, (currentRoute) => this.updateNavigation(currentRoute));

    this.bindGlobalEvents();
    this.router.render();
    this.updateNavigation(this.router.getCurrentRoute());

    // State change re-renders header and navigation
    this.state.subscribe(() => {
      this.renderChrome();
    });

    // Midnight Rollover Automation Check (Section 82 & 83)
    setInterval(() => {
      const currentToday = getLocalDateString();
      if (this.state.data.lastActiveDate && this.state.data.lastActiveDate !== currentToday) {
        const rollover = this.state.checkDailyRollover();
        if (rollover && rollover.isNewDay) {
          soundSynth.playChime();
          showToast('🌅 Midnight Rollover: Welcome to a new day! Today\'s containers and Top 3 are ready.', 'xp');
          this.renderChrome();
          this.router.render();
        }
      }
    }, 30000);

    // Onboarding wizard check (Section 69)
    if (!localStorage.getItem('aura_setup_completed')) {
      setTimeout(() => {
        SetupWizardEngine.open(this.state, () => {
          this.renderChrome();
          this.router.render();
        });
      }, 500);
    }

    // Register service worker for offline-first PWA
    this.registerServiceWorker();
  }

  applyTheme(theme) {
    document.body.className = `theme-${theme}`;
  }

  initDOM() {
    this.appRoot.innerHTML = `
      <div id="header-mount"></div>
      <div id="desktop-subnav-mount"></div>
      <main id="main-content" style="padding-top: 16px; min-height: 80vh;"></main>
      <div id="bottom-nav-mount"></div>

      <!-- Floating Action Button (FAB: Section 80) -->
      <button id="fab-quick-action" class="fab-quick-action" title="Quick Add (+ / N)">
        +
      </button>
    `;

    this.headerMount = document.getElementById('header-mount');
    this.desktopSubnavMount = document.getElementById('desktop-subnav-mount');
    this.mainContainer = document.getElementById('main-content');
    this.bottomNavMount = document.getElementById('bottom-nav-mount');
    this.fabBtn = document.getElementById('fab-quick-action');

    this.renderChrome();
  }

  renderChrome() {
    const currentRoute = this.router ? this.router.getCurrentRoute() : 'home';

    // 1. Render Top Header
    this.headerMount.innerHTML = renderHeader(
      this.state,
      this.router,
      () => this.router.openDoNowRecommendation(),
      () => QuickActionEngine.open(this.state),
      () => GlobalSearchEngine.open(this.state, (r) => this.router.navigate(r))
    );

    // 2. Render Desktop Subnav
    this.desktopSubnavMount.innerHTML = renderDesktopNav(
      currentRoute,
      (tab) => this.router.navigate(tab),
      () => this.router.openMoreModulesModal()
    );

    // 3. Render Mobile Bottom Nav
    this.bottomNavMount.innerHTML = renderBottomNav(
      currentRoute,
      (tab) => this.router.navigate(tab),
      () => this.router.openDoNowRecommendation(),
      () => this.router.openMoreModulesModal()
    );

    this.bindChromeEvents();
  }

  updateNavigation() {
    this.renderChrome();
  }

  bindChromeEvents() {
    // Header Search button
    const searchBtn = document.getElementById('btn-header-search');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        GlobalSearchEngine.open(this.state, (r) => this.router.navigate(r));
      });
    }

    // Header Quick Add button
    const quickAddBtn = document.getElementById('btn-header-quickadd');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        QuickActionEngine.open(this.state);
      });
    }

    // DO NOW Header Button
    const doNowHeaderBtn = document.getElementById('btn-header-donow');
    if (doNowHeaderBtn) {
      doNowHeaderBtn.addEventListener('click', () => {
        this.router.openDoNowRecommendation();
      });
    }

    // Score Pill in header
    const scorePill = document.getElementById('btn-header-score');
    if (scorePill) {
      scorePill.addEventListener('click', () => {
        this.router.openDailyScoreModal();
      });
    }

    // Recovery mode toggle button in header
    const recoveryBtn = document.getElementById('btn-header-recovery');
    if (recoveryBtn) {
      recoveryBtn.addEventListener('click', () => {
        this.state.update(d => {
          d.recoveryModeActive = !d.recoveryModeActive;
        });
        soundSynth.playClick();
        showToast(this.state.data.recoveryModeActive ? '🛡️ Recovery Mode Activated: Expectations lowered. Take it easy.' : 'Recovery Mode Deactivated. Full dashboard active.');
        this.renderChrome();
        this.router.render();
      });
    }

    // Nav Tab Buttons (Mobile and Desktop)
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          soundSynth.playClick();
          this.router.navigate(tab);
        }
      });
    });

    // Center glowing DO NOW Orb in mobile bottom nav
    const navDoNow = document.getElementById('btn-nav-donow');
    if (navDoNow) {
      navDoNow.addEventListener('click', () => {
        soundSynth.playClick();
        this.router.openDoNowRecommendation();
      });
    }

    // "More" Drawer Buttons
    const navMore = document.getElementById('btn-nav-more');
    if (navMore) {
      navMore.addEventListener('click', () => {
        soundSynth.playClick();
        this.router.openMoreModulesModal();
      });
    }

    const desktopMore = document.getElementById('btn-desktop-more');
    if (desktopMore) {
      desktopMore.addEventListener('click', () => {
        soundSynth.playClick();
        this.router.openMoreModulesModal();
      });
    }

    // FAB Quick Action button
    if (this.fabBtn) {
      this.fabBtn.onclick = () => {
        soundSynth.playClick();
        QuickActionEngine.open(this.state);
      };
    }
  }

  bindGlobalEvents() {
    // Keyboard Shortcuts (Section 63)
    window.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

      // Cmd/Ctrl + K => Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        GlobalSearchEngine.open(this.state, (r) => this.router.navigate(r));
        return;
      }

      // 'N' key (when not focused on form input) => Quick Add Modal
      if (!isInput && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        QuickActionEngine.open(this.state);
        return;
      }

      // Escape => Close deep work mode if active
      if (e.key === 'Escape') {
        if (document.body.classList.contains('deep-work-mode')) {
          document.body.classList.remove('deep-work-mode');
          this.router.render();
        }
      }
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(
          (reg) => {
            console.log('AURA PWA ServiceWorker active:', reg.scope);
          },
          () => {
            // Check in public/
            navigator.serviceWorker.register('./public/sw.js').catch(() => {
              // Graceful fallback for local development
            });
          }
        );
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.auraApp = new App();
});
