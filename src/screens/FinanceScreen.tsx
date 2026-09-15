import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  TrendingDown,
  Sparkles,
  PieChart,
  DollarSign
} from 'lucide-react';
import { FinanceTransaction } from '../types';

export const FinanceScreen: React.FC = () => {
  const { data, addTransaction, deleteTransaction } = useApp();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('College / Food');

  const totalExpenses = data.finances.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = data.finances.transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const remainingBudget = data.finances.monthlyBudget - totalExpenses;
  const budgetSpentPercent = Math.min(100, Math.round((totalExpenses / data.finances.monthlyBudget) * 100));

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      amount: Number(amount),
      type,
      category
    });

    setDescription('');
    setAmount('');
  };

  const categories = [
    'College / Food',
    'Travel & Commute',
    'Tech & Hosting',
    'Fitness / Gym',
    'Books / Materials',
    'Personal / Savings'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            FINANCIAL DISCIPLINE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Student Budget & Expenses (₹ INR)</h2>
        <p className="text-xs text-slate-400">
          Gain financial awareness early. Track college expenses, travel, tech tooling, and savings.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20">
          <span className="text-xs font-mono uppercase text-slate-400 block">REMAINING MONTHLY BUDGET</span>
          <div className="text-3xl font-black font-mono text-amber-300 my-1">
            ₹{remainingBudget.toLocaleString()}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                budgetSpentPercent > 80 ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${budgetSpentPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            ₹{totalExpenses.toLocaleString()} spent of ₹{data.finances.monthlyBudget.toLocaleString()} budget ({budgetSpentPercent}%)
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-mono uppercase text-slate-400 block">TOTAL EXPENSES</span>
          <div className="text-3xl font-black font-mono text-rose-400 my-1 flex items-center gap-2">
            <ArrowDownRight className="w-6 h-6" />
            <span>₹{totalExpenses.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Recorded this month</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-mono uppercase text-slate-400 block">INCOME / ALLOWANCE</span>
          <div className="text-3xl font-black font-mono text-emerald-400 my-1 flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6" />
            <span>₹{data.finances.monthlyBudget.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Student allowance / freelancing</span>
        </div>

      </div>

      {/* Add Transaction & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Log Form */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300 mb-4">
            LOG EXPENSE / INCOME
          </h3>

          <form onSubmit={handleAddTransaction} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                  type === 'expense'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                  type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                Income
              </button>
            </div>

            <div>
              <label className="block font-mono text-slate-400 mb-1">Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Canteen Lunch & Chai"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block font-mono text-slate-400 mb-1">Amount (₹ INR) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 120"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl glass-input font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 mt-2"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-300">
              RECENT ACTIVITY
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {data.finances.transactions.length} Transactions
            </span>
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {data.finances.transactions.map((t) => {
              const isExp = t.type === 'expense';
              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isExp ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      {isExp ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.description}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.category} • {t.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold text-sm ${
                        isExp ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {isExp ? '-' : '+'}₹{t.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-1 text-slate-600 hover:text-rose-400"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
