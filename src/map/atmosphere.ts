import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderAtmosphereLayer(atmoGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;

  // 1. Swirling Mist Banks over Misty Lake, Bamboo Forest, and Sanzu River
  const mistBanks = [
    { cx: 0.695 * w, cy: 0.785 * h, rx: 165, ry: 68, cls: 'cloud-drift-slow' },
    { cx: 0.785 * w, cy: 0.755 * h, rx: 120, ry: 52, cls: 'cloud-drift-fast' },
    { cx: 0.805 * w, cy: 0.445 * h, rx: 145, ry: 58, cls: 'cloud-drift-slow' },
    { cx: 0.305 * w, cy: 0.155 * h, rx: 130, ry: 48, cls: 'cloud-drift-fast' },
    { cx: 0.655 * w, cy: 0.135 * h, rx: 150, ry: 45, cls: 'cloud-drift-slow' },
  ];

  let html = `<g class="mist-banks" pointer-events="none">`;
  for (const mb of mistBanks) {
    html += `
      <ellipse
        cx="${mb.cx.toFixed(1)}"
        cy="${mb.cy.toFixed(1)}"
        rx="${mb.rx}"
        ry="${mb.ry}"
        fill="url(#mist-gradient)"
        class="${mb.cls}"
      />
    `;
  }
  html += `</g>`;

  // 2. Classical Japanese Woodblock Scrolling Clouds (Kumo) near mountain peaks & Heaven
  const clouds = [
    [0.58 * w, 0.08 * h, 1.0],
    [0.74 * w, 0.09 * h, 0.9],
    [0.39 * w, 0.08 * h, 0.85],
    [0.88 * w, 0.17 * h, 0.85],
  ];
  html += `<g class="woodblock-clouds cloud-drift-slow" opacity="0.52" pointer-events="none">`;
  for (const [cx, cy, s] of clouds) {
    html += `
      <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(${s})">
        <path
          d="M -48 6 Q -42 -8 -24 -6 Q -14 -18 6 -12 Q 24 -18 34 -4 Q 50 -4 48 8 Z"
          fill="#fbf6eb"
          stroke="var(--ink-secondary)"
          stroke-width="1.3"
        />
      </g>
    `;
  }
  html += `</g>`;

  // 3. Night-Mode Fireflies & Starry Constellations
  html += `<g class="night-only" pointer-events="none">`;
  for (let i = 0; i < 45; i++) {
    const fx = ((i * 173) % (w - 160)) + 80;
    const fy = ((i * 251) % (h - 140)) + 70;
    const r = i % 3 === 0 ? 2.4 : 1.6;
    const color = i % 2 === 0 ? '#ffe885' : '#9ef0d6';
    html += `<circle cx="${fx}" cy="${fy}" r="${r}" fill="${color}" opacity="0.78" />`;
  }
  html += `</g>`;

  atmoGroup.innerHTML = html;
}
