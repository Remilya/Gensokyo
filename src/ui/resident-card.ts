import {
  getResidentPlacement,
  RESIDENT_PLACEMENTS,
  type ResidentPlacement,
} from '../data/resident-placements';
import type { MapCanvas } from '../map/canvas';
import { getResidentPixelSpriteDataUrl } from '../map/characters2d';
import { store } from '../state';

export function mountResidentPopupCard(container: HTMLElement, mapCanvas: MapCanvas) {
  const card = document.createElement('div');
  card.className = 'resident-rpg-card';
  card.style.display = 'none';
  container.appendChild(card);

  let lastPopupCharId: string | null = null;

  function renderCard(charId: string | null) {
    if (!charId) {
      card.style.display = 'none';
      card.classList.remove('is-open');
      return;
    }

    const ch = store.getCharacter(charId);
    const placement = getResidentPlacement(charId);
    if (!ch && !placement) {
      card.style.display = 'none';
      return;
    }

    const accent = placement?.accentColor ?? '#d83848';
    const primary = placement?.outfitPrimary ?? '#282434';
    const pixelUrl = placement ? getResidentPixelSpriteDataUrl(placement) : '';
    const locId = placement?.locationId ?? ch?.home_location_ids?.[0] ?? null;
    const loc = store.getLocation(locId);

    // Find nearby/fellow residents in the same compound or region
    const nearbyResidents: ResidentPlacement[] = placement
      ? RESIDENT_PLACEMENTS.filter(
          (r) =>
            r.id !== placement.id &&
            (r.locationId === placement.locationId ||
              Math.hypot(r.x - placement.x, r.y - placement.y) < 0.085)
        ).slice(0, 6)
      : [];

    const nearbyHtml =
      nearbyResidents.length > 0
        ? `
          <div class="rpg-card-nearby">
            <span class="rpg-nearby-label">Nearby:</span>
            <div class="rpg-nearby-list">
              ${nearbyResidents
                .map(
                  (nr) => `
                  <button
                    class="rpg-nearby-btn"
                    data-near-id="${nr.id}"
                    title="${nr.shortName} — ${nr.spotLabel}"
                  >
                    <img src="${getResidentPixelSpriteDataUrl(nr)}" alt="${nr.shortName}" />
                    <span>${nr.shortName}</span>
                  </button>
                `
                )
                .join('')}
            </div>
          </div>
        `
        : '';

    card.style.setProperty('--rpg-accent', accent);
    card.style.setProperty('--rpg-primary', primary);
    card.style.display = 'block';
    requestAnimationFrame(() => card.classList.add('is-open'));

    card.innerHTML = `
      <div class="rpg-card-header">
        <div class="rpg-avatar-stage">
          <div class="rpg-pixel-frame" title="Chibi Pixel Sprite">
            ${
              pixelUrl
                ? `<img class="rpg-pixel-sprite" src="${pixelUrl}" alt="${ch?.name_en ?? placement?.shortName}" />`
                : ''
            }
          </div>
          ${
            ch?.sprite_url
              ? `
                <div class="rpg-dairi-thumb" id="rpg-dairi-open" title="Click to open full Chronicle">
                  <img src="${ch.sprite_url}" alt="${ch.name_en}" loading="eager" />
                </div>
              `
              : ''
          }
        </div>

        <div class="rpg-title-col">
          <div class="rpg-badges-row">
            <span class="rpg-species-badge">${ch?.species ?? 'Resident'}</span>
            ${
              placement
                ? `<span class="rpg-spot-badge">📍 ${placement.spotLabel}</span>`
                : ''
            }
          </div>
          <h3 class="rpg-char-name">${ch?.name_en ?? placement?.shortName}</h3>
          <div class="rpg-char-jp">
            <span>${ch?.name_jp ?? ''}</span>
            ${ch?.title ? `<span class="rpg-char-epithet">• “${ch.title}”</span>` : ''}
          </div>
        </div>

        <button class="rpg-card-close" id="rpg-btn-close" title="Close (Esc)">✕</button>
      </div>

      ${
        placement?.quote
          ? `
            <div class="rpg-dialogue-box">
              <span class="rpg-dialogue-speaker">${placement.shortName}:</span>
              <p class="rpg-dialogue-text">${placement.quote}</p>
            </div>
          `
          : ''
      }

      <div class="rpg-stats-grid">
        ${
          ch?.abilities
            ? `
              <div class="rpg-stat-item">
                <span class="rpg-stat-label">✨ Ability</span>
                <span class="rpg-stat-val">${ch.abilities}</span>
              </div>
            `
            : ''
        }
        ${
          ch?.theme_music
            ? `
              <div class="rpg-stat-item">
                <span class="rpg-stat-label">🎵 Theme</span>
                <span class="rpg-stat-val">${ch.theme_music}</span>
              </div>
            `
            : ''
        }
      </div>

      ${nearbyHtml}

      <div class="rpg-card-actions">
        <button class="rpg-action-primary" id="rpg-btn-full-dossier">
          📖 Open Full Chronicle ▸
        </button>
        ${
          loc
            ? `
              <button class="rpg-action-secondary" id="rpg-btn-inspect-loc">
                ⛩️ ${loc.name_en}
              </button>
            `
            : ''
        }
      </div>
    `;

    card.querySelector('#rpg-btn-close')?.addEventListener('click', () => {
      store.update({ popupCharacterId: null });
    });

    const openFullChronicle = () => {
      if (!ch) return;
      store.update({
        selectedId: locId,
        selectedCharacterId: ch.id,
        popupCharacterId: null,
      });
      window.history.replaceState(null, '', `#char=${ch.id}`);
    };

    card.querySelector('#rpg-btn-full-dossier')?.addEventListener('click', openFullChronicle);
    card.querySelector('#rpg-dairi-open')?.addEventListener('click', openFullChronicle);

    card.querySelector('#rpg-btn-inspect-loc')?.addEventListener('click', () => {
      if (!locId) return;
      store.update({
        selectedId: locId,
        selectedCharacterId: null,
        popupCharacterId: null,
      });
      window.history.replaceState(null, '', `#loc=${locId}`);
    });

    card.querySelectorAll<HTMLButtonElement>('.rpg-nearby-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nearId = btn.getAttribute('data-near-id');
        if (!nearId) return;
        const nearPlacement = getResidentPlacement(nearId);
        store.update({ popupCharacterId: nearId });
        if (store.getState().view3d && mapCanvas.atlas3d) {
          mapCanvas.atlas3d.flyToCharacter3D(nearId);
        } else if (nearPlacement) {
          mapCanvas.flyToNormalized(nearPlacement.x, nearPlacement.y, Math.max(store.getState().zoom.k, 2.5));
        }
      });
    });
  }

  store.subscribe((state) => {
    if (state.popupCharacterId !== lastPopupCharId) {
      lastPopupCharId = state.popupCharacterId;
      renderCard(state.popupCharacterId);
    }
  });
}
