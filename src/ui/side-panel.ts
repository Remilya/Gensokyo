import type { MapCanvas } from '../map/canvas';
import { store } from '../state';
import type { CharacterEntry, CharacterRelation, LocationEntry } from '../types';

function renderRelationCards(
  relations: CharacterRelation[],
  kindClass: 'ally' | 'rival' | 'acq',
  emptyText: string
): string {
  if (!relations || relations.length === 0) {
    return `<div style="font-size:12px;color:var(--ink-muted);font-style:italic;">${emptyText}</div>`;
  }

  return `
    <div class="char-rel-list">
      ${relations
        .map((rel) => {
          const targetChar = store.getCharacter(rel.id) ?? store.getCharacter(rel.name);
          const targetLoc = !targetChar ? store.getLocation(rel.id) : undefined;
          const clickableAttr = targetChar
            ? `data-char-id="${targetChar.id}" class="char-rel-card ${kindClass} is-clickable"`
            : targetLoc
            ? `data-loc-id="${targetLoc.id}" class="char-rel-card ${kindClass} is-clickable"`
            : `class="char-rel-card ${kindClass}"`;
          const badge = targetChar
            ? `<span class="char-rel-Sub">${targetChar.name_jp || targetChar.species} ▸</span>`
            : targetLoc
            ? `<span class="char-rel-Sub">📍 Location ▸</span>`
            : '';

          return `
            <div ${clickableAttr}>
              <div class="char-rel-header">
                <span class="char-rel-name">${rel.name}</span>
                ${badge}
              </div>
              <div class="char-rel-summary">${rel.summary}</div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

export function mountSidePanel(container: HTMLElement, mapCanvas: MapCanvas) {
  const panel = document.createElement('aside');
  panel.className = 'side-panel';
  container.appendChild(panel);

  let currentLocId: string | null = null;
  let currentCharId: string | null = null;

  function renderCharacterDossier(ch: CharacterEntry, returnLoc: LocationEntry | undefined) {
    const homeLocs = (ch.home_location_ids ?? [])
      .map((lid) => store.getLocation(lid))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const homeChips =
      homeLocs.length > 0
        ? homeLocs
            .map(
              (l) =>
                `<span class="chip conn-chip" data-target="${l.id}">⛩️ ${l.name_en} <small style="opacity:0.75;">(${l.name_jp})</small></span>`
            )
            .join('')
        : `<span style="font-size:12px;color:var(--ink-muted);">Wandering across Gensokyo</span>`;

    const factsHtml =
      ch.key_facts && ch.key_facts.length > 0
        ? `
          <ul class="char-facts-list">
            ${ch.key_facts.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        `
        : '';

    panel.innerHTML = `
      <div class="side-panel-header char-dossier-header">
        <div class="char-nav-bar">
          ${
            returnLoc
              ? `<button class="hud-chip-btn" id="btn-back-loc">← Back to ${returnLoc.name_en}</button>`
              : homeLocs[0]
              ? `<button class="hud-chip-btn" id="btn-back-loc">⛩️ Go to ${homeLocs[0].name_en}</button>`
              : `<span></span>`
          }
          <button class="side-panel-close" title="Close (Esc)" style="position:static;">✕</button>
        </div>
        <div class="panel-badges" style="margin-top:6px;">
          <span class="badge canon">👤 Character Chronicle</span>
          <span class="badge">${ch.species}</span>
          ${ch.age ? `<span class="badge">${ch.age}</span>` : ''}
        </div>
        <h2 class="panel-title-en">${ch.name_en}</h2>
        <div class="panel-title-jp">${ch.name_jp} ${ch.title ? `• <em>${ch.title}</em>` : ''}</div>
        ${ch.tagline ? `<div class="char-tagline">${ch.tagline}</div>` : ''}
      </div>

      <div class="side-panel-body">
        <div class="panel-actions-row">
          ${
            homeLocs[0]
              ? `<button class="panel-action-btn" id="btn-fly-char-home">📍 Focus ${homeLocs[0].name_en}</button>`
              : ''
          }
          <a
            href="${ch.wiki_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="panel-action-btn"
            style="text-decoration:none;text-align:center;"
          >📖 Official Touhou Wiki ↗</a>
        </div>

        <div>
          <div class="panel-section-title">Who They Are</div>
          <p class="panel-lore-text">${ch.who_they_are}</p>
          ${factsHtml}
        </div>

        <div>
          <div class="panel-section-title">Profile &amp; Signature Powers</div>
          <div class="atlas-spatial-box">
            <div class="atlas-spatial-item"><strong>Role &amp; Occupation:</strong> ${ch.occupation}</div>
            <div class="atlas-spatial-item"><strong>Signature Abilities:</strong> ${ch.abilities}</div>
            ${ch.theme_music ? `<div class="atlas-spatial-item"><strong>Signature Theme:</strong> ♪ ${ch.theme_music}</div>` : ''}
            <div class="atlas-spatial-item"><strong>Debut Appearance:</strong> ${ch.first_appearance}</div>
          </div>
        </div>

        <div>
          <div class="panel-section-title">Personality &amp; Demeanor</div>
          <div class="char-personality-box">${ch.personality}</div>
        </div>

        <div>
          <div class="panel-section-title">💚 Who They Like — Friends, Family &amp; Allies</div>
          ${renderRelationCards(
            ch.allies,
            'ally',
            'Independent spirit with few formal alliances.'
          )}
        </div>

        <div>
          <div class="panel-section-title">⚔️ Enemies, Rivals &amp; Friction</div>
          ${renderRelationCards(
            ch.rivals,
            'rival',
            'No sworn arch-enemies recorded outside friendly Spell Card duels.'
          )}
        </div>

        ${
          ch.acquaintances && ch.acquaintances.length > 0
            ? `
        <div>
          <div class="panel-section-title">🤝 Notable Associates &amp; Encounters</div>
          ${renderRelationCards(ch.acquaintances, 'acq', '')}
        </div>`
            : ''
        }

        <div>
          <div class="panel-section-title">⛩️ Associated Haunts &amp; Locations</div>
          <div class="chip-list">${homeChips}</div>
        </div>
      </div>
    `;

    panel.querySelector('.side-panel-close')?.addEventListener('click', () => {
      store.update({ selectedId: null, selectedCharacterId: null });
      window.history.replaceState(null, '', window.location.pathname);
    });

    panel.querySelector('#btn-back-loc')?.addEventListener('click', () => {
      const targetId = returnLoc?.id ?? homeLocs[0]?.id ?? null;
      store.update({ selectedId: targetId, selectedCharacterId: null });
      if (targetId) {
        mapCanvas.flyToLocation(targetId, 2.5);
        window.history.replaceState(null, '', `#loc=${targetId}`);
      }
    });

    panel.querySelector('#btn-fly-char-home')?.addEventListener('click', () => {
      if (homeLocs[0]) {
        mapCanvas.flyToLocation(homeLocs[0].id, 2.6);
      }
    });

    panel.querySelectorAll('.char-rel-card.is-clickable').forEach((card) => {
      card.addEventListener('click', () => {
        const nextCharId = card.getAttribute('data-char-id');
        const nextLocId = card.getAttribute('data-loc-id');
        if (nextCharId) {
          const nextChar = store.getCharacter(nextCharId);
          const homeId = nextChar?.home_location_ids?.[0] ?? store.getState().selectedId;
          store.update({ selectedId: homeId, selectedCharacterId: nextCharId });
          if (homeId) mapCanvas.flyToLocation(homeId, 2.5);
          window.history.replaceState(null, '', `#char=${nextCharId}`);
          panel.querySelector('.side-panel-body')?.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (nextLocId) {
          store.update({ selectedId: nextLocId, selectedCharacterId: null });
          mapCanvas.flyToLocation(nextLocId, 2.5);
          window.history.replaceState(null, '', `#loc=${nextLocId}`);
        }
      });
    });

    panel.querySelectorAll('.conn-chip').forEach((el) => {
      el.addEventListener('click', () => {
        const targetId = el.getAttribute('data-target');
        if (targetId) {
          store.update({ selectedId: targetId, selectedCharacterId: null });
          mapCanvas.flyToLocation(targetId, 2.5);
          window.history.replaceState(null, '', `#loc=${targetId}`);
        }
      });
    });
  }

  function renderLocationDossier(loc: LocationEntry) {
    const residents = loc.residents ?? [];
    const residentChips =
      residents.length > 0
        ? residents
            .map((r) => {
              const matchedChar = store.getCharacter(r);
              if (matchedChar) {
                return `<span class="chip resident-chip has-dossier" data-char-id="${matchedChar.id}" title="Open Character Chronicle for ${matchedChar.name_en}">👤 ${r} <strong style="color:var(--accent-hakurei);">▸</strong></span>`;
              }
              return `<span class="chip resident-chip" data-resident="${r.replace(/"/g, '&quot;')}">👤 ${r}</span>`;
            })
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
          <div class="panel-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>Notable Residents &amp; Figures</span>
            <span style="font-size:10px;color:var(--accent-hakurei);font-family:var(--font-sans);text-transform:none;font-weight:600;">Click a character to read dossier ▸</span>
          </div>
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
      store.update({ selectedId: null, selectedCharacterId: null });
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
        const charId = el.getAttribute('data-char-id');
        if (charId) {
          store.update({ selectedCharacterId: charId });
          window.history.replaceState(null, '', `#char=${charId}`);
          panel.querySelector('.side-panel-body')?.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
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
          store.update({ selectedId: targetId, selectedCharacterId: null });
          mapCanvas.flyToLocation(targetId, 2.5);
          window.history.replaceState(null, '', `#loc=${targetId}`);
        }
      });
    });
  }

  store.subscribe((state) => {
    if (state.selectedId === currentLocId && state.selectedCharacterId === currentCharId) return;
    currentLocId = state.selectedId;
    currentCharId = state.selectedCharacterId;

    if (!currentLocId && !currentCharId) {
      panel.classList.remove('open');
      document.body.classList.remove('panel-open');
      return;
    }

    panel.classList.add('open');
    document.body.classList.add('panel-open');

    if (currentCharId) {
      const ch = store.getCharacter(currentCharId);
      if (ch) {
        const returnLoc = currentLocId ? store.getLocation(currentLocId) : undefined;
        renderCharacterDossier(ch, returnLoc);
        return;
      }
    }

    if (currentLocId) {
      const loc = store.getLocation(currentLocId);
      if (loc) {
        renderLocationDossier(loc);
      }
    }
  });
}
