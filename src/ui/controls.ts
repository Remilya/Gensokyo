import type { MapCanvas } from '../map/canvas';
import { KIND_COLOR } from '../map/markers';
import { store } from '../state';
import type { LocationKind, TimeOfDay } from '../types';

export function mountControlsAndLegend(container: HTMLElement, mapCanvas: MapCanvas) {
  // 1. Overland Route Planner Floating Banner
  const routeBanner = document.createElement('div');
  routeBanner.className = 'route-planner-banner';
  routeBanner.style.display = 'none';
  container.appendChild(routeBanner);

  // 2. Bottom-Left Legend & Dynamic Scale Bar
  const bottomLeft = document.createElement('div');
  bottomLeft.className = 'hud-bottom-left';

  const legendEntries: [LocationKind, string][] = [
    ['shrine', 'Shrine (神社)'],
    ['temple', 'Temple (寺院)'],
    ['village', 'Village (里)'],
    ['residence', 'Estate / Shop'],
    ['landmark', 'Landmark'],
    ['forest', 'Forest / Woods'],
    ['mountain', 'Mountain Peak'],
    ['water', 'Lake / River'],
    ['otherworld', 'Otherworld'],
  ];

  bottomLeft.innerHTML = `
    <div class="legend-card">
      <div class="legend-title">ATLAS LEGEND &amp; FILTER</div>
      <div class="legend-grid">
        ${legendEntries
          .map(
            ([kind, label]) => `
          <div class="legend-item" data-kind="${kind}">
            <span class="legend-swatch" style="background:${KIND_COLOR[kind]};"></span>
            <span>${label}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="scale-bar-card">
      <div class="scale-bar-graphic" style="width: 140px;">
        <div class="scale-seg-dark"></div>
        <div class="scale-seg-light"></div>
        <div class="scale-seg-dark"></div>
        <div class="scale-seg-light"></div>
      </div>
      <div class="scale-bar-labels" id="scale-bar-labels">
        <span>0</span>
        <span id="scale-mid-label">500 m</span>
        <span id="scale-end-label">1.0 km (~14 min walk)</span>
      </div>
    </div>
  `;
  container.appendChild(bottomLeft);

  bottomLeft.querySelectorAll('.legend-item').forEach((item) => {
    item.addEventListener('click', () => {
      const kind = item.getAttribute('data-kind') as LocationKind;
      const current = store.getState().kindFilter;
      const next = current === kind ? 'All' : kind;
      store.update({ kindFilter: next });
      const kindSelect = document.querySelector<HTMLSelectElement>('#filter-kind');
      if (kindSelect) kindSelect.value = next;
    });
  });

  // 3. Bottom-Right Control Toolbar (Minimap mounts inside this container too)
  const bottomRight = document.createElement('div');
  bottomRight.className = 'hud-bottom-right';
  bottomRight.id = 'hud-bottom-right';

  bottomRight.innerHTML = `
    <div class="control-toolbar">
      <button class="ctrl-btn" id="btn-toggle-3d" title="Toggle Interactive Three.js 3D Map &amp; Landmark Models">🧊 3D Map</button>
      <button class="ctrl-btn active" id="btn-toggle-residents" title="Toggle Pixel-Art &amp; 3D Character Residents">👾 Residents</button>
      <button class="ctrl-btn" id="btn-zoom-in" title="Zoom In (+)">＋</button>
      <button class="ctrl-btn" id="btn-zoom-out" title="Zoom Out (-)">－</button>
      <button class="ctrl-btn" id="btn-zoom-reset" title="Reset View">⟲</button>
      <button class="ctrl-btn" id="btn-toggle-route" title="Toggle Overland Travel &amp; Route Calculator">🧭 Route Planner</button>
      <button class="ctrl-btn active" id="btn-toggle-footprints" title="Toggle 1:1 Architectural Building Footprints">🏘️ 1:1 Scale</button>
      <button class="ctrl-btn" id="btn-cycle-time" title="Switch Day / Autumn Dusk / Night Mode">☀️ Day</button>
    </div>
  `;
  container.appendChild(bottomRight);

  const view3dBtn = bottomRight.querySelector<HTMLButtonElement>('#btn-toggle-3d')!;
  view3dBtn.addEventListener('click', () => {
    const next3d = !store.getState().view3d;
    store.update({ view3d: next3d });
  });

  const residentsBtn = bottomRight.querySelector<HTMLButtonElement>('#btn-toggle-residents')!;
  residentsBtn.addEventListener('click', () => {
    const nextRes = !store.getState().showResidents;
    store.update({ showResidents: nextRes });
    residentsBtn.classList.toggle('active', nextRes);
  });

  bottomRight.querySelector('#btn-zoom-in')?.addEventListener('click', () => mapCanvas.zoomByFactor(1.4));
  bottomRight.querySelector('#btn-zoom-out')?.addEventListener('click', () => mapCanvas.zoomByFactor(1 / 1.4));
  bottomRight.querySelector('#btn-zoom-reset')?.addEventListener('click', () => mapCanvas.resetView());

  const routeBtn = bottomRight.querySelector<HTMLButtonElement>('#btn-toggle-route')!;
  routeBtn.addEventListener('click', () => {
    const st = store.getState();
    const nextMode = !st.routeMode;
    store.update({ routeMode: nextMode });
    if (nextMode && !st.routeStartId && !st.routeEndId) {
      store.setRouteEndpoints('human-village', 'scarlet-devil-mansion');
    } else if (!nextMode) {
      store.setRouteEndpoints(null, null);
    }
  });

  const footprintsBtn = bottomRight.querySelector<HTMLButtonElement>('#btn-toggle-footprints')!;
  footprintsBtn.addEventListener('click', () => {
    const next = !store.getState().showFootprints;
    store.update({ showFootprints: next });
    footprintsBtn.classList.toggle('active', next);
  });

  const timeBtn = bottomRight.querySelector<HTMLButtonElement>('#btn-cycle-time')!;
  const TIME_CYCLE: TimeOfDay[] = ['day', 'dusk', 'night'];
  const TIME_LABEL: Record<TimeOfDay, string> = {
    day: '☀️ Day',
    dusk: '🍁 Dusk',
    night: '🌙 Night',
  };
  timeBtn.addEventListener('click', () => {
    const cur = store.getState().timeOfDay;
    const next = TIME_CYCLE[(TIME_CYCLE.indexOf(cur) + 1) % TIME_CYCLE.length];
    store.update({ timeOfDay: next });
    document.documentElement.setAttribute('data-theme', next);
    timeBtn.textContent = TIME_LABEL[next];
  });

  function renderRouteBanner() {
    const st = store.getState();
    routeBtn.classList.toggle('active', st.routeMode);
    if (!st.routeMode) {
      routeBanner.style.display = 'none';
      return;
    }

    routeBanner.style.display = 'flex';
    const locs = store.getLocations();
    const optionsStart = locs
      .map(
        (l) =>
          `<option value="${l.id}" ${l.id === st.routeStartId ? 'selected' : ''}>${l.name_en} (${l.region})</option>`
      )
      .join('');
    const optionsEnd = locs
      .map(
        (l) =>
          `<option value="${l.id}" ${l.id === st.routeEndId ? 'selected' : ''}>${l.name_en} (${l.region})</option>`
      )
      .join('');

    const comp = st.computedRoute;
    const summaryHtml = comp
      ? `
        <div class="route-summary-box">
          <div class="route-stats-line">
            <span>🚶 Walk: <strong>${comp.totalMinutes} min</strong> (${comp.totalKm} km)</span>
            <span>🧹 Flight: <strong>~${comp.flightMinutes} min</strong> (${comp.crowKm} km crow-flies)</span>
            <span>📍 Waypoints: <strong>${comp.hops.length}</strong></span>
          </div>
          <div class="route-hops-line">
            <strong>Route Path:</strong> ${comp.hops.map((h) => h.name_en).join(' → ')}
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <button class="hud-chip-btn" id="btn-copy-route">📋 Copy Route Summary</button>
            <button class="hud-chip-btn" id="btn-swap-route">⇄ Reverse Route</button>
          </div>
        </div>
      `
      : `<div style="font-size:12px;color:var(--ink-secondary);">Click any two pins on the map or choose from the dropdowns above to calculate walking time and waypoints.</div>`;

    routeBanner.innerHTML = `
      <div class="route-planner-header">
        <span class="route-planner-title">🧭 GENSOKYO 1:1 OVERLAND ROUTE &amp; TRAVEL CALCULATOR</span>
        <button class="hud-chip-btn" id="btn-close-route">✕ Close</button>
      </div>
      <div class="route-selectors">
        <select class="route-select" id="route-start-select">
          <option value="">— Select Departure —</option>
          ${optionsStart}
        </select>
        <span style="font-weight:700;color:var(--accent-hakurei);">→</span>
        <select class="route-select" id="route-end-select">
          <option value="">— Select Destination —</option>
          ${optionsEnd}
        </select>
      </div>
      ${summaryHtml}
    `;

    routeBanner.querySelector('#btn-close-route')?.addEventListener('click', () => {
      store.update({ routeMode: false });
      store.setRouteEndpoints(null, null);
    });

    routeBanner.querySelector<HTMLSelectElement>('#route-start-select')?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value || null;
      store.setRouteEndpoints(val, store.getState().routeEndId);
    });

    routeBanner.querySelector<HTMLSelectElement>('#route-end-select')?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value || null;
      store.setRouteEndpoints(store.getState().routeStartId, val);
    });

    routeBanner.querySelector('#btn-swap-route')?.addEventListener('click', () => {
      const s = store.getState();
      store.setRouteEndpoints(s.routeEndId, s.routeStartId);
    });

    routeBanner.querySelector('#btn-copy-route')?.addEventListener('click', (ev) => {
      if (!comp) return;
      const btn = ev.currentTarget as HTMLButtonElement;
      const hopStr = comp.hops.map((h) => h.name_en).join(' → ');
      const routeText = `${comp.from.name_en} → ${comp.to.name_en} (~${comp.totalMinutes} min walk, ${comp.totalKm} km) via ${hopStr}`;
      navigator.clipboard?.writeText(routeText);
      btn.textContent = '✓ Copied Route Summary!';
      setTimeout(() => {
        btn.textContent = '📋 Copy Route Summary';
      }, 1800);
    });
  }

  let lastRouteMode = false;
  let lastStart: string | null = null;
  let lastEnd: string | null = null;
  let lastZoomK = 1;

  store.subscribe((state) => {
    view3dBtn.classList.toggle('active', state.view3d);
    view3dBtn.textContent = state.view3d ? '📜 2D Map' : '🧊 3D Map';

    if (
      state.routeMode !== lastRouteMode ||
      state.routeStartId !== lastStart ||
      state.routeEndId !== lastEnd
    ) {
      lastRouteMode = state.routeMode;
      lastStart = state.routeStartId;
      lastEnd = state.routeEndId;
      renderRouteBanner();
    }

    if (Math.abs(state.zoom.k - lastZoomK) > 0.05) {
      lastZoomK = state.zoom.k;
      const fullKm = 1.4 / state.zoom.k;
      const midLabel = document.getElementById('scale-mid-label');
      const endLabel = document.getElementById('scale-end-label');
      if (midLabel && endLabel) {
        if (fullKm >= 1) {
          midLabel.textContent = `${(fullKm / 2).toFixed(1)} km`;
          endLabel.textContent = `${fullKm.toFixed(1)} km (~${Math.round(fullKm * 14)}m walk)`;
        } else {
          const meters = Math.round(fullKm * 1000);
          midLabel.textContent = `${Math.round(meters / 2)} m`;
          endLabel.textContent = `${meters} m (~${Math.max(1, Math.round(fullKm * 14))}m walk)`;
        }
      }
    }
  });
}
