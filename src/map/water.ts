import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { TerrainData } from '../types';

function smoothClosedPolygon(pts: [number, number][]): string {
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
    if (i === 0) d += `M ${mx1.toFixed(1)} ${my1.toFixed(1)} `;
    d += `Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${mx2.toFixed(1)} ${my2.toFixed(1)} `;
  }
  return d + 'Z';
}

function smoothOpenPolyline(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  const scaled = pts.map(([x, y]) => [x * MAP_WIDTH, y * MAP_HEIGHT] as [number, number]);
  let d = `M ${scaled[0][0].toFixed(1)} ${scaled[0][1].toFixed(1)} `;
  for (let i = 1; i < scaled.length - 1; i++) {
    const p1 = scaled[i];
    const p2 = scaled[i + 1];
    const mx = (p1[0] + p2[0]) / 2;
    const my = (p1[1] + p2[1]) / 2;
    d += `Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
  }
  const last = scaled[scaled.length - 1];
  d += `L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return d;
}

export function renderWaterLayer(waterGroup: SVGGElement, data: TerrainData) {
  let html = '';

  // 1. Rivers & Canals with Stone/Sand Embankments & Deep Channel Currents
  for (const riv of data.rivers) {
    const d = smoothOpenPolyline(riv.points);
    const isSanzu = riv.id.includes('sanzu');
    const outerBank = isSanzu ? '#2b1e26' : '#4a3d2e';
    const sandBank = isSanzu ? '#6b5b66' : '#c9b894';
    const fillColor = isSanzu ? '#3c5d75' : 'var(--water-fill)';
    const deepColor = isSanzu ? '#263f52' : 'var(--water-deep)';
    html += `
      <g class="river-group" data-river="${riv.id}">
        <path d="${d}" fill="none" stroke="${outerBank}" stroke-width="${riv.width + 6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.62" />
        <path d="${d}" fill="none" stroke="${sandBank}" stroke-width="${riv.width + 3.2}" stroke-linecap="round" stroke-linejoin="round" opacity="0.78" />
        <path d="${d}" fill="none" stroke="${fillColor}" stroke-width="${riv.width}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${d}" fill="none" stroke="${deepColor}" stroke-width="${(riv.width * 0.52).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />
        <path d="${d}" fill="none" stroke="#e2f3fa" stroke-width="${Math.max(1.3, riv.width * 0.25).toFixed(1)}" stroke-dasharray="10 14" stroke-linecap="round" opacity="0.75" class="river-flow-anim" />
      </g>
    `;
  }

  // 2. Waterfall of Nine Heavens Cascade & Genbu Ravine Boulders
  const wfX = 0.655 * MAP_WIDTH;
  const wfY = 0.145 * MAP_HEIGHT;
  html += `
    <g class="waterfall-nine-heavens" transform="translate(${wfX.toFixed(1)}, ${wfY.toFixed(1)})">
      <!-- Cliff Escarpment Rocks flanking the Waterfall -->
      <polygon points="-22,-14 -8,-18 -4,16 -24,12" fill="#6b6154" stroke="var(--ink-primary)" stroke-width="1.3" />
      <polygon points="8,-18 22,-14 24,12 4,16" fill="#595045" stroke="var(--ink-primary)" stroke-width="1.3" />
      <!-- Cascading Whitewater Chute -->
      <path d="M -7 -16 L 7 -16 L 11 18 L -11 18 Z" fill="#8dc4db" stroke="#345b70" stroke-width="1.1" />
      <path d="M -5 -15 L -7 16 M 0 -16 L 0 17 M 5 -15 L 7 16" stroke="#f2fbff" stroke-width="2.0" stroke-dasharray="5 3" class="river-flow-anim" />
      <!-- Plunge Pool Foam at Base -->
      <ellipse cx="0" cy="19" rx="15" ry="5.5" fill="#e6f7fc" stroke="#78a3b8" stroke-width="1.2" opacity="0.9" />
    </g>
  `;

  // 3. Lakes & Ponds with Multi-Ring Shoreline Contours & Sand/Stone Rim
  for (const lake of data.lakes) {
    const d = smoothClosedPolygon(lake.points);
    const isBlood = lake.kind === 'blood';
    const outerRim = isBlood ? '#3b0c10' : '#4a3d2e';
    const sandShore = isBlood ? '#6e1d24' : '#d2c29d';
    const fill = isBlood ? '#8f242c' : 'var(--water-fill)';
    const stroke = isBlood ? '#4d1015' : 'var(--water-stroke)';
    const ripple = isBlood ? '#e07b82' : '#d2ebf7';

    // Compute approximate centroid for concentric inner shoreline scaling
    const cx =
      (lake.points.reduce((acc, p) => acc + p[0], 0) / lake.points.length) * MAP_WIDTH;
    const cy =
      (lake.points.reduce((acc, p) => acc + p[1], 0) / lake.points.length) * MAP_HEIGHT;

    html += `
      <g class="lake-group" data-lake="${lake.id}">
        <path d="${d}" fill="none" stroke="${outerRim}" stroke-width="6.5" stroke-linejoin="round" opacity="0.55" />
        <path d="${d}" fill="none" stroke="${sandShore}" stroke-width="3.8" stroke-linejoin="round" opacity="0.82" />
        <path d="${d}" fill="${fill}" fill-opacity="0.92" stroke="${stroke}" stroke-width="2.0" />
        <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(0.92) translate(${(-cx).toFixed(1)}, ${(-cy).toFixed(1)})">
          <path d="${d}" fill="var(--water-deep)" fill-opacity="0.32" stroke="${ripple}" stroke-width="1.3" stroke-dasharray="10 6" opacity="0.72" />
        </g>
        <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(0.80) translate(${(-cx).toFixed(1)}, ${(-cy).toFixed(1)})">
          <path d="${d}" fill="var(--water-deep)" fill-opacity="0.28" stroke="${ripple}" stroke-width="1.0" stroke-dasharray="6 8" opacity="0.52" />
        </g>
      </g>
    `;
  }

  // 4. Misty Lake Southern Rocky Crags (Cirno's Shore from image4.png) & Lakeside Reeds
  const cragX = 0.655 * MAP_WIDTH;
  const cragY = 0.878 * MAP_HEIGHT;
  html += `
    <g class="misty-lake-shore-rocks" transform="translate(${cragX.toFixed(1)}, ${cragY.toFixed(1)})">
      <polygon points="-28,6 -18,-8 -6,4" fill="#7a7062" stroke="var(--ink-primary)" stroke-width="1.2" />
      <polygon points="-10,8 0,-12 12,6" fill="#8c8273" stroke="var(--ink-primary)" stroke-width="1.2" />
      <polygon points="8,7 18,-6 28,5" fill="#6b6255" stroke="var(--ink-primary)" stroke-width="1.2" />
      <circle cx="-18" cy="-12" r="2.2" fill="#a8e6ff" stroke="#24526b" stroke-width="0.8" />
    </g>
  `;

  // 5. Wave Crest Lines & Sanzu Ferryboat Silhouette (Woodblock Style)
  const waveSpots: [number, number][] = [
    [0.64, 0.77], [0.70, 0.76], [0.74, 0.78], [0.66, 0.82], [0.72, 0.83],
    [0.688, 0.112], [0.298, 0.125], [0.305, 0.168], [0.275, 0.218],
  ];
  html += `<g class="water-waves" stroke="#e4f4fc" stroke-width="1.3" fill="none" opacity="0.75">`;
  for (const [wx, wy] of waveSpots) {
    const x = wx * MAP_WIDTH;
    const y = wy * MAP_HEIGHT;
    html += `<path d="M ${x - 14} ${y} Q ${x - 7} ${y - 4.5} ${x} ${y} T ${x + 14} ${y}" />`;
    html += `<path d="M ${x - 9} ${y + 6} Q ${x - 2} ${y + 2} ${x + 5} ${y + 6} T ${x + 17} ${y + 6}" />`;
  }
  html += `</g>`;

  // Komachi's Sanzu Ferryboat Silhouette on the Sanzu River
  const boatX = 0.304 * MAP_WIDTH;
  const boatY = 0.145 * MAP_HEIGHT;
  html += `
    <g class="sanzu-ferryboat" transform="translate(${boatX.toFixed(1)}, ${boatY.toFixed(1)}) rotate(-18)">
      <path d="M -11 0 Q 0 5 11 0 L 8 4 L -8 4 Z" fill="#5c3a24" stroke="#1f1108" stroke-width="1.1" />
      <line x1="-2" y1="0" x2="4" y2="-8" stroke="#2a180d" stroke-width="1.2" />
      <circle cx="-2" cy="-5" r="2.2" fill="#b6342a" />
    </g>
  `;

  waterGroup.innerHTML = html;
}
