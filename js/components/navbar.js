// Navigation System: Mobile-first bottom bar + Desktop top subheader + Modular drawer

export function renderHeader(state) {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening';
  else if (hour >= 21 || hour < 5) greeting = 'Time to wind down';

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const scoreInfo = state.calculateDailyScore();

  return `
    <header class="glass-panel" style="position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border-subtle); padding: 10px 16px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
        
        <!-- Greeting & Live Status -->
        <div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--neon-cyan);" class="pulse-glow"></span>
            <span>SYSTEM ACTIVE | ${timeStr}</span>
            ${state.data.recoveryModeActive ? '<span style="background:rgba(99,102,241,0.25); color:#a5b4fc; padding:1px 6px; border-radius:99px; border:1px solid #6366f1;">RECOVERY ON</span>' : ''}
          </div>
          <h1 style="font-size: 18px; font-weight: 800; color: #fff; margin-top: 2px;">
            ${greeting}, <span style="color: var(--neon-cyan);">${state.data.user.name}</span> ⚡
          </h1>
          <p style="font-size: 11px; color: var(--text-muted);">${dateStr}</p>
        </div>

        <!-- Header Actions -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          
          <!-- Search button -->
          <button id="btn-header-search" class="btn-secondary" style="padding: 6px 12px; font-size: 11px;">
            🔍 <span style="display:none;" class="md-inline">Search</span> <kbd style="font-size:9px; background:rgba(0,0,0,0.5); padding:1px 4px; border-radius:4px; font-family:var(--font-mono);">⌘K</kbd>
          </button>

          <!-- Quick Add button -->
          <button id="btn-header-quickadd" class="btn-secondary" style="border-color: rgba(0,240,255,0.4); color: var(--neon-cyan); font-size: 11px; font-weight: 700;">
            + QUICK ADD
          </button>

          <!-- Recovery Mode Toggle -->
          <button id="btn-header-recovery" class="btn-secondary" style="${state.data.recoveryModeActive ? 'background:rgba(99,102,241,0.25); border-color:#6366f1; color:#fff;' : ''} font-size: 11px;">
            🛡️ <span style="display:none;" class="md-inline">Recovery</span>
          </button>

          <!-- Daily Score Pill -->
          <button id="btn-header-score" class="btn-secondary" style="padding: 4px 10px; font-family: var(--font-mono);" title="View Daily Score Breakdown">
            <span style="font-size:9px; color:var(--text-dim); display:block; line-height:1;">SCORE</span>
            <span style="font-size:13px; font-weight:800; color:var(--neon-cyan);">${scoreInfo.total}<span style="font-size:10px; color:var(--text-dim);">/100</span></span>
          </button>

          <!-- Streak Pill -->
          <div class="btn-secondary" style="padding: 4px 8px; font-family: var(--font-mono); font-size: 11px; color: var(--neon-amber);">
            🔥 ${state.data.user.currentStreak}d <span style="font-size:9px; color:var(--neon-emerald); background:rgba(16,185,129,0.15); padding:1px 4px; border-radius:4px; margin-left:2px;">${state.data.user.streakProtectionsLeft} save</span>
          </div>

          <!-- DO NOW Button -->
          <button id="btn-header-donow" class="btn-primary" style="padding: 6px 14px; font-size: 11px;">
            ⚡ DO NOW
          </button>

        </div>

      </div>
    </header>
  `;
}

export function renderBottomNav(currentTab) {

  return `
    <nav style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; background: rgba(7, 9, 14, 0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border-subtle); padding: 6px 8px;">
      <div style="max-width: 500px; margin: 0 auto; display: flex; align-items: center; justify-content: space-around;">
        
        <button class="nav-tab-btn" data-tab="home" style="display:flex; flex-direction:column; align-items:center; color:${currentTab === 'home' ? 'var(--neon-cyan)' : 'var(--text-dim)'}; font-size:10px; font-weight:${currentTab === 'home' ? '700' : '500'};">
          <span style="font-size: 18px;">🏠</span>
          <span>Home</span>
        </button>

        <button class="nav-tab-btn" data-tab="tasks" style="display:flex; flex-direction:column; align-items:center; color:${currentTab === 'tasks' ? 'var(--neon-cyan)' : 'var(--text-dim)'}; font-size:10px; font-weight:${currentTab === 'tasks' ? '700' : '500'};">
          <span style="font-size: 18px;">✅</span>
          <span>Tasks</span>
        </button>

        <!-- Center Glowing DO NOW Orb -->
        <button id="btn-nav-donow" style="margin-top: -24px; width: 50px; height: 50px; border-radius: 18px; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple)); border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 10px 25px rgba(0,240,255,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff;">
          <span style="font-size: 20px;">⚡</span>
        </button>

        <button class="nav-tab-btn" data-tab="focus" style="display:flex; flex-direction:column; align-items:center; color:${currentTab === 'focus' ? 'var(--neon-cyan)' : 'var(--text-dim)'}; font-size:10px; font-weight:${currentTab === 'focus' ? '700' : '500'};">
          <span style="font-size: 18px;">⏱️</span>
          <span>Focus</span>
        </button>

        <button id="btn-nav-more" style="display:flex; flex-direction:column; align-items:center; color:${['study', 'projects', 'career', 'goals', 'attendance', 'health', 'finance', 'journal', 'reviews', 'profile'].includes(currentTab) ? 'var(--neon-purple)' : 'var(--text-dim)'}; font-size:10px; font-weight:600;">
          <span style="font-size: 18px;">☰</span>
          <span>More</span>
        </button>

      </div>
    </nav>
  `;
}

export function renderDesktopNav(currentTab) {
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'focus', label: 'Focus', icon: '⏱️' },
    { id: 'study', label: 'Study', icon: '📚' },
    { id: 'projects', label: 'Projects', icon: '💻' },
    { id: 'career', label: 'Career', icon: '💼' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'health', label: 'Health', icon: '⚡' }
  ];

  return `
    <nav class="desktop-subnav" style="display:none; border-bottom: 1px solid var(--border-subtle); background: rgba(10, 14, 24, 0.7); backdrop-filter: blur(12px); padding: 8px 16px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 6px; overflow-x: auto;">
        ${items.map(it => `
          <button class="nav-tab-btn btn-secondary" data-tab="${it.id}" style="${currentTab === it.id ? 'background:rgba(0,240,255,0.15); border-color:var(--neon-cyan); color:var(--neon-cyan);' : ''} padding: 6px 14px; font-size: 12px; shrink-0;">
            <span>${it.icon}</span>
            <span>${it.label}</span>
          </button>
        `).join('')}

        <button id="btn-desktop-more" class="btn-secondary" style="padding: 6px 14px; font-size: 12px; color: var(--neon-purple); border-color: rgba(168,85,247,0.3);">
          ☰ More Modules
        </button>
      </div>
    </nav>
  `;
}
