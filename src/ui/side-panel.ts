import type { MapCanvas } from '../map/canvas';
import { store } from '../state';

export function mountSidePanel(container: HTMLElement, mapCanvas: MapCanvas) {
  const panel = document.createElement('aside');
  panel.className = 'side-panel';
  container.appendChild(panel);

  let currentId: string | null = null;

  store.subscribe((state) => {
    if (state.selectedId === currentId) return;
    currentId = state.selectedId;

    if (!currentId) {
      panel.classList.remove('open');
      document.body.classList.remove('panel-open');
      return;
    }

    const loc = store.getLocation(currentId);
    if (!loc) return;

    panel.classList.add('open');
    document.body.classList.add('panel-open');

    const residents = loc.residents ?? [];
    const residentChips =
      residents.length > 0
        ? residents
            .map(
              (r) =>
                `<span class="chip resident-chip" data-resident="${r.replace(/"/g, '&quot;')}">👤 ${r}</span>`
            )
            .join('')
        : `<span style="font-size:12px;color:var(--ink-muted);">Uninhabited / Wandering spirits</span>`;

    const connectedLocs = (loc.connected_ids ?? [])
      .map((cid) => store.getLocation(cid))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const connectedChips =
      connectedLocs.length > 0
        ? connectedLocs
            .map(
              (c) =>
                `<span class="chip conn-chip" data-target="${c.id}">🧭 ${c.name_en}</span>`
            )
            .join('')
        : `<span style="font-size:12px;color:var(--ink-muted);">Use Route Planner to compute overland path</span>`;

    const sourceList = (loc.sources ?? []).map((s) => `<span class="badge">${s}</span>`).join(' ');

    panel.innerHTML = `
      <div class="side-panel-header">
        <button class="side-panel-close" title="Close (Esc)">✕</button>
        <div class="panel-badges">
          <span class="badge">${loc.region}</span>
          <span class="badge">${loc.kind}</span>
          <span class="badge ${loc.confidence}">${loc.confidence === 'canon' ? '✓ Official Canon' : '✦ Fanon / Atlas'}</span>
        </div>
        <h2 class="panel-title-en">${loc.name_en}</h2>
        <div class="panel-title-jp">${loc.name_jp}</div>
      </div>

      <div class="side-panel-body">
        <div class="panel-actions-row">
          <button class="panel-action-btn" id="btn-route-start">🚩 Route From Here</button>
          <button class="panel-action-btn" id="btn-route-end">🏁 Route To Here</button>
          <button class="panel-action-btn" id="btn-copy-citation">📋 Copy Atlas Note</button>
        </div>

        <div>
          <div class="panel-section-title">Overview &amp; Lore</div>
          <p class="panel-lore-text">${loc.long_desc}</p>
        </div>

        <div>
          <div class="panel-section-title">Geography &amp; Travel Notes</div>
          <div class="atlas-spatial-box">
            <div class="atlas-spatial-item"><strong>Coordinates &amp; Sector:</strong> ${loc.atlas_sector ?? loc.region}</div>
            <div class="atlas-spatial-item"><strong>Travel Distance &amp; Time:</strong> ${loc.travel_time ?? 'See Route Planner'}</div>
            <div class="atlas-spatial-item"><strong>Approach Route &amp; Waypoints:</strong> ${loc.approach_route ?? loc.placement_note}</div>
            <div class="atlas-spatial-item"><strong>Local Customs &amp; Jurisdiction:</strong> ${loc.local_customs ?? 'Standard Gensokyo customs apply.'}</div>
          </div>
        </div>

        <div>
          <div class="panel-section-title">Notable Residents &amp; Figures</div>
          <div class="chip-list">${residentChips}</div>
        </div>

        ${
          loc.wiki_sublocations && loc.wiki_sublocations.length > 0
            ? `
        <div>
          <div class="panel-section-title">Canonical Sub-Locations (Touhou Wiki)</div>
          <div class="chip-list">
            ${loc.wiki_sublocations.map((s) => `<span class="badge">🏛️ ${s}</span>`).join('')}
          </div>
        </div>`
            : ''
        }

        ${
          loc.wiki_summary
            ? `
        <div>
          <div class="panel-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>📖 Official Touhou Wiki Canon</span>
            ${
              loc.wiki_url
                ? `<a href="${loc.wiki_url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-hakurei);text-decoration:none;font-weight:700;">↗ Touhou Wiki</a>`
                : ''
            }
          </div>
          <div style="font-size:12.5px;line-height:1.5;color:var(--ink-secondary);max-height:190px;overflow-y:auto;background:var(--paper-card-alt);padding:8px 10px;border-radius:6px;border:1px solid rgba(90,70,56,0.25);white-space:pre-line;">${loc.wiki_summary.slice(0, 1200)}${loc.wiki_summary.length > 1200 ? '…' : ''}</div>
        </div>`
            : ''
        }

        <div>
          <div class="panel-section-title">Direct Connected Waypoints</div>
          <div class="chip-list">${connectedChips}</div>
        </div>

        <div>
          <div class="panel-section-title">Cartographic &amp; Canon Provenance</div>
          <div style="font-size:12px;color:var(--ink-secondary);line-height:1.45;margin-bottom:6px;">
            <strong>First Appearance:</strong> ${loc.first_appearance}<br/>
            <strong>Placement Note:</strong> ${loc.placement_note} (${(loc.x * 100).toFixed(1)}%, ${(loc.y * 100).toFixed(1)}%)
          </div>
          <div class="panel-badges">${sourceList}</div>
        </div>
      </div>
    `;

    panel.querySelector('.side-panel-close')?.addEventListener('click', () => {
      store.update({ selectedId: null });
      window.history.replaceState(null, '', window.location.pathname);
    });

    panel.querySelector('#btn-route-start')?.addEventListener('click', () => {
      const endId = store.getState().routeEndId ?? (loc.id === 'human-village' ? 'hakurei-shrine' : 'human-village');
      store.update({ routeMode: true });
      store.setRouteEndpoints(loc.id, endId);
    });

    panel.querySelector('#btn-route-end')?.addEventListener('click', () => {
      const startId = store.getState().routeStartId ?? (loc.id === 'human-village' ? 'hakurei-shrine' : 'human-village');
      store.update({ routeMode: true });
      store.setRouteEndpoints(startId, loc.id);
    });

    panel.querySelector('#btn-copy-citation')?.addEventListener('click', (ev) => {
      const btn = ev.currentTarget as HTMLButtonElement;
      const snippet = `${loc.name_en} (${loc.name_jp}) — ${loc.atlas_sector ?? loc.region} | Travel: ${loc.travel_time ?? 'N/A'} | Route: ${loc.approach_route ?? loc.placement_note}`;
      navigator.clipboard?.writeText(snippet);
      const prev = btn.textContent;
      btn.textContent = '✓ Copied to Clipboard!';
      setTimeout(() => {
        btn.textContent = prev;
      }, 1800);
    });

    panel.querySelectorAll('.resident-chip').forEach((el) => {
      el.addEventListener('click', () => {
        const res = el.getAttribute('data-resident') ?? '';
        store.update({ searchQuery: res });
        const input = document.querySelector<HTMLInputElement>('#atlas-search-input');
        if (input) input.value = res;
      });
    });

    panel.querySelectorAll('.conn-chip').forEach((el) => {
      el.addEventListener('click', () => {
        const targetId = el.getAttribute('data-target');
        if (targetId) {
          store.update({ selectedId: targetId });
          mapCanvas.flyToLocation(targetId, 2.5);
          window.history.replaceState(null, '', `#loc=${targetId}`);
        }
      });
    });
  });
}
