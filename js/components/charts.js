// Lightweight SVG Chart Generation Engine (Zero External Dependencies)

export class ChartEngine {
  /**
   * Renders a clean SVG Bar Chart for weekly study hours
   * @param {Array<{label: string, value: number, isCurrent?: boolean}>} data
   * @param {number} width
   * @param {number} height
   */
  static renderBarChart(data, width = 320, height = 160) {
    const padding = { top: 20, right: 15, bottom: 25, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => d.value), 4);
    const barWidth = Math.max(16, Math.floor(chartW / (data.length * 1.6)));
    const gap = (chartW - (barWidth * data.length)) / (data.length - 1 || 1);

    const bars = data.map((d, i) => {
      const x = padding.left + i * (barWidth + gap);
      const barH = Math.round((d.value / maxVal) * chartH);
      const y = padding.top + chartH - barH;
      const color = d.isCurrent ? 'var(--neon-cyan)' : 'rgba(0, 240, 255, 0.4)';
      const labelColor = d.isCurrent ? 'var(--neon-cyan)' : 'var(--text-dim)';

      return `
        <g class="chart-bar" tabindex="0">
          <title>${d.label}: ${d.value} hrs</title>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="${color}" style="transition: all 0.3s ease;">
            <animate attributeName="height" from="0" to="${barH}" dur="0.4s" />
            <animate attributeName="y" from="${padding.top + chartH}" to="${y}" dur="0.4s" />
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 5}" font-size="10" font-family="var(--font-mono)" fill="#fff" text-anchor="middle" font-weight="700">
            ${d.value > 0 ? d.value + 'h' : ''}
          </text>
          <text x="${x + barWidth / 2}" y="${height - 8}" font-size="10" font-family="var(--font-mono)" fill="${labelColor}" text-anchor="middle" font-weight="600">
            ${d.label}
          </text>
        </g>
      `;
    }).join('');

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible; display: block;">
        <!-- Grid horizontal lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${padding.left}" y1="${padding.top + chartH / 2}" x2="${width - padding.right}" y2="${padding.top + chartH / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="rgba(255,255,255,0.15)" />
        
        <!-- Y Axis Labels -->
        <text x="${padding.left - 8}" y="${padding.top + 4}" font-size="9" font-family="var(--font-mono)" fill="var(--text-dim)" text-anchor="end">${maxVal}h</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH / 2 + 3}" font-size="9" font-family="var(--font-mono)" fill="var(--text-dim)" text-anchor="end">${Math.round(maxVal / 2)}h</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH + 3}" font-size="9" font-family="var(--font-mono)" fill="var(--text-dim)" text-anchor="end">0h</text>

        ${bars}
      </svg>
    `;
  }

  /**
   * Renders a clean Progress Ring (Circular SVG)
   * @param {number} percentage (0 - 100)
   * @param {number} size
   * @param {number} strokeWidth
   * @param {string} color
   */
  static renderProgressRing(percentage, size = 110, strokeWidth = 10, color = 'var(--neon-cyan)') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
    const strokeDashoffset = circumference - (clamped / 100) * circumference;

    return `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="rgba(255, 255, 255, 0.08)"
            stroke-width="${strokeWidth}"
            fill="transparent"
          />
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            stroke-linecap="round"
            fill="transparent"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${strokeDashoffset}"
            style="transition: stroke-dashoffset 0.6s ease-in-out;"
          />
        </svg>
        <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
          <span style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: #fff;">${clamped}%</span>
        </div>
      </div>
    `;
  }

  /**
   * Renders a Mini Sparkline Line Chart
   * @param {number[]} values
   * @param {number} width
   * @param {number} height
   * @param {string} color
   */
  static renderSparkline(values, width = 120, height = 36, color = 'var(--neon-cyan)') {
    if (!values || values.length < 2) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 6) + 3;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
        <polyline
          fill="none"
          stroke="${color}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="${points}"
        />
      </svg>
    `;
  }
}
