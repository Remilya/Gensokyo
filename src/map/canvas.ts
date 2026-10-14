import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { MAP_HEIGHT, MAP_WIDTH, store } from '../state';
import type { TerrainData } from '../types';
import { renderAtmosphereLayer } from './atmosphere';
import { renderBorderLayer } from './border';
import { renderLabelsLayer } from './labels';
import { renderMarkersLayer } from './markers';
import { renderRoadsLayer, updateActiveRouteOverlay } from './roads';
import { renderFootprintsLayer, renderTerrainLayer } from './terrain';
import { renderWaterLayer } from './water';

export class MapCanvas {
  public svgEl: SVGSVGElement;
  public cameraGroup: SVGGElement;
  private terrainGroup: SVGGElement;
  private waterGroup: SVGGElement;
  private footprintsGroup: SVGGElement;
  private roadsGroup: SVGGElement;
  private borderGroup: SVGGElement;
  private atmoGroup: SVGGElement;
  private markersGroup: SVGGElement;
  private labelsGroup: SVGGElement;
  private tooltipEl: HTMLDivElement;

  private zoomBehavior: ZoomBehavior<SVGSVGElement, unknown>;

  constructor(container: HTMLElement, terrainData: TerrainData) {
    const viewport = document.createElement('div');
    viewport.className = 'atlas-viewport';

    this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgEl.setAttribute('class', 'atlas-svg');
    this.svgEl.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);
    this.svgEl.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    this.svgEl.innerHTML = `
      <defs>
        <!-- Parchment Base Radial Gradient -->
        <radialGradient id="parchment-grad" cx="50%" cy="48%" r="65%">
          <stop offset="0%" stop-color="var(--paper-bg)" />
          <stop offset="75%" stop-color="var(--paper-bg)" />
          <stop offset="100%" stop-color="var(--paper-edge)" />
        </radialGradient>

        <!-- Lantern Radial Gradient (Night Mode) -->
        <radialGradient id="lantern-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffcf5c" stop-opacity="0.72" />
          <stop offset="55%" stop-color="#ff8c3b" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#ff8c3b" stop-opacity="0" />
        </radialGradient>

        <!-- Mist Radial Gradient -->
        <radialGradient id="mist-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f7f4ec" stop-opacity="0.48" />
          <stop offset="65%" stop-color="#e8e2d5" stop-opacity="0.20" />
          <stop offset="100%" stop-color="#e8e2d5" stop-opacity="0" />
        </radialGradient>

        <!-- Great Hakurei Barrier Gradient -->
        <linearGradient id="barrier-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b6342a" />
          <stop offset="50%" stop-color="#8b4899" />
          <stop offset="100%" stop-color="#c8963e" />
        </linearGradient>
      </defs>

      <g id="camera">
        <rect id="layer-paper" x="-400" y="-300" width="${MAP_WIDTH + 800}" height="${MAP_HEIGHT + 600}" fill="url(#parchment-grad)" />
        <image
          class="parchment-tex-img"
          href="https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui/parchment-texture.webp"
          x="0"
          y="0"
          width="${MAP_WIDTH}"
          height="${MAP_HEIGHT}"
          preserveAspectRatio="none"
          opacity="0.88"
          pointer-events="none"
        />
        <g id="layer-terrain"></g>
        <g id="layer-water"></g>
        <g id="layer-footprints"></g>
        <g id="layer-roads"></g>
        <g id="layer-border"></g>
        <g id="layer-atmosphere"></g>
        <g id="layer-markers"></g>
        <g id="layer-labels"></g>
      </g>
    `;

    const vignette = document.createElement('div');
    vignette.className = 'atlas-vignette';

    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'map-tooltip';

    viewport.appendChild(this.svgEl);
    viewport.appendChild(vignette);
    viewport.appendChild(this.tooltipEl);
    container.appendChild(viewport);

    this.cameraGroup = this.svgEl.querySelector('#camera') as SVGGElement;
    this.terrainGroup = this.svgEl.querySelector('#layer-terrain') as SVGGElement;
    this.waterGroup = this.svgEl.querySelector('#layer-water') as SVGGElement;
    this.footprintsGroup = this.svgEl.querySelector('#layer-footprints') as SVGGElement;
    this.roadsGroup = this.svgEl.querySelector('#layer-roads') as SVGGElement;
    this.borderGroup = this.svgEl.querySelector('#layer-border') as SVGGElement;
    this.atmoGroup = this.svgEl.querySelector('#layer-atmosphere') as SVGGElement;
    this.markersGroup = this.svgEl.querySelector('#layer-markers') as SVGGElement;
    this.labelsGroup = this.svgEl.querySelector('#layer-labels') as SVGGElement;

