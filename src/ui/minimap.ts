import type { MapCanvas } from '../map/canvas';
import { KIND_COLOR } from '../map/markers';
import { MAP_HEIGHT, MAP_WIDTH, store } from '../state';
import type { TerrainData } from '../types';

export function mountMinimap(terrainData: TerrainData, mapCanvas: MapCanvas) {
  const host = document.getElementById('hud-bottom-right');
  if (!host) return;

  const card = document.createElement('div');
  card.className = 'minimap-card';

  const miniSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  miniSvg.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);
  miniSvg.setAttribute('width', '100%');
  miniSvg.setAttribute('height', '100%');

  const lakesSvg = terrainData.lakes
    .map((l) => {
      const pts = l.points.map(([x, y]) => `${(x * MAP_WIDTH).toFixed(0)},${(y * MAP_HEIGHT).toFixed(0)}`).join(' ');
      return `<polygon points="${pts}" fill="var(--water-fill)" opacity="0.85" />`;
    })
    .join('');

  const pinsSvg = store
    .getLocations()
    .filter((l) => l.importance <= 2)
    .map(
      (l) =>
        `<circle cx="${(l.x * MAP_WIDTH).toFixed(0)}" cy="${(l.y * MAP_HEIGHT).toFixed(0)}" r="${l.importance === 1 ? 30 : 18}" fill="${KIND_COLOR[l.kind]}" stroke="#fff" stroke-width="6" />`
    )
    .join('');

  miniSvg.innerHTML = `
    <rect x="0" y="0" width="${MAP_WIDTH}" height="${MAP_HEIGHT}" fill="var(--paper-bg)" />
    ${lakesSvg}
    ${pinsSvg}
    <rect id="minimap-view-rect" x="0" y="0" width="${MAP_WIDTH}" height="${MAP_HEIGHT}" fill="rgba(182, 52, 42, 0.12)" stroke="#b6342a" stroke-width="24" />
  `;

  card.appendChild(miniSvg);
  host.insertBefore(card, host.firstChild);

  const viewRect = miniSvg.querySelector<SVGRectElement>('#minimap-view-rect')!;

  store.subscribe((state) => {
    const k = state.zoom.k;
    const vx = Math.max(0, -state.zoom.x / k);
    const vy = Math.max(0, -state.zoom.y / k);
    const vw = Math.min(MAP_WIDTH, MAP_WIDTH / k);
    const vh = Math.min(MAP_HEIGHT, MAP_HEIGHT / k);

    viewRect.setAttribute('x', vx.toFixed(0));
    viewRect.setAttribute('y', vy.toFixed(0));
    viewRect.setAttribute('width', vw.toFixed(0));
    viewRect.setAttribute('height', vh.toFixed(0));
  });

  function jumpFromEvent(e: MouseEvent) {
    const rect = card.getBoundingClientRect();
    const nx = Math.max(0.04, Math.min(0.96, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0.04, Math.min(0.96, (e.clientY - rect.top) / rect.height));
    const curK = Math.max(1.8, store.getState().zoom.k);
    mapCanvas.flyToNormalized(nx, ny, curK);
  }

  let dragging = false;
  card.addEventListener('mousedown', (e) => {
    dragging = true;
    jumpFromEvent(e);
  });
  window.addEventListener('mousemove', (e) => {
    if (dragging) jumpFromEvent(e);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
  });
}
