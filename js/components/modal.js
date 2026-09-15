// Reusable Modal Component Engine (Accessible, Mobile-First, Keyboard Friendly)

export class ModalEngine {
  static open(id, contentHTML, onMount = null) {
    this.close(); // Close any existing modal

    const overlay = document.createElement('div');
    overlay.id = 'aura-modal-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 900;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px; animation: fadeIn 0.2s ease-out;
    `;

    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.className = 'glass-panel';
    dialog.style.cssText = `
      width: 100%; max-width: 540px; max-height: 90vh;
      overflow-y: auto; border-radius: 24px;
      padding: 24px; position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 240, 255, 0.25);
    `;
    dialog.innerHTML = contentHTML;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Click outside to close (unless inside content)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        ModalEngine.close();
      }
    });

    // Escape to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        ModalEngine.close();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    if (typeof onMount === 'function') {
      onMount(dialog);
    }
  }

  static close() {
    const existing = document.getElementById('aura-modal-overlay');
    if (existing) {
      existing.remove();
      document.body.style.overflow = '';
    }
  }
}
