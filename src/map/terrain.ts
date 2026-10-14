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

  // 2. Biome Watercolor Washes (Multi-layered soft feathered edges that let parchment fibers show through)
  for (const reg of data.regions) {
    const d = smoothClosedPath(reg.points);
    const fill = BIOME_FILL[reg.biome] ?? 'var(--biome-foothills)';
    html += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="36" stroke-opacity="0.12" stroke-linejoin="round" stroke-linecap="round" />`;
    html += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="18" stroke-opacity="0.18" stroke-linejoin="round" stroke-linecap="round" />`;
    html += `<path d="${d}" fill="${fill}" fill-opacity="0.38" stroke="${fill}" stroke-width="6" stroke-opacity="0.28" stroke-linejoin="round" data-biome="${reg.id}" />`;
  }

  // 3. Armixi-Style Multi-Tier Stepped Topographic Massif for Youkai Mountain & Hakurei Ridge
  const youkaiTiers = [
    { rx: 0.175, ry: 0.112, fill: '#9e9275', op: 0.38, seed: 1.1 },
    { rx: 0.150, ry: 0.096, fill: '#948870', op: 0.45, seed: 2.3 },
    { rx: 0.126, ry: 0.080, fill: '#a39883', op: 0.52, seed: 3.7 },
    { rx: 0.104, ry: 0.066, fill: '#b3aa98', op: 0.58, seed: 4.9 },
    { rx: 0.082, ry: 0.052, fill: '#c7c0b2', op: 0.64, seed: 6.2 },
    { rx: 0.062, ry: 0.039, fill: '#dbd6ca', op: 0.70, seed: 7.5 },
    { rx: 0.042, ry: 0.026, fill: '#efece4', op: 0.76, seed: 8.8 },
  ];
  html += `<g class="youkai-mountain-terraces">`;
  for (const t of youkaiTiers) {
    const td = steppedContourPolygon(0.658, 0.155, t.rx, t.ry, t.seed, 22);
    html += `<path d="${td}" fill="${t.fill}" fill-opacity="${t.op}" stroke="var(--ink-primary)" stroke-width="1.1" stroke-opacity="0.45" />`;
    html += `<path d="${td}" fill="none" stroke="var(--ink-secondary)" stroke-width="2.6" stroke-dasharray="1.2 5.5" stroke-opacity="0.32" />`;
  }
  // Hakurei Western Ridge stepped terraces
  const hakureiTiers = [
    { rx: 0.095, ry: 0.064, fill: '#a89b7c', op: 0.36, seed: 2.1 },
    { rx: 0.072, ry: 0.048, fill: '#9a8c6f', op: 0.44, seed: 3.4 },
    { rx: 0.048, ry: 0.032, fill: '#b5a88b', op: 0.52, seed: 5.1 },
  ];
  for (const t of hakureiTiers) {
    const td = steppedContourPolygon(0.252, 0.318, t.rx, t.ry, t.seed, 16);
    html += `<path d="${td}" fill="${t.fill}" fill-opacity="${t.op}" stroke="var(--ink-primary)" stroke-width="1.0" stroke-opacity="0.40" />`;
    html += `<path d="${td}" fill="none" stroke="var(--ink-secondary)" stroke-width="2.2" stroke-dasharray="1.2 6" stroke-opacity="0.28" />`;
  }
  html += `</g>`;

  // 3B. Painted Woodblock Mountain Range & Forest Canopy Stamps (jsDelivr CDN WebP Assets)
  const UI_CDN = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui';
  const autumnCanopySpots: [number, number, number, number][] = [
    // [cxNorm, cyNorm, widthPx, heightPx]
    [0.21, 0.29, 250, 188],
    [0.32, 0.34, 230, 172],
    [0.20, 0.48, 240, 180],
    [0.22, 0.57, 250, 188],
    [0.34, 0.56, 260, 195],
    [0.42, 0.62, 230, 172],
    [0.49, 0.61, 250, 188],
    [0.56, 0.65, 280, 210],
    [0.65, 0.63, 260, 195],
    [0.52, 0.72, 240, 180],
    [0.55, 0.25, 250, 188],
    [0.65, 0.24, 240, 180],
    [0.75, 0.24, 250, 188],
  ];
  const bambooCanopySpots: [number, number, number, number][] = [
    [0.73, 0.37, 250, 188],
    [0.85, 0.35, 260, 195],
    [0.75, 0.47, 240, 180],
    [0.82, 0.43, 235, 176],
    [0.91, 0.46, 235, 176],
  ];

  html += `<g class="painted-cartographic-stamps" pointer-events="none">`;
  // Panoramic Youkai Mountain Range Stamp
  html += `
    <image
      href="${UI_CDN}/mountain-range-stamp.webp"
      x="${(0.39 * MAP_WIDTH).toFixed(1)}"
      y="${(0.012 * MAP_HEIGHT).toFixed(1)}"
      width="${(0.45 * MAP_WIDTH).toFixed(1)}"
      height="${(0.225 * MAP_HEIGHT).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.90"
    />
    <image
      href="${UI_CDN}/mountain-range-stamp.webp"
      x="${(0.13 * MAP_WIDTH).toFixed(1)}"
      y="${(0.185 * MAP_HEIGHT).toFixed(1)}"
      width="${(0.25 * MAP_WIDTH).toFixed(1)}"
      height="${(0.145 * MAP_HEIGHT).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.80"
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
        opacity="0.84"
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
        opacity="0.88"
      />
    `;
  }
  html += `</g>`;

  // 4. Subtle Hand-Drawn Ink Mountain Ridges & Crag Accents
  const mountainPeaks: [number, number, number, boolean][] = [
    // Mid-slope Youkai Mountain crags & Genbu Ravine cliffs
    [0.49, 0.16, 1.00, false], [0.57, 0.14, 1.15, false],
    [0.65, 0.14, 1.20, true],  [0.74, 0.16, 1.10, false], [0.81, 0.19, 0.95, false],
    // Lower Youkai Foothill ridges
    [0.52, 0.21, 0.92, false], [0.64, 0.21, 1.05, false], [0.74, 0.21, 0.98, false],
    // Western Hakurei Border Ridge
    [0.17, 0.31, 0.98, false], [0.29, 0.31, 0.95, false], [0.18, 0.37, 0.90, false],
    // Eastern Mayohiga & Barrier Crags
    [0.86, 0.28, 1.05, false], [0.91, 0.30, 1.15, false], [0.94, 0.34, 1.05, false],
    [0.92, 0.67, 1.00, false],
  ];

  html += `<g class="mountain-hachures" opacity="0.48">`;
  for (const [px, py, scale, snow] of mountainPeaks) {
    const x = px * MAP_WIDTH;
    const y = py * MAP_HEIGHT;
    const w = 44 * scale;
    const h = 28 * scale;
    const snowCap = snow
      ? `<path d="M 0 ${(-h * 0.62).toFixed(1)} L ${(-w * 0.32).toFixed(1)} ${(-h * 0.14).toFixed(1)} L ${(-w * 0.12).toFixed(1)} ${(-h * 0.22).toFixed(1)} L 0 ${(-h * 0.10).toFixed(1)} L ${(w * 0.16).toFixed(1)} ${(-h * 0.20).toFixed(1)} L ${(w * 0.32).toFixed(1)} ${(-h * 0.12).toFixed(1)} Z" fill="#f7f4ec" opacity="0.82" />`
      : '';
    html += `
      <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)})">
        <!-- Sunlit Western Slope -->
        <path d="M ${-w} ${h * 0.42} L ${-w * 0.48} ${-h * 0.10} L 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42} Z" fill="var(--biome-mountain)" fill-opacity="0.62" />
        <!-- Shaded Eastern Face -->
        <path d="M 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42} L ${w * 0.08} ${h * 0.42} L ${-w * 0.06} ${h * 0.05} Z" fill="var(--ink-primary)" fill-opacity="0.22" />
        ${snowCap}
        <!-- Outer Ink Ridge Contour -->
        <path d="M ${-w} ${h * 0.42} L ${-w * 0.48} ${-h * 0.10} L 0 ${-h * 0.62} L ${w * 0.48} ${-h * 0.08} L ${w} ${h * 0.42}" fill="none" stroke="var(--ink-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Center Spine & Cliff Hachure Strokes -->
        <path d="M 0 ${-h * 0.62} L ${-w * 0.06} ${h * 0.05} L ${w * 0.08} ${h * 0.36} M ${w * 0.18} ${-h * 0.32} L ${w * 0.32} ${h * 0.28} M ${w * 0.36} ${-h * 0.12} L ${w * 0.52} ${h * 0.32} M ${-w * 0.22} ${-h * 0.25} L ${-w * 0.38} ${h * 0.22}" fill="none" stroke="var(--ink-secondary)" stroke-width="1.0" stroke-opacity="0.68" stroke-linecap="round" />
      </g>
    `;
  }
  html += `</g>`;

  // 5. Subtle Hand-Crafted Flora Ground-Cover Accents
  html += `<g class="flora-details" opacity="0.58">`;

  // Helper for shan-shui-inf / ukiyo-e scalloped deciduous & autumn tree cluster (replaces flat circles)
  const renderTreeClump = (x: number, y: number, colorA: string, colorB: string, s = 1) => `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${s.toFixed(2)})">
      <ellipse cx="0.5" cy="5.8" rx="9.5" ry="3.0" fill="rgba(26, 15, 8, 0.22)" />
      <!-- Gnarled East-Asian Ink Trunk & Forked Boughs -->
      <path d="M -2.5 5.8 Q -2.2 1.8 -4.4 -1.6 M 2.2 5.8 Q 1.8 1.5 4.2 -1.4 M -0.2 5.8 L 0 -3.8" fill="none" stroke="#362214" stroke-width="1.45" stroke-linecap="round" />
      <!-- Lower Shaded Foliage Cloud Crown -->
      <path d="M -8.6 -0.8 C -10.4 -3.8, -7.8 -7.4, -4.2 -6.8 C -2.2 -9.6, 2.4 -9.6, 4.4 -6.8 C 8.0 -7.2, 10.4 -3.6, 8.4 -0.6 C 9.2 1.8, 5.6 3.0, 2.4 2.2 C 0 3.2, -2.6 3.0, -4.6 2.0 C -7.6 2.8, -9.4 1.2, -8.6 -0.8 Z" fill="${colorB}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Upper Sunlit Scalloped Foliage Crown -->
      <path d="M -6.4 -3.2 C -7.8 -6.2, -4.8 -9.4, -1.6 -8.6 C 0.4 -11.2, 4.2 -10.2, 5.4 -7.4 C 7.8 -6.6, 7.6 -3.2, 5.2 -2.0 C 2.6 -0.8, -3.2 -0.8, -6.4 -3.2 Z" fill="${colorA}" stroke="var(--ink-primary)" stroke-width="0.8" stroke-linejoin="round" />
      <!-- Ink Brush Texture & Highlight -->
      <path d="M -3.5 -6.8 Q 0 -8.8 3.5 -6.5 M -5.2 -2.5 Q -2.5 -4.0 0.5 -2.8" fill="none" stroke="#fff8e7" stroke-width="0.65" opacity="0.42" stroke-linecap="round" />
    </g>
  `;

  // Helper for shan-shui-inf tiered Japanese pine (Matsu) with curved trunk & horizontal needle pads
  const renderPineClump = (x: number, y: number, color: string, s = 1) => `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${s.toFixed(2)})">
      <ellipse cx="0.5" cy="7.2" rx="8.0" ry="2.5" fill="rgba(26, 15, 8, 0.22)" />
      <!-- Curved Resinous Pine Trunk -->
      <path d="M -0.4 7.5 Q -1.2 1.5 0.2 -9.5 M -0.6 1.5 L -4.5 -0.8 M 0.2 -2.5 L 4.4 -4.5" fill="none" stroke="#3b2416" stroke-width="1.5" stroke-linecap="round" />
      <!-- Bottom Tier Pine Needle Pad -->
      <path d="M -8.8 3.6 Q -4.5 -0.8 0 -0.2 Q 4.5 -0.8 8.8 3.6 Q 4.2 4.6 0 4.0 Q -4.2 4.6 -8.8 3.6 Z" fill="${color}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Middle Tier Pine Needle Pad -->
      <path d="M -7.2 -1.6 Q -3.5 -5.8 0 -5.2 Q 3.5 -5.8 7.2 -1.6 Q 3.2 -0.8 0 -1.2 Q -3.2 -0.8 -7.2 -1.6 Z" fill="${color}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Crown Tier Pine Needle Pad -->
      <path d="M -5.0 -6.6 Q 0 -11.8 5.0 -6.6 Q 0 -5.8 -5.0 -6.6 Z" fill="${color}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Ink Needle Hachure Accents -->
      <path d="M -5.2 2.2 L -3.2 0.8 M 3.2 0.8 L 5.2 2.2 M -3.8 -3.0 L -1.8 -4.4 M 1.8 -4.4 L 3.8 -3.0" stroke="rgba(255,248,231,0.32)" stroke-width="0.65" stroke-linecap="round" />
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
 * Renders the 2.5D Isometric Architectural Building Footprints, Hand-Inked Irregular Rice Paddies,
 * Street Grids, Dragon Canal Bridges, and Armixi-style Key-Fret (雷文) Realm Cartouches
 */
export function renderFootprintsLayer(footprintsGroup: SVGGElement) {
  const vx = 0.480 * MAP_WIDTH;
  const vy = 0.460 * MAP_HEIGHT;

  // 1. Generate Human Village 2.5D Three-Quarter Isometric Edo/Meiji Houses (Machiya) inside the Palisade
  let villageRoofs = '';
  const blockRows = [-58, -40, -22, 22, 40, 58];
  const blockCols = [-98, -76, -54, -32, 32, 54, 76, 98];
  for (const r of blockRows) {
    for (const c of blockCols) {
      if (Math.hypot(c * 0.80, r * 1.12) > 98) continue;
      // Leave extra breathing room around Dragon Canal (x ≈ +14)
      if (c === 32 && Math.abs(r) === 22) continue;
      const bw = 16.5 + ((Math.abs(r + c) % 3) * 3.0);
      const bh = 10.5 + ((Math.abs(r * c) % 2) * 2.2);
      const wallH = 4.2;
      const sideW = 3.2;
      const isSlate = (r + c) % 3 === 0;
      const roofNorth = isSlate ? '#3e444a' : (r + c) % 2 === 0 ? '#5c412e' : '#4a3324';
      const roofSouth = isSlate ? '#575f68' : (r + c) % 2 === 0 ? '#78573f' : '#634632';
      const ridgeColor = isSlate ? '#c4ccd4' : '#e0cba8';
      const hw = +(bw / 2).toFixed(1);
      const hh = +(bh / 2).toFixed(1);

      villageRoofs += `
        <g transform="translate(${(vx + c).toFixed(1)}, ${(vy + r).toFixed(1)})">
          <!-- 2.5D Cast Ground Shadow -->
          <polygon points="${-hw + 2.2},${hh + wallH + 1.8} ${hw + sideW + 2.5},${hh + wallH + 1.8} ${hw + sideW + 2.5},${-hh + 2.5} ${-hw + 2.2},${-hh + 2.5}" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Sunlit Front Timber & White-Plaster Facade Wall -->
          <rect x="${-hw + 1}" y="${hh - 0.8}" width="${bw - 2}" height="${wallH}" fill="#efe2c6" stroke="#24170f" stroke-width="0.9" />
          <!-- Traditional Wooden Koshi Lattice & Doorway on Front Wall -->
          <line x1="${-hw + 4}" y1="${hh - 0.5}" x2="${-hw + 4}" y2="${hh + wallH - 0.8}" stroke="#4a321f" stroke-width="1.2" />
          <line x1="0" y1="${hh - 0.5}" x2="0" y2="${hh + wallH - 0.8}" stroke="#3b2616" stroke-width="1.8" />
          <line x1="${hw - 4}" y1="${hh - 0.5}" x2="${hw - 4}" y2="${hh + wallH - 0.8}" stroke="#4a321f" stroke-width="1.2" />
          <!-- Shaded Eastern Side Wall (2.5D Depth Extrusion) -->
          <polygon points="${hw - 1},${-hh + 1.5} ${hw + sideW},${-hh + 3.2} ${hw + sideW},${hh + wallH - 0.8} ${hw - 1},${hh + wallH - 0.8}" fill="#c4b08b" stroke="#24170f" stroke-width="0.9" stroke-linejoin="round" />
          <!-- Pitched Irimoya Roof — North Slope (Darker) -->
          <polygon points="${-hw},${0} ${-hw + 2.8},${-hh} ${hw - 2.2},${-hh} ${hw + 0.8},${0}" fill="${roofNorth}" stroke="#21140c" stroke-width="1.0" stroke-linejoin="round" />
          <!-- Pitched Irimoya Roof — South Overhanging Slope (Sunlit) -->
          <polygon points="${-hw - 0.6},${hh} ${-hw},${0} ${hw + 0.8},${0} ${hw + 1.2},${hh}" fill="${roofSouth}" stroke="#21140c" stroke-width="1.0" stroke-linejoin="round" />
          <!-- Eastern Roof Gable Triangle -->
          <polygon points="${hw - 2.2},${-hh} ${hw + sideW + 0.4},${0.8} ${hw + 1.2},${hh}" fill="${roofNorth}" stroke="#21140c" stroke-width="0.95" stroke-linejoin="round" />
          <!-- Raised Ornamental Roof Ridge Beam (棟) -->
          <line x1="${-hw + 2.4}" y1="0" x2="${hw - 1.5}" y2="0" stroke="${ridgeColor}" stroke-width="1.35" stroke-linecap="round" />
        </g>
      `;
    }
  }

  // 2. Hand-Inked Irregular Rice Paddies & Hachure Furrows with Strict River & Road Buffer Clipping
  let paddies = '';
  let paddySeed = 11;
  for (let px = -216; px <= 216; px += 38) {
    for (let py = -124; py <= 124; py += 28) {
      paddySeed++;
      const dist = Math.hypot(px * 0.82, py * 1.15);
      // Keep strictly outside the village palisade & gatehouses (dist >= 134) and inside the farmland basin
      if (dist < 134 || dist > 208) continue;

      // STRICT BUFFER CLIPPING: Never overlap the North-South Dragon Canal (x ≈ +14) or North/South Gate Highways (x ≈ 0)
      if (Math.abs(px - 6) < 35) continue;
      // STRICT BUFFER CLIPPING: Never overlap the West/East Gate Highways (y ≈ 0)
      if (Math.abs(py) < 25) continue;

      // Organic hand-inked vertex jitter (Rough.js style irregular field plots)
      const j1 = (hash01(paddySeed * 1.3) - 0.5) * 4.5;
      const j2 = (hash01(paddySeed * 2.1) - 0.5) * 4.2;
      const j3 = (hash01(paddySeed * 3.7) - 0.5) * 4.5;
      const j4 = (hash01(paddySeed * 5.3) - 0.5) * 4.2;
      const tilt = ((Math.atan2(py, px) * 180) / Math.PI) * 0.12;

      const x1 = (-14.5 + j1).toFixed(1);
      const y1 = (-9.2 + j2).toFixed(1);
      const x2 = (14.5 + j3).toFixed(1);
      const y2 = (-8.8 - j1 * 0.6).toFixed(1);
      const x3 = (14.2 - j2).toFixed(1);
      const y3 = (9.2 + j4).toFixed(1);
      const x4 = (-14.2 - j3 * 0.6).toFixed(1);
      const y4 = (8.8 - j4 * 0.5).toFixed(1);

      const isFlooded = paddySeed % 3 === 0;
      const fillTint = isFlooded
        ? 'rgba(138, 172, 134, 0.28)'
        : paddySeed % 2 === 0
        ? 'rgba(168, 184, 112, 0.26)'
        : 'rgba(214, 198, 138, 0.24)';

      paddies += `
        <g transform="translate(${(vx + px + j1).toFixed(1)}, ${(vy + py + j2).toFixed(1)}) rotate(${tilt.toFixed(1)})">
          <!-- Irregular Hand-Inked Earth Bund Perimeter (Double-Stroke Sketchy Linework) -->
          <path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z" fill="${fillTint}" stroke="#6e5d3c" stroke-width="1.05" stroke-opacity="0.65" stroke-linejoin="round" />
          <path d="M ${(+x1 + 0.8).toFixed(1)} ${(+y1 + 0.6).toFixed(1)} L ${(+x2 - 0.6).toFixed(1)} ${(+y2 + 0.8).toFixed(1)} L ${(+x3 - 0.8).toFixed(1)} ${(+y3 - 0.6).toFixed(1)} L ${(+x4 + 0.6).toFixed(1)} ${(+y4 - 0.5).toFixed(1)} Z" fill="none" stroke="#4f4128" stroke-width="0.55" stroke-opacity="0.42" />
          <!-- Hand-Inked Hachure Rice Shoot Rows -->
          <path d="M -10.5 -4.2 L 10.5 -3.8 M -10.2 0.2 L 10.2 0.5 M -10.0 4.4 L 10.0 4.6" stroke="#5c733e" stroke-width="0.8" stroke-dasharray="2.2 2.8" stroke-linecap="round" opacity="0.68" />
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
    <!-- Hand-Inked Irregular Rice Paddies Surrounding Village -->
    <g class="village-paddies">${paddies}</g>

    <!-- 1. HUMAN VILLAGE 1:1 WALLED PALISADE, STREET GRID & DRAGON CANAL (2.5D Isometric Centerpiece) -->
    <g class="footprint-human-village">
      <!-- Village Ground Clearing with Soft Hand-Inked Outer Earth Rim -->
      <ellipse cx="${vx}" cy="${vy}" rx="125" ry="85" fill="#dfd0b2" fill-opacity="0.85" stroke="#8c7353" stroke-width="2" stroke-dasharray="10 4" />

      <!-- Internal Main Street & Cross Lanes -->
      <line x1="${vx - 122}" y1="${vy}" x2="${vx + 122}" y2="${vy}" stroke="#bfa67a" stroke-width="11.5" />
      <line x1="${vx - 122}" y1="${vy}" x2="${vx + 122}" y2="${vy}" stroke="#e8d8b8" stroke-width="7.5" />
      <line x1="${vx - 64}" y1="${vy - 76}" x2="${vx - 64}" y2="${vy + 76}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${vx + 64}" y1="${vy - 76}" x2="${vx + 64}" y2="${vy + 76}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${vx - 108}" y1="${vy - 31}" x2="${vx + 108}" y2="${vy - 31}" stroke="#cbb48c" stroke-width="5" />
      <line x1="${vx - 108}" y1="${vy + 31}" x2="${vx + 108}" y2="${vy + 31}" stroke="#cbb48c" stroke-width="5" />

      <!-- Stone-Lined Dragon Canal (Canal of Willows) bisecting the Village North-to-South -->
      <path d="M ${vx + 14} ${vy - 83} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 83}" fill="none" stroke="#4a3f35" stroke-width="13" />
      <path d="M ${vx + 14} ${vy - 83} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 83}" fill="none" stroke="var(--water-fill)" stroke-width="8.5" />
      <path d="M ${vx + 14} ${vy - 83} Q ${vx + 10} ${vy} ${vx + 15} ${vy + 83}" fill="none" stroke="#d8eef7" stroke-width="2" stroke-dasharray="6 8" class="river-flow-anim" />

      <!-- Three 2.5D Arched Timber Footbridges across the Dragon Canal -->
      <g stroke="#2a180d" stroke-width="1.1">
        <rect x="${vx + 4}" y="${vy - 34}" width="18" height="7.5" rx="1.5" fill="rgba(20,12,6,0.28)" />
        <rect x="${vx + 3.5}" y="${vy - 35.5}" width="18" height="7" rx="1.5" fill="#9c673a" />
        <line x1="${vx + 4.5}" y1="${vy - 35}" x2="${vx + 20.5}" y2="${vy - 35}" stroke="#e0c294" stroke-width="0.9" />

        <rect x="${vx + 3}" y="${vy - 3.5}" width="19" height="9.5" rx="2" fill="rgba(20,12,6,0.30)" />
        <rect x="${vx + 2.5}" y="${vy - 5}" width="19" height="9" rx="2" fill="#a86f3e" />
        <line x1="${vx + 3.5}" y1="${vy - 4.2}" x2="${vx + 20.5}" y2="${vy - 4.2}" stroke="#e6ca9c" stroke-width="1.0" />

        <rect x="${vx + 5}" y="${vy + 29}" width="18" height="7.5" rx="1.5" fill="rgba(20,12,6,0.28)" />
        <rect x="${vx + 4.5}" y="${vy + 27.5}" width="18" height="7" rx="1.5" fill="#9c673a" />
        <line x1="${vx + 5.5}" y1="${vy + 28.2}" x2="${vx + 21.5}" y2="${vy + 28.2}" stroke="#e0c294" stroke-width="0.9" />
      </g>

      <!-- Market Square Central Flagstone Plaza & 2.5D Dragon Statue Pedestal -->
      <rect x="${vx - 26}" y="${vy - 16}" width="38" height="32" rx="3" fill="#ead9b7" stroke="#6b4e35" stroke-width="1.4" />
      <path d="M ${vx - 22} ${vy - 8} L ${vx + 8} ${vy - 8} M ${vx - 22} ${vy + 8} L ${vx + 8} ${vy + 8} M ${vx - 7} ${vy - 14} L ${vx - 7} ${vy + 14}" stroke="#b89f74" stroke-width="0.7" opacity="0.65" />
      <ellipse cx="${vx - 6}" cy="${vy + 2}" rx="6.5" ry="4" fill="rgba(26,15,8,0.28)" />
      <circle cx="${vx - 7}" cy="${vy}" r="5.8" fill="#9e9585" stroke="#3b3228" stroke-width="1.2" />
      <circle cx="${vx - 7}" cy="${vy - 1.2}" r="2.5" fill="#d9a74a" stroke="#3b2818" stroke-width="0.7" />

      <!-- Individual 2.5D Isometric Village Houses -->
      ${villageRoofs}

      <!-- Outer Timber Stake Palisade Wall (2.5D Upright Log Ring & Shadow) -->
      <ellipse cx="${vx + 2}" cy="${vy + 2.5}" rx="126.5" ry="86.5" fill="none" stroke="rgba(22, 12, 6, 0.28)" stroke-width="7" />
      <ellipse cx="${vx}" cy="${vy}" rx="126" ry="86" fill="none" stroke="#24150c" stroke-width="6.5" />
      <ellipse cx="${vx}" cy="${vy}" rx="126" ry="86" fill="none" stroke="#855b3b" stroke-width="4.5" stroke-dasharray="2.5 2.0" />
      <ellipse cx="${vx}" cy="${vy}" rx="122.5" ry="82.5" fill="none" stroke="#3b2314" stroke-width="1.2" />

      <!-- Four 2.5D Palisade Gate Watchtowers (North, South, West, East Yagura-mon) -->
      <!-- North Gatehouse -->
      <g transform="translate(${vx}, ${vy - 86})">
        <rect x="-13" y="-4" width="26" height="12" fill="rgba(20,12,6,0.32)" />
        <rect x="-12" y="-3" width="24" height="8" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <rect x="-4.5" y="-2" width="9" height="7" rx="2" fill="#2a180d" />
        <polygon points="-16,-2 -12,-10 12,-10 16,-2" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="-11" y1="-6" x2="11" y2="-6" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- South Gatehouse -->
      <g transform="translate(${vx}, ${vy + 86})">
        <rect x="-13" y="-4" width="26" height="12" fill="rgba(20,12,6,0.32)" />
        <rect x="-12" y="-3" width="24" height="8" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <rect x="-4.5" y="-2" width="9" height="7" rx="2" fill="#2a180d" />
        <polygon points="-16,-2 -12,-10 12,-10 16,-2" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="-11" y1="-6" x2="11" y2="-6" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- West Gatehouse -->
      <g transform="translate(${vx - 126}, ${vy})">
        <rect x="-6" y="-12" width="15" height="25" fill="rgba(20,12,6,0.32)" />
        <rect x="-6" y="-11" width="12" height="22" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <polygon points="-8,-13 0,-15 8,-13 8,13 0,15 -8,13" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- East Gatehouse -->
      <g transform="translate(${vx + 126}, ${vy})">
        <rect x="-6" y="-12" width="15" height="25" fill="rgba(20,12,6,0.32)" />
        <rect x="-6" y="-11" width="12" height="22" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <polygon points="-8,-13 0,-15 8,-13 8,13 0,15 -8,13" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
    </g>

    <!-- 2. HAKUREI SHRINE 2.5D HILLTOP COMPOUND & LONG STONE STAIRCASE -->
    <g class="footprint-hakurei-shrine" transform="translate(${hx}, ${hy})">
      <!-- Hand-Inked Swept Shrine Courtyard & Stone Retaining Wall -->
      <path d="M -52 -2 C -50 -24, -26 -36, 2 -35 C 30 -36, 52 -22, 53 0 C 51 22, 28 33, 0 33 C -28 33, -51 20, -52 -2 Z" fill="#d9cbb0" fill-opacity="0.88" stroke="#594535" stroke-width="2.2" />
      <ellipse cx="0" cy="-2" rx="45" ry="27" fill="#e8dcc2" fill-opacity="0.85" stroke="#8c735b" stroke-width="1" stroke-dasharray="6 4" />
      <!-- Long Stone Staircase descending South-Southeast toward the Village road -->
      <path d="M -8 24 L -16 98 L 12 98 L 8 24 Z" fill="#bfb5a4" stroke="#453a30" stroke-width="1.6" />
      <path d="M -9 34 L 9 34 M -10 44 L 10 44 M -11 54 L 11 54 M -12 64 L 12 64 M -13 74 L 12 74 M -14 84 L 12 84 M -15 93 L 12 93" stroke="#5e5246" stroke-width="1.3" />
      <!-- Stone Lanterns (Tōrō) flanking the stairs -->
      <circle cx="-13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="-19" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="16" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <!-- 2.5D Honden Main Hall & Living Quarters Footprints -->
      <rect x="-25" y="-18" width="38" height="22" rx="2" fill="rgba(22,12,6,0.30)" />
      <rect x="-24" y="-6" width="34" height="6" fill="#efe2c6" stroke="#26120e" stroke-width="1.1" />
      <polygon points="-28,-5 -22,-22 10,-22 14,-5" fill="#7a2820" stroke="#26120e" stroke-width="1.4" stroke-linejoin="round" />
      <line x1="-19" y1="-13.5" x2="7" y2="-13.5" stroke="#d9a74a" stroke-width="1.3" />
      <rect x="14" y="-12" width="22" height="14" rx="1.5" fill="#6b4c35" stroke="#26120e" stroke-width="1.3" />
    </g>

    <!-- 3. SCARLET DEVIL MANSION 2.5D GOTHIC ESTATE, WROUGHT-IRON GATES & ROSE GARDENS -->
    <g class="footprint-sdm" transform="translate(${sx}, ${sy})">
      <!-- Peninsula Stone Terrace & Wrought-Iron Wall -->
      <path d="M -84 -50 L 76 -50 L 80 0 L 76 50 L -84 50 L -88 0 Z" fill="rgba(128, 36, 44, 0.20)" stroke="#3d1217" stroke-width="2.2" stroke-linejoin="round" />
      <rect x="-80" y="-46" width="152" height="92" rx="4" fill="none" stroke="#9e2a33" stroke-width="1.1" stroke-dasharray="6 3" />
      <!-- Parterre Rose Hedge Labyrinths -->
      <rect x="-70" y="-36" width="42" height="30" rx="3" fill="rgba(46, 82, 52, 0.35)" stroke="#294a2e" stroke-width="1.8" />
      <rect x="-62" y="-28" width="26" height="14" fill="none" stroke="#b6342a" stroke-width="1.3" stroke-dasharray="4 3" />
      <rect x="-70" y="6" width="42" height="30" rx="3" fill="rgba(46, 82, 52, 0.35)" stroke="#294a2e" stroke-width="1.8" />
      <rect x="-62" y="14" width="26" height="14" fill="none" stroke="#b6342a" stroke-width="1.3" stroke-dasharray="4 3" />
      <!-- 2.5D Grand Crimson Manor Wings & Central Clock Tower Base -->
      <path d="M -18 -35 L 56 -35 L 56 41 L -18 41 Z" fill="rgba(20, 8, 10, 0.34)" />
      <path d="M -20 -38 L 54 -38 L 54 38 L -20 38 L -20 16 L 10 16 L 10 -16 L -20 -16 Z" fill="#6e1820" stroke="#21080a" stroke-width="1.8" stroke-linejoin="round" />
      <circle cx="22" cy="0" r="15" fill="#94222b" stroke="#f0d080" stroke-width="1.6" />
    </g>

    <!-- 4. MYOUREN TEMPLE 2.5D MONASTERY, PAGODA & ORGANIC STONE COURTYARD (Fixes stark rectangular box) -->
    <g class="footprint-myouren" transform="translate(${mx}, ${my})">
      <!-- Soft Feathered Earth & Moss Clearing Transition -->
      <ellipse cx="-4" cy="0" rx="64" ry="42" fill="rgba(186, 174, 146, 0.28)" />
      <!-- Organic Hand-Inked Flagstone Courtyard Perimeter (Stepped Stone Polygon instead of stark rect) -->
      <path d="M -46 -26 L -18 -31 L 24 -30 L 44 -22 L 47 18 L 36 29 L -8 32 L -44 26 L -50 2 Z" fill="rgba(222, 210, 184, 0.62)" stroke="#4a3e33" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M -42 -22 L 22 -26 L 41 -18 L 42 15 L 32 25 L -40 22 Z" fill="none" stroke="#7a6855" stroke-width="0.9" stroke-dasharray="5 4" />
      <!-- Flagstone Approach Walk & Southern Sanmon Gatehouse -->
      <path d="M -6 10 L -6 34 L 6 34 L 6 10 Z" fill="#c7bba4" stroke="#54473b" stroke-width="1.0" />
      <rect x="-12" y="26" width="24" height="7" rx="1.5" fill="#5c3d28" stroke="#24160d" stroke-width="1.2" />
      <!-- 2.5D Hondo Main Temple Hall (Cast Shadow + White Plaster Wall + Curved Irimoya Slate Roof) -->
      <rect x="-27" y="-17" width="46" height="27" rx="2" fill="rgba(20, 14, 10, 0.34)" />
      <rect x="-26" y="1" width="42" height="6.5" fill="#efe4ce" stroke="#1e2226" stroke-width="1.1" />
      <polygon points="-30,2 -24,-21 16,-21 20,2" fill="#464d54" stroke="#1e2226" stroke-width="1.5" stroke-linejoin="round" />
      <polygon points="-25,-3 -20,-17 12,-17 15,-3" fill="#576069" stroke="#1e2226" stroke-width="0.9" stroke-linejoin="round" />
      <line x1="-16" y1="-10" x2="8" y2="-10" stroke="#d9a74a" stroke-width="1.4" stroke-linecap="round" />
      <!-- 2.5D Three-Story Wooden Pagoda (Gojū-no-tō) on Eastern Courtyard -->
      <rect x="23" y="-15" width="16" height="17" rx="1.5" fill="rgba(20, 14, 10, 0.34)" />
      <rect x="23" y="-5" width="14" height="5" fill="#dfd0b4" stroke="#24170f" stroke-width="1.0" />
      <polygon points="20,-4 24,-17 36,-17 40,-4" fill="#5e4332" stroke="#1e2226" stroke-width="1.3" stroke-linejoin="round" />
      <polygon points="22,-8 25,-19 35,-19 38,-8" fill="#464d54" stroke="#1e2226" stroke-width="1.1" stroke-linejoin="round" />
      <circle cx="30" cy="-13" r="2.2" fill="#d9a74a" stroke="#1e2226" stroke-width="0.8" />
      <!-- Western Cemetery Gravestones, Jizō Statues & Wooden Sotoba Stupas -->
      <g transform="translate(-66, -6)" fill="#968f84" stroke="#36312b" stroke-width="1">
        <ellipse cx="-2" cy="0" rx="20" ry="18" fill="rgba(140, 134, 122, 0.22)" stroke="none" />
        <rect x="-14" y="-12" width="5" height="9.5" rx="1.5" />
        <rect x="-4" y="-14" width="5" height="11.5" rx="1.5" />
        <rect x="6" y="-11" width="5" height="9" rx="1.5" />
        <rect x="-12" y="3" width="5" height="9.5" rx="1.5" />
        <rect x="-1" y="2" width="5" height="10.5" rx="1.5" />
        <rect x="8" y="4" width="5" height="8.5" rx="1.5" />
      </g>
    </g>

    <!-- 5. EIENTEI 2.5D HIDDEN BAMBOO PALACE COMPOUND -->
    <g class="footprint-eientei" transform="translate(${ex}, ${ey})">
      <ellipse cx="0" cy="0" rx="58" ry="42" fill="rgba(228, 218, 192, 0.68)" stroke="#2e4f2b" stroke-width="3.2" />
      <ellipse cx="0" cy="0" rx="58" ry="42" fill="none" stroke="#68945e" stroke-width="2" stroke-dasharray="3 2.5" />
      <!-- Outer Covered Corridor Veranda (Engawa) -->
      <rect x="-38" y="-24" width="76" height="48" rx="2" fill="none" stroke="#4f3826" stroke-width="4.5" />
      <!-- 2.5D Central Palace Pavilion -->
      <rect x="-19" y="-11" width="42" height="29" rx="2" fill="rgba(20, 12, 6, 0.32)" />
      <rect x="-19" y="8" width="38" height="5.5" fill="#efe2c6" stroke="#24170e" stroke-width="1.0" />
      <polygon points="-23,9 -17,-15 17,-15 23,9" fill="#3b4f37" stroke="#1b2919" stroke-width="1.5" stroke-linejoin="round" />
      <line x1="-12" y1="-3" x2="12" y2="-3" stroke="#d9b44a" stroke-width="1.4" stroke-linecap="round" />
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
      <rect x="${uwX + 12}" y="${uwY + 14}" width="398" height="24" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.5" />
      <text x="${uwX + 211}" y="${uwY + 30}" text-anchor="middle" font-family="var(--font-display)" font-size="12.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.4">UNDERWORLD &amp; FORMER HELL (地底・旧地獄)</text>

      <!-- 6B. MAKAI DEMON REALM CARTOUCHE -->
      <rect x="${0.032 * MAP_WIDTH}" y="${0.482 * MAP_HEIGHT}" width="${0.138 * MAP_WIDTH}" height="${0.178 * MAP_HEIGHT}" rx="6" fill="rgba(72, 48, 92, 0.18)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${0.032 * MAP_WIDTH}" y="${0.482 * MAP_HEIGHT}" width="${0.138 * MAP_WIDTH}" height="${0.178 * MAP_HEIGHT}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <rect x="${0.038 * MAP_WIDTH}" y="${0.490 * MAP_HEIGHT}" width="168" height="22" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.4" />
      <text x="${0.038 * MAP_WIDTH + 84}" y="${0.490 * MAP_HEIGHT + 15}" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.3">MAKAI (魔界)</text>

      <!-- 6C. THE MOON & DREAM WORLD CELESTIAL CARTOUCHE (Armixi Lunar Sphere Homage) -->
      <rect x="${0.822 * MAP_WIDTH}" y="${0.026 * MAP_HEIGHT}" width="${0.152 * MAP_WIDTH}" height="${0.252 * MAP_HEIGHT}" rx="6" fill="rgba(186, 198, 218, 0.22)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${0.822 * MAP_WIDTH}" y="${0.026 * MAP_HEIGHT}" width="${0.152 * MAP_WIDTH}" height="${0.252 * MAP_HEIGHT}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <!-- Lunar Sphere Ring around the Lunar Capital -->
      <circle cx="${0.902 * MAP_WIDTH}" cy="${0.112 * MAP_HEIGHT}" r="58" fill="rgba(242, 238, 225, 0.55)" stroke="var(--border-ink)" stroke-width="2.2" />
      <circle cx="${0.902 * MAP_WIDTH}" cy="${0.112 * MAP_HEIGHT}" r="52" fill="none" stroke="var(--border-gold)" stroke-width="1.2" stroke-dasharray="5 3" />
      <rect x="${0.828 * MAP_WIDTH}" y="${0.034 * MAP_HEIGHT}" width="268" height="22" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.4" />
      <text x="${0.828 * MAP_WIDTH + 134}" y="${0.034 * MAP_HEIGHT + 15}" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.3">THE MOON &amp; DREAM (月の都)</text>
    </g>
  `;
}
