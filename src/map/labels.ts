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

  // 1. Major Regional Cartographic Parchment Scroll Banners (visible at overview/mid zoom)
  if (zoomK < 2.6) {
    const regionTitles = [
      { text: 'YOUKAI MOUNTAIN', jp: '妖怪の山', x: 0.665, y: 0.198, w: 196 },
      { text: 'HUMAN VILLAGE', jp: '人間の里', x: 0.480, y: 0.392, w: 170 },
      { text: 'FOREST OF MAGIC', jp: '魔法の森', x: 0.565, y: 0.692, w: 178 },
      { text: 'MISTY LAKE', jp: '霧の湖', x: 0.685, y: 0.805, w: 142 },
      { text: 'BAMBOO FOREST OF THE LOST', jp: '迷いの竹林', x: 0.805, y: 0.392, w: 238 },
      { text: 'GARDEN OF THE SUN', jp: '太陽の畑', x: 0.818, y: 0.562, w: 176 },
      { text: 'SANZU RIVER & HIGAN', jp: '三途の川・彼岸', x: 0.215, y: 0.185, w: 194 },
    ];

    const op = Math.max(0.24, 0.86 - (zoomK - 1) * 0.32).toFixed(2);
    html += `<g class="region-watermarks" opacity="${op}" pointer-events="none">`;
    for (const rt of regionTitles) {
      const rx = rt.x * MAP_WIDTH;
      const ry = rt.y * MAP_HEIGHT;
      const hw = rt.w / 2;
      html += `
        <g transform="translate(${rx.toFixed(1)}, ${ry.toFixed(1)})">
          <rect x="${-hw}" y="-15" width="${rt.w}" height="28" rx="4" fill="var(--paper-card)" fill-opacity="0.78" stroke="var(--border-gold)" stroke-width="1.2" />
          <text x="0" y="-2" text-anchor="middle" font-family="var(--font-display)" font-size="13" font-weight="700" fill="var(--ink-primary)" letter-spacing="2.2">
            ${rt.text}
          </text>
          <text x="0" y="10" text-anchor="middle" font-family="var(--font-jp)" font-size="10.5" fill="var(--accent-hakurei)" font-weight="600" letter-spacing="1.5">
            ${rt.jp}
          </text>
        </g>
      `;
    }
    html += `</g>`;
  }

  // 2. Location Pin Labels with LOD, Parchment Nameplates for Tier-1 Landmarks & Greedy Collision Avoidance
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
    const estWidth = (loc.name_en.length * 7.2 + 20) * invScale;
    const estHeight = (loc.importance === 1 ? 34 : 21) * invScale;
    const offsetY = (loc.importance === 1 ? 16 : 11.5) * invScale;

    const box: Box = {
      x1: cx - estWidth / 2,
      y1: cy + offsetY - estHeight * 0.35,
      x2: cx + estWidth / 2,
      y2: cy + offsetY + estHeight * 0.75,
    };

    if (!isSelected && placedBoxes.some((b) => boxesOverlap(box, b))) {
      continue;
    }
    placedBoxes.push(box);

    const jpLine =
      loc.importance === 1 || zoomK >= 1.8
        ? `<tspan x="0" dy="${(12.5 * invScale).toFixed(1)}" font-family="var(--font-jp)" font-size="${(scaledFont * 0.78).toFixed(1)}" fill="var(--accent-hakurei)" font-weight="600">${loc.name_jp}</tspan>`
        : '';

    // Subtle antique parchment nameplate pill for Tier-1 major landmarks or selected location
    const plateW = (Math.max(loc.name_en.length * 7.0, (loc.name_jp?.length ?? 4) * 11) + 16) * invScale;
    const plateH = (loc.importance === 1 || zoomK >= 1.8 ? 27 : 16) * invScale;
    const plateY = -11.5 * invScale;
    const nameplate =
      loc.importance === 1 || isSelected
        ? `<rect x="${(-plateW / 2).toFixed(1)}" y="${plateY.toFixed(1)}" width="${plateW.toFixed(1)}" height="${plateH.toFixed(1)}" rx="${(3.5 * invScale).toFixed(1)}" fill="var(--paper-card)" fill-opacity="0.86" stroke="${isSelected ? 'var(--accent-hakurei)' : 'var(--border-ink)'}" stroke-width="${(1.1 * invScale).toFixed(2)}" />`
        : '';

    html += `
      <g class="map-label" data-id="${loc.id}" transform="translate(${cx.toFixed(1)}, ${(cy + offsetY).toFixed(1)})" style="cursor:pointer;">
        ${nameplate}
        <text
          x="0"
          y="0"
          text-anchor="middle"
          font-family="var(--font-serif)"
          font-size="${scaledFont.toFixed(1)}"
          font-weight="700"
          fill="var(--ink-primary)"
          stroke="var(--paper-bg)"
          stroke-width="${(3.6 * invScale).toFixed(1)}"
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
