import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { TerrainData } from '../types';

const BIOME_FILL: Record<string, string> = {
  farmland: 'var(--biome-farmland)',
  forest: 'var(--biome-forest)',
  'magic-forest': 'var(--biome-magic-forest)',
  bamboo: 'var(--biome-bamboo)',
  sunflower: 'var(--biome-sunflower)',
  foothills: 'var(--biome-foothills)',
  mountain: 'var(--biome-mountain)',
  peak: 'var(--biome-peak)',
  wetland: 'var(--biome-wetland)',
  higan: 'var(--biome-higan)',
  netherworld: 'var(--biome-netherworld)',
  heaven: 'var(--biome-heaven)',
  lunar: 'var(--biome-lunar)',
  underworld: 'var(--biome-underworld)',
  makai: 'var(--biome-makai)',
  'sdm-grounds': 'var(--biome-sdm)',
  backdoor: 'var(--biome-backdoor)',
};

function smoothClosedPath(pts: [number, number][]): string {
  if (pts.length < 3) return '';
  const scaled = pts.map(([x, y]) => [x * MAP_WIDTH, y * MAP_HEIGHT] as [number, number]);
  const n = scaled.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = scaled[(i - 1 + n) % n];
    const p1 = scaled[i];
    const p2 = scaled[(i + 1) % n];
    const mx1 = (p0[0] + p1[0]) / 2;
    const my1 = (p0[1] + p1[1]) / 2;
    const mx2 = (p1[0] + p2[0]) / 2;
    const my2 = (p1[1] + p2[1]) / 2;
    if (i === 0) {
      d += `M ${mx1.toFixed(1)} ${my1.toFixed(1)} `;
    }
    d += `Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${mx2.toFixed(1)} ${my2.toFixed(1)} `;
  }
  return d + 'Z';
}

function hash01(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * Generates an organic wavy closed polygon for stepped topographic mountain ledges (Armixi style)
 */
function steppedContourPolygon(
  cxNorm: number,
  cyNorm: number,
  rxNorm: number,
  ryNorm: number,
  seed: number,
  lobes = 18
): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < lobes; i++) {
    const angle = (i / lobes) * Math.PI * 2;
    const wobble =
      1 +
      0.08 * Math.sin(angle * 3 + seed) +
      0.05 * Math.cos(angle * 5 - seed * 1.7) +
      0.03 * Math.sin(angle * 7 + seed * 0.5);
    const px = cxNorm + Math.cos(angle) * rxNorm * wobble;
    const py = cyNorm + Math.sin(angle) * ryNorm * wobble;
    pts.push([px, py]);
  }
  return smoothClosedPath(pts);
}

