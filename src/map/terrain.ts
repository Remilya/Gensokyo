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

export function renderTerrainLayer(terrainGroup: SVGGElement, data: TerrainData) {
  let html = '';

  // 1. Biome Watercolor Washes (Zero-filter multi-layered soft stroke edge for 60fps zoom/pan)
  for (const reg of data.regions) {
    const d = smoothClosedPath(reg.points);
    const fill = BIOME_FILL[reg.biome] ?? 'var(--biome-foothills)';
    html += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="24" stroke-opacity="0.22" stroke-linejoin="round" stroke-linecap="round" />`;
    html += `<path d="${d}" fill="${fill}" fill-opacity="0.60" stroke="${fill}" stroke-width="10" stroke-opacity="0.36" stroke-linejoin="round" data-biome="${reg.id}" />`;
    html += `<path d="${d}" fill="none" stroke="var(--ink-secondary)" stroke-width="1.2" stroke-dasharray="6 5" stroke-opacity="0.38" />`;
  }

  // 2. Topographic Elevation Contours on Youkai Mountain & Hakurei Ridge
  const contourCenters = [
    { cx: 0.665, cy: 0.145, rx: 0.14, ry: 0.085, rings: 5 },
    { cx: 0.255, cy: 0.320, rx: 0.08, ry: 0.055, rings: 3 },
  ];
  for (const c of contourCenters) {
    for (let r = 1; r <= c.rings; r++) {
      const k = r / c.rings;
      const rx = (c.rx * k * MAP_WIDTH).toFixed(1);
      const ry = (c.ry * k * MAP_HEIGHT).toFixed(1);
      const cx = (c.cx * MAP_WIDTH).toFixed(1);
      const cy = (c.cy * MAP_HEIGHT).toFixed(1);
      html += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--ink-secondary)" stroke-width="1" stroke-opacity="${(0.32 - k * 0.14).toFixed(2)}" stroke-dasharray="8 4" />`;
    }
  }

  // 3. Hand-Drawn Ink Mountain Ridges & Peaks (Storybook Woodblock Style)
  const mountainPeaks: [number, number, number][] = [
    // Northern & Youkai Mountain skyline
    [0.44, 0.12, 1.0], [0.48, 0.10, 1.2], [0.52, 0.11, 1.15], [0.56, 0.09, 1.35],
    [0.60, 0.08, 1.5], [0.64, 0.07, 1.65], [0.68, 0.08, 1.6], [0.72, 0.09, 1.45],
    [0.76, 0.11, 1.3], [0.80, 0.13, 1.15],
    // Mid-slope Youkai Mountain crags
    [0.54, 0.18, 1.1], [0.58, 0.17, 1.25], [0.62, 0.19, 1.2], [0.67, 0.18, 1.35],
    [0.71, 0.17, 1.25], [0.75, 0.19, 1.15], [0.79, 0.21, 1.0],
    // Western Hakurei Border Ridge
    [0.18, 0.26, 1.1], [0.22, 0.24, 1.25], [0.26, 0.25, 1.15], [0.31, 0.27, 1.0],
    [0.17, 0.34, 0.95], [0.21, 0.36, 0.9],
    // Eastern / Mayohiga Border Crags
    [0.88, 0.31, 1.05], [0.92, 0.33, 1.15], [0.94, 0.38, 0.95],
  ];

  html += `<g class="mountain-hachures" opacity="0.78">`;
  for (const [px, py, scale] of mountainPeaks) {
    const x = px * MAP_WIDTH;
    const y = py * MAP_HEIGHT;
    const w = 44 * scale;
    const h = 28 * scale;
    html += `
      <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)})">
        <path d="M ${-w} ${h * 0.4} L 0 ${-h * 0.6} L ${w} ${h * 0.4} Z" fill="var(--biome-mountain)" fill-opacity="0.55" />
        <path d="M 0 ${-h * 0.6} L ${w} ${h * 0.4} L ${w * 0.18} ${h * 0.4} Z" fill="var(--ink-primary)" fill-opacity="0.16" />
        <path d="M ${-w} ${h * 0.4} L ${-w * 0.45} ${-h * 0.08} L 0 ${-h * 0.6} L ${w * 0.48} ${-h * 0.05} L ${w} ${h * 0.4}" fill="none" stroke="var(--ink-primary)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 0 ${-h * 0.6} L ${w * 0.12} ${h * 0.22} M ${w * 0.22} ${-h * 0.28} L ${w * 0.35} ${h * 0.25}" stroke="var(--ink-secondary)" stroke-width="1" stroke-opacity="0.65" />
      </g>
    `;
  }
  html += `</g>`;

  // 4. Hand-Placed Flora & Biome Details (Trees, Bamboo Stalks, Mushrooms, Sunflowers, Higanbana)
  html += `<g class="flora-details" opacity="0.76">`;

  // Bamboo Forest stalks (x: 0.70..0.92, y: 0.35..0.51)
  for (let i = 0; i < 42; i++) {
    const bx = (0.705 + ((i * 37) % 100) * 0.0021) * MAP_WIDTH;
    const by = (0.355 + ((i * 53) % 100) * 0.0015) * MAP_HEIGHT;
    html += `
      <g transform="translate(${bx.toFixed(1)}, ${by.toFixed(1)})">
        <line x1="0" y1="10" x2="0" y2="-12" stroke="#2c5e3b" stroke-width="2" />
        <line x1="5" y1="11" x2="6" y2="-10" stroke="#387349" stroke-width="1.7" />
        <path d="M 0 -8 Q -6 -11 -9 -7 M 0 -3 Q 6 -6 9 -2 M 6 -6 Q 11 -9 13 -5" fill="none" stroke="#2c5e3b" stroke-width="1.3" />
      </g>
    `;
  }

  // Forest of Magic trees & luminescent mushrooms (x: 0.48..0.67, y: 0.59..0.73)
  for (let i = 0; i < 36; i++) {
    const fx = (0.485 + ((i * 41) % 100) * 0.0018) * MAP_WIDTH;
    const fy = (0.590 + ((i * 67) % 100) * 0.0014) * MAP_HEIGHT;
    const isMushroom = i % 4 === 0;
    if (isMushroom) {
      html += `
        <g transform="translate(${fx.toFixed(1)}, ${fy.toFixed(1)})">
          <path d="M -2 5 L -1 0 L 1 0 L 2 5 Z" fill="#e6dcc5" />
          <path d="M -6 1 Q 0 -7 6 1 Z" fill="#8b4899" stroke="var(--ink-primary)" stroke-width="0.9" />
          <circle cx="-2" cy="-2" r="1" fill="#f7e396" />
          <circle cx="2" cy="-1.5" r="0.9" fill="#f7e396" />
        </g>
      `;
    } else {
      html += `
        <g transform="translate(${fx.toFixed(1)}, ${fy.toFixed(1)})">
          <path d="M 0 -11 L -7 2 L -3 2 L -8 9 L 8 9 L 3 2 L 7 2 Z" fill="#3a5c45" stroke="var(--ink-primary)" stroke-width="0.9" />
        </g>
      `;
    }
  }

  // Great Youkai Forest & Tanuki Forest pines/autumn maples
  for (let i = 0; i < 32; i++) {
    const tx = (0.31 + ((i * 29) % 100) * 0.0014) * MAP_WIDTH;
    const ty = (0.52 + ((i * 61) % 100) * 0.0012) * MAP_HEIGHT;
    const autumn = i % 3 === 0 ? '#b85d35' : '#58784c';
    html += `
      <g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)})">
        <circle cx="0" cy="-3" r="6.5" fill="${autumn}" stroke="var(--ink-primary)" stroke-width="0.8" />
        <line x1="0" y1="3" x2="0" y2="8" stroke="var(--ink-primary)" stroke-width="1.4" />
      </g>
    `;
  }

  // Garden of the Sun sunflowers (x: 0.75..0.90, y: 0.55..0.64)
  for (let i = 0; i < 22; i++) {
    const sx = (0.75 + ((i * 43) % 100) * 0.0015) * MAP_WIDTH;
    const sy = (0.55 + ((i * 59) % 100) * 0.0009) * MAP_HEIGHT;
    html += `
      <g transform="translate(${sx.toFixed(1)}, ${sy.toFixed(1)})">
        <circle cx="0" cy="0" r="4.5" fill="#e6b422" stroke="#8c5a14" stroke-width="0.8" />
        <circle cx="0" cy="0" r="2" fill="#4f3111" />
      </g>
    `;
  }

  // Muenzuka & Higan red spider lilies (higanbana)
  for (let i = 0; i < 20; i++) {
    const hx = (0.14 + ((i * 31) % 100) * 0.0013) * MAP_WIDTH;
    const hy = (0.39 + ((i * 47) % 100) * 0.0009) * MAP_HEIGHT;
    html += `
      <g transform="translate(${hx.toFixed(1)}, ${hy.toFixed(1)})">
        <circle cx="0" cy="0" r="3.2" fill="#c92a2a" />
        <path d="M -4 -2 L 4 2 M -4 2 L 4 -2 M 0 -4.5 L 0 4.5" stroke="#a61e1e" stroke-width="0.9" />
      </g>
    `;
  }

  html += `</g>`;
  terrainGroup.innerHTML = html;
}

