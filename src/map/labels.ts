import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { LocationEntry } from '../types';

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type AnchorDir = 'bottom' | 'right' | 'left' | 'top';

function boxesOverlap(a: Box, b: Box): boolean {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

/**
 * Preferred candidate anchor order for dense hub sub-locations so banners never stack
 * vertically along the Human Village central street/canal or other tight clusters.
 */
const PREFERRED_ANCHORS: Record<string, AnchorDir[]> = {
  'human-village': ['bottom', 'right', 'top', 'left'],
  'terakoya-school': ['top', 'left', 'right', 'bottom'],
  'human-village-market-square': ['right', 'left', 'bottom', 'top'],
  'suzunaan': ['bottom', 'right', 'left', 'top'],
  'hieda-estate': ['left', 'top', 'bottom', 'right'],
  'geidontei': ['left', 'bottom', 'top', 'right'],
  'dragon-statue': ['right', 'top', 'left', 'bottom'],
  'kirisame-shop': ['right', 'bottom', 'top', 'left'],
  'canal-of-willows': ['right', 'bottom', 'left', 'top'],
};

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
      x1: 0.34 * MAP_WIDTH,
      y1: 14,
      x2: 0.63 * MAP_WIDTH,
      y2: 112,
    });
  }

  // Reserve small pin-center boxes for visible markers so side-anchored labels do not cover neighboring pins
  for (const loc of locations) {
    if (regionFilter !== 'All' && loc.region !== regionFilter) continue;
    if (kindFilter !== 'All' && loc.kind !== kindFilter) continue;
    if (loc.importance === 3 && zoomK < 1.5 && loc.id !== selectedId) continue;
    const px = loc.x * MAP_WIDTH;
    const py = loc.y * MAP_HEIGHT;
    const pr = (loc.importance === 1 ? 10 : 7) * invScale;
    placedBoxes.push({
      x1: px - pr,
      y1: py - pr,
      x2: px + pr,
      y2: py + pr,
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
    const enWidth = displayEn.length * (fontSize * 0.58) * invScale;
    const jpWidth = showJp ? (loc.name_jp?.length ?? 0) * (fontSize * 0.88) * invScale : 0;
    const plateW = Math.max(enWidth, jpWidth) + 20 * invScale;
    const plateH = (showJp ? 30 : 18) * invScale;
    const pinGap = (loc.importance === 1 ? 15.5 : 12.0) * invScale;

    const candidateOrder: AnchorDir[] =
      PREFERRED_ANCHORS[loc.id] ?? ['bottom', 'right', 'left', 'top'];

    let chosenDir: AnchorDir | null = null;
    let chosenCenterX = cx;
    let chosenTopY = cy + pinGap;
    let chosenBox: Box | null = null;

    for (const dir of candidateOrder) {
      let labelCenterX = cx;
      let rectTopY = cy;
      if (dir === 'bottom') {
        labelCenterX = cx;
        rectTopY = cy + pinGap - 3 * invScale;
      } else if (dir === 'top') {
        labelCenterX = cx;
        rectTopY = cy - pinGap - plateH - (loc.icon ? 14 * invScale : 2 * invScale);
      } else if (dir === 'right') {
        labelCenterX = cx + pinGap + plateW / 2 + 4 * invScale;
        rectTopY = cy - plateH / 2;
      } else if (dir === 'left') {
        labelCenterX = cx - pinGap - plateW / 2 - 4 * invScale;
        rectTopY = cy - plateH / 2;
      }

      const candidateBox: Box = {
        x1: labelCenterX - plateW / 2 - 4 * invScale,
        y1: rectTopY - 2.5 * invScale,
        x2: labelCenterX + plateW / 2 + 4 * invScale,
        y2: rectTopY + plateH + 2.5 * invScale,
      };

      if (!placedBoxes.some((b) => boxesOverlap(candidateBox, b))) {
        chosenDir = dir;
        chosenCenterX = labelCenterX;
        chosenTopY = rectTopY;
        chosenBox = candidateBox;
        break;
      }
    }

    if (!chosenBox && isSelected) {
      // Selected location always renders (fallback to first preferred direction)
      const dir = candidateOrder[0];
      chosenDir = dir;
      if (dir === 'top') {
        chosenCenterX = cx;
        chosenTopY = cy - pinGap - plateH - 12 * invScale;
      } else if (dir === 'right') {
        chosenCenterX = cx + pinGap + plateW / 2 + 4 * invScale;
        chosenTopY = cy - plateH / 2;
      } else if (dir === 'left') {
        chosenCenterX = cx - pinGap - plateW / 2 - 4 * invScale;
        chosenTopY = cy - plateH / 2;
      } else {
        chosenCenterX = cx;
        chosenTopY = cy + pinGap - 3 * invScale;
      }
      chosenBox = {
        x1: chosenCenterX - plateW / 2,
        y1: chosenTopY,
        x2: chosenCenterX + plateW / 2,
        y2: chosenTopY + plateH,
      };
    }

    if (!chosenBox || !chosenDir) continue;
    placedBoxes.push(chosenBox);

    const jpLine = showJp
      ? `<tspan x="0" dy="${(12.2 * invScale).toFixed(1)}" font-family="var(--font-jp)" font-size="${(scaledFont * 0.78).toFixed(1)}" fill="var(--ink-jp-accent)" font-weight="700">${loc.name_jp}</tspan>`
      : '';

    const borderColor = isSelected
      ? 'var(--accent-hakurei)'
      : loc.importance === 1
      ? 'var(--border-ink)'
      : 'rgba(66, 46, 31, 0.72)';
    const borderWidth = ((isSelected ? 1.8 : 1.25) * invScale).toFixed(2);

    // Subtle leader callout line when anchored to the left, right, or top
    let leaderSvg = '';
    if (chosenDir === 'right') {
      const lx1 = (cx - chosenCenterX + 8 * invScale).toFixed(1);
      const lx2 = (-plateW / 2).toFixed(1);
      const ly = (plateH / 2).toFixed(1);
      leaderSvg = `<line x1="${lx1}" y1="${ly}" x2="${lx2}" y2="${ly}" stroke="${borderColor}" stroke-width="${(1.15 * invScale).toFixed(2)}" stroke-dasharray="${(2.5 * invScale).toFixed(1)} ${(2 * invScale).toFixed(1)}" />`;
    } else if (chosenDir === 'left') {
      const lx1 = (cx - chosenCenterX - 8 * invScale).toFixed(1);
      const lx2 = (plateW / 2).toFixed(1);
      const ly = (plateH / 2).toFixed(1);
      leaderSvg = `<line x1="${lx1}" y1="${ly}" x2="${lx2}" y2="${ly}" stroke="${borderColor}" stroke-width="${(1.15 * invScale).toFixed(2)}" stroke-dasharray="${(2.5 * invScale).toFixed(1)} ${(2 * invScale).toFixed(1)}" />`;
    }

    const textY = (12.8 * invScale).toFixed(1);

    html += `
      <g class="map-label" data-id="${loc.id}" transform="translate(${chosenCenterX.toFixed(1)}, ${chosenTopY.toFixed(1)})" style="cursor:pointer;">
        ${leaderSvg}
        <rect
          x="${(-plateW / 2).toFixed(1)}"
          y="0"
          width="${plateW.toFixed(1)}"
          height="${plateH.toFixed(1)}"
          rx="${(4 * invScale).toFixed(1)}"
          fill="var(--paper-card)"
          fill-opacity="0.95"
          stroke="${borderColor}"
          stroke-width="${borderWidth}"
        />
        <text
          x="0"
          y="${textY}"
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