export function renderTerrainLayer(terrainGroup: SVGGElement, data: TerrainData) {
  let html = '';

  // 0. Antique Cartographic Rhumb Lines & Subtle Graticule Grid (centered on Human Village 0,0)
  const vx = 0.480 * MAP_WIDTH;
  const vy = 0.460 * MAP_HEIGHT;
  html += `<g class="cartographic-graticule" opacity="0.22" pointer-events="none">`;
  for (let gx = 0.1; gx <= 0.9; gx += 0.1) {
    const x = (gx * MAP_WIDTH).toFixed(1);
    html += `<line x1="${x}" y1="28" x2="${x}" y2="${MAP_HEIGHT - 28}" stroke="var(--ink-secondary)" stroke-width="0.7" stroke-dasharray="4 6" />`;
  }
  for (let gy = 0.1; gy <= 0.9; gy += 0.1) {
    const y = (gy * MAP_HEIGHT).toFixed(1);
    html += `<line x1="28" y1="${y}" x2="${MAP_WIDTH - 28}" y2="${y}" stroke="var(--ink-secondary)" stroke-width="0.7" stroke-dasharray="4 6" />`;
  }
  // 16 Portolan Compass Rhumb Rays radiating from Human Village
  for (let a = 0; a < 16; a++) {
    const rad = (a * Math.PI) / 8;
    const tx = (vx + Math.cos(rad) * MAP_WIDTH).toFixed(1);
    const ty = (vy + Math.sin(rad) * MAP_HEIGHT).toFixed(1);
    html += `<line x1="${vx.toFixed(1)}" y1="${vy.toFixed(1)}" x2="${tx}" y2="${ty}" stroke="var(--border-gold)" stroke-width="0.8" />`;
  }
  html += `</g>`;

  // 1. Base Surface Basin Watercolor Underwash (fills gaps between biomes so the basin feels cohesive)
  const basinPts: [number, number][] = [
    [0.14, 0.22],
    [0.35, 0.14],
    [0.65, 0.08],
    [0.84, 0.14],
    [0.94, 0.34],
    [0.94, 0.62],
    [0.88, 0.84],
    [0.66, 0.90],
    [0.42, 0.82],
    [0.26, 0.66],
    [0.14, 0.46],
  ];
  const basinD = smoothClosedPath(basinPts);
  html += `<path d="${basinD}" fill="var(--biome-foothills)" fill-opacity="0.32" stroke="var(--biome-foothills)" stroke-width="45" stroke-opacity="0.18" stroke-linejoin="round" />`;

  // 2. Biome Watercolor Washes (Multi-layered soft feathered edges)
  for (const reg of data.regions) {
    const d = smoothClosedPath(reg.points);
    const fill = BIOME_FILL[reg.biome] ?? 'var(--biome-foothills)';
    html += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="38" stroke-opacity="0.18" stroke-linejoin="round" stroke-linecap="round" />`;
    html += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="20" stroke-opacity="0.28" stroke-linejoin="round" stroke-linecap="round" />`;
    html += `<path d="${d}" fill="${fill}" fill-opacity="0.72" stroke="${fill}" stroke-width="8" stroke-opacity="0.45" stroke-linejoin="round" data-biome="${reg.id}" />`;
  }

  // 3. Armixi-Style Multi-Tier Stepped Topographic Massif for Youkai Mountain & Hakurei Ridge
  const youkaiTiers = [
    { rx: 0.175, ry: 0.112, fill: '#9e9275', op: 0.55, seed: 1.1 },
    { rx: 0.150, ry: 0.096, fill: '#948870', op: 0.65, seed: 2.3 },
    { rx: 0.126, ry: 0.080, fill: '#a39883', op: 0.72, seed: 3.7 },
    { rx: 0.104, ry: 0.066, fill: '#b3aa98', op: 0.78, seed: 4.9 },
    { rx: 0.082, ry: 0.052, fill: '#c7c0b2', op: 0.84, seed: 6.2 },
    { rx: 0.062, ry: 0.039, fill: '#dbd6ca', op: 0.88, seed: 7.5 },
    { rx: 0.042, ry: 0.026, fill: '#efece4', op: 0.92, seed: 8.8 },
  ];
  html += `<g class="youkai-mountain-terraces">`;
  for (const t of youkaiTiers) {
    const td = steppedContourPolygon(0.658, 0.155, t.rx, t.ry, t.seed, 22);
    html += `<path d="${td}" fill="${t.fill}" fill-opacity="${t.op}" stroke="var(--ink-primary)" stroke-width="1.3" stroke-opacity="0.58" />`;
    html += `<path d="${td}" fill="none" stroke="var(--ink-secondary)" stroke-width="3.2" stroke-dasharray="1.2 5.5" stroke-opacity="0.42" />`;
  }
  // Hakurei Western Ridge stepped terraces
  const hakureiTiers = [
    { rx: 0.095, ry: 0.064, fill: '#a89b7c', op: 0.50, seed: 2.1 },
    { rx: 0.072, ry: 0.048, fill: '#9a8c6f', op: 0.62, seed: 3.4 },
    { rx: 0.048, ry: 0.032, fill: '#b5a88b', op: 0.72, seed: 5.1 },
  ];
  for (const t of hakureiTiers) {
    const td = steppedContourPolygon(0.252, 0.318, t.rx, t.ry, t.seed, 16);
    html += `<path d="${td}" fill="${t.fill}" fill-opacity="${t.op}" stroke="var(--ink-primary)" stroke-width="1.1" stroke-opacity="0.48" />`;
    html += `<path d="${td}" fill="none" stroke="var(--ink-secondary)" stroke-width="2.6" stroke-dasharray="1.2 6" stroke-opacity="0.35" />`;
  }
  html += `</g>`;

  // 3B. Painted Woodblock Mountain Range & Forest Canopy Stamps (jsDelivr CDN WebP Assets)
  const UI_CDN = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui';
  const autumnCanopySpots: [number, number, number, number][] = [
    // [cxNorm, cyNorm, widthPx, heightPx]
    [0.21, 0.29, 240, 180],
    [0.32, 0.34, 220, 165],
    [0.21, 0.54, 250, 188],
    [0.34, 0.56, 260, 195],
    [0.42, 0.62, 230, 172],
    [0.54, 0.64, 280, 210],
    [0.64, 0.63, 260, 195],
    [0.52, 0.72, 240, 180],
    [0.56, 0.25, 250, 188],
    [0.74, 0.24, 250, 188],
  ];
  const bambooCanopySpots: [number, number, number, number][] = [
    [0.74, 0.38, 250, 188],
    [0.86, 0.36, 260, 195],
    [0.75, 0.48, 240, 180],
    [0.91, 0.46, 230, 172],
  ];

  html += `<g class="painted-cartographic-stamps" pointer-events="none">`;
  // Panoramic Youkai Mountain Range Stamp
  html += `
    <image
      href="${UI_CDN}/mountain-range-stamp.webp"
      x="${(0.39 * MAP_WIDTH).toFixed(1)}"
      y="${(0.005 * MAP_HEIGHT).toFixed(1)}"
      width="${(0.47 * MAP_WIDTH).toFixed(1)}"
      height="${(0.24 * MAP_HEIGHT).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.88"
    />
    <image
      href="${UI_CDN}/mountain-range-stamp.webp"
      x="${(0.13 * MAP_WIDTH).toFixed(1)}"
      y="${(0.18 * MAP_HEIGHT).toFixed(1)}"
      width="${(0.25 * MAP_WIDTH).toFixed(1)}"
      height="${(0.15 * MAP_HEIGHT).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.76"
    />
  `;
  for (const [cx, cy, cw, ch] of autumnCanopySpots) {
    html += `
      <image
        href="${UI_CDN}/autumn-forest-canopy.webp"
        x="${(cx * MAP_WIDTH - cw / 2).toFixed(1)}"
        y="${(cy * MAP_HEIGHT - ch / 2).toFixed(1)}"
        width="${cw}"
        height="${ch}"
        opacity="0.78"
      />
    `;
  }
  for (const [cx, cy, cw, ch] of bambooCanopySpots) {
    html += `
      <image
        href="${UI_CDN}/bamboo-grove-cluster.webp"
        x="${(cx * MAP_WIDTH - cw / 2).toFixed(1)}"
        y="${(cy * MAP_HEIGHT - ch / 2).toFixed(1)}"
        width="${cw}"
        height="${ch}"
        opacity="0.84"
      />
    `;
  }
  html += `</g>`;

  // 4. Hand-Drawn Ink Mountain Ridges & Peaks (Storybook Woodblock Style — image4.png homage)
  const mountainPeaks: [number, number, number, boolean][] = [
    // Northern Horizon Range & Youkai Mountain Skyline (x, y, scale, snowCap)
    [0.39, 0.13, 0.95, false], [0.42, 0.11, 1.10, false], [0.45, 0.12, 1.05, false],
    [0.48, 0.09, 1.28, false], [0.51, 0.10, 1.22, false], [0.54, 0.08, 1.42, true],
    [0.57, 0.09, 1.35, true],  [0.60, 0.07, 1.62, true],  [0.63, 0.06, 1.75, true],
    [0.66, 0.07, 1.80, true],  [0.69, 0.06, 1.70, true],  [0.72, 0.08, 1.55, true],
    [0.75, 0.09, 1.40, true],  [0.78, 0.11, 1.25, false], [0.81, 0.13, 1.10, false],
    // Mid-slope Youkai Mountain crags & Genbu Ravine cliffs
    [0.49, 0.16, 1.05, false], [0.53, 0.15, 1.20, false], [0.57, 0.14, 1.30, false],
    [0.61, 0.15, 1.35, true],  [0.65, 0.14, 1.40, true],  [0.70, 0.15, 1.35, true],
    [0.74, 0.16, 1.25, false], [0.78, 0.17, 1.15, false], [0.81, 0.19, 1.05, false],
    // Lower Youkai Foothill ridges
    [0.52, 0.21, 1.00, false], [0.56, 0.22, 1.12, false], [0.64, 0.21, 1.18, false],
    [0.69, 0.22, 1.15, false], [0.74, 0.21, 1.10, false], [0.78, 0.23, 1.00, false],
    // Western Hakurei Border Ridge
    [0.17, 0.25, 1.15, false], [0.20, 0.23, 1.30, false], [0.23, 0.24, 1.25, false],
    [0.27, 0.23, 1.35, false], [0.30, 0.25, 1.18, false], [0.33, 0.27, 1.05, false],
    [0.17, 0.31, 1.08, false], [0.20, 0.33, 1.12, false], [0.29, 0.31, 1.05, false],
    [0.16, 0.37, 0.95, false], [0.20, 0.38, 0.90, false],
    // Eastern Mayohiga & Barrier Crags
    [0.86, 0.28, 1.10, false], [0.90, 0.30, 1.25, false], [0.93, 0.33, 1.15, false],
    [0.95, 0.38, 1.00, false], [0.91, 0.66, 1.05, false], [0.94, 0.68, 1.15, false],
  ];

  html += `<g class="mountain-hachures" opacity="0.88">`;
  for (const [px, py, scale, snow] of mountainPeaks) {
    const x = px * MAP_WIDTH;
    const y = py * MAP_HEIGHT;
    const w = 46 * scale;
    const h = 30 * scale;
    const snowCap = snow
      ? `<path d="M 0 ${(-h * 0.62).toFixed(1)} L ${(-w * 0.32).toFixed(1)} ${(-h * 0.14).toFixed(1)} L ${(-w * 0.12).toFixed(1)} ${(-h * 0.22).toFixed(1)} L 0 ${(-h * 0.10).toFixed(1)} L ${(w * 0.16).toFixed(1)} ${(-h * 0.20).toFixed(1)} L ${(w * 0.32).toFixed(1)} ${(-h * 0.12).toFixed(1)} Z" fill="#f7f4ec" opacity="0.88" />`
      : '';
    html += `
      <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)})">
        <!-- Sunlit Western Slope -->
        <path d="M ${-w} ${h * 0.42} L ${-w * 0.48} ${-h * 0.10} L 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42} Z" fill="var(--biome-mountain)" fill-opacity="0.72" />
        <!-- Shaded Eastern Face -->
        <path d="M 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42} L ${w * 0.08} ${h * 0.42} L ${-w * 0.06} ${h * 0.05} Z" fill="var(--ink-primary)" fill-opacity="0.24" />
        ${snowCap}
        <!-- Outer Ink Ridge Contour -->
        <path d="M ${-w} ${h * 0.42} L ${-w * 0.48} ${-h * 0.10} L 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42}" fill="none" stroke="var(--ink-primary)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Center Spine & Cliff Hachure Strokes -->
        <path d="M 0 ${-h * 0.62} L ${-w * 0.06} ${h * 0.05} L ${w * 0.08} ${h * 0.36} M ${w * 0.18} ${-h * 0.32} L ${w * 0.32} ${h * 0.28} M ${w * 0.36} ${-h * 0.12} L ${w * 0.52} ${h * 0.32} M ${-w * 0.22} ${-h * 0.25} L ${-w * 0.38} ${h * 0.22}" fill="none" stroke="var(--ink-secondary)" stroke-width="1.05" stroke-opacity="0.72" stroke-linecap="round" />
      </g>
    `;
  }
  html += `</g>`;

  // 5. Dense Hand-Crafted Forest Canopies, Autumn Maple Woods & Bamboo Groves
  html += `<g class="flora-details" opacity="0.86">`;

  // Helper for deciduous/autumn tree cluster (image4.png warm autumn & emerald forest style)
  const renderTreeClump = (x: number, y: number, colorA: string, colorB: string, s = 1) => `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${s.toFixed(2)})">
      <ellipse cx="0" cy="5.5" rx="9" ry="3.2" fill="rgba(26, 15, 8, 0.22)" />
      <line x1="-3.5" y1="1" x2="-3.5" y2="5.5" stroke="#3b2618" stroke-width="1.5" />
      <line x1="3.5" y1="1" x2="3.5" y2="5.5" stroke="#3b2618" stroke-width="1.5" />
      <circle cx="-4.2" cy="-2.2" r="5.6" fill="${colorB}" stroke="var(--ink-primary)" stroke-width="0.85" />
      <circle cx="4.2" cy="-1.8" r="5.2" fill="${colorB}" stroke="var(--ink-primary)" stroke-width="0.85" />
      <circle cx="0" cy="-5.2" r="6.2" fill="${colorA}" stroke="var(--ink-primary)" stroke-width="0.9" />
      <path d="M -3 -7 Q 0 -9.5 3 -7" fill="none" stroke="#fff8e7" stroke-width="0.7" opacity="0.45" />
    </g>
  `;

  // Helper for double-tiered conifer/pine cluster
  const renderPineClump = (x: number, y: number, color: string, s = 1) => `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${s.toFixed(2)})">
      <ellipse cx="0" cy="7" rx="7.5" ry="2.6" fill="rgba(26, 15, 8, 0.22)" />
      <path d="M 0 -13 L -6.5 -2 L -2.8 -2 L -8 6.5 L 8 6.5 L 2.8 -2 L 6.5 -2 Z" fill="${color}" stroke="var(--ink-primary)" stroke-width="0.9" stroke-linejoin="round" />
      <line x1="0" y1="6.5" x2="0" y2="9.5" stroke="#3b2618" stroke-width="1.6" />
    </g>
  `;

  // 5A. Western Hakurei Ridge, Aokigahara & Fantasy Seal Autumn Woods (image4.png signature autumn-and-pine mix!)
  const westZones: [number, number, number, number, number][] = [
    [0.15, 0.38, 0.24, 0.44, 48], // Hakurei Ridge & Shrine approach
    [0.14, 0.30, 0.44, 0.66, 42], // Aokigahara / Western woods
    [0.27, 0.45, 0.50, 0.67, 52], // Tanuki Forest & Myouren Temple woods
    [0.52, 0.72, 0.66, 0.75, 28], // Northern Misty Lake shoreline woods
  ];
  const autumnPalette: [string, string][] = [
    ['#cc5f2b', '#9e3e1c'], // Fiery Maple Orange
    ['#d98a2b', '#b06818'], // Golden Amber Birch
    ['#547846', '#3c5931'], // Deep Forest Green
    ['#68874d', '#496334'], // Moss Olive Oak
    ['#b84327', '#872b16'], // Crimson Autumn Leaf
  ];
  let seedIdx = 1;
  for (const [xMin, xMax, yMin, yMax, count] of westZones) {
    for (let i = 0; i < count; i++) {
      seedIdx++;
      const nx = xMin + hash01(seedIdx * 1.3) * (xMax - xMin);
      const ny = yMin + hash01(seedIdx * 2.7) * (yMax - yMin);
      // Keep clear of Human Village oval & Hakurei Shrine courtyard
      if (Math.hypot((nx - 0.48) * 1.3, (ny - 0.46) * 1.7) < 0.115) continue;
      if (Math.hypot(nx - 0.255, ny - 0.320) < 0.032) continue;
      if (Math.hypot(nx - 0.382, ny - 0.585) < 0.032) continue;
      const x = nx * MAP_WIDTH;
      const y = ny * MAP_HEIGHT;
      const sc = 0.82 + hash01(seedIdx * 3.9) * 0.42;
      if (i % 3 === 0) {
        html += renderPineClump(x, y, i % 6 === 0 ? '#35543c' : '#466944', sc);
      } else {
        const [cA, cB] = autumnPalette[i % autumnPalette.length];
        html += renderTreeClump(x, y, cA, cB, sc);
      }
    }
  }

  // 5B. Forest of Magic Dense Canopy & Luminescent Mushrooms (x: 0.44..0.70, y: 0.56..0.75)
  for (let i = 0; i < 72; i++) {
    seedIdx++;
    const nx = 0.445 + hash01(seedIdx * 1.9) * 0.255;
    const ny = 0.565 + hash01(seedIdx * 3.1) * 0.185;
    // Keep Misty Lake water clear
    if (nx > 0.58 && ny > 0.70) continue;
    const x = nx * MAP_WIDTH;
    const y = ny * MAP_HEIGHT;
    const sc = 0.85 + hash01(seedIdx * 4.3) * 0.45;
    if (i % 5 === 0) {
      // Giant Magic Mushroom cluster
      const capColor = i % 10 === 0 ? '#8b4899' : '#b83b5e';
      html += `
        <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${sc.toFixed(2)})">
          <ellipse cx="0" cy="5.5" rx="6" ry="2" fill="rgba(26, 15, 8, 0.25)" />
          <path d="M -2.2 5.5 L -1.2 -0.5 L 1.2 -0.5 L 2.2 5.5 Z" fill="#efe4ce" stroke="var(--ink-primary)" stroke-width="0.7" />
          <path d="M -7 1 Q 0 -8 7 1 Z" fill="${capColor}" stroke="var(--ink-primary)" stroke-width="0.9" />
          <circle cx="-2.5" cy="-2.2" r="1.2" fill="#fff2a6" />
          <circle cx="2.2" cy="-1.6" r="1.0" fill="#fff2a6" />
          <circle cx="0" cy="-4.2" r="0.9" fill="#fff2a6" />
        </g>
      `;
    } else if (i % 2 === 0) {
      html += renderPineClump(x, y, i % 4 === 0 ? '#2b4a37' : '#385e46', sc);
    } else {
      html += renderTreeClump(x, y, '#436b4f', '#2d4d38', sc);
    }
  }

  // 5C. Great Youkai Forest & Youkai Mountain Foothill Woods (x: 0.42..0.82, y: 0.14..0.34)
  for (let i = 0; i < 68; i++) {
    seedIdx++;
    const nx = 0.42 + hash01(seedIdx * 2.1) * 0.40;
    const ny = 0.15 + hash01(seedIdx * 3.7) * 0.19;
    // Leave summit caldera lighter
    if (Math.hypot(nx - 0.66, ny - 0.14) < 0.065) continue;
    const x = nx * MAP_WIDTH;
    const y = ny * MAP_HEIGHT;
    const sc = 0.80 + hash01(seedIdx * 5.1) * 0.40;
    if (i % 3 !== 0) {
      html += renderPineClump(x, y, i % 2 === 0 ? '#3d5e42' : '#4f7048', sc);
    } else {
      const [cA, cB] = autumnPalette[i % autumnPalette.length];
      html += renderTreeClump(x, y, cA, cB, sc * 0.92);
    }
  }

  // 5D. Bamboo Forest of the Lost Dense Groves (x: 0.68..0.94, y: 0.32..0.53)
  for (let i = 0; i < 78; i++) {
    seedIdx++;
    const nx = 0.675 + hash01(seedIdx * 1.7) * 0.265;
    const ny = 0.320 + hash01(seedIdx * 2.9) * 0.215;
    // Keep Eientei compound clearing open
    if (Math.hypot(nx - 0.855, ny - 0.470) < 0.038) continue;
    const bx = nx * MAP_WIDTH;
    const by = ny * MAP_HEIGHT;
    const sc = 0.85 + hash01(seedIdx * 4.7) * 0.38;
    html += `
      <g transform="translate(${bx.toFixed(1)}, ${by.toFixed(1)}) scale(${sc.toFixed(2)})">
        <ellipse cx="2" cy="11" rx="7" ry="2.2" fill="rgba(26, 15, 8, 0.18)" />
        <line x1="-3" y1="10" x2="-3.5" y2="-12" stroke="#234d30" stroke-width="2.0" />
        <line x1="1.5" y1="11" x2="2" y2="-14" stroke="#2e633e" stroke-width="2.1" />
        <line x1="6" y1="10" x2="7" y2="-10" stroke="#3c7a4f" stroke-width="1.8" />
        <!-- Bamboo Node Rings -->
        <path d="M -4.5 -4 L -2 -4 M 0.5 -6 L 3 -6 M 5.5 -2 L 8 -2" stroke="#a8cfa8" stroke-width="0.9" />
        <!-- Feathery Bamboo Canopy -->
        <path d="M -3.5 -10 Q -10 -14 -13 -9 M -3 -6 Q -9 -9 -11 -4 M 2 -13 Q -4 -17 -7 -12 M 2 -9 Q 8 -13 11 -8 M 7 -8 Q 13 -11 15 -6" fill="none" stroke="#285936" stroke-width="1.45" stroke-linecap="round" />
      </g>
    `;
  }

  // 5E. Netherworld Cherry Blossom (Sakura) Groves (x: 0.29..0.48, y: 0.035..0.12)
  for (let i = 0; i < 24; i++) {
    seedIdx++;
    const sx = (0.29 + hash01(seedIdx * 2.3) * 0.19) * MAP_WIDTH;
    const sy = (0.038 + hash01(seedIdx * 3.3) * 0.08) * MAP_HEIGHT;
    html += renderTreeClump(sx, sy, '#f2a7c3', '#d97a9e', 0.90);
  }

  // 5F. Garden of the Sun Sunflowers (x: 0.73..0.92, y: 0.54..0.66)
  for (let i = 0; i < 34; i++) {
    seedIdx++;
    const sx = (0.725 + hash01(seedIdx * 1.5) * 0.19) * MAP_WIDTH;
    const sy = (0.540 + hash01(seedIdx * 2.5) * 0.115) * MAP_HEIGHT;
    html += `
      <g transform="translate(${sx.toFixed(1)}, ${sy.toFixed(1)})">
        <line x1="0" y1="0" x2="0" y2="6.5" stroke="#3d632e" stroke-width="1.5" />
        <circle cx="0" cy="0" r="5" fill="#f0b924" stroke="#8c5a14" stroke-width="0.8" />
        <circle cx="0" cy="0" r="2.2" fill="#4f3111" />
      </g>
    `;
  }

  // 5G. Higan & Muenzuka Red Spider Lilies (Higanbana)
  const lilyZones: [number, number, number, number, number][] = [
    [0.05, 0.26, 0.05, 0.23, 28], // Higan Plains
    [0.13, 0.29, 0.38, 0.48, 24], // Muenzuka
  ];
  for (const [xMin, xMax, yMin, yMax, count] of lilyZones) {
    for (let i = 0; i < count; i++) {
      seedIdx++;
      const hx = (xMin + hash01(seedIdx * 1.8) * (xMax - xMin)) * MAP_WIDTH;
      const hy = (yMin + hash01(seedIdx * 2.8) * (yMax - yMin)) * MAP_HEIGHT;
      html += `
        <g transform="translate(${hx.toFixed(1)}, ${hy.toFixed(1)})">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#3c5938" stroke-width="1" />
          <circle cx="0" cy="0" r="3.4" fill="#d62828" />
          <path d="M -4.5 -2 L 4.5 2 M -4.5 2 L 4.5 -2 M 0 -4.8 L 0 4.2" stroke="#9e1414" stroke-width="0.95" />
        </g>
      `;
    }
  }

  html += `</g>`;
  terrainGroup.innerHTML = html;
}

