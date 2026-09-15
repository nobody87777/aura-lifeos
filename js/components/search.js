// Global Search Engine (Cmd/Ctrl + K or Header Search)
import { ModalEngine } from './modal.js';

export class GlobalSearchEngine {
  static open(state, onNavigate) {
    const content = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-focus); border-radius: 12px; padding: 10px 14px;">
          <span style="font-size: 16px;">🔍</span>
          <input
            type="text"
            id="global-search-input"
            placeholder="Type to search tasks, study subjects, projects, notes, skills... (ESC to close)"
            style="flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 14px; font-family: var(--font-sans);"
            autofocus
          />
          <kbd style="font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); color: var(--text-dim);">ESC</kbd>
        </div>

        <div id="search-results" style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
          <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 13px;">
            Start typing to search your entire operating system...
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px; font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
          <span>Quick jump to modules:</span>
          <div style="display: flex; gap: 6px;">
            <a href="#tasks" class="search-quicklink" style="color: var(--neon-cyan); text-decoration: none;">Tasks</a> ·
            <a href="#study" class="search-quicklink" style="color: var(--neon-purple); text-decoration: none;">Study</a> ·
            <a href="#projects" class="search-quicklink" style="color: var(--neon-emerald); text-decoration: none;">Projects</a> ·
            <a href="#attendance" class="search-quicklink" style="color: var(--neon-amber); text-decoration: none;">Attendance</a>
          </div>
        </div>
      </div>
    `;

    ModalEngine.open('modal-global-search', content, (dialog) => {
      const input = dialog.querySelector('#global-search-input');
      const resultsContainer = dialog.querySelector('#search-results');

      const performSearch = (q) => {
        const query = q.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 13px;">
              Start typing to search your entire operating system...
            </div>
          `;
          return;
        }

        const matches = [];

        // 1. Search Tasks
        (state.data.tasks || []).forEach(t => {
          if (t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))) {
            matches.push({
              type: 'Task',
              icon: '✅',
              title: t.title,
              subtitle: `${t.tier || 'normal'} · ${t.category || 'General'} · ${t.status}`,
              route: '#tasks'
            });
          }
        });

        // 2. Search Subjects
        (state.data.subjects || []).forEach(s => {
          if (s.name.toLowerCase().includes(query) || (s.code && s.code.toLowerCase().includes(query))) {
            matches.push({
              type: 'Study Subject',
              icon: '📚',
              title: `${s.name} (${s.code || ''})`,
              subtitle: `${s.totalMinutes || 0} mins studied · ${s.confidence || 0}% confidence`,
              route: '#study'
            });
          }
        });

        // 3. Search Projects
        (state.data.projects || []).forEach(p => {
          if (p.name.toLowerCase().includes(query) || (p.tagline && p.tagline.toLowerCase().includes(query))) {
            matches.push({
              type: 'Project',
              icon: '💻',
              title: p.name,
              subtitle: `${p.tagline || ''} · ${p.progress}% done`,
              route: '#projects'
            });
          }
        });

        // 4. Search Skills
        (state.data.careerSkills || []).forEach(sk => {
          if (sk.name.toLowerCase().includes(query) || sk.category.toLowerCase().includes(query)) {
            matches.push({
              type: 'Career Skill',
              icon: '💼',
              title: sk.name,
              subtitle: `${sk.category} · ${sk.level} (${sk.confidencePercent}%)`,
              route: '#career'
            });
          }
        });

        // 5. Search Notes
        (state.data.notes || []).forEach(n => {
          if (n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)) {
            matches.push({
              type: 'Note',
              icon: '📝',
              title: n.title,
              subtitle: n.content.slice(0, 50) + (n.content.length > 50 ? '...' : ''),
              route: '#home'
            });
          }
        });

        // 6. Search Habits
        (state.data.habits || []).forEach(h => {
          if (h.name.toLowerCase().includes(query)) {
            matches.push({
              type: 'Habit',
              icon: '🔥',
              title: h.name,
              subtitle: `${h.streak} day streak · ${h.target}`,
              route: '#home'
            });
          }
        });

        if (matches.length === 0) {
          resultsContainer.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 13px;">
              No matches found for "<span style="color:#fff;">${query}</span>".
            </div>
          `;
          return;
        }

        resultsContainer.innerHTML = matches.map(m => `
          <div class="search-result-item" data-route="${m.route}" style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <span style="font-size: 18px;">${m.icon}</span>
              <div style="min-width: 0;">
                <div style="font-weight: 700; color: #fff; font-size: 13px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${m.title}</div>
                <div style="font-size: 11px; color: var(--text-dim); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${m.subtitle}</div>
              </div>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">${m.type}</span>
          </div>
        `).join('');

        dialog.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('mouseenter', () => {
            item.style.borderColor = 'var(--neon-cyan)';
            item.style.background = 'rgba(0,240,255,0.05)';
          });
          item.addEventListener('mouseleave', () => {
            item.style.borderColor = 'var(--border-subtle)';
            item.style.background = 'rgba(255,255,255,0.03)';
          });
          item.addEventListener('click', () => {
            const route = item.getAttribute('data-route');
            ModalEngine.close();
            if (typeof onNavigate === 'function') onNavigate(route);
            else if (route) window.location.hash = route;
          });
        });
      };

      // Debounced search input
      let timeout;
      input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => performSearch(e.target.value), 180);
      });

      // Quick links
      dialog.querySelectorAll('.search-quicklink').forEach(link => {
        link.addEventListener('click', () => ModalEngine.close());
      });
    });
  }
}