    // Set initial CSS scale variable and tier visibility class
    this.svgEl.style.setProperty('--marker-inv-scale', '1');
    this.svgEl.classList.add('hide-tier-3');

    // Render static/base layers once
    renderTerrainLayer(this.terrainGroup, terrainData);
    renderWaterLayer(this.waterGroup, terrainData);
    renderFootprintsLayer(this.footprintsGroup);
    renderRoadsLayer(this.roadsGroup, store.getRoutes());
    renderBorderLayer(this.borderGroup);
    renderAtmosphereLayer(this.atmoGroup);

    // Initialize d3-zoom with requestAnimationFrame batching & interaction state
    let rafId = 0;
    let pendingTransform: ZoomTransform | null = null;
    let interactTimer = 0;

    const getLodTier = (k: number): number => {
      if (k < 1.15) return 0;
      if (k < 1.55) return 1;
      if (k < 2.05) return 2;
      if (k < 2.65) return 3;
      return 4;
    };

    this.zoomBehavior = zoom<SVGSVGElement, unknown>()
      .clickDistance(6)
      .scaleExtent([0.65, 9])
      .translateExtent([
        [-300, -250],
        [MAP_WIDTH + 300, MAP_HEIGHT + 250],
      ])
      .on('start', () => {
        window.clearTimeout(interactTimer);
      })
      .on('zoom', (event) => {
        const t: ZoomTransform = event.transform;
        this.svgEl.classList.add('is-interacting');
        this.tooltipEl.classList.remove('visible');
        // Apply camera transform immediately for zero-latency panning
        this.cameraGroup.setAttribute(
          'transform',
          `translate(${t.x.toFixed(1)},${t.y.toFixed(1)}) scale(${t.k.toFixed(4)})`
        );
        pendingTransform = t;
        if (!rafId) {
          rafId = window.requestAnimationFrame(() => {
            rafId = 0;
            if (!pendingTransform) return;
            const pt = pendingTransform;
            const invScale = Math.max(0.42, Math.min(1.15, 1 / Math.pow(pt.k, 0.55)));
            this.svgEl.style.setProperty('--marker-inv-scale', invScale.toFixed(3));
            const hasSearch = Boolean(store.getState().searchQuery.trim());
            this.svgEl.classList.toggle('hide-tier-3', pt.k < 1.5 && !hasSearch);
            store.update({ zoom: { x: pt.x, y: pt.y, k: pt.k } });
          });
        }
      })
      .on('end', () => {
        interactTimer = window.setTimeout(() => {
          this.svgEl.classList.remove('is-interacting');
        }, 120);
      });

    select(this.svgEl).call(this.zoomBehavior);

