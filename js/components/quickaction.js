// Floating Quick Action Engine (Section 80: Fast frictionless 1-tap logging)
import { ModalEngine } from './modal.js';
import { showToast } from './toast.js';
import { soundSynth } from '../modules/sound.js';
import { getLocalDateString } from '../state.js';

export class QuickActionEngine {
  static open(state, defaultTab = 'task') {
    const subjects = state.data.subjects || [];
    const todayStr = getLocalDateString();

    const content = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">⚡</span>
            <h2 style="font-size: 18px; font-weight: 800; color: #fff;">Quick Capture</h2>
          </div>
          <button id="btn-qa-close" style="background: none; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer;">✕</button>
        </div>

        <!-- Quick Switcher Tabs -->
        <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
          <button class="qa-tab btn-secondary ${defaultTab === 'task' ? 'active-tab' : ''}" data-target="qa-task" style="padding: 6px 12px; font-size: 11px;">✅ Task</button>
          <button class="qa-tab btn-secondary ${defaultTab === 'expense' ? 'active-tab' : ''}" data-target="qa-expense" style="padding: 6px 12px; font-size: 11px;">💸 Expense</button>
          <button class="qa-tab btn-secondary ${defaultTab === 'study' ? 'active-tab' : ''}" data-target="qa-study" style="padding: 6px 12px; font-size: 11px;">📚 Study</button>
          <button class="qa-tab btn-secondary ${defaultTab === 'note' ? 'active-tab' : ''}" data-target="qa-note" style="padding: 6px 12px; font-size: 11px;">📝 Note</button>
          <button class="qa-tab btn-secondary ${defaultTab === 'distraction' ? 'active-tab' : ''}" data-target="qa-distraction" style="padding: 6px 12px; font-size: 11px;">📵 Distraction</button>
        </div>

        <!-- TAB 1: TASK -->
        <div id="qa-task" class="qa-section ${defaultTab === 'task' ? '' : 'hidden'}" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="qa-task-title" class="input-field" placeholder="What needs to be done today?" autofocus />
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Tier</label>
              <select id="qa-task-tier" class="input-field" style="margin-top: 4px;">
                <option value="must-do">🔴 Must-Do (Top Priority)</option>
                <option value="should-do" selected>🟡 Should-Do</option>
                <option value="could-do">🟢 Could-Do (Optional)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Category</label>
              <select id="qa-task-category" class="input-field" style="margin-top: 4px;">
                <option value="College">College / Academics</option>
                <option value="MultitaskCoder">MultitaskCoder Project</option>
                <option value="Coding">DSA / Coding</option>
                <option value="Fitness">Fitness / Gym</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Estimated Time</label>
              <select id="qa-task-duration" class="input-field" style="margin-top: 4px;">
                <option value="15">15 min</option>
                <option value="25" selected>25 min (1 Pomodoro)</option>
                <option value="45">45 min (Deep)</option>
                <option value="60">60 min</option>
              </select>
            </div>
            <div style="display: flex; align-items: flex-end; padding-bottom: 6px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--neon-cyan); cursor: pointer;">
                <input type="checkbox" id="qa-task-top3" style="accent-color: var(--neon-cyan);" />
                <span>Mark as Top 3 Task</span>
              </label>
            </div>
          </div>

          <button id="btn-save-task" class="btn-primary" style="margin-top: 6px; justify-content: center;">
            Save Task (+10 XP)
          </button>
        </div>

        <!-- TAB 2: EXPENSE -->
        <div id="qa-expense" class="qa-section ${defaultTab === 'expense' ? '' : 'hidden'}" style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">QUICK AMOUNTS (INR ₹)</label>
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <button type="button" class="btn-secondary btn-qa-quick-amount" data-val="50" style="flex: 1; font-family: var(--font-mono);">+₹50</button>
              <button type="button" class="btn-secondary btn-qa-quick-amount" data-val="100" style="flex: 1; font-family: var(--font-mono);">+₹100</button>
              <button type="button" class="btn-secondary btn-qa-quick-amount" data-val="200" style="flex: 1; font-family: var(--font-mono);">+₹200</button>
              <button type="button" class="btn-secondary btn-qa-quick-amount" data-val="500" style="flex: 1; font-family: var(--font-mono);">+₹500</button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Amount (₹)</label>
              <input type="number" id="qa-expense-amount" class="input-field" placeholder="₹ Amount" value="50" style="margin-top: 4px;" />
            </div>
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Category</label>
              <select id="qa-expense-category" class="input-field" style="margin-top: 4px;">
                <option value="Food">Food / Canteen</option>
                <option value="Travel">Travel / Bus Pass</option>
                <option value="Education">Education / Books</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Gym">Gym / Fitness</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <input type="text" id="qa-expense-desc" class="input-field" placeholder="Description (e.g. Lunch & tea)" />

          <button id="btn-save-expense" class="btn-primary" style="margin-top: 6px; justify-content: center; background: linear-gradient(135deg, var(--neon-emerald), #059669);">
            Record Expense (₹)
          </button>
        </div>

        <!-- TAB 3: STUDY LOG -->
        <div id="qa-study" class="qa-section ${defaultTab === 'study' ? '' : 'hidden'}" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Subject</label>
              <select id="qa-study-subject" class="input-field" style="margin-top: 4px;">
                ${subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Duration</label>
              <select id="qa-study-duration" class="input-field" style="margin-top: 4px;">
                <option value="25">25 mins</option>
                <option value="45" selected>45 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
              </select>
            </div>
          </div>

          <input type="text" id="qa-study-topics" class="input-field" placeholder="Topics studied (e.g. Binary Search, OSI Model)" />
          <input type="text" id="qa-study-notes" class="input-field" placeholder="Key takeaways or revision notes" />

          <button id="btn-save-study" class="btn-primary" style="margin-top: 6px; justify-content: center; background: linear-gradient(135deg, var(--neon-purple), #7c3aed);">
            Log Study Session (+20 XP)
          </button>
        </div>

        <!-- TAB 4: NOTE -->
        <div id="qa-note" class="qa-section ${defaultTab === 'note' ? '' : 'hidden'}" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="qa-note-title" class="input-field" placeholder="Note Title" />
          <textarea id="qa-note-content" class="input-field" rows="4" placeholder="Capture code snippet, exam tip, or lecture thought..."></textarea>
          
          <button id="btn-save-note" class="btn-primary" style="margin-top: 6px; justify-content: center;">
            Save Quick Note
          </button>
        </div>

        <!-- TAB 5: DISTRACTION -->
        <div id="qa-distraction" class="qa-section ${defaultTab === 'distraction' ? '' : 'hidden'}" style="display: flex; flex-direction: column; gap: 12px;">
          <p style="font-size: 11px; color: var(--text-dim);">
            Awareness without shame. Logging distractions helps notice patterns and regain focus.
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Distraction</label>
              <select id="qa-distraction-type" class="input-field" style="margin-top: 4px;">
                <option value="Social Media">Social Media (Reels/Insta)</option>
                <option value="YouTube">YouTube rabbit hole</option>
                <option value="Gaming">Gaming</option>
                <option value="Chatting">Chatting / WhatsApp</option>
                <option value="Browsing">Mindless Browsing</option>
                <option value="Procrastination">General Procrastination</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">Duration</label>
              <select id="qa-distraction-duration" class="input-field" style="margin-top: 4px;">
                <option value="15">15 min</option>
                <option value="30" selected>30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour+</option>
              </select>
            </div>
          </div>

          <input type="text" id="qa-distraction-note" class="input-field" placeholder="What triggered it? (Optional)" />

          <button id="btn-save-distraction" class="btn-secondary" style="border-color: var(--neon-amber); color: var(--neon-amber); margin-top: 6px; justify-content: center;">
            Log Distraction & Refocus
          </button>
        </div>

      </div>
    `;

    ModalEngine.open('modal-quick-action', content, (dialog) => {
      // Tab switching
      dialog.querySelectorAll('.qa-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          dialog.querySelectorAll('.qa-tab').forEach(t => {
            t.classList.remove('active-tab');
            t.style.borderColor = '';
            t.style.color = '';
          });
          tab.classList.add('active-tab');
          tab.style.borderColor = 'var(--neon-cyan)';
          tab.style.color = 'var(--neon-cyan)';

          dialog.querySelectorAll('.qa-section').forEach(s => s.classList.add('hidden'));
          const target = dialog.querySelector(`#${tab.getAttribute('data-target')}`);
          if (target) target.classList.remove('hidden');
        });
      });

      // Quick amount buttons
      dialog.querySelectorAll('.btn-qa-quick-amount').forEach(b => {
        b.addEventListener('click', () => {
          const val = b.getAttribute('data-val');
          const input = dialog.querySelector('#qa-expense-amount');
          if (input) input.value = val;
        });
      });

      // Close button
      dialog.querySelector('#btn-qa-close').addEventListener('click', () => ModalEngine.close());

      // Save Task
      dialog.querySelector('#btn-save-task').addEventListener('click', () => {
        const title = dialog.querySelector('#qa-task-title').value.trim();
        if (!title) {
          showToast('Please enter a task title', 'info');
          return;
        }
        const tier = dialog.querySelector('#qa-task-tier').value;
        const category = dialog.querySelector('#qa-task-category').value;
        const duration = Number(dialog.querySelector('#qa-task-duration').value) || 25;
        const isTop3 = dialog.querySelector('#qa-task-top3').checked;

        state.update(d => {
          d.tasks.unshift({
            id: `task-${Date.now()}`,
            title,
            tier,
            category,
            estimatedMinutes: duration,
            status: 'todo',
            dueDate: todayStr,
            isTop3,
            difficulty: 'medium',
            energyRequired: 'medium'
          });
        });

        soundSynth.playClick();
        state.addXP(10, 'Task Created');
        showToast(`Task added: "${title}" (+10 XP)`);
        ModalEngine.close();
      });

      // Save Expense
      dialog.querySelector('#btn-save-expense').addEventListener('click', () => {
        const amount = Number(dialog.querySelector('#qa-expense-amount').value) || 0;
        const category = dialog.querySelector('#qa-expense-category').value;
        const desc = dialog.querySelector('#qa-expense-desc').value.trim() || `${category} Expense`;

        if (amount <= 0) {
          showToast('Please enter an amount greater than ₹0', 'info');
          return;
        }

        state.update(d => {
          if (!d.finances) d.finances = { monthlyBudget: 6000, transactions: [] };
          d.finances.transactions.unshift({
            id: `tx-${Date.now()}`,
            date: todayStr,
            description: desc,
            amount,
            type: 'expense',
            category
          });
        });

        soundSynth.playClick();
        showToast(`Recorded ₹${amount} for ${desc}`, 'success');
        ModalEngine.close();
      });

      // Save Study
      dialog.querySelector('#btn-save-study').addEventListener('click', () => {
        const subjectName = dialog.querySelector('#qa-study-subject').value;
        const duration = Number(dialog.querySelector('#qa-study-duration').value) || 30;
        const topics = dialog.querySelector('#qa-study-topics').value.trim() || 'General Revision';
        const notes = dialog.querySelector('#qa-study-notes').value.trim();

        state.update(d => {
          if (!d.studySessions) d.studySessions = [];
          d.studySessions.unshift({
            id: `sess-${Date.now()}`,
            subjectName,
            durationMinutes: duration,
            topics,
            revisionNote: notes,
            date: todayStr,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          });

          const subj = (d.subjects || []).find(s => s.name === subjectName);
          if (subj) {
            subj.totalMinutes = (subj.totalMinutes || 0) + duration;
          }
        });

        soundSynth.playChime();
        state.addXP(20, 'Study Session Logged');
        showToast(`Logged ${duration}m study in ${subjectName} (+20 XP)`, 'xp');
        ModalEngine.close();
      });

      // Save Note
      dialog.querySelector('#btn-save-note').addEventListener('click', () => {
        const title = dialog.querySelector('#qa-note-title').value.trim();
        const content = dialog.querySelector('#qa-note-content').value.trim();

        if (!title && !content) {
          showToast('Please write something for the note', 'info');
          return;
        }

        state.update(d => {
          if (!d.notes) d.notes = [];
          d.notes.unshift({
            id: `n-${Date.now()}`,
            title: title || 'Quick Note',
            content: content || '',
            date: todayStr,
            category: 'Quick'
          });
        });

        soundSynth.playClick();
        showToast('Note captured', 'success');
        ModalEngine.close();
      });

      // Save Distraction
      dialog.querySelector('#btn-save-distraction').addEventListener('click', () => {
        const distraction = dialog.querySelector('#qa-distraction-type').value;
        const duration = Number(dialog.querySelector('#qa-distraction-duration').value) || 30;
        const note = dialog.querySelector('#qa-distraction-note').value.trim();

        state.update(d => {
          if (!d.distractions) d.distractions = [];
          d.distractions.unshift({
            id: `dist-${Date.now()}`,
            distraction,
            durationMinutes: duration,
            note,
            date: todayStr,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          });
        });

        showToast(`Logged ${duration}m ${distraction}. Take a deep breath & refocus.`, 'info');
        ModalEngine.close();
      });
    });
  }
}
