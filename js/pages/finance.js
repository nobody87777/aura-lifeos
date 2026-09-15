// Kerala Student Personal Finance Module (Section 23: INR ₹ Budget, Fast Logging, Spending Insights)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';

export function renderFinancePage(state) {
  const finances = state.data.finances || { monthlyBudget: 6000, transactions: [] };
  const txs = finances.transactions || [];

  const totalSpent = txs
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const budget = finances.monthlyBudget || 6000;
  const remaining = Math.max(0, budget - totalSpent);
  const spentPercent = Math.min(100, Math.round((totalSpent / budget) * 100));

  // Category breakdown
  const categoryTotals = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    const cat = t.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Student Finance & Budget</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-emerald); background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 99px;">
              INR (₹) KERALA
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Manage monthly allowance, canteen expenses, travel pass, and college savings.
          </p>
        </div>

        <button id="btn-add-expense-modal" class="btn-primary" style="font-size: 12px; padding: 7px 16px; background: linear-gradient(135deg, var(--neon-emerald), #059669);">
          + Record Expense
        </button>
      </div>

      <!-- Budget Progress Overview Card -->
      <div class="glass-card" style="padding: 24px; border-color: rgba(16,185,129,0.3); background: linear-gradient(135deg, rgba(6,20,11,0.9), rgba(15,23,42,0.95));">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700; text-transform: uppercase;">
              MONTHLY ALLOWANCE BUDGET
            </span>
            <div style="font-size: 32px; font-weight: 800; color: #fff; font-family: var(--font-mono); margin-top: 2px;">
              ₹${remaining.toLocaleString('en-IN')} <span style="font-size: 14px; font-weight: 500; color: var(--text-muted);">remaining of ₹${budget.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <div style="padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); text-align: right;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">TOTAL SPENT</span>
              <div style="font-size: 18px; font-weight: 800; color: var(--neon-rose); font-family: var(--font-mono);">
                ₹${totalSpent.toLocaleString('en-IN')}
              </div>
            </div>
            <div style="padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); text-align: right;">
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">BUDGET USED</span>
              <div style="font-size: 18px; font-weight: 800; color: ${spentPercent > 85 ? 'var(--neon-rose)' : 'var(--neon-emerald)'}; font-family: var(--font-mono);">
                ${spentPercent}%
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Bar -->
        <div style="width: 100%; height: 8px; border-radius: 99px; background: rgba(255,255,255,0.08); margin-top: 18px; overflow: hidden;">
          <div style="width: ${spentPercent}%; height: 100%; background: ${spentPercent > 85 ? 'var(--neon-rose)' : 'var(--neon-emerald)'}; border-radius: 99px; transition: width 0.4s ease;"></div>
        </div>
      </div>

      <!-- Quick Fast Logging Bar (Section 80: 3-5 seconds logging) -->
      <div class="glass-card" style="padding: 16px 20px;">
        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">
          ⚡ 1-TAP FAST LOGGING (CANTEEN & TRAVEL)
        </span>
        <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
          <button class="btn-quick-log-money btn-secondary" data-amount="30" data-cat="Travel" data-desc="Bus / Train Pass" style="padding: 6px 14px; font-size: 12px; font-family: var(--font-mono);">
            🚌 ₹30 Bus Pass
          </button>
          <button class="btn-quick-log-money btn-secondary" data-amount="50" data-cat="Food" data-desc="Canteen Tea & Snacks" style="padding: 6px 14px; font-size: 12px; font-family: var(--font-mono);">
            ☕ ₹50 Tea & Snack
          </button>
          <button class="btn-quick-log-money btn-secondary" data-amount="80" data-cat="Food" data-desc="Canteen Full Lunch" style="padding: 6px 14px; font-size: 12px; font-family: var(--font-mono);">
            🍛 ₹80 Meals
          </button>
          <button class="btn-quick-log-money btn-secondary" data-amount="150" data-cat="Education" data-desc="Photocopy & Records" style="padding: 6px 14px; font-size: 12px; font-family: var(--font-mono);">
            📄 ₹150 Print / Lab
          </button>
        </div>
      </div>

      <!-- Category Breakdown Cards -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Category Breakdown</h3>
          ${topCategory ? `
            <span style="font-size: 11px; color: var(--neon-amber); font-family: var(--font-mono);">
              Top spending: ${topCategory[0]} (₹${topCategory[1]})
            </span>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
          ${Object.entries(categoryTotals).length === 0 ? `
            <div style="color: var(--text-dim); font-size: 12px; grid-column: 1/-1;">No expenses logged yet this month.</div>
          ` : Object.entries(categoryTotals).map(([cat, amt]) => `
            <div style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);">
              <span style="font-size: 11px; color: var(--text-muted); display: block;">${cat}</span>
              <strong style="font-size: 16px; color: #fff; font-family: var(--font-mono); margin-top: 2px; display: block;">
                ₹${amt.toLocaleString('en-IN')}
              </strong>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Transaction Log -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Transaction History</h3>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);">${txs.length} transactions</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${txs.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: var(--text-dim); font-size: 13px;">No transactions recorded.</div>
          ` : txs.slice(0, 15).map((t, idx) => `
            <div style="padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 18px;">
                  ${t.category === 'Food' ? '🍛' : t.category === 'Travel' ? '🚌' : t.category === 'Education' ? '📚' : t.category === 'Subscriptions' ? '💻' : '💸'}
                </span>
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 13px;">${t.description}</div>
                  <div style="font-size: 11px; color: var(--text-dim);">${t.date} · ${t.category}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: var(--neon-rose);">
                  -₹${t.amount}
                </span>
                <button class="btn-delete-tx" data-idx="${idx}" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 13px;">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function bindFinanceEvents(state, rerender) {
  const todayStr = getLocalDateString();

  // Open modal
  const openBtn = document.getElementById('btn-add-expense-modal');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      import('../components/quickaction.js').then(m => {
        m.QuickActionEngine.open(state, 'expense');
      });
    });
  }

  // Quick 1-tap buttons
  document.querySelectorAll('.btn-quick-log-money').forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = Number(btn.getAttribute('data-amount'));
      const cat = btn.getAttribute('data-cat');
      const desc = btn.getAttribute('data-desc');

      state.update(d => {
        if (!d.finances) d.finances = { monthlyBudget: 6000, transactions: [] };
        d.finances.transactions.unshift({
          id: `tx-${Date.now()}`,
          date: todayStr,
          description: desc,
          amount,
          type: 'expense',
          category: cat
        });
      });

      soundSynth.playClick();
      showToast(`Logged ₹${amount} for ${desc}`, 'success');
      rerender();
    });
  });

  // Delete transaction
  document.querySelectorAll('.btn-delete-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        d.finances?.transactions?.splice(idx, 1);
      });
      soundSynth.playClick();
      showToast('Transaction removed');
      rerender();
    });
  });
}