    let lastHoveredId: string | null = null;
    this.cameraGroup.addEventListener('mousemove', (e) => {
      if (this.svgEl.classList.contains('is-interacting')) return;
      const target = (e.target as Element).closest('.map-marker, .map-label') as SVGGElement | null;
      if (!target) {
        if (lastHoveredId !== null) {
          lastHoveredId = null;
          this.tooltipEl.classList.remove('visible');
        }
        return;
      }
      const id = target.getAttribute('data-id');
      if (!id) return;

      if (id !== lastHoveredId) {
        lastHoveredId = id;
        const loc = store.getLocation(id);
        if (!loc) return;
        this.tooltipEl.innerHTML = `
          <div>
            <span class="tooltip-title">${loc.name_en}</span>
            <span class="tooltip-jp">${loc.name_jp}</span>
          </div>
          <div class="tooltip-desc">${loc.short_desc}</div>
        `;
        this.tooltipEl.classList.add('visible');
      }

      const tx = Math.min(window.innerWidth - 285, e.clientX + 14);
      const ty = Math.min(window.innerHeight - 100, e.clientY + 14);
      this.tooltipEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    this.svgEl.addEventListener('mouseleave', () => {
      lastHoveredId = null;
      this.tooltipEl.classList.remove('visible');
    });

    // Reliable pointer tap/click detection for markers, labels, and empty background
    // (Uses pointerdown/pointerup so d3-zoom's mousedown/mouseup capture never swallows clicks)
    let downX = 0;
    let downY = 0;
    let downTarget: SVGGElement | null = null;
    let lastSelectTime = 0;

    const handleSelectOrDeselect = (target: SVGGElement | null) => {
      const now = performance.now();
      if (now - lastSelectTime < 80) return; // debounce duplicate pointerup + click
      lastSelectTime = now;

      if (target) {
        const id = target.getAttribute('data-id');
        if (!id) return;

        const st = store.getState();
        if (st.routeMode) {
          if (!st.routeStartId || (st.routeStartId && st.routeEndId)) {
            store.setRouteEndpoints(id, null);
          } else if (st.routeStartId !== id) {
            store.setRouteEndpoints(st.routeStartId, id);
          }
        }
        store.update({ selectedId: id, selectedCharacterId: null });
        window.history.replaceState(null, '', `#loc=${id}`);
        return;
      }

      if (store.getState().selectedId || store.getState().selectedCharacterId) {
        store.update({ selectedId: null, selectedCharacterId: null });
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    this.svgEl.addEventListener(
      'pointerdown',
      (e) => {
        if (e.button !== 0) return;
        downX = e.clientX;
        downY = e.clientY;
        downTarget = (e.target as Element).closest('.map-marker, .map-label') as SVGGElement | null;
      },
      { capture: true }
    );

    this.svgEl.addEventListener(
      'pointerup',
      (e) => {
        if (e.button !== 0) return;
        const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
        if (dist > 8) return;
        const upTarget =
          ((e.target as Element).closest('.map-marker, .map-label') as SVGGElement | null) ??
          downTarget;
        handleSelectOrDeselect(upTarget);
      },
      { capture: true }
    );

    this.svgEl.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      const target = (e.target as Element).closest('.map-marker, .map-label') as SVGGElement | null;
      handleSelectOrDeselect(target);
    });

    // Subscribe to state updates (separated so pan/zoom never rebuilds marker DOM!)
    let lastLodTier = getLodTier(1);
    let lastSelected: string | null = null;
    let lastQuery = '';
    let lastRegion = 'All';
    let lastKind = 'All';
    let lastComputedRoute = store.getState().computedRoute;

    store.subscribe((state) => {
      this.footprintsGroup.style.display = state.showFootprints ? 'block' : 'none';
      this.roadsGroup.style.display = state.showRoutes ? 'block' : 'none';

      if (state.computedRoute !== lastComputedRoute) {
        lastComputedRoute = state.computedRoute;
        updateActiveRouteOverlay(this.roadsGroup, state.computedRoute);
      }

      const filterOrSelectionChanged =
        state.selectedId !== lastSelected ||
        state.searchQuery !== lastQuery ||
        state.regionFilter !== lastRegion ||
        state.kindFilter !== lastKind;

      const lodTier = getLodTier(state.zoom.k);
      const lodChanged = lodTier !== lastLodTier;

      if (filterOrSelectionChanged) {
        lastSelected = state.selectedId;
        lastQuery = state.searchQuery;
        lastRegion = state.regionFilter;
        lastKind = state.kindFilter;

        const hasSearch = Boolean(state.searchQuery.trim());
        this.svgEl.classList.toggle('hide-tier-3', state.zoom.k < 1.5 && !hasSearch);

        renderMarkersLayer(
          this.markersGroup,
          store.getLocations(),
          state.selectedId,
          state.zoom.k,
          state.searchQuery,
          state.regionFilter,
          state.kindFilter
        );
      }

      if (filterOrSelectionChanged || lodChanged) {
        lastLodTier = lodTier;
        renderLabelsLayer(
          this.labelsGroup,
          store.getLocations(),
          state.selectedId,
          state.zoom.k,
          state.regionFilter,
          state.kindFilter
        );
      }
    });

    // Initial render of markers & labels
    renderMarkersLayer(this.markersGroup, store.getLocations(), null, 1, '', 'All', 'All');
    renderLabelsLayer(this.labelsGroup, store.getLocations(), null, 1, 'All', 'All');
  }

  public zoomByFactor(factor: number) {
    select(this.svgEl).call(this.zoomBehavior.scaleBy, factor);
  }

  public resetView() {
    select(this.svgEl).call(this.zoomBehavior.transform, zoomIdentity);
  }

  public flyToNormalized(nx: number, ny: number, targetK = 2.6) {
    const rect = this.svgEl.getBoundingClientRect();
    // Convert screen center to SVG viewBox coordinates
    const scaleX = MAP_WIDTH / Math.max(1, rect.width);
    const scaleY = MAP_HEIGHT / Math.max(1, rect.height);
    const viewScale = Math.max(scaleX, scaleY);
    const vbCenterX = MAP_WIDTH / 2;
    const vbCenterY = MAP_HEIGHT / 2;

    const targetX = nx * MAP_WIDTH;
    const targetY = ny * MAP_HEIGHT;
    const tx = vbCenterX - targetX * targetK * (1 / Math.max(0.5, viewScale * 0 + 1));
    const ty = vbCenterY - targetY * targetK;

    const transform = zoomIdentity.translate(tx, ty).scale(targetK);
    select(this.svgEl). call(this.zoomBehavior.transform, transform);
  }

  public flyToLocation(id: string, targetK = 2.6) {
    const loc = store.getLocation(id);
    if (!loc) return;
    this.flyToNormalized(loc.x, loc.y, targetK);
  }
}
