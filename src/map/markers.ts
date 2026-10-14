import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { LocationEntry, LocationKind } from '../types';

export const KIND_COLOR: Record<LocationKind, string> = {
  shrine: '#b6342a',
  temple: '#7b4b94',
  residence: '#b57c2e',
  village: '#2e6b56',
  landmark: '#8a5a36',
  water: '#366f8f',
  mountain: '#5c5449',
  forest: '#3d6b42',
  otherworld: '#63458a',
};

function renderCustomLandmarkArt(icon: string): string {
  switch (icon) {
    case 'hakurei-shrine':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <path d="M -16 -12 L 16 -12 M -13 -8 L 13 -8" stroke="#b6342a" stroke-width="3.2" stroke-linecap="round" />
          <line x1="-10" y1="-12" x2="-11" y2="10" stroke="#b6342a" stroke-width="2.6" />
          <line x1="10" y1="-12" x2="11" y2="10" stroke="#b6342a" stroke-width="2.6" />
          <line x1="0" y1="-12" x2="0" y2="-8" stroke="#b6342a" stroke-width="2" />
          <!-- Shimenawa & Gohei -->
          <path d="M -9 -6 Q 0 -3 9 -6" fill="none" stroke="#d9b44a" stroke-width="1.6" />
          <polygon points="-5,-5 -7,1 -3,1" fill="#fffdf7" />
          <polygon points="5,-5 3,1 7,1" fill="#fffdf7" />
        </g>
      `;
    case 'scarlet-devil-mansion':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <rect x="-13" y="-4" width="26" height="14" fill="#8f1d24" stroke="#240b0d" stroke-width="1.4" />
          <polygon points="-15,-4 0,-13 15,-4" fill="#5e1318" stroke="#240b0d" stroke-width="1.2" />
          <rect x="-5" y="-16" width="10" height="26" fill="#a3222a" stroke="#240b0d" stroke-width="1.4" />
          <polygon points="-7,-16 0,-26 7,-16" fill="#421014" stroke="#240b0d" stroke-width="1.2" />
          <circle cx="0" cy="-10" r="3.2" fill="#fff3c4" stroke="#240b0d" stroke-width="0.9" />
          <line x1="0" y1="-10" x2="0" y2="-12" stroke="#240b0d" stroke-width="0.9" />
          <line x1="0" y1="-10" x2="1.8" y2="-10" stroke="#240b0d" stroke-width="0.9" />
        </g>
      `;
    case 'human-village':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <rect x="-14" y="-3" width="28" height="13" fill="#e6d6b5" stroke="#3b2818" stroke-width="1.5" />
          <path d="M -18 -3 Q 0 -14 18 -3 Z" fill="#4a3728" stroke="#24180e" stroke-width="1.4" />
          <rect x="-5" y="1" width="10" height="9" rx="4" fill="#3b2818" />
          <circle cx="0" cy="-7" r="2.2" fill="#c8963e" />
        </g>
      `;
    case 'myouren-temple':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <rect x="-13" y="-2" width="26" height="12" fill="#d9cbb0" stroke="#2e2925" stroke-width="1.4" />
          <path d="M -19 -2 Q -9 -12 0 -14 Q 9 -12 19 -2 Z" fill="#4d5359" stroke="#1f2226" stroke-width="1.4" />
          <circle cx="0" cy="-15" r="2.2" fill="#d9a74a" />
        </g>
      `;
    case 'kourindou':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <rect x="-11" y="-3" width="22" height="12" fill="#8c583a" stroke="#2b1a10" stroke-width="1.3" />
          <polygon points="-14,-3 0,-13 14,-3" fill="#3d5245" stroke="#1e2922" stroke-width="1.3" />
          <circle cx="0" cy="-6" r="2.2" fill="#f2d179" />
        </g>
      `;
    case 'marisas-house':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <rect x="-10" y="-1" width="20" height="10" fill="#734f36" stroke="#291a10" stroke-width="1.3" />
          <path d="M -15 -1 L 0 -16 L 15 -1 Z" fill="#2e2633" stroke="#17121a" stroke-width="1.3" />
          <path d="M -9 -3 L 9 -3" stroke="#f5e6c8" stroke-width="2" />
        </g>
      `;
    case 'eientei':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <rect x="-15" y="-1" width="30" height="10" fill="#d8c8a8" stroke="#362517" stroke-width="1.3" />
          <path d="M -19 -1 L -12 -10 L 12 -10 L 19 -1 Z" fill="#3d5238" stroke="#1e291b" stroke-width="1.3" />
          <circle cx="0" cy="-12" r="3" fill="#f7e594" stroke="#8c6d1f" stroke-width="0.9" />
        </g>
      `;
    case 'moriya-shrine':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <!-- Four Onbashira Pillars + Shrine -->
          <line x1="-15" y1="-15" x2="-15" y2="10" stroke="#8c6239" stroke-width="2.6" />
          <line x1="15" y1="-15" x2="15" y2="10" stroke="#8c6239" stroke-width="2.6" />
          <rect x="-10" y="-3" width="20" height="11" fill="#dcd0b8" stroke="#2e241b" stroke-width="1.3" />
          <polygon points="-13,-3 0,-12 13,-3" fill="#2f6f5e" stroke="#17382f" stroke-width="1.3" />
        </g>
      `;
    case 'youkai-mountain':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <polygon points="-18,8 -4,-15 10,8" fill="#6e6559" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-6,8 6,-12 18,8" fill="#857a6b" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-4,-15 -9,-6 1,-6" fill="#f5f2eb" />
        </g>
      `;
    case 'palace-of-earth-spirits':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <rect x="-12" y="-4" width="24" height="13" fill="#4f334d" stroke="#1f121e" stroke-width="1.3" />
          <polygon points="-14,-4 0,-14 14,-4" fill="#7a2848" stroke="#1f121e" stroke-width="1.3" />
          <ellipse cx="0" cy="2" rx="5" ry="3.2" fill="#ff5e7e" stroke="#ffd1dc" stroke-width="1" />
          <circle cx="0" cy="2" r="1.5" fill="#240b14" />
        </g>
      `;
    case 'hakugyokurou':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <circle cx="0" cy="-6" r="11" fill="#f2a7c3" stroke="#8f3d5e" stroke-width="1.2" />
          <path d="M 0 10 L 0 -4 M 0 -1 L -5 -6 M 0 -2 L 5 -7" stroke="#4a2c21" stroke-width="2" stroke-linecap="round" />
        </g>
      `;
    default:
      return '';
  }
}

export function renderMarkersLayer(
  markersGroup: SVGGElement,
  locations: LocationEntry[],
  selectedId: string | null,
  _zoomK: number,
  searchQuery: string,
  regionFilter: string,
  kindFilter: string
) {
  const q = searchQuery.trim().toLowerCase();
  let html = '';

  for (const loc of locations) {
    // Filter check
    if (regionFilter !== 'All' && loc.region !== regionFilter) continue;
    if (kindFilter !== 'All' && loc.kind !== kindFilter) continue;

    const matchesSearch =
      !q ||
      loc.name_en.toLowerCase().includes(q) ||
      loc.name_jp.toLowerCase().includes(q) ||
      loc.residents.some((r) => r.toLowerCase().includes(q)) ||
      loc.short_desc.toLowerCase().includes(q);

    const isSelected = loc.id === selectedId;
    const x = loc.x * MAP_WIDTH;
    const y = loc.y * MAP_HEIGHT;
    const color = KIND_COLOR[loc.kind] ?? '#8a5a36';
    const opacity = matchesSearch ? 1 : 0.22;

    const r = loc.importance === 1 ? 8.5 : loc.importance === 2 ? 6.5 : 5.0;
    const customArt = loc.icon && loc.importance === 1 ? renderCustomLandmarkArt(loc.icon) : '';

    // Night-mode glowing lantern for inhabited places
    const hasLantern = ['shrine', 'temple', 'residence', 'village'].includes(loc.kind);
    const lanternSvg = hasLantern
      ? `<circle cx="0" cy="0" r="${r * 2.8}" fill="url(#lantern-radial)" class="night-only" />`
      : '';

    const selectedRing = isSelected
      ? `
        <circle cx="0" cy="0" r="${r + 9}" fill="none" stroke="#b6342a" stroke-width="2.5" class="marker-pulse-ring" />
        <circle cx="0" cy="0" r="${r + 5}" fill="none" stroke="#d9a74a" stroke-width="2" />
      `
      : '';

    html += `
      <g
        class="map-marker${isSelected ? ' is-selected' : ''}"
        data-id="${loc.id}"
        data-importance="${loc.importance}"
        transform="translate(${x.toFixed(1)}, ${y.toFixed(1)})"
        opacity="${opacity}"
      >
        <g class="marker-scale-wrap">
          <circle cx="0" cy="0" r="${(r + 7).toFixed(1)}" fill="transparent" />
          ${lanternSvg}
          ${selectedRing}
          ${customArt}
          <circle
            cx="0"
            cy="2"
            r="${(r + 0.8).toFixed(1)}"
            fill="rgba(26, 15, 8, 0.38)"
          />
          <circle
            cx="0"
            cy="0"
            r="${r}"
            fill="${color}"
            stroke="#fff8ec"
            stroke-width="${loc.importance === 1 ? 2.2 : 1.6}"
          />
          <circle cx="0" cy="0" r="${r * 0.38}" fill="#fff8ec" />
        </g>
      </g>
    `;
  }

  markersGroup.innerHTML = html;
}

