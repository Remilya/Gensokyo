import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { LocationEntry } from '../types';

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function boxesOverlap(a: Box, b: Box): boolean {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

export function renderLabelsLayer(
  labelsGroup: SVGGElement,
  locations: LocationEntry[],
  selectedId: string | null,
  zoomK: number,
  regionFilter: string,
  kindFilter: string
) {
  let html = '';

  // 1. Major Regional Cartographic Calligraphic Titles (visible at overview/mid zoom)
  if (zoomK < 2.6) {
    const regionTitles = [
      { text: 'YOUKAI MOUNTAIN', jp: '妖怪の山', x: 0.675, y: 0.198, size: 20 },
      { text: 'HUMAN VILLAGE', jp: '人間の里', x: 0.480, y: 0.398, size: 17 },
      { text: 'FOREST OF MAGIC', jp: '魔法の森', x: 0.565, y: 0.692, size: 17 },
      { text: 'MISTY LAKE', jp: '霧の湖', x: 0.685, y: 0.808, size: 18 },
      { text: 'BAMBOO FOREST OF THE LOST', jp: '迷いの竹林', x: 0.795, y: 0.398, size: 16 },
      { text: 'GARDEN OF THE SUN', jp: '太陽の畑', x: 0.815, y: 0.562, size: 14 },
      { text: 'SANZU RIVER & HIGAN', jp: '三途の川・彼岸', x: 0.235, y: 0.195, size: 15 },
    ];

    html += `<g class="region-watermarks" opacity="${Math.max(0.22, 0.72 - (zoomK - 1) * 0.25).toFixed(2)}" pointer-events="none">`;
    for (const rt of regionTitles) {
      const rx = rt.x * MAP_WIDTH;
      const ry = rt.y * MAP_HEIGHT;
      html += `
        <text x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" text-anchor="middle" font-family="var(--font-display)" font-size="${rt.size}" fill="var(--ink-secondary)" letter-spacing="3.5" stroke="var(--paper-bg)" stroke-width="3.5" paint-order="stroke">
          ${rt.text}
        </text>
      `;
    }
    html += `</g>`;
  }

  // 2. Location Pin Labels with LOD & Greedy Collision Avoidance
  const placedBoxes: Box[] = [];
  const invScale = Math.max(0.40, Math.min(1.10, 1 / Math.pow(zoomK, 0.62)));

  // Sort so selected & higher importance labels get priority
  const sorted = [...locations].sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    return a.importance - b.importance;
  });

  html += `<g class="pin-labels">`;

  for (const loc of sorted) {
    if (regionFilter !== 'All' && loc.region !== regionFilter) continue;
    if (kindFilter !== 'All' && loc.kind !== kindFilter) continue;

    const isSelected = loc.id === selectedId;
    if (!isSelected) {
      if (loc.importance === 2 && zoomK < 1.15) continue;
      if (loc.importance === 3 && zoomK < 2.05) continue;
    }

    const cx = loc.x * MAP_WIDTH;
    const cy = loc.y * MAP_HEIGHT;

    const fontSize = loc.importance === 1 ? 14.5 : loc.importance === 2 ? 12.5 : 11.5;
    const scaledFont = fontSize * invScale;
    const estWidth = (loc.name_en.length * 7.2 + 16) * invScale;
    const estHeight = (loc.importance === 1 ? 32 : 20) * invScale;
    const offsetY = (loc.importance === 1 ? 15 : 11) * invScale;

    const box: Box = {
      x1: cx - estWidth / 2,
      y1: cy + offsetY - estHeight * 0.3,
      x2: cx + estWidth / 2,
      y2: cy + offsetY + estHeight * 0.7,
    };

    if (!isSelected && placedBoxes.some((b) => boxesOverlap(box, b))) {
      continue;
    }
    placedBoxes.push(box);

    const jpLine =
      loc.importance === 1 || zoomK >= 1.8
        ? `<tspan x="0" dy="${(12.5 * invScale).toFixed(1)}" font-family="var(--font-jp)" font-size="${(scaledFont * 0.78).toFixed(1)}" fill="var(--accent-hakurei)" font-weight="500">${loc.name_jp}</tspan>`
        : '';

    html += `
      <g class="map-label" data-id="${loc.id}" transform="translate(${cx.toFixed(1)}, ${(cy + offsetY).toFixed(1)})" style="cursor:pointer;">
        <text
          x="0"
          y="0"
          text-anchor="middle"
          font-family="var(--font-serif)"
          font-size="${scaledFont.toFixed(1)}"
          font-weight="700"
          fill="var(--ink-primary)"
          stroke="var(--paper-bg)"
          stroke-width="${(3.8 * invScale).toFixed(1)}"
          stroke-linejoin="round"
          paint-order="stroke"
        >
          ${loc.name_en}
          ${jpLine}
        </text>
      </g>
    `;
  }

  html += `</g>`;
  labelsGroup.innerHTML = html;
}
