// Career Hub Module (Section 26: Skill Matrix, Certifications, Applications Tracker)
import { soundSynth } from '../modules/sound.js';
import { showToast } from '../components/toast.js';
import { getLocalDateString } from '../state.js';

export function renderCareerPage(state) {
  const skills = state.data.careerSkills || [];
  const careerItems = state.data.careerItems || [];

  const avgConfidence = Math.round(skills.reduce((acc, s) => acc + (s.confidencePercent || 0), 0) / (skills.length || 1));

  return `
    <div class="app-container" style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #fff;">Career & Skills Matrix</h1>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-emerald); background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 99px;">
              JOB READINESS
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            Map technical competence, portfolio assets, and campus placement readiness.
          </p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-add-skill" class="btn-primary" style="font-size: 12px; padding: 7px 14px;">
            + Add Skill
          </button>
        </div>
      </div>

      <!-- Readiness Overview Card -->
      <div class="glass-card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 54px; height: 54px; border-radius: 16px; background: rgba(16,185,129,0.15); border: 1px solid var(--neon-emerald); display: flex; align-items: center; justify-content: center; font-size: 24px;">
            💼
          </div>
          <div>
            <h2 style="font-size: 17px; font-weight: 800; color: #fff;">Placement & Industry Preparedness</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              Average Technical Confidence: <strong style="color: var(--neon-emerald);">${avgConfidence}%</strong> across ${skills.length} core domains.
            </p>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="text-align: right;">
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase;">FLAGSHIP PROJECT</span>
            <div style="font-size: 13px; font-weight: 700; color: var(--neon-cyan);">MultitaskCoder (72%)</div>
          </div>
        </div>
      </div>

      <!-- Skill Matrix Section -->
      <div class="glass-card" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff;">Technical Skill Inventory</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Languages, algorithms, and system engineering proficiencies.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
          ${skills.map((s, idx) => {
            const conf = s.confidencePercent || 70;
            const confColor = conf >= 85 ? 'var(--neon-emerald)' : conf >= 75 ? 'var(--neon-cyan)' : 'var(--neon-amber)';

            return `
              <div class="glass-card" style="padding: 14px 16px; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 800; font-size: 14px; color: #fff;">${s.name}</span>
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${s.category}</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
                  <span style="color: var(--text-muted);">${s.level || 'Intermediate'}</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: ${confColor};">${conf}% Confidence</span>
                </div>

                <div style="width: 100%; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.08); overflow: hidden;">
                  <div style="width: ${conf}%; height: 100%; background: ${confColor}; border-radius: 99px;"></div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 6px; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                  <button class="btn-secondary btn-boost-skill" data-idx="${idx}" style="padding: 3px 8px; font-size: 10px; color: var(--neon-cyan);">
                    + Boost Confidence (+5%)
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Certifications & Job Applications Tracker Grid -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 16px;" class="md-grid-2">
        
        <!-- Certifications & Credentials -->
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Certifications & Badges</h3>
            <button id="btn-add-cert" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">+ Add</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${careerItems.filter(i => i.type === 'certification').map(c => `
              <div style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 13px;">📜 ${c.title}</div>
                  <div style="font-size: 11px; color: var(--text-dim);">${c.date || 'Completed'}</div>
                </div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-emerald); background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">VERIFIED</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Internship / Job Applications -->
        <div class="glass-card" style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <h3 style="font-size: 15px; font-weight: 800; color: #fff;">Applications & Interviews</h3>
            <button id="btn-add-app" class="btn-secondary" style="font-size: 11px; padding: 4px 10px;">+ Add Role</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 13px;">Junior Software Engineer</div>
                <div style="font-size: 11px; color: var(--text-dim);">Infopark Kochi Campus Placement Drive</div>
              </div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-amber); background: rgba(245,158,11,0.15); padding: 2px 6px; border-radius: 4px;">PREPARING</span>
            </div>

            <div style="padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 13px;">Full Stack Web Developer Intern</div>
                <div style="font-size: 11px; color: var(--text-dim);">Kerala Startup Mission (KSUM)</div>
              </div>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--neon-cyan); background: rgba(0,240,255,0.15); padding: 2px 6px; border-radius: 4px;">APPLIED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function bindCareerEvents(state, rerender) {
  // Boost skill confidence
  document.querySelectorAll('.btn-boost-skill').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.update(d => {
        const s = d.careerSkills?.[idx];
        if (s) {
          s.confidencePercent = Math.min(100, (s.confidencePercent || 70) + 5);
        }
      });
      soundSynth.playChime();
      state.addXP(10, 'Skill Confidence Boosted');
      showToast('Skill confidence updated (+10 XP)!', 'xp');
      rerender();
    });
  });

  // Add Skill
  const addSkillBtn = document.getElementById('btn-add-skill');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', () => {
      const name = prompt('Enter technical skill name (e.g. Docker, TypeScript, Linux):');
      if (name && name.trim()) {
        const category = prompt('Category (Languages, Core CS, Tools & Systems):') || 'Tools & Systems';
        state.update(d => {
          if (!d.careerSkills) d.careerSkills = [];
          d.careerSkills.push({
            id: `sk-${Date.now()}`,
            name: name.trim(),
            category: category.trim(),
            level: 'Intermediate',
            confidencePercent: 75
          });
        });
        soundSynth.playClick();
        showToast(`Added ${name} to skill inventory!`);
        rerender();
      }
    });
  }

  // Add Cert
  const addCertBtn = document.getElementById('btn-add-cert');
  if (addCertBtn) {
    addCertBtn.addEventListener('click', () => {
      const title = prompt('Enter certification name (e.g. AWS Certified Cloud Practitioner):');
      if (title && title.trim()) {
        state.update(d => {
          if (!d.careerItems) d.careerItems = [];
          d.careerItems.push({
            id: `ci-${Date.now()}`,
            title: title.trim(),
            type: 'certification',
            status: 'completed',
            date: getLocalDateString()
          });
        });
        soundSynth.playClick();
        rerender();
      }
    });
  }
}