/**
 * Renders the 1:1 Architectural Building Footprints & Street Grid layer
 * (Human Village palisade & blocks, Hakurei Shrine compound, SDM wings, Myouren Temple, Eientei, etc.)
 */
export function renderFootprintsLayer(footprintsGroup: SVGGElement) {
  const vx = 0.480 * MAP_WIDTH;
  const vy = 0.460 * MAP_HEIGHT;

  // Generate Human Village 1:1 timber rooftops inside the palisade
  let villageRoofs = '';
  const blockRows = [-52, -32, -12, 12, 32, 50];
  const blockCols = [-95, -68, -42, -18, 18, 44, 70, 94];
  for (const r of blockRows) {
    for (const c of blockCols) {
      if (Math.hypot(c * 0.82, r * 1.15) > 96) continue;
      if (Math.abs(c) < 12 && Math.abs(r) < 14) continue; // Market Square open center
      const bw = 16 + ((Math.abs(r + c) % 3) * 4);
      const bh = 11 + ((Math.abs(r * c) % 2) * 3);
      const shade = (r + c) % 2 === 0 ? '#6e523d' : '#594230';
      villageRoofs += `
        <g transform="translate(${(vx + c).toFixed(1)}, ${(vy + r).toFixed(1)})">
          <rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" rx="1.5" fill="${shade}" stroke="#2a1d15" stroke-width="1" />
          <line x1="${-bw / 2 + 2}" y1="0" x2="${bw / 2 - 2}" y2="0" stroke="#cbb595" stroke-width="0.7" stroke-opacity="0.7" />
        </g>
      `;
    }
  }

  // Rice paddy grid lines around Human Village
  let paddies = '';
  for (let px = -190; px <= 210; px += 38) {
    for (let py = -110; py <= 110; py += 28) {
      if (Math.hypot(px * 0.85, py * 1.15) < 128) continue;
      paddies += `<rect x="${(vx + px).toFixed(1)}" y="${(vy + py).toFixed(1)}" width="32" height="22" rx="2" fill="none" stroke="#8c7d56" stroke-width="0.8" stroke-opacity="0.45" />`;
    }
  }

  // Hakurei Shrine 1:1 compound coordinates
  const hx = 0.255 * MAP_WIDTH;
  const hy = 0.320 * MAP_HEIGHT;

  // Scarlet Devil Mansion 1:1 compound coordinates
  const sx = 0.825 * MAP_WIDTH;
  const sy = 0.745 * MAP_HEIGHT;

  // Myouren Temple 1:1 compound coordinates
  const mx = 0.382 * MAP_WIDTH;
  const my = 0.585 * MAP_HEIGHT;

  // Eientei 1:1 compound coordinates
  const ex = 0.855 * MAP_WIDTH;
  const ey = 0.470 * MAP_HEIGHT;

  footprintsGroup.innerHTML = `
    <!-- Rice Paddies Surrounding Village -->
    <g class="village-paddies">${paddies}</g>

    <!-- 1. HUMAN VILLAGE 1:1 WALLED PALISADE & STREET GRID -->
    <g class="footprint-human-village">
      <!-- Outer Timber Palisade Ring -->
      <ellipse cx="${vx}" cy="${vy}" rx="122" ry="82" fill="rgba(218, 201, 166, 0.55)" stroke="#4a3221" stroke-width="4.5" stroke-dasharray="10 2.5" />
      <ellipse cx="${vx}" cy="${vy}" rx="125" ry="85" fill="none" stroke="#2a1d15" stroke-width="1.2" />

      <!-- Internal Main Street & Cross Lanes -->
      <line x1="${vx - 120}" y1="${vy}" x2="${vx + 120}" y2="${vy}" stroke="#c8b28a" stroke-width="9" />
      <line x1="${vx}" y1="${vy - 80}" x2="${vx}" y2="${vy + 80}" stroke="#c8b28a" stroke-width="8" />
      <line x1="${vx - 55}" y1="${vy - 72}" x2="${vx - 55}" y2="${vy + 72}" stroke="#c8b28a" stroke-width="4.5" />
      <line x1="${vx + 55}" y1="${vy - 72}" x2="${vx + 55}" y2="${vy + 72}" stroke="#c8b28a" stroke-width="4.5" />
      <line x1="${vx - 105}" y1="${vy - 36}" x2="${vx + 105}" y2="${vy - 36}" stroke="#c8b28a" stroke-width="4" />
      <line x1="${vx - 105}" y1="${vy + 36}" x2="${vx + 105}" y2="${vy + 36}" stroke="#c8b28a" stroke-width="4" />

      <!-- Market Square Central Plaza -->
      <rect x="${vx - 22}" y="${vy - 12}" width="44" height="34" rx="3" fill="#e5d2ad" stroke="#6b4e35" stroke-width="1.4" />

      <!-- Individual 1:1 Building Rooftops -->
      ${villageRoofs}

      <!-- Four Palisade Gate Watchtowers (North, South, West, East) -->
      <rect x="${vx - 11}" y="${vy - 88}" width="22" height="12" fill="#5c3a24" stroke="#24150c" stroke-width="1.5" />
      <rect x="${vx - 11}" y="${vy + 76}" width="22" height="12" fill="#5c3a24" stroke="#24150c" stroke-width="1.5" />
      <rect x="${vx - 128}" y="${vy - 10}" width="12" height="20" fill="#5c3a24" stroke="#24150c" stroke-width="1.5" />
      <rect x="${vx + 116}" y="${vy - 10}" width="12" height="20" fill="#5c3a24" stroke="#24150c" stroke-width="1.5" />
    </g>

    <!-- 2. HAKUREI SHRINE 1:1 HILLTOP COMPOUND & STONE STEPS -->
    <g class="footprint-hakurei-shrine" transform="translate(${hx}, ${hy})">
      <!-- Stone Staircase descending ESE -->
      <path d="M 18 14 L 82 58 L 90 48 L 26 4 Z" fill="#b8afa0" stroke="#4a3e35" stroke-width="1.2" />
      <path d="M 28 18 L 34 10 M 40 27 L 46 19 M 52 36 L 58 28 M 64 45 L 70 37 M 76 54 L 82 46" stroke="#5c5046" stroke-width="1.2" />
      <!-- Swept Shrine Courtyard -->
      <ellipse cx="0" cy="0" rx="46" ry="30" fill="#dfd2b5" stroke="#6b5340" stroke-width="1.5" />
      <!-- Honden Main Hall & Living Quarters -->
      <rect x="-24" y="-16" width="32" height="20" rx="2" fill="#7a2c24" stroke="#2a1812" stroke-width="1.4" />
      <rect x="12" y="-12" width="20" height="15" rx="1.5" fill="#6b4e38" stroke="#2a1812" stroke-width="1.2" />
      <!-- Crimson Torii at top of stairs -->
      <path d="M 16 14 L 24 4 M 12 9 L 28 -1" stroke="#b6342a" stroke-width="2.5" stroke-linecap="round" />
    </g>

    <!-- 3. SCARLET DEVIL MANSION 1:1 GOTHIC ESTATE & ROSE GARDENS -->
    <g class="footprint-sdm" transform="translate(${sx}, ${sy})">
      <!-- Outer Walled Grounds & Rose Hedge Maze -->
      <rect x="-78" y="-48" width="148" height="96" rx="4" fill="rgba(143, 45, 52, 0.18)" stroke="#6e1d24" stroke-width="2" />
      <rect x="-66" y="-36" width="40" height="30" fill="none" stroke="#3a5e3c" stroke-width="2" stroke-dasharray="8 4" />
      <rect x="-66" y="6" width="40" height="30" fill="none" stroke="#3a5e3c" stroke-width="2" stroke-dasharray="8 4" />
      <!-- Main Crimson Manor Wings & Clock Tower -->
      <path d="M -20 -34 L 46 -34 L 46 34 L -20 34 L -20 14 L 8 14 L 8 -14 L -20 -14 Z" fill="#7d2027" stroke="#260d10" stroke-width="1.6" />
      <circle cx="18" cy="0" r="13" fill="#9e2a33" stroke="#f0d080" stroke-width="1.5" />
    </g>

    <!-- 4. MYOUREN TEMPLE 1:1 MONASTERY & CEMETERY -->
    <g class="footprint-myouren" transform="translate(${mx}, ${my})">
      <rect x="-46" y="-28" width="84" height="54" rx="3" fill="rgba(215, 202, 176, 0.55)" stroke="#4f4339" stroke-width="1.5" />
      <!-- Main Temple Hall -->
      <rect x="-24" y="-16" width="42" height="26" rx="2" fill="#4f565e" stroke="#22252a" stroke-width="1.5" />
      <!-- Cemetery Gravestones to the West -->
      <g transform="translate(-62, -8)" fill="#8c857b" stroke="#3b3630" stroke-width="0.9">
        <rect x="-12" y="-10" width="5" height="9" />
        <rect x="-3" y="-12" width="5" height="11" />
        <rect x="6" y="-9" width="5" height="8" />
        <rect x="-10" y="4" width="5" height="9" />
        <rect x="1" y="3" width="5" height="10" />
      </g>
    </g>

    <!-- 5. EIENTEI 1:1 BAMBOO PALACE COMPOUND -->
    <g class="footprint-eientei" transform="translate(${ex}, ${ey})">
      <ellipse cx="0" cy="0" rx="54" ry="38" fill="rgba(224, 214, 188, 0.55)" stroke="#3e5c38" stroke-width="2.5" stroke-dasharray="6 3" />
      <rect x="-34" y="-22" width="68" height="44" fill="none" stroke="#543d2b" stroke-width="4" />
      <rect x="-16" y="-12" width="32" height="24" fill="#5e4633" stroke="#291c12" stroke-width="1.4" />
    </g>

    <!-- 6. REALM CARTOUCHE DIVIDERS (Armixi Atlas Style Key-Fret Frames) -->
    <g class="realm-cartouche-frames" opacity="0.82">
      <!-- Underworld / Old Hell Subterranean Frame -->
      <rect x="${0.032 * MAP_WIDTH}" y="${0.682 * MAP_HEIGHT}" width="${0.268 * MAP_WIDTH}" height="${0.285 * MAP_HEIGHT}" rx="8" fill="none" stroke="var(--border-ink)" stroke-width="2.5" stroke-dasharray="12 4" />
      <text x="${0.042 * MAP_WIDTH}" y="${0.704 * MAP_HEIGHT}" font-family="var(--font-display)" font-size="15" fill="var(--ink-secondary)" letter-spacing="2">UNDERWORLD &amp; FORMER HELL (地底・旧地獄)</text>

      <!-- Makai Demon Realm Frame -->
      <rect x="${0.032 * MAP_WIDTH}" y="${0.482 * MAP_HEIGHT}" width="${0.135 * MAP_WIDTH}" height="${0.175 * MAP_HEIGHT}" rx="8" fill="none" stroke="var(--border-ink)" stroke-width="2" stroke-dasharray="8 4" />
      <text x="${0.042 * MAP_WIDTH}" y="${0.502 * MAP_HEIGHT}" font-family="var(--font-display)" font-size="13" fill="var(--ink-secondary)" letter-spacing="1.5">MAKAI (魔界)</text>

      <!-- Lunar Capital & Dream World Frame -->
      <rect x="${0.825 * MAP_WIDTH}" y="${0.028 * MAP_HEIGHT}" width="${0.148 * MAP_WIDTH}" height="${0.248 * MAP_HEIGHT}" rx="8" fill="none" stroke="var(--border-ink)" stroke-width="2" stroke-dasharray="8 4" />
      <text x="${0.835 * MAP_WIDTH}" y="${0.048 * MAP_HEIGHT}" font-family="var(--font-display)" font-size="13" fill="var(--ink-secondary)" letter-spacing="1.5">THE MOON &amp; DREAM (月の都)</text>
    </g>
  `;
}
