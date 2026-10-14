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

/**
 * Shortens long parenthetical location titles at overview zoom so labels never overflow or clutter
 */
function formatDisplayTitle(nameEn: string, zoomK: number, isSelected: boolean): string {
  if (isSelected || zoomK >= 2.2) return nameEn;
  const cleaned = nameEn.replace(/\s*\([^)]*\)\s*/g, '').trim();
  if (cleaned === 'Higan & Ministry of Right and Wrong') return 'Higan';
  if (cleaned === 'Hall of Dreams Great Mausoleum') return 'Divine Spirit Mausoleum';
  if (cleaned === 'The Underworld') return 'Underworld Cavern';
  return cleaned || nameEn;
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

  const placedBoxes: Box[] = [];
  const invScale = Math.max(0.42, Math.min(1.08, 1 / Math.pow(zoomK, 0.58)));

  // Reserve collision box for the top title scroll so no pin labels render on top of it
  if (zoomK < 2.0) {
    placedBoxes.push({
      x1: 0.16 * MAP_WIDTH,
      y1: 18,
      x2: 0.44 * MAP_WIDTH,
      y2: 118,
    });
  }

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
      if (loc.importance === 2 && zoomK < 1.25) continue;
      if (loc.importance === 3 && zoomK < 2.15) continue;
    }

    const cx = loc.x * MAP_WIDTH;
    const cy = loc.y * MAP_HEIGHT;
    const displayEn = formatDisplayTitle(loc.name_en, zoomK, isSelected);
    const showJp = loc.importance === 1 || isSelected || zoomK >= 1.75;

    const fontSize = loc.importance === 1 ? 13.8 : loc.importance === 2 ? 12.2 : 11.2;
    const scaledFont = fontSize * invScale;

    // Accurate pill width & height calculation so text never overflows its nameplate
    const enWidth = displayEn.length * (fontSize * 0.57) * invScale;
    const jpWidth = showJp ? (loc.name_jp?.length ?? 0) * (fontSize * 0.85) * invScale : 0;
    const plateW = Math.max(enWidth, jpWidth) + 20 * invScale;
    const plateH = (showJp ? 30 : 18) * invScale;
    const offsetY = (loc.importance === 1 ? 17 : 12.5) * invScale;
    const plateY = -12.5 * invScale;

    const box: Box = {
      x1: cx - plateW / 2 - 4,
      y1: cy + offsetY + plateY - 2,
      x2: cx + plateW / 2 + 4,
      y2: cy + offsetY + plateY + plateH + 2,
    };

    if (!isSelected && placedBoxes.some((b) => boxesOverlap(box, b))) {
      continue;
    }
    placedBoxes.push(box);

    const jpLine = showJp
      ? `<tspan x="0" dy="${(12.2 * invScale).toFixed(1)}" font-family="var(--font-jp)" font-size="${(scaledFont * 0.78).toFixed(1)}" fill="var(--accent-hakurei)" font-weight="700">${loc.name_jp}</tspan>`
      : '';

    const borderColor = isSelected
      ? 'var(--accent-hakurei)'
      : loc.importance === 1
      ? 'var(--border-ink)'
      : 'rgba(66, 46, 31, 0.65)';
    const borderWidth = ((isSelected ? 1.8 : 1.2) * invScale).toFixed(2);

    html += `
      <g class="map-label" data-id="${loc.id}" transform="translate(${cx.toFixed(1)}, ${(cy + offsetY).toFixed(1)})" style="cursor:pointer;">
        <rect
          x="${(-plateW / 2).toFixed(1)}"
          y="${plateY.toFixed(1)}"
          width="${plateW.toFixed(1)}"
          height="${plateH.toFixed(1)}"
          rx="${(4 * invScale).toFixed(1)}"
          fill="var(--paper-card)"
          fill-opacity="0.94"
          stroke="${borderColor}"
          stroke-width="${borderWidth}"
        />
        <text
          x="0"
          y="0"
          text-anchor="middle"
          font-family="var(--font-serif)"
          font-size="${scaledFont.toFixed(1)}"
          font-weight="700"
          fill="var(--ink-primary)"
        >
          ${displayEn}
          ${jpLine}
        </text>
      </g>
    `;
  }

  html += `</g>`;
  labelsGroup.innerHTML = html;
}
