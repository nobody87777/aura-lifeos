// Lightweight non-intrusive Toast Notifications

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const border = type === 'success' ? '#10b981' : type === 'xp' ? '#a855f7' : '#00f0ff';
  toast.style.cssText = `
    background: rgba(15, 20, 32, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid ${border};
    color: #fff;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
