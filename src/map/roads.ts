import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { ComputedRoute, RouteEntry } from '../types';

function routePathD(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  const scaled = pts.map(([x, y]) => [x * MAP_WIDTH, y * MAP_HEIGHT] as [number, number]);
  if (scaled.length === 2) {
    return `M ${scaled[0][0].toFixed(1)} ${scaled[0][1].toFixed(1)} L ${scaled[1][0].toFixed(1)} ${scaled[1][1].toFixed(1)}`;
  }
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

export function renderRoadsLayer(roadsGroup: SVGGElement, routes: RouteEntry[]) {
  let html = '';

  for (const r of routes) {
    const d = routePathD(r.points);
    if (r.kind === 'road') {
      // Maintained highway: dark ink casing + warm sand center
      html += `
        <g class="route-seg route-road" data-route="${r.id}">
          <path d="${d}" fill="none" stroke="var(--ink-primary)" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />
          <path d="${d}" fill="none" stroke="#e3cfa6" stroke-width="3.0" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      `;
    } else if (r.kind === 'path') {
      // Forest / Mountain footpath
      html += `
        <path d="${d}" fill="none" stroke="#593e28" stroke-width="2.1" stroke-dasharray="7 5" stroke-linecap="round" opacity="0.78" data-route="${r.id}" />
      `;
    } else if (r.kind === 'secret') {
      // Hidden / Shifting trail
      html += `
        <path d="${d}" fill="none" stroke="#8f2d38" stroke-width="1.8" stroke-dasharray="3 6" stroke-linecap="round" opacity="0.72" data-route="${r.id}" />
      `;
    } else if (r.kind === 'ropeway') {
      // Moriya Aerial Ropeway cable line
      html += `
        <g class="route-ropeway" data-route="${r.id}">
          <path d="${d}" fill="none" stroke="#2c3e50" stroke-width="2.2" stroke-dasharray="12 4 2 4" opacity="0.82" />
        </g>
      `;
    } else if (r.kind === 'ferry') {
      // Sanzu Ferry route
      html += `
        <path d="${d}" fill="none" stroke="#295f78" stroke-width="2.4" stroke-dasharray="4 7" stroke-linecap="round" opacity="0.85" data-route="${r.id}" />
      `;
    } else if (r.kind === 'portal') {
      // Dimensional / Sky portal link
      html += `
        <path d="${d}" fill="none" stroke="#8a56ac" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round" opacity="0.48" data-route="${r.id}" />
      `;
    }
  }

  html += `<g id="active-route-overlay"></g>`;
  roadsGroup.innerHTML = html;
}

export function updateActiveRouteOverlay(
  roadsGroup: SVGGElement,
  computed: ComputedRoute | null
) {
  const overlay = roadsGroup.querySelector<SVGGElement>('#active-route-overlay');
  if (!overlay) return;

  if (!computed) {
    overlay.innerHTML = '';
    return;
  }

  let html = '';

  if (computed.segments.length > 0) {
    for (const seg of computed.segments) {
      const d = routePathD(seg.points);
      html += `
        <path d="${d}" fill="none" stroke="rgba(255, 232, 166, 0.85)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${d}" fill="none" stroke="#b6342a" stroke-width="4.2" stroke-dasharray="10 6" stroke-linecap="round" stroke-linejoin="round" class="active-route-path" />
      `;
    }
  } else {
    const x1 = computed.from.x * MAP_WIDTH;
    const y1 = computed.from.y * MAP_HEIGHT;
    const x2 = computed.to.x * MAP_WIDTH;
    const y2 = computed.to.y * MAP_HEIGHT;
    html += `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255, 232, 166, 0.85)" stroke-width="8" stroke-linecap="round" />
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b6342a" stroke-width="3.8" stroke-dasharray="10 6" stroke-linecap="round" class="active-route-path" />
    `;
  }

  // Waypoint hop rings along the route
  computed.hops.forEach((hop, idx) => {
    const hx = hop.x * MAP_WIDTH;
    const hy = hop.y * MAP_HEIGHT;
    const isEndpoint = idx === 0 || idx === computed.hops.length - 1;
    const r = isEndpoint ? 11 : 7;
    html += `
      <g transform="translate(${hx.toFixed(1)}, ${hy.toFixed(1)})">
        <circle cx="0" cy="0" r="${r + 4}" fill="none" stroke="#b6342a" stroke-width="2" class="marker-pulse-ring" />
        <circle cx="0" cy="0" r="${r}" fill="#b6342a" stroke="#fff8ee" stroke-width="2" />
        <text x="0" y="3.5" text-anchor="middle" fill="#fff8ee" font-size="9.5" font-weight="700" font-family="var(--font-ui)">${idx + 1}</text>
      </g>
    `;
  });

  overlay.innerHTML = html;
}
