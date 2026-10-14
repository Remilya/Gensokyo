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

  // 1. Rivers & Canals
  for (const riv of data.rivers) {
    const d = smoothOpenPolyline(riv.points);
    const isSanzu = riv.id.includes('sanzu');
    const bankColor = isSanzu ? '#2b475c' : 'var(--water-stroke)';
    const fillColor = isSanzu ? '#486b82' : 'var(--water-fill)';
    html += `
      <g class="river-group" data-river="${riv.id}">
        <path d="${d}" fill="none" stroke="${bankColor}" stroke-width="${riv.width + 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />
        <path d="${d}" fill="none" stroke="${fillColor}" stroke-width="${riv.width}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${d}" fill="none" stroke="#d8eef7" stroke-width="${Math.max(1.2, riv.width * 0.28).toFixed(1)}" stroke-dasharray="10 14" stroke-linecap="round" opacity="0.68" class="river-flow-anim" />
      </g>
    `;
  }

  // 2. Lakes & Ponds with Concentric Shoreline Ripples
  for (const lake of data.lakes) {
    const d = smoothClosedPolygon(lake.points);
    const isBlood = lake.kind === 'blood';
    const fill = isBlood ? '#8f242c' : 'var(--water-fill)';
    const stroke = isBlood ? '#4d1015' : 'var(--water-stroke)';
    const ripple = isBlood ? '#d96b73' : '#c6e2f0';

    html += `
      <g class="lake-group" data-lake="${lake.id}">
        <path d="${d}" fill="${fill}" fill-opacity="0.88" stroke="${stroke}" stroke-width="2.2" />
        <path d="${d}" fill="none" stroke="${ripple}" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.55" transform="scale(0.985)" style="transform-origin: center;" />
      </g>
    `;
  }

  // 3. Wave crest lines inside Misty Lake & Sanzu River (Woodblock Style)
  const waveSpots: [number, number][] = [
    [0.66, 0.78], [0.71, 0.77], [0.68, 0.82], [0.73, 0.81],
    [0.685, 0.112], [0.305, 0.145], [0.295, 0.185],
  ];
  html += `<g class="water-waves" stroke="#dceef7" stroke-width="1.2" fill="none" opacity="0.65">`;
  for (const [wx, wy] of waveSpots) {
    const x = wx * MAP_WIDTH;
    const y = wy * MAP_HEIGHT;
    html += `<path d="M ${x - 14} ${y} Q ${x - 7} ${y - 4} ${x} ${y} T ${x + 14} ${y}" />`;
    html += `<path d="M ${x - 9} ${y + 6} Q ${x - 2} ${y + 2} ${x + 5} ${y + 6} T ${x + 17} ${y + 6}" />`;
  }
  html += `</g>`;

  waterGroup.innerHTML = html;
}
