import type { MapCanvas } from '../map/canvas';
import { store } from '../state';
import type { GensokyoRegion, LocationKind } from '../types';

const REGIONS: (GensokyoRegion | 'All')[] = [
  'All',
  'Heartland',
  'Hakurei',
  'Forest of Magic',
  'Misty Lake',
  'Bamboo Forest',
  'Youkai Mountain',
  'Netherworld',
  'Underworld',
  'Otherworld',
];

const KINDS: (LocationKind | 'All')[] = [
  'All',
  'shrine',
  'temple',
  'residence',
  'village',
  'landmark',
  'water',
  'mountain',
  'forest',
  'otherworld',
];

const REALM_PRESETS = [
  { label: '🗺️ Full Atlas', x: 0.50, y: 0.50, k: 1.0, reset: true },
  { label: '🏘️ Human Village 1:1', x: 0.480, y: 0.465, k: 3.4 },
  { label: '⛩️ Hakurei Ridge', x: 0.250, y: 0.340, k: 2.6 },
  { label: '🍄 Forest of Magic', x: 0.565, y: 0.655, k: 2.6 },
  { label: '🦇 Misty Lake & SDM', x: 0.745, y: 0.765, k: 2.5 },
  { label: '🎍 Bamboo & Eientei', x: 0.815, y: 0.485, k: 2.4 },
  { label: '⛰️ Youkai Mountain', x: 0.655, y: 0.175, k: 2.3 },
  { label: '🌸 Sanzu & Netherworld', x: 0.295, y: 0.115, k: 2.3 },
  { label: '🔥 Old Hell & Chireiden', x: 0.165, y: 0.825, k: 2.5 },
  { label: '🌙 Makai & Lunar', x: 0.900, y: 0.125, k: 2.6 },
];

export function mountSearchAndRealmBar(container: HTMLElement, mapCanvas: MapCanvas) {
  // 1. Top-Left Search & Filters
  const topLeft = document.createElement('div');
  topLeft.className = 'hud-top-left';

  topLeft.innerHTML = `
    <div class="search-box-wrap">
      <span class="search-icon">🔍</span>
      <input
        id="atlas-search-input"
        class="search-input"
        type="text"
        placeholder="Search 100 locations, kanji, or residents (Reimu, SDM, 紅魔館)..."
        autocomplete="off"
      />
      <kbd class="search-kbd">/</kbd>
    </div>
    <div class="filter-row">
      <select id="filter-region" class="hud-select" title="Filter by Region">
        ${REGIONS.map((r) => `<option value="${r}">${r === 'All' ? 'All Regions (9)' : r}</option>`).join('')}
      </select>
      <select id="filter-kind" class="hud-select" title="Filter by Category">
        ${KINDS.map((k) => `<option value="${k}">${k === 'All' ? 'All Types' : k.toUpperCase()}</option>`).join('')}
      </select>
      <button id="btn-clear-filters" class="hud-chip-btn" style="display:none;">✕ Reset</button>
    </div>
    <div id="search-results-box" class="search-results-dropdown" style="display:none;"></div>
  `;

  container.appendChild(topLeft);

  const searchInput = topLeft.querySelector<HTMLInputElement>('#atlas-search-input')!;
  const regionSelect = topLeft.querySelector<HTMLSelectElement>('#filter-region')!;
  const kindSelect = topLeft.querySelector<HTMLSelectElement>('#filter-kind')!;
  const clearBtn = topLeft.querySelector<HTMLButtonElement>('#btn-clear-filters')!;
  const resultsBox = topLeft.querySelector<HTMLDivElement>('#search-results-box')!;

  function renderDropdown() {
    const st = store.getState();
    const q = st.searchQuery.trim().toLowerCase();
    const hasFilter = Boolean(q) || st.regionFilter !== 'All' || st.kindFilter !== 'All';
    clearBtn.style.display = hasFilter ? 'inline-block' : 'none';

    if (!q) {
      resultsBox.style.display = 'none';
      return;
    }

    const matches = store
      .getLocations()
      .filter((loc) => {
        if (st.regionFilter !== 'All' && loc.region !== st.regionFilter) return false;
        if (st.kindFilter !== 'All' && loc.kind !== st.kindFilter) return false;
        return (
          loc.name_en.toLowerCase().includes(q) ||
          loc.name_jp.toLowerCase().includes(q) ||
          loc.residents.some((r) => r.toLowerCase().includes(q)) ||
          loc.short_desc.toLowerCase().includes(q)
        );
      })
      .slice(0, 12);

    if (matches.length === 0) {
      resultsBox.style.display = 'block';
      resultsBox.innerHTML = `<div style="padding:10px 12px;font-size:12.5px;color:var(--ink-muted);">No matching locations found in Gensokyo.</div>`;
      return;
    }

    resultsBox.style.display = 'block';
    resultsBox.innerHTML = matches
      .map(
        (m) => `
        <div class="search-result-item" data-id="${m.id}">
          <div>
            <span class="search-result-title">${m.name_en}</span>
            <span class="search-result-jp">${m.name_jp}</span>
            <div class="search-result-meta">${m.region} • ${m.residents.slice(0, 3).join(', ') || m.kind}</div>
          </div>
          <span class="badge">${m.kind}</span>
        </div>
      `
      )
      .join('');

    resultsBox.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if (!id) return;
        store.update({ selectedId: id, searchQuery: '' });
        searchInput.value = '';
        resultsBox.style.display = 'none';
        mapCanvas.flyToLocation(id, 2.8);
        window.history.replaceState(null, '', `#loc=${id}`);
      });
    });
  }

  searchInput.addEventListener('input', () => {
    store.update({ searchQuery: searchInput.value });
    renderDropdown();
  });

  regionSelect.addEventListener('change', () => {
    store.update({ regionFilter: regionSelect.value as GensokyoRegion | 'All' });
    renderDropdown();
  });

  kindSelect.addEventListener('change', () => {
    store.update({ kindFilter: kindSelect.value as LocationKind | 'All' });
    renderDropdown();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    regionSelect.value = 'All';
    kindSelect.value = 'All';
    store.update({ searchQuery: '', regionFilter: 'All', kindFilter: 'All' });
    renderDropdown();
  });

  // 2. Top-Center Realm Quick-Jump Bar
  const topCenter = document.createElement('div');
  topCenter.className = 'hud-top-center';
  topCenter.innerHTML = REALM_PRESETS.map(
    (p, idx) => `<button class="realm-pill ${idx === 0 ? 'active' : ''}" data-idx="${idx}">${p.label}</button>`
  ).join('');
  container.appendChild(topCenter);

  topCenter.querySelectorAll('.realm-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      topCenter.querySelectorAll('.realm-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const idx = Number(btn.getAttribute('data-idx') ?? 0);
      const preset = REALM_PRESETS[idx];
      if (!preset) return;
      if (preset.reset) {
        mapCanvas.resetView();
      } else {
        mapCanvas.flyToNormalized(preset.x, preset.y, preset.k);
      }
    });
  });

  // Keyboard shortcuts ('/' to focus search, 'Escape' to close)
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === 'Escape') {
      if (resultsBox.style.display !== 'none') {
        resultsBox.style.display = 'none';
      } else if (store.getState().selectedId) {
        store.update({ selectedId: null });
        window.history.replaceState(null, '', window.location.pathname);
      } else if (store.getState().routeMode) {
        store.update({ routeMode: false, routeStartId: null, routeEndId: null, computedRoute: null });
      }
    }
  });
}