/**
 * Renders the 1:1 Architectural Building Footprints, Street Grids, Dragon Canal Bridges,
 * and Armixi-style Key-Fret (雷文) Realm Cartouches
 */
export function renderFootprintsLayer(footprintsGroup: SVGGElement) {
  const vx = 0.480 * MAP_WIDTH;
  const vy = 0.460 * MAP_HEIGHT;

  // 1. Generate Human Village 1:1 Pitched-Roof Edo/Meiji Houses inside the Palisade (image4.png style)
  let villageRoofs = '';
  const blockRows = [-58, -40, -22, 22, 40, 58];
  const blockCols = [-98, -76, -54, -32, 32, 54, 76, 98];
  for (const r of blockRows) {
    for (const c of blockCols) {
      if (Math.hypot(c * 0.80, r * 1.12) > 98) continue;
      const bw = 17 + ((Math.abs(r + c) % 3) * 3.5);
      const bh = 11.5 + ((Math.abs(r * c) % 2) * 2.5);
      const isSlate = (r + c) % 3 === 0;
      const roofFill = isSlate ? '#4d5359' : (r + c) % 2 === 0 ? '#6e503b' : '#593f2d';
      const ridgeColor = isSlate ? '#b8c0c8' : '#d8c3a0';
      villageRoofs += `
        <g transform="translate(${(vx + c).toFixed(1)}, ${(vy + r).toFixed(1)})">
          <!-- Drop Shadow -->
          <rect x="${(-bw / 2 + 1.5).toFixed(1)}" y="${(-bh / 2 + 1.8).toFixed(1)}" width="${bw}" height="${bh}" rx="1" fill="rgba(26, 15, 8, 0.30)" />
          <!-- Pitched Timber/Tile Roof -->
          <rect x="${(-bw / 2).toFixed(1)}" y="${(-bh / 2).toFixed(1)}" width="${bw}" height="${bh}" rx="1.2" fill="${roofFill}" stroke="#24170f" stroke-width="1.1" />
          <!-- Roof Gable & Ridge Beam -->
          <path d="M ${(-bw / 2).toFixed(1)} ${(-bh / 2).toFixed(1)} L ${(-bw / 2 + 3.5).toFixed(1)} 0 L ${(-bw / 2).toFixed(1)} ${(bh / 2).toFixed(1)} M ${(bw / 2).toFixed(1)} ${(-bh / 2).toFixed(1)} L ${(bw / 2 - 3.5).toFixed(1)} 0 L ${(bw / 2).toFixed(1)} ${(bh / 2).toFixed(1)}" fill="none" stroke="#24170f" stroke-width="0.85" />
          <line x1="${(-bw / 2 + 3.5).toFixed(1)}" y1="0" x2="${(bw / 2 - 3.5).toFixed(1)}" y2="0" stroke="${ridgeColor}" stroke-width="0.9" />
        </g>
      `;
    }
  }

  // Terraced Rice Paddies & Irrigation Ditches surrounding the Human Village
  let paddies = '';
  for (let px = -210; px <= 210; px += 36) {
    for (let py = -118; py <= 118; py += 26) {
      const dist = Math.hypot(px * 0.82, py * 1.15);
      if (dist < 126 || dist > 205) continue;
      const fillTint = (px + py) % 72 === 0 ? 'rgba(168, 184, 112, 0.25)' : 'rgba(214, 198, 138, 0.22)';
      paddies += `
        <g transform="translate(${(vx + px).toFixed(1)}, ${(vy + py).toFixed(1)})">
          <rect x="-15" y="-10" width="30" height="20" rx="2" fill="${fillTint}" stroke="#7d6e49" stroke-width="0.85" stroke-opacity="0.55" />
          <line x1="-11" y1="-4" x2="11" y2="-4" stroke="#6b7d49" stroke-width="0.7" stroke-dasharray="2 3" opacity="0.6" />
          <line x1="-11" y1="4" x2="11" y2="4" stroke="#6b7d49" stroke-width="0.7" stroke-dasharray="2 3" opacity="0.6" />
        </g>
      `;
    }
  }

  // Compound coordinates
  const hx = 0.255 * MAP_WIDTH;
  const hy = 0.320 * MAP_HEIGHT;
  const sx = 0.825 * MAP_WIDTH;
  const sy = 0.745 * MAP_HEIGHT;
  const mx = 0.382 * MAP_WIDTH;
  const my = 0.585 * MAP_HEIGHT;
  const ex = 0.855 * MAP_WIDTH;
  const ey = 0.470 * MAP_HEIGHT;

  // Underworld cavern ceiling stalactites (Armixi Underground Cartouche homage)
  const uwX = 0.032 * MAP_WIDTH;
  const uwY = 0.682 * MAP_HEIGHT;
  const uwW = 0.268 * MAP_WIDTH;
  const uwH = 0.285 * MAP_HEIGHT;
  let stalactites = '';
  for (let i = 0; i < 24; i++) {
    const sx0 = uwX + 12 + (i * (uwW - 24)) / 24;
    const sw = (uwW - 24) / 24;
    const sh = 10 + ((i * 17) % 18);
    stalactites += `<polygon points="${sx0.toFixed(1)},${(uwY + 4).toFixed(1)} ${(sx0 + sw / 2).toFixed(1)},${(uwY + 4 + sh).toFixed(1)} ${(sx0 + sw).toFixed(1)},${(uwY + 4).toFixed(1)}" fill="#3b2d29" stroke="var(--border-ink)" stroke-width="0.9" opacity="0.78" />`;
  }

  footprintsGroup.innerHTML = `
    <!-- Rice Paddies Surrounding Village -->
    <g class="village-paddies">${paddies}</g>

    <!-- 1. HUMAN VILLAGE 1:1 WALLED PALISADE, STREET GRID & DRAGON CANAL (image4.png Centerpiece) -->
    <g class="footprint-human-village">
      <!-- Village Ground Clearing -->
      <ellipse cx="${vx}" cy="${vy}" rx="124" ry="84" fill="#dfd0b2" fill-opacity="0.82" />

      <!-- Internal Main Street & Cross Lanes -->
      <line x1="${vx - 120}" y1="${vy}" x2="${vx + 120}" y2="${vy}" stroke="#cbb48c" stroke-width="11" />
      <line x1="${vx - 120}" y1="${vy}" x2="${vx + 120}" y2="${vy}" stroke="#e8d8b8" stroke-width="7" />
      <line x1="${vx - 64}" y1="${vy - 75}" x2="${vx - 64}" y2="${vy + 75}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${vx + 64}" y1="${vy - 75}" x2="${vx + 64}" y2="${vy + 75}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${vx - 108}" y1="${vy - 31}" x2="${vx + 108}" y2="${vy - 31}" stroke="#cbb48c" stroke-width="5" />
      <line x1="${vx - 108}" y1="${vy + 31}" x2="${vx + 108}" y2="${vy + 31}" stroke="#cbb48c" stroke-width="5" />

      <!-- Stone-Lined Dragon Canal (Canal of Willows) bisecting the Village North-to-South -->
      <path d="M ${vx + 14} ${vy - 82} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 82}" fill="none" stroke="#4a3f35" stroke-width="13" />
      <path d="M ${vx + 14} ${vy - 82} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 82}" fill="none" stroke="var(--water-fill)" stroke-width="8.5" />
      <path d="M ${vx + 14} ${vy - 82} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 82}" fill="none" stroke="#d8eef7" stroke-width="2" stroke-dasharray="6 8" class="river-flow-anim" />

      <!-- Three Arched Wooden Footbridges across the Dragon Canal -->
      <g fill="#8c5a32" stroke="#2a180d" stroke-width="1.1">
        <rect x="${vx + 4}" y="${vy - 35}" width="18" height="7" rx="1.5" />
        <rect x="${vx + 3}" y="${vy - 5}" width="19" height="9" rx="2" />
        <rect x="${vx + 5}" y="${vy + 28}" width="18" height="7" rx="1.5" />
      </g>

      <!-- Market Square Central Plaza & Dragon Statue Pedestal -->
      <rect x="${vx - 26}" y="${vy - 16}" width="38" height="32" rx="3" fill="#ead9b7" stroke="#6b4e35" stroke-width="1.5" />
      <circle cx="${vx - 7}" cy="${vy}" r="5.5" fill="#9e9585" stroke="#3b3228" stroke-width="1.2" />
      <circle cx="${vx - 7}" cy="${vy}" r="2.2" fill="#d9a74a" />

      <!-- Individual 1:1 Pitched-Roof Village Houses -->
      ${villageRoofs}

      <!-- Outer Timber Stake Palisade Wall (Individual Wooden Stakes Ring) -->
      <ellipse cx="${vx}" cy="${vy}" rx="126" ry="86" fill="none" stroke="#24150c" stroke-width="6.5" />
      <ellipse cx="${vx}" cy="${vy}" rx="126" ry="86" fill="none" stroke="#785235" stroke-width="4.5" stroke-dasharray="2.5 2.0" />
      <ellipse cx="${vx}" cy="${vy}" rx="122.5" ry="82.5" fill="none" stroke="#3b2314" stroke-width="1.2" />

      <!-- Four Palisade Gate Watchtowers (North, South, West, East) -->
      <g fill="#543520" stroke="#1f1108" stroke-width="1.5">
        <rect x="${vx - 13}" y="${vy - 92}" width="26" height="13" rx="1.5" />
        <line x1="${vx - 10}" y1="${vy - 86}" x2="${vx + 10}" y2="${vy - 86}" stroke="#d8c3a0" stroke-width="1.1" />
        <rect x="${vx - 13}" y="${vy + 79}" width="26" height="13" rx="1.5" />
        <line x1="${vx - 10}" y1="${vy + 85}" x2="${vx + 10}" y2="${vy + 85}" stroke="#d8c3a0" stroke-width="1.1" />
        <rect x="${vx - 133}" y="${vy - 12}" width="13" height="24" rx="1.5" />
        <rect x="${vx + 120}" y="${vy - 12}" width="13" height="24" rx="1.5" />
      </g>
    </g>

    <!-- 2. HAKUREI SHRINE 1:1 HILLTOP COMPOUND & LONG STONE STAIRCASE (image4.png Top-Left Showcase) -->
    <g class="footprint-hakurei-shrine" transform="translate(${hx}, ${hy})">
      <!-- Swept Shrine Courtyard & Retaining Wall -->
      <ellipse cx="0" cy="-2" rx="52" ry="34" fill="#d9cbb0" stroke="#594535" stroke-width="2.2" />
      <ellipse cx="0" cy="-2" rx="46" ry="28" fill="#e8dcc2" stroke="#8c735b" stroke-width="1" stroke-dasharray="6 4" />
      <!-- Long Stone Staircase descending South-Southeast toward the Village road -->
      <path d="M -8 24 L -16 98 L 12 98 L 8 24 Z" fill="#bfb5a4" stroke="#453a30" stroke-width="1.6" />
      <path d="M -9 34 L 9 34 M -10 44 L 10 44 M -11 54 L 11 54 M -12 64 L 12 64 M -13 74 L 12 74 M -14 84 L 12 84 M -15 93 L 12 93" stroke="#5e5246" stroke-width="1.3" />
      <!-- Stone Lanterns (Tōrō) flanking the stairs -->
      <circle cx="-13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="-19" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="16" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <!-- Honden Main Hall & Living Quarters Footprints -->
      <rect x="-26" y="-22" width="38" height="22" rx="2" fill="#7a2820" stroke="#26120e" stroke-width="1.5" />
      <rect x="14" y="-16" width="22" height="16" rx="1.5" fill="#6b4c35" stroke="#26120e" stroke-width="1.3" />
    </g>

    <!-- 3. SCARLET DEVIL MANSION 1:1 GOTHIC ESTATE, WROUGHT-IRON GATES & ROSE GARDENS -->
    <g class="footprint-sdm" transform="translate(${sx}, ${sy})">
      <!-- Peninsula Stone Terrace & Wrought-Iron Wall -->
      <rect x="-86" y="-52" width="164" height="104" rx="6" fill="rgba(128, 36, 44, 0.22)" stroke="#3d1217" stroke-width="2.4" />
      <rect x="-82" y="-48" width="156" height="96" rx="4" fill="none" stroke="#9e2a33" stroke-width="1.2" stroke-dasharray="6 3" />
      <!-- Geometric Victorian Rose Hedge Labyrinths -->
      <rect x="-72" y="-38" width="44" height="32" rx="2" fill="rgba(46, 82, 52, 0.35)" stroke="#294a2e" stroke-width="2" />
      <rect x="-64" y="-30" width="28" height="16" fill="none" stroke="#b6342a" stroke-width="1.4" stroke-dasharray="4 3" />
      <rect x="-72" y="6" width="44" height="32" rx="2" fill="rgba(46, 82, 52, 0.35)" stroke="#294a2e" stroke-width="2" />
      <rect x="-64" y="14" width="28" height="16" fill="none" stroke="#b6342a" stroke-width="1.4" stroke-dasharray="4 3" />
      <!-- Grand Crimson Manor Wings & Central Clock Tower Base -->
      <path d="M -20 -38 L 54 -38 L 54 38 L -20 38 L -20 16 L 10 16 L 10 -16 L -20 -16 Z" fill="#6e1820" stroke="#21080a" stroke-width="1.8" />
      <circle cx="22" cy="0" r="15" fill="#94222b" stroke="#f0d080" stroke-width="1.6" />
    </g>

    <!-- 4. MYOUREN TEMPLE 1:1 MONASTERY, PAGODA & CEMETERY -->
    <g class="footprint-myouren" transform="translate(${mx}, ${my})">
      <rect x="-52" y="-32" width="96" height="62" rx="4" fill="rgba(218, 205, 178, 0.72)" stroke="#4a3e33" stroke-width="2" />
      <rect x="-28" y="-20" width="48" height="28" rx="2" fill="#464d54" stroke="#1e2226" stroke-width="1.6" />
      <rect x="24" y="-16" width="14" height="14" rx="1.5" fill="#5e4332" stroke="#1e2226" stroke-width="1.3" />
      <!-- Cemetery Gravestones & Stupas -->
      <g transform="translate(-68, -10)" fill="#968f84" stroke="#36312b" stroke-width="1">
        <rect x="-14" y="-12" width="5.5" height="10" rx="1" />
        <rect x="-4" y="-14" width="5.5" height="12" rx="1" />
        <rect x="6" y="-11" width="5.5" height="9" rx="1" />
        <rect x="-12" y="4" width="5.5" height="10" rx="1" />
        <rect x="-1" y="3" width="5.5" height="11" rx="1" />
        <rect x="8" y="5" width="5.5" height="9" rx="1" />
      </g>
    </g>

    <!-- 5. EIENTEI 1:1 HIDDEN BAMBOO PALACE COMPOUND -->
    <g class="footprint-eientei" transform="translate(${ex}, ${ey})">
      <ellipse cx="0" cy="0" rx="58" ry="42" fill="rgba(228, 218, 192, 0.76)" stroke="#2e4f2b" stroke-width="3.5" />
      <ellipse cx="0" cy="0" rx="58" ry="42" fill="none" stroke="#68945e" stroke-width="2" stroke-dasharray="3 2.5" />
      <rect x="-38" y="-24" width="76" height="48" rx="2" fill="none" stroke="#4f3826" stroke-width="4.5" />
      <rect x="-20" y="-14" width="40" height="28" rx="2" fill="#59402c" stroke="#24170e" stroke-width="1.6" />
    </g>

    <!-- 6. ARMIXI-STYLE KEY-FRET (雷文) REALM CARTOUCHES (Underworld, Makai, The Moon) -->
    <g class="realm-cartouche-frames" opacity="0.92">
      <!-- 6A. UNDERWORLD & FORMER HELL SUBTERRANEAN CAVERN CARTOUCHE -->
      <rect x="${uwX}" y="${uwY}" width="${uwW}" height="${uwH}" rx="6" fill="rgba(34, 24, 22, 0.24)" stroke="var(--border-ink)" stroke-width="7" />
      <rect x="${uwX}" y="${uwY}" width="${uwW}" height="${uwH}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3.2" stroke-dasharray="8 4 2 4" />
      <rect x="${uwX + 4}" y="${uwY + 4}" width="${uwW - 8}" height="${uwH - 8}" rx="4" fill="none" stroke="var(--border-ink)" stroke-width="1.2" />
      <!-- Hanging Cavern Stalactites along the top ceiling -->
      ${stalactites}
      <!-- Subterranean Lava Cracks & Hellfire Glow in Blazing Hell -->
      <path d="M ${0.06 * MAP_WIDTH} ${0.91 * MAP_HEIGHT} Q ${0.11 * MAP_WIDTH} ${0.89 * MAP_HEIGHT} ${0.16 * MAP_WIDTH} ${0.92 * MAP_HEIGHT} T ${0.24 * MAP_WIDTH} ${0.90 * MAP_HEIGHT}" fill="none" stroke="#ff542e" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.75" />
      <rect x="${uwX + 12}" y="${uwY + 14}" width="295" height="22" rx="3" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="1.4" />
      <text x="${uwX + 20}" y="${uwY + 29}" font-family="var(--font-display)" font-size="13.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.8">UNDERWORLD &amp; FORMER HELL (地底・旧地獄)</text>

      <!-- 6B. MAKAI DEMON REALM CARTOUCHE -->
      <rect x="${0.032 * MAP_WIDTH}" y="${0.482 * MAP_HEIGHT}" width="${0.138 * MAP_WIDTH}" height="${0.178 * MAP_HEIGHT}" rx="6" fill="rgba(72, 48, 92, 0.18)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${0.032 * MAP_WIDTH}" y="${0.482 * MAP_HEIGHT}" width="${0.138 * MAP_WIDTH}" height="${0.178 * MAP_HEIGHT}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <rect x="${0.038 * MAP_WIDTH}" y="${0.490 * MAP_HEIGHT}" width="138" height="20" rx="3" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="1.3" />
      <text x="${0.043 * MAP_WIDTH}" y="${0.504 * MAP_HEIGHT}" font-family="var(--font-display)" font-size="12.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.5">MAKAI (魔界)</text>

      <!-- 6C. THE MOON & DREAM WORLD CELESTIAL CARTOUCHE (Armixi Lunar Sphere Homage) -->
      <rect x="${0.822 * MAP_WIDTH}" y="${0.026 * MAP_HEIGHT}" width="${0.152 * MAP_WIDTH}" height="${0.252 * MAP_HEIGHT}" rx="6" fill="rgba(186, 198, 218, 0.22)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${0.822 * MAP_WIDTH}" y="${0.026 * MAP_HEIGHT}" width="${0.152 * MAP_WIDTH}" height="${0.252 * MAP_HEIGHT}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <!-- Lunar Sphere Ring around the Lunar Capital -->
      <circle cx="${0.902 * MAP_WIDTH}" cy="${0.112 * MAP_HEIGHT}" r="58" fill="rgba(242, 238, 225, 0.55)" stroke="var(--border-ink)" stroke-width="2.2" />
      <circle cx="${0.902 * MAP_WIDTH}" cy="${0.112 * MAP_HEIGHT}" r="52" fill="none" stroke="var(--border-gold)" stroke-width="1.2" stroke-dasharray="5 3" />
      <rect x="${0.828 * MAP_WIDTH}" y="${0.034 * MAP_HEIGHT}" width="215" height="20" rx="3" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="1.3" />
      <text x="${0.834 * MAP_WIDTH}" y="${0.048 * MAP_HEIGHT}" font-family="var(--font-display)" font-size="12.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.5">THE MOON &amp; DREAM (月の都)</text>
    </g>
  `;
}
