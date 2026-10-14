import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderAtmosphereLayer(atmoGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;
  const UI_CDN = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui';

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

  // 2. Classical Japanese Ukiyo-e Gold-Leaf Scrolling Clouds (Kumo) near Heaven, Moon & Mountain Peaks
  const cloudPlacements: [number, number, number, number][] = [
    [0.56 * w, 0.015 * h, 240, 120],
    [0.70 * w, 0.025 * h, 220, 110],
    [0.34 * w, 0.020 * h, 210, 105],
    [0.82 * w, 0.140 * h, 220, 110],
  ];
  html += `<g class="woodblock-clouds cloud-drift-slow" opacity="0.82" pointer-events="none">`;
  for (const [cx, cy, cw, ch] of cloudPlacements) {
    html += `
      <image
        href="${UI_CDN}/ukiyo-cloud-cluster.webp"
        x="${cx.toFixed(1)}"
        y="${cy.toFixed(1)}"
        width="${cw}"
        height="${ch}"
      />
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
