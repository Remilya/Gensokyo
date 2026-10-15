import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  getResidentPlacement,
  RESIDENT_PLACEMENTS,
  type ResidentPlacement,
} from '../data/resident-placements';
import { getResidentPixelSpriteDataUrl } from '../map/characters2d';
import { KIND_COLOR } from '../map/markers';
import { MAP_HEIGHT, MAP_WIDTH, store } from '../state';
import type { ComputedRoute, LocationEntry, RouteEntry, TerrainData, TimeOfDay } from '../types';
import {
  buildChireiden3D,
  buildEientei3D,
  buildHakureiShrine3D,
  buildHumanVillage3D,
  buildMoriyaShrine3D,
  buildMyourenTemple3D,
  buildProceduralLandmark3D,
} from './landmarks/other-landmarks';
import { buildScarletDevilMansion3D } from './landmarks/sdm';
import {
  BLENDER_GLB_LANDMARKS,
  loadBlenderCharactersKit,
  loadBlenderFoliageKit,
  loadBlenderLandmarkGLB,
  loadWorldDioramaGLB,
  sharedEmissiveVertexMat,
  sharedOpaqueVertexMat,
  tagHierarchyWithLocationId,
} from './model-loader';

export const WORLD_W = MAP_WIDTH; // 2400
export const WORLD_D = MAP_HEIGHT; // 1600

export function normToWorldXZ(nx: number, ny: number): [number, number] {
  return [(nx - 0.5) * WORLD_W, (ny - 0.5) * WORLD_D];
}

function pointInPolygon(px: number, py: number, pts: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0];
    const yi = pts[i][1];
    const xj = pts[j][0];
    const yj = pts[j][1];
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegmentSq(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-12) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return (px - projX) * (px - projX) + (py - projY) * (py - projY);
}

function distToPolygonEdge(px: number, py: number, pts: [number, number][]): number {
  let minSq = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const dSq = distToSegmentSq(px, py, pts[j][0], pts[j][1], pts[i][0], pts[i][1]);
    if (dSq < minSq) minSq = dSq;
  }
  return Math.sqrt(minSq);
}

/**
 * Returns a smooth [0..1] weight for a polygon with feathered edges of width `feather`.
 */
function smoothPolygonWeight(
  px: number,
  py: number,
  pts: [number, number][],
  feather: number
): number {
  const inside = pointInPolygon(px, py, pts);
  const d = distToPolygonEdge(px, py, pts);
  if (inside) {
    return smoothstep(0, feather, d + feather * 0.5);
  }
  if (d < feather) {
    return 0.5 * (1 - smoothstep(0, feather, d));
  }
  return 0;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Deterministic 3D elevation function over normalized coordinates (nx, ny) in [0..1]
 * Synced with Blender's gensokyo-diorama-dressings.glb and flattens buildable pads around major 3D compounds.
 */
export function getTerrainElevation(nx: number, ny: number): number {
  // Base gentle basin bowl with subtle rolling valley hills
  let h =
    4.0 +
    Math.sin(nx * 19.0) * Math.cos(ny * 15.0) * 1.6 +
    Math.sin((nx + ny) * 37.0) * 0.65;

  // 1. Youkai Mountain Grand Massif (centered around 0.658, 0.155)
  const dxY = (nx - 0.658) / 0.195;
  const dyY = (ny - 0.155) / 0.135;
  const dYoukai = Math.hypot(dxY, dyY);
  if (dYoukai < 1.38) {
    const angle = Math.atan2(dyY, dxY);
    const ridgeMod =
      1.0 +
      0.12 * Math.cos(angle * 5.0 + 0.4) +
      0.07 * Math.sin(angle * 9.0 - 1.1) * smoothstep(0.15, 0.85, dYoukai);
    const m = Math.pow(Math.max(0, 1 - dYoukai / 1.38), 1.55);
    const stepped = Math.floor(m * 8) / 8;
    h += (m * 0.76 + stepped * 0.24) * 172 * ridgeMod;
  }

  // Wind God's Lake summit caldera depression (0.688, 0.112)
  const dWindLake = Math.hypot((nx - 0.688) / 0.044, (ny - 0.112) / 0.032);
  if (dWindLake < 1.0) {
    h -= (1 - dWindLake * dWindLake) * 24;
  }

  // 2. Western Hakurei Border Ridge (centered around 0.252, 0.318)
  const dHakurei = Math.hypot((nx - 0.252) / 0.115, (ny - 0.318) / 0.085);
  if (dHakurei < 1.25) {
    const mh = Math.pow(Math.max(0, 1 - dHakurei / 1.25), 1.5);
    h += mh * 56;
  }

  // 3. Eastern Mayohiga & Barrier Crags (0.91, 0.34)
  const dEastRidge = Math.hypot((nx - 0.91) / 0.085, (ny - 0.34) / 0.095);
  if (dEastRidge < 1.2) {
    h += Math.pow(Math.max(0, 1 - dEastRidge / 1.2), 1.6) * 46;
  }

  // 4. Netherworld / Hakugyokurou Elevated Cloud Terrace (0.38, 0.07)
  const dNether = Math.hypot((nx - 0.38) / 0.11, (ny - 0.07) / 0.055);
  if (dNether < 1.1) {
    h += (1 - smoothstep(0.5, 1.1, dNether)) * 34;
  }

  // 4b. Lunar Capital / Sea of Tranquility Plateau (0.91, 0.11)
  const dLunar = Math.hypot((nx - 0.91) / 0.085, (ny - 0.11) / 0.065);
  if (dLunar < 1.15) {
    h += (1 - smoothstep(0.55, 1.15, dLunar)) * 36;
  }

  // 5. Misty Lake Basin Depression (0.685, 0.79)
  const dMisty = Math.hypot((nx - 0.685) / 0.105, (ny - 0.79) / 0.09);
  if (dMisty < 1.05) {
    h -= (1 - smoothstep(0.4, 1.05, dMisty)) * 5.5;
  }

  // 6. Flatten buildable terraces around major 3D landmarks so compounds sit level
  const pads: [number, number, number, number, number][] = [
    // [cx, cy, rx, ry, targetHeight]
    [0.825, 0.745, 0.064, 0.082, 7.5], // Scarlet Devil Mansion & Full Estate Gardens
    [0.480, 0.460, 0.062, 0.062, 4.2], // Human Village
    [0.255, 0.320, 0.032, 0.038, 48.0], // Hakurei Shrine Hilltop
    [0.382, 0.585, 0.028, 0.032, 5.0], // Myouren Temple
    [0.855, 0.470, 0.028, 0.030, 5.2], // Eientei
    [0.645, 0.105, 0.030, 0.030, 108.0], // Moriya Shrine Summit
    [0.698, 0.148, 0.026, 0.024, 126.0], // Tengu Village Mountain Terrace
    [0.752, 0.245, 0.018, 0.020, 48.0], // Asama Purifying Mountain Sanctuary
    [0.562, 0.215, 0.014, 0.014, 39.0], // Moriya Branch Shrine / Radio Tower
    [0.125, 0.775, 0.028, 0.028, 4.5], // Palace of the Earth Spirits
    [0.355, 0.070, 0.042, 0.032, 38.0], // Hakugyokurou & Saigyou Ayakashi Terrace
    [0.912, 0.092, 0.038, 0.038, 39.5], // Lunar Capital & Jade Bridge Plateau
  ];

  for (const [cx, cy, rx, ry, targetH] of pads) {
    const d = Math.hypot((nx - cx) / rx, (ny - cy) / ry);
    if (d < 1.35) {
      const blend = 1 - smoothstep(0.65, 1.35, d);
      h = h * (1 - blend) + targetH * blend;
    }
  }

  return h;
}

const BIOME_HEX: Record<string, number> = {
  farmland: 0x9cb35b,
  forest: 0x456b3c,
  'magic-forest': 0x2f523b,
  bamboo: 0x4d7d46,
  sunflower: 0xc8a838,
  foothills: 0x7c8558,
  mountain: 0x766e62,
  peak: 0xe8e6df,
  wetland: 0x5e6e54,
  higan: 0xa2383e,
  netherworld: 0xdcb0c4,
  heaven: 0xe0d6b8,
  lunar: 0xbec8d8,
  underworld: 0x3a2b28,
  makai: 0x4a365c,
  'sdm-grounds': 0x526e4c,
  backdoor: 0x344234,
};

export interface Camera3DPreset {
  id: string;
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
}

/**
 * Extracts all child Mesh geometries from a procedural THREE.Group, baking each material's
 * RGB color into a `color` vertex attribute so 90+ minor landmarks can merge into 1 draw call.
 */
function bakeGroupToVertexColoredGeometries(
  root: THREE.Object3D,
  outGeoms: THREE.BufferGeometry[]
) {
  root.updateMatrixWorld(true);
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const geom = mesh.geometry.clone().toNonIndexed();
    geom.applyMatrix4(mesh.matrixWorld);

    // Strip extra attributes so mergeGeometries has a uniform attribute layout
    for (const key of Object.keys(geom.attributes)) {
      if (key !== 'position' && key !== 'normal') {
        geom.deleteAttribute(key);
      }
    }
    if (!geom.attributes.normal) {
      geom.computeVertexNormals();
    }

    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const col =
      (mat as THREE.MeshStandardMaterial)?.color ?? new THREE.Color(0xcccccc);
    const count = geom.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    outGeoms.push(geom);
  });
}

export class Atlas3DView {
  public containerEl: HTMLDivElement;
  private canvasEl: HTMLCanvasElement;
  private labelsContainer: HTMLDivElement;
  private cameraHudEl: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private ambientLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;
  private sdmPointLight: THREE.PointLight;
  private nightPointLights: THREE.PointLight[] = [];

  private routesGroup: THREE.Group;
  private activeRouteGroup: THREE.Group;
  private footprintsGroup: THREE.Group;
  private markersGroup: THREE.Group;
  private residentsGroup: THREE.Group;

  private floatingObjects: { obj: THREE.Object3D; baseY: number; phase: number }[] = [];
  private landmarkLoadPromises: Promise<unknown>[] = [];
  private terrainMesh: THREE.Mesh | null = null;
  private worldDioramaGroup: THREE.Group | null = null;
  private lakePolygons: { points: [number, number][]; surfaceY: number }[] = [];
  private raycaster = new THREE.Raycaster();
  private pointerDownPos = { x: 0, y: 0 };
  private pickSpheres: { id: string; center: THREE.Vector3; radiusSq: number }[] = [];
  private charPickSpheres: { charId: string; center: THREE.Vector3; radiusSq: number }[] = [];

  private labelEls = new Map<
    string,
    {
      el: HTMLDivElement;
      worldPos: THREE.Vector3;
      loc: LocationEntry;
      filteredOut: boolean;
      lastVis: boolean;
      lastX: number;
      lastY: number;
    }
  >();
  private charLabelEls = new Map<
    string,
    {
      el: HTMLDivElement;
      worldPos: THREE.Vector3;
      placement: ResidentPlacement;
      filteredOut: boolean;
      lastVis: boolean;
      lastX: number;
      lastY: number;
    }
  >();
  private viewportWidth = window.innerWidth;
  private viewportHeight = window.innerHeight;
  private labelsDirty = true;
  private isActive = false;
  private rafId = 0;

  // Smooth camera flight state
  private flyAnim: {
    startTime: number;
    duration: number;
    fromPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toPos: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null = null;

  constructor(hostViewport: HTMLElement, terrainData: TerrainData) {
    this.containerEl = document.createElement('div');
    this.containerEl.className = 'atlas-3d-container';
    this.containerEl.style.display = 'none';

    this.canvasEl = document.createElement('canvas');
    this.canvasEl.className = 'atlas-3d-canvas';
    this.containerEl.appendChild(this.canvasEl);

    this.labelsContainer = document.createElement('div');
    this.labelsContainer.className = 'atlas-3d-labels';
    this.containerEl.appendChild(this.labelsContainer);

    this.cameraHudEl = document.createElement('div');
    this.cameraHudEl.className = 'atlas-3d-cam-bar';
    this.containerEl.appendChild(this.cameraHudEl);

    hostViewport.appendChild(this.containerEl);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasEl,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Static shadow map caching: only re-render shadows when models load or Time of Day changes!
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce6f2);
    this.scene.fog = new THREE.FogExp2(0xdce6f2, 0.00038);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2.0, 4500);
    this.camera.position.set(0, 920, 980);

    this.controls = new OrbitControls(this.camera, this.canvasEl);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent clipping below terrain
    this.controls.minDistance = 12;
    this.controls.maxDistance = 2200;
    this.controls.target.set(0, 10, 40);

    // Lighting
    this.ambientLight = new THREE.HemisphereLight(0xfff6e6, 0x5c5346, 0.95);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff2d6, 1.65);
    this.sunLight.position.set(420, 680, 380);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 80;
    this.sunLight.shadow.camera.far = 2100;
    const d = 950;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Dedicated warm point lights over major landmarks for dusk/night (hidden during day so 0 fragment shader cost!)
    const [sdmX, sdmZ] = normToWorldXZ(0.825, 0.745);
    const sdmY = getTerrainElevation(0.825, 0.745);
    this.sdmPointLight = new THREE.PointLight(0xff9c42, 0, 180, 1.5);
    this.sdmPointLight.position.set(sdmX, sdmY + 28, sdmZ);
    this.sdmPointLight.visible = false;
    this.scene.add(this.sdmPointLight);

    const nightLightCoords: [number, number, number][] = [
      [0.48, 0.46, 0xffaa48], // Human Village
      [0.255, 0.32, 0xff9438], // Hakurei Shrine
      [0.382, 0.585, 0xffa442], // Myouren Temple
      [0.855, 0.47, 0xffb866], // Eientei
      [0.645, 0.105, 0xffa84c], // Moriya Shrine
      [0.125, 0.775, 0xff5238], // Palace of the Earth Spirits & Former Hell
    ];
    for (const [nx, ny, hex] of nightLightCoords) {
      const [lx, lz] = normToWorldXZ(nx, ny);
      const ly = getTerrainElevation(nx, ny);
      const pl = new THREE.PointLight(hex, 0, 150, 1.5);
      pl.position.set(lx, ly + 22, lz);
      pl.visible = false;
      this.scene.add(pl);
      this.nightPointLights.push(pl);
    }

    this.routesGroup = new THREE.Group();
    this.activeRouteGroup = new THREE.Group();
    this.footprintsGroup = new THREE.Group();
    this.markersGroup = new THREE.Group();
    this.residentsGroup = new THREE.Group();

    this.scene.add(this.routesGroup);
    this.scene.add(this.activeRouteGroup);
    this.scene.add(this.footprintsGroup);
    this.scene.add(this.markersGroup);
    this.scene.add(this.residentsGroup);

    // Build 3D World Layers
    this.buildTerrainAndWater(terrainData);
    this.buildInstancedForests();
    this.build3DLandmarks();
    this.build3DRoads(store.getRoutes());
    this.build3DMarkersAndLabels(store.getLocations());
    this.build3DCharacters();
    this.mountCameraPresetBar();
    this.setup3DRaycasting();

    window.addEventListener('resize', () => this.handleResize());

    // Subscribe to Store updates
    let lastTimeOfDay: TimeOfDay = 'day';
    let lastRoute: ComputedRoute | null = null;
    let lastSelectedId: string | null = null;
    let lastActiveCharId: string | null = null;
    let lastRegion = 'All';
    let lastKind = 'All';
    let lastQuery = '';
    let lastFootprints = true;
    let lastResidents = true;

    store.subscribe((state) => {
      if (state.showFootprints !== lastFootprints) {
        lastFootprints = state.showFootprints;
        this.footprintsGroup.visible = state.showFootprints;
        this.requestShadowUpdate();
      }
      if (state.showResidents !== lastResidents) {
        lastResidents = state.showResidents;
        this.residentsGroup.visible = state.showResidents;
        this.labelsDirty = true;
        this.requestShadowUpdate();
      }
      this.routesGroup.visible = state.showRoutes;

      if (state.timeOfDay !== lastTimeOfDay) {
        lastTimeOfDay = state.timeOfDay;
        this.applyTimeOfDay(state.timeOfDay);
      }

      if (state.computedRoute !== lastRoute) {
        lastRoute = state.computedRoute;
        this.updateActiveRoute3D(state.computedRoute);
      }

      const activeChar = state.popupCharacterId ?? state.selectedCharacterId;
      if (
        state.selectedId !== lastSelectedId ||
        activeChar !== lastActiveCharId ||
        state.regionFilter !== lastRegion ||
        state.kindFilter !== lastKind ||
        state.searchQuery !== lastQuery
      ) {
        lastSelectedId = state.selectedId;
        lastActiveCharId = activeChar;
        lastRegion = state.regionFilter;
        lastKind = state.kindFilter;
        lastQuery = state.searchQuery;
        this.updateLabelFilterStates();
      }
    });
  }

  private requestShadowUpdate() {
    this.renderer.shadowMap.needsUpdate = true;
  }

  /**
   * Ultra-fast O(1) bounding-sphere ray picking for 3D characters.
   */
  private pickCharacterAtClientPos(clientX: number, clientY: number): string | null {
    if (!store.getState().showResidents) return null;
    if (this.viewportWidth === 0 || this.viewportHeight === 0) return null;
    const rect = this.canvasEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const ray = this.raycaster.ray;

    let bestCharId: string | null = null;
    let bestDistSq = Infinity;

    for (let i = 0; i < this.charPickSpheres.length; i++) {
      const s = this.charPickSpheres[i];
      const dSq = ray.distanceSqToPoint(s.center);
      if (dSq <= s.radiusSq) {
        const camDistSq = ray.origin.distanceToSquared(s.center);
        if (camDistSq < bestDistSq) {
          bestDistSq = camDistSq;
          bestCharId = s.charId;
        }
      }
    }
    return bestCharId;
  }

  /**
   * Ultra-fast O(1) bounding-sphere ray picking (< 0.01ms instead of 250,000-triangle mesh raycasting).
   */
  private pickLocationAtClientPos(clientX: number, clientY: number): string | null {
    if (this.viewportWidth === 0 || this.viewportHeight === 0) return null;
    const rect = this.canvasEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const ray = this.raycaster.ray;

    let bestId: string | null = null;
    let bestDistSq = Infinity;

    for (let i = 0; i < this.pickSpheres.length; i++) {
      const s = this.pickSpheres[i];
      const dSq = ray.distanceSqToPoint(s.center);
      if (dSq <= s.radiusSq) {
        const camDistSq = ray.origin.distanceToSquared(s.center);
        if (camDistSq < bestDistSq) {
          bestDistSq = camDistSq;
          bestId = s.id;
        }
      }
    }
    return bestId;
  }

  private setup3DRaycasting() {
    this.canvasEl.addEventListener('pointerdown', (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    let lastHoverTime = 0;
    this.canvasEl.addEventListener('pointermove', (e) => {
      if (e.buttons !== 0) return;
      const now = performance.now();
      if (now - lastHoverTime < 48) return; // Throttle hover cursor check to ~20Hz
      lastHoverTime = now;
      const hitChar = this.pickCharacterAtClientPos(e.clientX, e.clientY);
      const hitId = hitChar ?? this.pickLocationAtClientPos(e.clientX, e.clientY);
      this.canvasEl.style.cursor = hitId ? 'pointer' : 'grab';
    });

    this.canvasEl.addEventListener('pointerup', (e) => {
      if (e.button !== 0) return;
      const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (dist > 6) return; // Ignore orbit camera drags

      const charId = this.pickCharacterAtClientPos(e.clientX, e.clientY);
      if (charId) {
        store.update({ popupCharacterId: charId });
        this.flyToCharacter3D(charId);
        return;
      }

      const locId = this.pickLocationAtClientPos(e.clientX, e.clientY);
      if (!locId) return;

      const st = store.getState();
      if (st.routeMode) {
        if (!st.routeStartId || (st.routeStartId && st.routeEndId)) {
          store.setRouteEndpoints(locId, null);
        } else if (st.routeStartId !== locId) {
          store.setRouteEndpoints(st.routeStartId, locId);
        }
      }
      store.update({ selectedId: locId, selectedCharacterId: null, popupCharacterId: null });
      window.history.replaceState(null, '', `#loc=${locId}`);
      this.flyToLocation(locId);
    });
  }

  private mountCameraPresetBar() {
    const [sdmX, sdmZ] = normToWorldXZ(0.825, 0.745);
    const sdmY = getTerrainElevation(0.825, 0.745);
    const [vilX, vilZ] = normToWorldXZ(0.48, 0.46);
    const vilY = getTerrainElevation(0.48, 0.46);
    const [hakX, hakZ] = normToWorldXZ(0.255, 0.32);
    const hakY = getTerrainElevation(0.255, 0.32);
    const [eieX, eieZ] = normToWorldXZ(0.855, 0.47);
    const eieY = getTerrainElevation(0.855, 0.47);
    const [morX, morZ] = normToWorldXZ(0.645, 0.105);
    const morY = getTerrainElevation(0.645, 0.105);
    const [hkgX, hkgZ] = normToWorldXZ(0.38, 0.065);
    const hkgY = getTerrainElevation(0.38, 0.065);
    const [chiX, chiZ] = normToWorldXZ(0.125, 0.775);
    const chiY = getTerrainElevation(0.125, 0.775);
    const [lunX, lunZ] = normToWorldXZ(0.92, 0.1);
    const lunY = getTerrainElevation(0.92, 0.1);

    const presets: (Camera3DPreset & { locId?: string })[] = [
      {
        id: 'atlas-overview',
        label: '🗺️ Overview',
        pos: [0, 860, 920],
        target: [0, 10, 40],
      },
      {
        id: 'village-3d',
        label: '🏘️ Human Village',
        pos: [vilX + 45, vilY + 95, vilZ + 145],
        target: [vilX, vilY + 6, vilZ],
        locId: 'human-village',
      },
      {
        id: 'hakurei-3d',
        label: '⛩️ Hakurei Shrine',
        pos: [hakX + 28, hakY + 46, hakZ + 82],
        target: [hakX, hakY + 10, hakZ],
        locId: 'hakurei-shrine',
      },
      {
        id: 'sdm-iso',
        label: '🦇 Scarlet Devil Mansion',
        pos: [sdmX + 88, sdmY + 78, sdmZ + 128],
        target: [sdmX, sdmY + 18, sdmZ + 10],
        locId: 'scarlet-devil-mansion',
      },
      {
        id: 'eientei-3d',
        label: '🎋 Eientei & Bamboo',
        pos: [eieX + 42, eieY + 46, eieZ + 78],
        target: [eieX, eieY + 8, eieZ],
        locId: 'eientei',
      },
      {
        id: 'moriya-3d',
        label: '⛰️ Youkai Mt. & Moriya',
        pos: [morX - 55, morY + 52, morZ + 88],
        target: [morX, morY + 10, morZ],
        locId: 'moriya-shrine',
      },
      {
        id: 'hakugyokurou-3d',
        label: '🌸 Hakugyokurou',
        pos: [hkgX + 38, hkgY + 48, hkgZ + 78],
        target: [hkgX, hkgY + 10, hkgZ],
        locId: 'hakugyokurou',
      },
      {
        id: 'chireiden-3d',
        label: '🔥 Chireiden & Old Hell',
        pos: [chiX + 42, chiY + 46, chiZ + 78],
        target: [chiX, chiY + 10, chiZ],
        locId: 'palace-of-earth-spirits',
      },
      {
        id: 'lunar-3d',
        label: '🌕 Lunar Capital',
        pos: [lunX - 42, lunY + 46, lunZ + 78],
        target: [lunX, lunY + 10, lunZ],
        locId: 'lunar-capital',
      },
    ];

    this.cameraHudEl.innerHTML = `
      <div class="cam3d-bar-label">🎥 3D REALM &amp; LANDMARK CAMERAS (BLENDER GLB + PROCEDURAL):</div>
      <div class="cam3d-bar-pills">
        ${presets
          .map(
            (p, idx) =>
              `<button class="cam3d-pill" data-idx="${idx}">${p.label}</button>`
          )
          .join('')}
      </div>
      <div class="cam3d-help">Click any 3D building or nameplate to inspect • Left-Drag: Orbit • Right-Drag: Pan • Scroll: Zoom</div>
    `;

    this.cameraHudEl.querySelectorAll('.cam3d-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx') ?? 0);
        const p = presets[idx];
        if (!p) return;
        this.flyToCameraPose(
          new THREE.Vector3(...p.pos),
          new THREE.Vector3(...p.target),
          950
        );
        if (p.locId) {
          store.update({ selectedId: p.locId, selectedCharacterId: null });
          window.history.replaceState(null, '', `#loc=${p.locId}`);
        }
      });
    });
  }

  private buildTerrainAndWater(terrainData: TerrainData) {
    const segX = 250;
    const segZ = 170;
    const geom = new THREE.PlaneGeometry(WORLD_W, WORLD_D, segX, segZ);
    geom.rotateX(-Math.PI / 2);

    // Precompute bounding boxes for regions and lakes so feathered polygon evaluation is ultra-fast
    const featherBiome = 0.024;
    const regionBounds = terrainData.regions.map((reg) => {
      let minX = 1;
      let maxX = 0;
      let minY = 1;
      let maxY = 0;
      for (const [x, y] of reg.points) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      return {
        reg,
        color: new THREE.Color(BIOME_HEX[reg.biome] ?? 0x7c8558),
        minX: minX - featherBiome,
        maxX: maxX + featherBiome,
        minY: minY - featherBiome,
        maxY: maxY + featherBiome,
      };
    });

    const featherLake = 0.0045;
    const lakeMeta = terrainData.lakes
      .filter((l) => l.points.length >= 3)
      .map((lake) => {
        let cx = 0;
        let cy = 0;
        let minX = 1;
        let maxX = 0;
        let minY = 1;
        let maxY = 0;
        for (const [x, y] of lake.points) {
          cx += x;
          cy += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
        cx /= lake.points.length;
        cy /= lake.points.length;
        // Misty Lake sits at a consistent water surface level so SDM shoreline & basin never poke through
        const isMisty = Math.hypot(cx - 0.685, cy - 0.79) < 0.09;
        const surfaceY = isMisty ? 2.4 : getTerrainElevation(cx, cy) + 0.85;
        return {
          lake,
          cx,
          cy,
          surfaceY,
          minX: minX - featherLake,
          maxX: maxX + featherLake,
          minY: minY - featherLake,
          maxY: maxY + featherLake,
        };
      });
    this.lakePolygons = lakeMeta.map((lm) => ({
      points: lm.lake.points,
      surfaceY: lm.surfaceY,
    }));

    const posAttr = geom.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    const valleyGrass = new THREE.Color(0x6f8e4e);
    const warmMeadow = new THREE.Color(0x8fa458);
    const graniteColor = new THREE.Color(0x766e60);
    const snowColor = new THREE.Color(0xf2efe9);
    const lakebedColor = new THREE.Color(0x1f4568);
    const bloodbedColor = new THREE.Color(0x4f1218);
    const shoreSandColor = new THREE.Color(0xb8a97e);
    const tempColor = new THREE.Color();

    for (let i = 0; i < posAttr.count; i++) {
      const wx = posAttr.getX(i);
      const wz = posAttr.getZ(i);
      const nx = wx / WORLD_W + 0.5;
      const ny = wz / WORLD_D + 0.5;

      let elev = getTerrainElevation(nx, ny);

      // Organic valley meadow base color with subtle multi-scale variation
      const noiseVal =
        0.5 +
        0.32 * Math.sin(nx * 28.0 + ny * 19.0) +
        0.18 * Math.cos(nx * 53.0 - ny * 41.0);
      tempColor.copy(valleyGrass).lerp(warmMeadow, Math.max(0, Math.min(1, noiseVal)));

      // Smoothly feather biome regions instead of jagged stair-step binary triangles
      for (const rb of regionBounds) {
        if (nx < rb.minX || nx > rb.maxX || ny < rb.minY || ny > rb.maxY) continue;
        const w = smoothPolygonWeight(nx, ny, rb.reg.points, featherBiome);
        if (w > 0.001) {
          tempColor.lerp(rb.color, w * 0.92);
        }
      }

      // Elevation-driven granite strata and alpine snow caps on Youkai Mountain & ridges
      if (elev > 90) {
        const snowT = Math.min(1, (elev - 90) / 48);
        tempColor.lerp(graniteColor, 0.45 * (1 - snowT));
        tempColor.lerp(snowColor, snowT);
      } else if (elev > 26) {
        const rockT = Math.min(0.72, (elev - 26) / 64);
        tempColor.lerp(graniteColor, rockT);
      }

      // Muenzuka Slate-Blue & Crimson Higanbana Valley Tint (`magenzuka ref.png`)
      const dMuenzuka = Math.hypot((nx - 0.165) / 0.055, (ny - 0.415) / 0.048);
      if (dMuenzuka < 1.0) {
        const mw = 1 - smoothstep(0.25, 1.0, dMuenzuka);
        const higanPatch = 0.5 + 0.5 * Math.sin(nx * 210.0 + ny * 170.0) * Math.cos(nx * 140.0 - ny * 190.0);
        const slateSoil = new THREE.Color(0x5e6c84);
        const higanCrimson = new THREE.Color(0xc83e36);
        tempColor.lerp(slateSoil, mw * 0.78);
        if (higanPatch > 0.58) {
          tempColor.lerp(higanCrimson, mw * (higanPatch - 0.58) * 1.45);
        }
      }

      // Carve lake basins strictly inside lake polygons without clamping nearby mountain/estate terraces
      for (const lm of lakeMeta) {
        if (nx < lm.minX || nx > lm.maxX || ny < lm.minY || ny > lm.maxY) continue;
        const insideLake = pointInPolygon(nx, ny, lm.lake.points);
        const lw = smoothPolygonWeight(nx, ny, lm.lake.points, featherLake);
        if (lw > 0.001) {
          const targetBedY = lm.surfaceY - 3.6;
          if (insideLake) {
            const carvedY = elev * (1 - lw) + targetBedY * lw;
            elev = Math.min(carvedY, lm.surfaceY - 0.85);
          } else {
            // Gentle shoreline blend that never pulls down high terraces or cliffs outside the lake
            const shoreTarget = Math.min(elev, lm.surfaceY + 0.25);
            elev = elev * (1 - lw * 0.65) + shoreTarget * (lw * 0.65);
          }
          if (lw < 0.45) {
            tempColor.lerp(shoreSandColor, lw * 1.4);
          } else {
            tempColor.lerp(
              lm.lake.kind === 'blood' ? bloodbedColor : lakebedColor,
              Math.min(1, (lw - 0.25) * 1.3)
            );
          }
        }
      }

      posAttr.setY(i, elev);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.86,
      metalness: 0.04,
    });
    const terrainMesh = new THREE.Mesh(geom, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.updateMatrixWorld(true);
    this.terrainMesh = terrainMesh;
    this.scene.add(terrainMesh);

    // Load Blender-sculpted World Diorama Dressings and track promise for character collision checks
    const dioramaPromise = loadWorldDioramaGLB(this.scene, () => this.requestShadowUpdate()).then(
      (grp) => {
        this.worldDioramaGroup = grp;
        return grp;
      }
    );
    this.landmarkLoadPromises.push(dioramaPromise);

    // Build 3D Water Lakes merged into 2 draw calls total (Water Lakes + Blood Pool)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2978b5,
      roughness: 0.12,
      metalness: 0.32,
      transparent: true,
      opacity: 0.88,
    });
    const bloodMat = new THREE.MeshStandardMaterial({
      color: 0x961c26,
      roughness: 0.22,
      metalness: 0.18,
    });

    const waterLakeGeoms: THREE.BufferGeometry[] = [];
    const bloodLakeGeoms: THREE.BufferGeometry[] = [];

    for (const lm of lakeMeta) {
      const shape = new THREE.Shape();
      lm.lake.points.forEach(([x, y], idx) => {
        const [wx, wz] = normToWorldXZ(x, y);
        if (idx === 0) shape.moveTo(wx, -wz);
        else shape.lineTo(wx, -wz);
      });
      shape.closePath();

      const lakeGeom = new THREE.ShapeGeometry(shape);
      lakeGeom.rotateX(-Math.PI / 2);
      lakeGeom.translate(0, lm.surfaceY, 0);
      if (lm.lake.kind === 'blood') bloodLakeGeoms.push(lakeGeom);
      else waterLakeGeoms.push(lakeGeom);
    }

    if (waterLakeGeoms.length > 0) {
      const mergedWaterLakes = mergeGeometries(waterLakeGeoms, false);
      if (mergedWaterLakes) {
        const mesh = new THREE.Mesh(mergedWaterLakes, waterMat);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      }
    }
    if (bloodLakeGeoms.length > 0) {
      const mergedBloodLakes = mergeGeometries(bloodLakeGeoms, false);
      if (mergedBloodLakes) {
        const mesh = new THREE.Mesh(mergedBloodLakes, bloodMat);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      }
    }

    // Merge all 3D River Ribbons into a single draw call
    const riverGeoms: THREE.BufferGeometry[] = [];
    for (const riv of terrainData.rivers) {
      const curvePts = riv.points.map(([nx, ny]) => {
        const [wx, wz] = normToWorldXZ(nx, ny);
        const wy = getTerrainElevation(nx, ny) + 0.55;
        return new THREE.Vector3(wx, wy, wz);
      });
      const curve = new THREE.CatmullRomCurve3(curvePts);
      const tubeGeom = new THREE.TubeGeometry(curve, 64, riv.width * 0.52, 6, false);
      tubeGeom.scale(1, 0.14, 1);
      riverGeoms.push(tubeGeom);
    }
    if (riverGeoms.length > 0) {
      const mergedRivers = mergeGeometries(riverGeoms, false);
      if (mergedRivers) {
        const riverMesh = new THREE.Mesh(mergedRivers, waterMat);
        riverMesh.receiveShadow = true;
        this.scene.add(riverMesh);
      }
    }
  }

  private buildInstancedForests() {
    void loadBlenderFoliageKit().then((kit) => {
      if (!kit) return;

      let seed = 17;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      const allLocations = store.getLocations();
      const isClearOfPadsAndLakes = (nx: number, ny: number): boolean => {
        if (Math.hypot(nx - 0.48, ny - 0.46) < 0.068) return false; // Human Village
        if (Math.hypot(nx - 0.825, ny - 0.745) < 0.065) return false; // SDM
        if (Math.hypot(nx - 0.255, ny - 0.32) < 0.036) return false; // Hakurei Shrine
        if (Math.hypot(nx - 0.382, ny - 0.585) < 0.032) return false; // Myouren Temple
        if (Math.hypot(nx - 0.855, ny - 0.47) < 0.032) return false; // Eientei
        if (Math.hypot(nx - 0.685, ny - 0.785) < 0.098) return false; // Misty Lake
        if (Math.hypot(nx - 0.645, ny - 0.105) < 0.032) return false; // Moriya Shrine
        if (Math.hypot(nx - 0.698, ny - 0.148) < 0.028) return false; // Tengu Village
        if (Math.hypot(nx - 0.355, ny - 0.07) < 0.038) return false; // Hakugyokurou
        if (Math.hypot(nx - 0.912, ny - 0.092) < 0.038) return false; // Lunar Capital
        for (const lp of this.lakePolygons) {
          if (pointInPolygon(nx, ny, lp.points)) return false;
        }
        for (const loc of allLocations) {
          const minDist = BLENDER_GLB_LANDMARKS[loc.id] ? 0.022 : 0.009;
          if (Math.hypot(nx - loc.x, ny - loc.y) < minDist) return false;
        }
        for (const rp of RESIDENT_PLACEMENTS) {
          if (Math.hypot(nx - rp.x, ny - rp.y) < 0.007) return false;
        }
        return true;
      };

      const dummy = new THREE.Object3D();
      const vMat = sharedOpaqueVertexMat;

      // 1. Japanese Red Pine (Akamatsu) — Blender multi-branch crooked trunk + 4 cloud canopies
      if (kit.PineTree) {
        const maxPine = 640;
        const instPine = new THREE.InstancedMesh(kit.PineTree, vMat, maxPine);
        instPine.castShadow = true;
        instPine.receiveShadow = true;

        const pineZones: [number, number, number, number, number][] = [
          [0.42, 0.72, 0.54, 0.75, 200], // Forest of Magic
          [0.40, 0.84, 0.13, 0.36, 220], // Great Youkai Forest & Foothills
          [0.74, 0.95, 0.56, 0.88, 120], // Eastern Lakeside & SDM Woods
          [0.34, 0.62, 0.35, 0.55, 100], // Central Valley Groves
        ];
        let pIdx = 0;
        for (const [xMin, xMax, yMin, yMax, n] of pineZones) {
          for (let i = 0; i < n && pIdx < maxPine; i++) {
            const nx = xMin + rand() * (xMax - xMin);
            const ny = yMin + rand() * (yMax - yMin);
            if (!isClearOfPadsAndLakes(nx, ny)) continue;
            const [wx, wz] = normToWorldXZ(nx, ny);
            const wy = getTerrainElevation(nx, ny);
            const s = 0.78 + rand() * 0.65;
            dummy.position.set(wx, wy, wz);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(0, rand() * Math.PI * 2, 0);
            dummy.updateMatrix();
            instPine.setMatrixAt(pIdx++, dummy.matrix);
          }
        }
        instPine.count = pIdx;
        instPine.instanceMatrix.needsUpdate = true;
        this.scene.add(instPine);
      }

      // 2. Japanese Maple (Momiji) — Blender forked trunk + crimson/gold autumn canopies
      if (kit.AutumnTree) {
        const maxAutumn = 340;
        const instAutumn = new THREE.InstancedMesh(kit.AutumnTree, vMat, maxAutumn);
        instAutumn.castShadow = true;
        instAutumn.receiveShadow = true;

        const autumnZones: [number, number, number, number, number][] = [
          [0.14, 0.39, 0.22, 0.65, 185], // Western Autumn & Hakurei Woods
          [0.54, 0.78, 0.12, 0.29, 155], // Youkai Mountain & Nine Heavens Waterfall Crimson Slopes
        ];
        let aIdx = 0;
        for (const [xMin, xMax, yMin, yMax, n] of autumnZones) {
          for (let i = 0; i < n && aIdx < maxAutumn; i++) {
            const nx = xMin + rand() * (xMax - xMin);
            const ny = yMin + rand() * (yMax - yMin);
            if (!isClearOfPadsAndLakes(nx, ny)) continue;
            const [wx, wz] = normToWorldXZ(nx, ny);
            const wy = getTerrainElevation(nx, ny);
            const s = 0.78 + rand() * 0.65;
            dummy.position.set(wx, wy, wz);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(0, rand() * Math.PI * 2, 0);
            dummy.updateMatrix();
            instAutumn.setMatrixAt(aIdx++, dummy.matrix);
          }
        }
        instAutumn.count = aIdx;
        instAutumn.instanceMatrix.needsUpdate = true;
        this.scene.add(instAutumn);
      }

      // 3. Moso Bamboo Clusters — Blender 5-stalk cluster with nodal foliage sprays
      if (kit.BambooCluster) {
        const maxBamboo = 220;
        const instBamboo = new THREE.InstancedMesh(kit.BambooCluster, vMat, maxBamboo);
        instBamboo.castShadow = true;
        instBamboo.receiveShadow = true;

        let bIdx = 0;
        for (let i = 0; i < maxBamboo; i++) {
          const nx = 0.69 + rand() * 0.25;
          const ny = 0.33 + rand() * 0.21;
          if (!isClearOfPadsAndLakes(nx, ny)) continue;
          const [wx, wz] = normToWorldXZ(nx, ny);
          const wy = getTerrainElevation(nx, ny);
          const s = 0.82 + rand() * 0.55;
          dummy.position.set(wx, wy, wz);
          dummy.scale.set(s, s, s);
          dummy.rotation.set(0, rand() * Math.PI * 2, 0);
          dummy.updateMatrix();
          instBamboo.setMatrixAt(bIdx++, dummy.matrix);
        }
        instBamboo.count = bIdx;
        instBamboo.instanceMatrix.needsUpdate = true;
        this.scene.add(instBamboo);
      }

      // 4. Weeping Sakura Trees — Blender gnarled cherry trunk + 5 blossom clouds
      if (kit.SakuraTree) {
        const maxSakura = 240;
        const instSakura = new THREE.InstancedMesh(kit.SakuraTree, vMat, maxSakura);
        instSakura.castShadow = true;
        instSakura.receiveShadow = true;

        const sakuraZones: [number, number, number, number, number][] = [
          [0.27, 0.49, 0.03, 0.13, 100], // Netherworld / Hakugyokurou Sakura Gardens
          [0.11, 0.22, 0.36, 0.47, 60], // Muenzuka Weeping Sakura Hills (`magenzuka ref.png`)
          [0.21, 0.30, 0.27, 0.37, 42], // Hakurei Shrine Sakura Approach
          [0.34, 0.44, 0.52, 0.63, 38], // Myouren Temple & Human Village Outskirts
        ];
        let sIdx = 0;
        for (const [xMin, xMax, yMin, yMax, n] of sakuraZones) {
          for (let i = 0; i < n && sIdx < maxSakura; i++) {
            const nx = xMin + rand() * (xMax - xMin);
            const ny = yMin + rand() * (yMax - yMin);
            if (!isClearOfPadsAndLakes(nx, ny)) continue;
            const [wx, wz] = normToWorldXZ(nx, ny);
            const wy = getTerrainElevation(nx, ny);
            const s = 0.8 + rand() * 0.65;
            dummy.position.set(wx, wy, wz);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(0, rand() * Math.PI * 2, 0);
            dummy.updateMatrix();
            instSakura.setMatrixAt(sIdx++, dummy.matrix);
          }
        }
        instSakura.count = sIdx;
        instSakura.instanceMatrix.needsUpdate = true;
        this.scene.add(instSakura);
      }

      // 5. Forest of Magic Luminous Mushroom Clusters — Blender 3-mushroom cluster with stems & caps
      if (kit.MushroomCluster) {
        const maxMush = 80;
        const instMush = new THREE.InstancedMesh(kit.MushroomCluster, vMat, maxMush);
        instMush.castShadow = true;
        let mIdx = 0;
        for (let i = 0; i < maxMush; i++) {
          const nx = 0.45 + rand() * 0.24;
          const ny = 0.56 + rand() * 0.17;
          if (!isClearOfPadsAndLakes(nx, ny)) continue;
          const [wx, wz] = normToWorldXZ(nx, ny);
          const wy = getTerrainElevation(nx, ny);
          const s = 0.75 + rand() * 0.65;
          dummy.position.set(wx, wy, wz);
          dummy.scale.set(s, s, s);
          dummy.rotation.set(0, rand() * Math.PI * 2, 0);
          dummy.updateMatrix();
          instMush.setMatrixAt(mIdx++, dummy.matrix);
        }
        instMush.count = mIdx;
        instMush.instanceMatrix.needsUpdate = true;
        this.scene.add(instMush);
      }

      this.requestShadowUpdate();
    });
  }

  private build3DLandmarks() {
    // Load the 7 major compound Blender GLB landmarks directly (each pre-merged into 1-2 meshes in Blender)
    const majorCompounds: [string, number, number, () => THREE.Group][] = [
      ['scarlet-devil-mansion', 0.825, 0.745, buildScarletDevilMansion3D],
      ['human-village', 0.48, 0.46, buildHumanVillage3D],
      ['hakurei-shrine', 0.255, 0.32, buildHakureiShrine3D],
      ['myouren-temple', 0.382, 0.585, buildMyourenTemple3D],
      ['eientei', 0.855, 0.47, buildEientei3D],
      ['moriya-shrine', 0.645, 0.105, buildMoriyaShrine3D],
      ['palace-of-earth-spirits', 0.125, 0.775, buildChireiden3D],
    ];

    for (const [id, nx, ny, buildFallback] of majorCompounds) {
      const [wx, wz] = normToWorldXZ(nx, ny);
      const wy = getTerrainElevation(nx, ny);
      const pos = new THREE.Vector3(wx, wy, wz);
      const p = loadBlenderLandmarkGLB(id, this.footprintsGroup, pos, () =>
        this.requestShadowUpdate()
      ).then((loaded) => {
        if (!loaded) {
          const fb = buildFallback();
          fb.position.copy(pos);
          tagHierarchyWithLocationId(fb, id);
          this.footprintsGroup.add(fb);
          this.requestShadowUpdate();
        }
      });
      this.landmarkLoadPromises.push(p);
    }

    // Merged Translucent Mist Layers over Misty Lake & Youkai Mountain Mid-Slopes (1 draw call total)
    const [mlX, mlZ] = normToWorldXZ(0.685, 0.785);
    const mlY = getTerrainElevation(0.685, 0.785);
    const mistMat = new THREE.MeshStandardMaterial({
      color: 0xf4f8ff,
      transparent: true,
      opacity: 0.22,
      roughness: 1.0,
      depthWrite: false,
    });
    const mistGeoms: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 3; i++) {
      const g = new THREE.CylinderGeometry(85 - i * 14, 92 - i * 14, 0.6, 20);
      g.translate(mlX + (i - 1) * 18, mlY + 3.2 + i * 2.1, mlZ + (i - 1) * 12);
      mistGeoms.push(g);
    }
    // Drifting white mountain mist banks wrapping Youkai Mountain's mid-slopes (`Youkaimountain-thumb.jpg`)
    const ymMistAnchors: [number, number, number, number][] = [
      [0.64, 0.19, 105, 8],
      [0.71, 0.22, 92, 12],
      [0.57, 0.21, 88, 6],
      [0.65, 0.14, 96, 18],
    ];
    for (const [mnx, mny, mRad, mLift] of ymMistAnchors) {
      const [mwx, mwz] = normToWorldXZ(mnx, mny);
      const mwy = getTerrainElevation(mnx, mny);
      const mg = new THREE.CylinderGeometry(mRad * 0.88, mRad, 1.4, 20);
      mg.translate(mwx, mwy + mLift, mwz);
      mistGeoms.push(mg);
    }
    const mergedMist = mergeGeometries(mistGeoms, false);
    if (mergedMist) {
      this.scene.add(new THREE.Mesh(mergedMist, mistMat));
    }
  }

  private build3DRoads(routes: RouteEntry[]) {
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xd8c398, roughness: 0.9 });
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x8a6d4b, roughness: 0.92 });

    const roadGeoms: THREE.BufferGeometry[] = [];
    const pathGeoms: THREE.BufferGeometry[] = [];

    for (const r of routes) {
      if (r.kind === 'portal' || r.points.length < 2) continue;
      const pts = r.points.map(([nx, ny]) => {
        const [wx, wz] = normToWorldXZ(nx, ny);
        const wy = getTerrainElevation(nx, ny) + 0.55;
        return new THREE.Vector3(wx, wy, wz);
      });
      const curve = new THREE.CatmullRomCurve3(pts);
      const radius = r.kind === 'road' ? 1.6 : 0.9;
      const geom = new THREE.TubeGeometry(curve, Math.max(10, pts.length * 6), radius, 5, false);
      geom.scale(1, 0.25, 1);
      if (r.kind === 'road') roadGeoms.push(geom);
      else pathGeoms.push(geom);
    }

    if (roadGeoms.length > 0) {
      const mergedRoads = mergeGeometries(roadGeoms, false);
      if (mergedRoads) this.routesGroup.add(new THREE.Mesh(mergedRoads, roadMat));
    }
    if (pathGeoms.length > 0) {
      const mergedPaths = mergeGeometries(pathGeoms, false);
      if (mergedPaths) this.routesGroup.add(new THREE.Mesh(mergedPaths, pathMat));
    }
  }

  private updateActiveRoute3D(computed: ComputedRoute | null) {
    this.activeRouteGroup.clear();
    if (!computed) return;

    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xb6342a,
      emissive: 0xff5e3a,
      emissiveIntensity: 0.75,
      roughness: 0.3,
    });

    if (computed.segments.length > 0) {
      for (const seg of computed.segments) {
        const pts = seg.points.map(([nx, ny]) => {
          const [wx, wz] = normToWorldXZ(nx, ny);
          const wy = getTerrainElevation(nx, ny) + 2.2;
          return new THREE.Vector3(wx, wy, wz);
        });
        const curve = new THREE.CatmullRomCurve3(pts);
        const geom = new THREE.TubeGeometry(curve, 32, 2.4, 8, false);
        this.activeRouteGroup.add(new THREE.Mesh(geom, glowMat));
      }
    } else {
      const [x1, z1] = normToWorldXZ(computed.from.x, computed.from.y);
      const [x2, z2] = normToWorldXZ(computed.to.x, computed.to.y);
      const y1 = getTerrainElevation(computed.from.x, computed.from.y) + 3;
      const y2 = getTerrainElevation(computed.to.x, computed.to.y) + 3;
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
      );
      const geom = new THREE.TubeGeometry(curve, 16, 2.2, 8, false);
      this.activeRouteGroup.add(new THREE.Mesh(geom, glowMat));
    }
  }

  private build3DMarkersAndLabels(locations: LocationEntry[]) {
    this.markersGroup.clear();
    this.labelsContainer.innerHTML = '';
    this.labelEls.clear();
    this.floatingObjects = [];
    this.pickSpheres = [];

    const customHeightOffset: Record<string, number> = {
      'scarlet-devil-mansion': 68,
      'human-village': 28,
      'hakurei-shrine': 34,
      'myouren-temple': 36,
      'eientei': 28,
      'moriya-shrine': 36,
      'palace-of-earth-spirits': 34,
    };

    const [sdmX, sdmZ] = normToWorldXZ(0.825, 0.745);
    const sdmY = getTerrainElevation(0.825, 0.745);

    const compoundSubLocations: Record<string, THREE.Vector3> = {
      'voile-library': new THREE.Vector3(sdmX - 31.5, sdmY + 26, sdmZ - 12),
      'sdm-parlor-dining': new THREE.Vector3(sdmX + 26, sdmY + 18, sdmZ + 2),
      'sdm-gardens-east-wing': new THREE.Vector3(sdmX + 24, sdmY + 22, sdmZ - 22),
    };

    const floatingIds = new Set([
      'shining-needle-castle',
      'torifune-space-shrine',
    ]);

    const minorLandmarkGeoms: THREE.BufferGeometry[] = [];
    const docFrag = document.createDocumentFragment();

    for (const loc of locations) {
      const [wx, wz] = normToWorldXZ(loc.x, loc.y);
      const baseElev = getTerrainElevation(loc.x, loc.y);
      const pinOffset =
        customHeightOffset[loc.id] ??
        (loc.id === 'heaven' || loc.id === 'bhava-agra'
          ? 114
          : loc.id === 'shining-needle-castle'
          ? 52
          : loc.id === 'tengu-village'
          ? 46
          : loc.id === 'torifune-space-shrine'
          ? 28
          : BLENDER_GLB_LANDMARKS[loc.id]
          ? 26
          : loc.importance === 1
          ? 16
          : 11);
      const worldPos = compoundSubLocations[loc.id]
        ? compoundSubLocations[loc.id].clone()
        : new THREE.Vector3(wx, baseElev + pinOffset, wz);

      // Register fast O(1) bounding sphere for 3D click/hover picking
      const pickRadius = customHeightOffset[loc.id]
        ? 36
        : BLENDER_GLB_LANDMARKS[loc.id]
        ? 26
        : 12;
      const pickYOffset =
        loc.id === 'heaven' || loc.id === 'bhava-agra'
          ? 96
          : pickRadius * 0.45;
      this.pickSpheres.push({
        id: loc.id,
        center: new THREE.Vector3(wx, baseElev + pickYOffset, wz),
        radiusSq: pickRadius * pickRadius,
      });

      if (
        !customHeightOffset[loc.id] &&
        !compoundSubLocations[loc.id] &&
        loc.id !== 'dragon-statue'
      ) {
        if (BLENDER_GLB_LANDMARKS[loc.id]) {
          // Load merged Blender GLB directly
          const pos = new THREE.Vector3(wx, baseElev, wz);
          const p = loadBlenderLandmarkGLB(loc.id, this.markersGroup, pos, () =>
            this.requestShadowUpdate()
          ).then((glbGroup) => {
            if (glbGroup && floatingIds.has(loc.id)) {
              this.floatingObjects.push({
                obj: glbGroup,
                baseY: glbGroup.position.y,
                phase: (loc.x * 13 + loc.y * 7) * Math.PI,
              });
            }
          });
          this.landmarkLoadPromises.push(p);
        } else if (floatingIds.has(loc.id)) {
          const model = buildProceduralLandmark3D(loc);
          model.position.set(wx, baseElev, wz);
          this.markersGroup.add(model);
          this.floatingObjects.push({
            obj: model,
            baseY: baseElev,
            phase: (loc.x * 13 + loc.y * 7) * Math.PI,
          });
        } else {
          // Bake static minor procedural landmark into our single merged vertex-color buffer!
          const tempModel = buildProceduralLandmark3D(loc);
          tempModel.position.set(wx, baseElev, wz);
          bakeGroupToVertexColoredGeometries(tempModel, minorLandmarkGeoms);
        }
      }

      // Floating HTML interactive nameplate
      const el = document.createElement('div');
      el.className = `pin-3d-label imp-${loc.importance}`;
      el.setAttribute('data-id', loc.id);
      const dotColor = KIND_COLOR[loc.kind] ?? '#b6342a';
      el.innerHTML = `
        <span class="pin-3d-dot" style="background:${dotColor};"></span>
        <span class="pin-3d-en">${loc.name_en}</span>
        ${loc.importance === 1 ? `<span class="pin-3d-jp">${loc.name_jp}</span>` : ''}
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const st = store.getState();
        if (st.routeMode) {
          if (!st.routeStartId || (st.routeStartId && st.routeEndId)) {
            store.setRouteEndpoints(loc.id, null);
          } else if (st.routeStartId !== loc.id) {
            store.setRouteEndpoints(st.routeStartId, loc.id);
          }
        }
        store.update({ selectedId: loc.id, selectedCharacterId: null, popupCharacterId: null });
        window.history.replaceState(null, '', `#loc=${loc.id}`);
        this.flyToLocation(loc.id);
      });

      docFrag.appendChild(el);
      this.labelEls.set(loc.id, {
        el,
        worldPos,
        loc,
        filteredOut: false,
        lastVis: true,
        lastX: -9999,
        lastY: -9999,
      });
    }

    this.labelsContainer.appendChild(docFrag);

    // Merge all ~90 minor procedural landmarks into 1 single draw call!
    if (minorLandmarkGeoms.length > 0) {
      const mergedMinor = mergeGeometries(minorLandmarkGeoms, false);
      if (mergedMinor) {
        const minorMesh = new THREE.Mesh(mergedMinor, sharedOpaqueVertexMat);
        minorMesh.castShadow = true;
        minorMesh.receiveShadow = true;
        this.markersGroup.add(minorMesh);
      }
    }
  }

  private build3DCharacters() {
    const skyOffsets: Record<string, number> = {
      heaven: 89.8,
      'bhava-agra': 89.8,
    };

    const docFrag = document.createDocumentFragment();
    const placementsWithWorld: {
      p: ResidentPlacement;
      wx: number;
      wy: number;
      wz: number;
    }[] = [];

    for (const p of RESIDENT_PLACEMENTS) {
      const [wx, wz] = normToWorldXZ(p.x, p.y);
      const baseElev =
        p.id === 'wakasagihime'
          ? 2.4
          : getTerrainElevation(p.x, p.y) + (skyOffsets[p.locationId] ?? 0);
      placementsWithWorld.push({ p, wx, wy: baseElev, wz });

      this.charPickSpheres.push({
        charId: p.id,
        center: new THREE.Vector3(wx, baseElev + 4.2, wz),
        radiusSq: 7.5 * 7.5,
      });

      const el = document.createElement('div');
      el.className = 'char-3d-label';
      el.setAttribute('data-char-id', p.id);
      const spriteUrl = getResidentPixelSpriteDataUrl(p);
      el.innerHTML = `
        <img class="char-3d-pixel" src="${spriteUrl}" alt="" />
        <span class="char-3d-name">${p.shortName}</span>
      `;
      el.style.setProperty('--char-accent', p.accentColor);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        store.update({ popupCharacterId: p.id });
        this.flyToCharacter3D(p.id);
      });

      docFrag.appendChild(el);
      this.charLabelEls.set(p.id, {
        el,
        worldPos: new THREE.Vector3(wx, baseElev + 9.2, wz),
        placement: p,
        filteredOut: false,
        lastVis: false,
        lastX: -9999,
        lastY: -9999,
      });
    }

    this.labelsContainer.appendChild(docFrag);

    const normalizeForBatch = (
      src: THREE.BufferGeometry,
      mat4: THREE.Matrix4
    ): THREE.BufferGeometry => {
      const g = src.clone().toNonIndexed();
      g.applyMatrix4(mat4);
      g.computeVertexNormals();
      const posAttr = g.attributes.position;
      const normAttr = g.attributes.normal;
      const colAttr = g.attributes.color;
      const count = posAttr.count;
      const rgb = new Float32Array(count * 3);
      if (colAttr) {
        for (let i = 0; i < count; i++) {
          rgb[i * 3] = colAttr.getX(i);
          rgb[i * 3 + 1] = colAttr.getY(i);
          rgb[i * 3 + 2] = colAttr.getZ(i);
        }
      } else {
        rgb.fill(0.85);
      }
      const clean = new THREE.BufferGeometry();
      clean.setAttribute('position', posAttr);
      clean.setAttribute('normal', normAttr);
      clean.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
      return clean;
    };

    // Wait for both the 3D character kit AND all 3D building/diorama GLBs so we can raycast-verify
    // that no character is ever inside a building roof/wall, cliff crag, or sunk under a courtyard slab!
    void Promise.all([loadBlenderCharactersKit(), ...this.landmarkLoadPromises]).then(
      ([kit]) => {
        if (!kit) return;

        if (this.terrainMesh) this.terrainMesh.updateMatrixWorld(true);
        if (this.worldDioramaGroup) this.worldDioramaGroup.updateMatrixWorld(true);
        this.footprintsGroup.updateMatrixWorld(true);
        this.markersGroup.updateMatrixWorld(true);

        const buildingMeshes: THREE.Mesh[] = [];
        const collectMeshes = (grp: THREE.Object3D | null) => {
          if (!grp) return;
          grp.traverse((ch) => {
            if ((ch as THREE.Mesh).isMesh) {
              buildingMeshes.push(ch as THREE.Mesh);
            }
          });
        };
        collectMeshes(this.worldDioramaGroup);
        collectMeshes(this.footprintsGroup);
        collectMeshes(this.markersGroup);

        const downRay = new THREE.Raycaster();
        const downDir = new THREE.Vector3(0, -1, 0);
        const rayOrigin = new THREE.Vector3();
        const placedXZ: [number, number][] = [];

        const getRenderedTerrainY = (tx: number, tz: number): number => {
          if (this.terrainMesh) {
            rayOrigin.set(tx, 400, tz);
            downRay.set(rayOrigin, downDir);
            const tHits = downRay.intersectObject(this.terrainMesh, false);
            if (tHits.length > 0) {
              return tHits[0].point.y;
            }
          }
          const nx = tx / WORLD_W + 0.5;
          const ny = tz / WORLD_D + 0.5;
          return getTerrainElevation(nx, ny);
        };

        const isInsideLake = (nx: number, ny: number): boolean => {
          for (const lm of this.lakePolygons) {
            let inside = false;
            const pts = lm.points;
            for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
              const xi = pts[i][0],
                yi = pts[i][1];
              const xj = pts[j][0],
                yj = pts[j][1];
              if (
                yi > ny !== yj > ny &&
                nx < ((xj - xi) * (ny - yi)) / (yj - yi + 1e-9) + xi
              ) {
                inside = !inside;
              }
            }
            if (inside) return true;
          }
          return false;
        };

        const discRadius = 2.8;
        const discOffsets: [number, number][] = [
          [0, 0],
          [discRadius, 0],
          [-discRadius, 0],
          [0, discRadius],
          [0, -discRadius],
          [discRadius * 0.7, discRadius * 0.7],
          [-discRadius * 0.7, discRadius * 0.7],
          [discRadius * 0.7, -discRadius * 0.7],
          [-discRadius * 0.7, -discRadius * 0.7],
        ];

        const evaluateSpot = (
          tx: number,
          tz: number,
          p: ResidentPlacement
        ): { clear: boolean; groundY: number } => {
          if (p.id === 'wakasagihime') {
            return { clear: true, groundY: 2.4 };
          }

          const nx = tx / WORLD_W + 0.5;
          const ny = tz / WORLD_D + 0.5;
          const centerTerrY = getRenderedTerrainY(tx, tz);

          if (p.locationId === 'heaven' || p.locationId === 'bhava-agra') {
            rayOrigin.set(tx, 300, tz);
            downRay.set(rayOrigin, downDir);
            const hits = downRay
              .intersectObjects(buildingMeshes, false)
              .filter((h) => h.point.y > 100);
            if (hits.length > 0) {
              return { clear: true, groundY: hits[0].point.y };
            }
            return { clear: false, groundY: centerTerrY + 89.8 };
          }

          if (isInsideLake(nx, ny)) {
            return { clear: false, groundY: centerTerrY };
          }

          let centerGroundY = centerTerrY;
          let minG = Infinity;
          let maxG = -Infinity;

          for (let di = 0; di < discOffsets.length; di++) {
            const [dx, dz] = discOffsets[di];
            const px = tx + dx;
            const pz = tz + dz;
            const ptTerr = di === 0 ? centerTerrY : getRenderedTerrainY(px, pz);

            rayOrigin.set(px, ptTerr + 160, pz);
            downRay.set(rayOrigin, downDir);
            const hits = downRay
              .intersectObjects(buildingMeshes, false)
              .filter(
                (h) =>
                  h.point.y > 0.05 && !h.object.name.includes('CrustSlab')
              );

            let ptGround = ptTerr;
            if (hits.length > 0) {
              const topY = hits[0].point.y;
              const hDiff = topY - ptTerr;
              // Allow flat courtyard slabs and steps up to 4.8 units thick (even on 2.3x scaled landmarks),
              // while rejecting building roofs, walls, fences, and rocky crags!
              if (hDiff > 4.8) {
                return { clear: false, groundY: centerTerrY };
              }
              ptGround = Math.max(ptTerr, topY);
            }

            if (di === 0) centerGroundY = ptGround;
            if (ptGround < minG) minG = ptGround;
            if (ptGround > maxG) maxG = ptGround;
          }

          // Reject if the character's 2.8-unit footprint straddles a steep terrace step or cliff edge
          if (maxG - minG > 1.8) {
            return { clear: false, groundY: centerGroundY };
          }

          return { clear: true, groundY: centerGroundY };
        };

        const opaqueGeoms: THREE.BufferGeometry[] = [];
        const emissiveGeoms: THREE.BufferGeometry[] = [];
        const dummy = new THREE.Object3D();

        const candidateAngles = [
          0,
          0.35,
          -0.35,
          0.75,
          -0.75,
          1.15,
          -1.15,
          1.57,
          -1.57,
          2.1,
          -2.1,
          2.6,
          -2.6,
          Math.PI,
        ];
        const candidateRadii = [5, 10, 15, 20, 26, 32, 40, 48, 56, 66];

        for (let i = 0; i < placementsWithWorld.length; i++) {
          const item = placementsWithWorld[i];
          const { p } = item;

          let finalX = item.wx;
          let finalZ = item.wz;
          let finalY = item.wy;

          const initialCheck = evaluateSpot(finalX, finalZ, p);
          const tooCloseToOther = (cx: number, cz: number) =>
            placedXZ.some(([px, pz]) => Math.hypot(cx - px, cz - pz) < 4.5);

          if (initialCheck.clear && !tooCloseToOther(finalX, finalZ)) {
            finalY = initialCheck.groundY;
          } else {
            // Spiral outward biased toward +Z (front courtyard) until clear of any building roof/wall
            let found = false;
            for (const rad of candidateRadii) {
              for (const ang of candidateAngles) {
                const tx = item.wx + Math.sin(ang) * rad;
                const tz = item.wz + Math.cos(ang) * rad;
                if (tooCloseToOther(tx, tz)) continue;
                const chk = evaluateSpot(tx, tz, p);
                if (chk.clear) {
                  finalX = tx;
                  finalZ = tz;
                  finalY = chk.groundY;
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
          }

          placedXZ.push([finalX, finalZ]);
          item.wx = finalX;
          item.wy = finalY;
          item.wz = finalZ;

          // Sync picking sphere and floating 3D badge to the verified collision-free position!
          if (this.charPickSpheres[i]) {
            this.charPickSpheres[i].center.set(finalX, finalY + 4.2, finalZ);
          }
          const lblItem = this.charLabelEls.get(p.id);
          if (lblItem) {
            lblItem.worldPos.set(finalX, finalY + 9.2, finalZ);
          }

          const opSrc = kit[`${p.id}_Opaque`];
          const emSrc = kit[`${p.id}_Emissive`];

          dummy.position.set(finalX, finalY, finalZ);
          dummy.rotation.set(0, ((i % 5) - 2) * 0.14, 0);
          dummy.scale.setScalar(3.5);
          dummy.updateMatrix();

          if (opSrc) {
            opaqueGeoms.push(normalizeForBatch(opSrc, dummy.matrix));
          }
          if (emSrc) {
            emissiveGeoms.push(normalizeForBatch(emSrc, dummy.matrix));
          }
        }

        if (opaqueGeoms.length > 0) {
          const mergedOp = mergeGeometries(opaqueGeoms, false);
          if (mergedOp) {
            const meshOp = new THREE.Mesh(mergedOp, sharedOpaqueVertexMat);
            meshOp.castShadow = true;
            meshOp.receiveShadow = true;
            this.residentsGroup.add(meshOp);
          }
        }

        if (emissiveGeoms.length > 0) {
          const mergedEm = mergeGeometries(emissiveGeoms, false);
          if (mergedEm) {
            const meshEm = new THREE.Mesh(mergedEm, sharedEmissiveVertexMat);
            meshEm.castShadow = false;
            meshEm.receiveShadow = false;
            this.residentsGroup.add(meshEm);
          }
        }

        this.labelsDirty = true;
        this.requestShadowUpdate();
      }
    );
  }

  private updateLabelFilterStates() {
    const st = store.getState();
    const q = st.searchQuery.trim().toLowerCase();
    const activeChar = st.popupCharacterId ?? st.selectedCharacterId;

    for (const [id, item] of this.labelEls.entries()) {
      const { el, loc } = item;
      const isSelected = id === st.selectedId;
      el.classList.toggle('is-selected', isSelected);

      const regionOk = st.regionFilter === 'All' || loc.region === st.regionFilter;
      const kindOk = st.kindFilter === 'All' || loc.kind === st.kindFilter;
      const searchOk =
        !q ||
        loc.name_en.toLowerCase().includes(q) ||
        loc.name_jp.toLowerCase().includes(q) ||
        loc.residents.some((r) => r.toLowerCase().includes(q));

      item.filteredOut = !regionOk || !kindOk || !searchOk;
    }

    for (const [cid, cItem] of this.charLabelEls.entries()) {
      const { el, placement } = cItem;
      const isSelected = cid === activeChar;
      el.classList.toggle('is-selected', isSelected);

      const regionOk = st.regionFilter === 'All' || placement.region === st.regionFilter;
      const ch = store.getCharacter(cid);
      const searchOk =
        !q ||
        placement.shortName.toLowerCase().includes(q) ||
        placement.spotLabel.toLowerCase().includes(q) ||
        Boolean(
          ch &&
            (ch.name_en.toLowerCase().includes(q) ||
              ch.name_jp.toLowerCase().includes(q) ||
              ch.title.toLowerCase().includes(q))
        );

      cItem.filteredOut = !st.showResidents || !regionOk || !searchOk;
    }

    this.labelsDirty = true;
  }

  private updateProjectedLabels() {
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const camPos = this.camera.position;
    const st = store.getState();
    const selectedId = st.selectedId;
    const activeChar = st.popupCharacterId ?? st.selectedCharacterId;
    const isCloseUpInspection = camPos.y < 115;
    const tempV = new THREE.Vector3();

    for (const [id, item] of this.labelEls.entries()) {
      if (item.filteredOut) {
        if (item.lastVis) {
          item.el.style.display = 'none';
          item.lastVis = false;
        }
        continue;
      }

      const { el, worldPos, loc } = item;
      const dist = camPos.distanceTo(worldPos);
      const isSelected = id === selectedId;

      if (!isSelected) {
        if (
          (isCloseUpInspection && dist > 195) ||
          (loc.importance === 3 && dist > 340) ||
          (loc.importance === 2 && dist > 780)
        ) {
          if (item.lastVis) {
            el.style.display = 'none';
            item.lastVis = false;
          }
          continue;
        }
      }

      tempV.copy(worldPos).project(this.camera);

      if (tempV.z > 1) {
        if (item.lastVis) {
          el.style.display = 'none';
          item.lastVis = false;
        }
        continue;
      }

      const sx = tempV.x * halfW + halfW;
      const sy = -tempV.y * halfH + halfH;

      if (sx < -80 || sx > width + 80 || sy < -40 || sy > height + 40) {
        if (item.lastVis) {
          el.style.display = 'none';
          item.lastVis = false;
        }
        continue;
      }

      if (!item.lastVis) {
        el.style.display = 'inline-flex';
        item.lastVis = true;
      }

      if (Math.abs(sx - item.lastX) > 0.35 || Math.abs(sy - item.lastY) > 0.35) {
        item.lastX = sx;
        item.lastY = sy;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    }

    for (const [cid, cItem] of this.charLabelEls.entries()) {
      if (cItem.filteredOut) {
        if (cItem.lastVis) {
          cItem.el.style.display = 'none';
          cItem.lastVis = false;
        }
        continue;
      }

      const { el, worldPos } = cItem;
      const dist = camPos.distanceTo(worldPos);
      const isSelected = cid === activeChar;

      if (!isSelected && dist > 480) {
        if (cItem.lastVis) {
          el.style.display = 'none';
          cItem.lastVis = false;
        }
        continue;
      }

      tempV.copy(worldPos).project(this.camera);
      if (tempV.z > 1) {
        if (cItem.lastVis) {
          el.style.display = 'none';
          cItem.lastVis = false;
        }
        continue;
      }

      const sx = tempV.x * halfW + halfW;
      const sy = -tempV.y * halfH + halfH;

      if (sx < -60 || sx > width + 60 || sy < -30 || sy > height + 30) {
        if (cItem.lastVis) {
          el.style.display = 'none';
          cItem.lastVis = false;
        }
        continue;
      }

      if (!cItem.lastVis) {
        el.style.display = 'inline-flex';
        cItem.lastVis = true;
      }

      if (Math.abs(sx - cItem.lastX) > 0.35 || Math.abs(sy - cItem.lastY) > 0.35) {
        cItem.lastX = sx;
        cItem.lastY = sy;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    }
  }

  public applyTimeOfDay(tod: TimeOfDay) {
    if (tod === 'day') {
      this.scene.background = new THREE.Color(0xdce6f2);
      this.scene.fog = new THREE.FogExp2(0xdce6f2, 0.00038);
      this.ambientLight.color.setHex(0xfff6e6);
      this.ambientLight.groundColor.setHex(0x5c5346);
      this.ambientLight.intensity = 0.95;
      this.sunLight.color.setHex(0xfff2d6);
      this.sunLight.intensity = 1.65;
      this.sunLight.position.set(420, 680, 380);
      this.sdmPointLight.visible = false;
      this.sdmPointLight.intensity = 0;
      for (const pl of this.nightPointLights) {
        pl.visible = false;
        pl.intensity = 0;
      }
    } else if (tod === 'dusk') {
      this.scene.background = new THREE.Color(0xd99b72);
      this.scene.fog = new THREE.FogExp2(0xd99b72, 0.00045);
      this.ambientLight.color.setHex(0xffb885);
      this.ambientLight.groundColor.setHex(0x422a24);
      this.ambientLight.intensity = 0.78;
      this.sunLight.color.setHex(0xff8c42);
      this.sunLight.intensity = 1.45;
      this.sunLight.position.set(-540, 320, 480);
      this.sdmPointLight.visible = true;
      this.sdmPointLight.intensity = 2.2;
      for (const pl of this.nightPointLights) {
        pl.visible = true;
        pl.intensity = 1.8;
      }
    } else {
      this.scene.background = new THREE.Color(0x0f1626);
      this.scene.fog = new THREE.FogExp2(0x0f1626, 0.00048);
      this.ambientLight.color.setHex(0x486299);
      this.ambientLight.groundColor.setHex(0x141824);
      this.ambientLight.intensity = 0.52;
      this.sunLight.color.setHex(0x88aaff);
      this.sunLight.intensity = 0.55;
      this.sunLight.position.set(-320, 580, -320);
      this.sdmPointLight.visible = true;
      this.sdmPointLight.intensity = 4.5;
      for (const pl of this.nightPointLights) {
        pl.visible = true;
        pl.intensity = 3.8;
      }
    }
    this.requestShadowUpdate();
  }

  public setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;
    this.containerEl.style.display = active ? 'block' : 'none';

    if (active) {
      this.handleResize();
      this.updateLabelFilterStates();
      this.requestShadowUpdate();
      const selectedId = store.getState().selectedId;
      if (selectedId) {
        this.flyToLocation(selectedId);
      }
      this.startLoop();
    } else {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
    }
  }

  private handleResize() {
    if (!this.isActive) return;
    const w = this.containerEl.clientWidth || window.innerWidth;
    const h = this.containerEl.clientHeight || window.innerHeight;
    this.viewportWidth = w;
    this.viewportHeight = h;
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelsDirty = true;
  }

  private startLoop() {
    const lastCamPos = new THREE.Vector3();
    const lastTargetPos = new THREE.Vector3();

    const tick = (now: number) => {
      if (!this.isActive) return;
      this.rafId = requestAnimationFrame(tick);

      if (this.flyAnim) {
        const t = Math.min(1, (now - this.flyAnim.startTime) / this.flyAnim.duration);
        const ease = 1 - Math.pow(1 - t, 3);
        this.camera.position.lerpVectors(this.flyAnim.fromPos, this.flyAnim.toPos, ease);
        this.controls.target.lerpVectors(this.flyAnim.fromTarget, this.flyAnim.toTarget, ease);
        if (t >= 1) this.flyAnim = null;
      }

      // Gentle vertical bobbing for floating sky locations
      const sec = now * 0.001;
      for (let i = 0; i < this.floatingObjects.length; i++) {
        const f = this.floatingObjects[i];
        f.obj.position.y = f.baseY + Math.sin(sec * 1.4 + f.phase) * 1.8;
      }

      this.controls.update();

      const camMoved =
        lastCamPos.distanceToSquared(this.camera.position) > 0.0005 ||
        lastTargetPos.distanceToSquared(this.controls.target) > 0.0005;

      if (camMoved || this.labelsDirty) {
        lastCamPos.copy(this.camera.position);
        lastTargetPos.copy(this.controls.target);
        this.labelsDirty = false;
        this.updateProjectedLabels();
      }

      this.renderer.render(this.scene, this.camera);
    };
    this.rafId = requestAnimationFrame(tick);
  }


  public flyToCameraPose(toPos: THREE.Vector3, toTarget: THREE.Vector3, duration = 900) {
    this.flyAnim = {
      startTime: performance.now(),
      duration,
      fromPos: this.camera.position.clone(),
      fromTarget: this.controls.target.clone(),
      toPos,
      toTarget,
    };
  }

  public flyToCharacter3D(charId: string) {
    const pick = this.charPickSpheres.find((c) => c.charId === charId);
    if (pick) {
      const { x: cx, y: cy, z: cz } = pick.center;
      this.flyToCameraPose(
        new THREE.Vector3(cx + 14, cy + 26, cz + 44),
        new THREE.Vector3(cx, cy + 1.5, cz),
        750
      );
      return;
    }
    const placement = getResidentPlacement(charId);
    if (placement) {
      const [wx, wz] = normToWorldXZ(placement.x, placement.y);
      const wy = getTerrainElevation(placement.x, placement.y);
      this.flyToCameraPose(
        new THREE.Vector3(wx + 14, wy + 28, wz + 44),
        new THREE.Vector3(wx, wy + 3.5, wz),
        750
      );
    }
  }

  public flyToNormalized(nx: number, ny: number, targetK = 2.6) {
    const [wx, wz] = normToWorldXZ(nx, ny);
    const wy = getTerrainElevation(nx, ny);

    // Special close-up cinematic framing outside the 1.45x-scaled Scarlet Devil Mansion compound
    if (Math.hypot(nx - 0.825, ny - 0.745) < 0.025) {
      this.flyToCameraPose(
        new THREE.Vector3(wx + 88, wy + 78, wz + 128),
        new THREE.Vector3(wx, wy + 18, wz - 6),
        950
      );
      return;
    }

    const dist = Math.max(85, 360 / Math.max(1, targetK * 0.75));
    this.flyToCameraPose(
      new THREE.Vector3(wx + dist * 0.25, wy + dist * 0.68, wz + dist * 0.82),
      new THREE.Vector3(wx, wy + 6, wz),
      850
    );
  }

  public flyToLocation(id: string) {
    const [sdmX, sdmZ] = normToWorldXZ(0.825, 0.745);
    const sdmY = getTerrainElevation(0.825, 0.745);

    if (id === 'voile-library') {
      this.flyToCameraPose(
        new THREE.Vector3(sdmX - 96, sdmY + 54, sdmZ + 32),
        new THREE.Vector3(sdmX - 36, sdmY + 14, sdmZ - 12),
        900
      );
      return;
    }
    if (id === 'sdm-parlor-dining') {
      this.flyToCameraPose(
        new THREE.Vector3(sdmX + 94, sdmY + 52, sdmZ + 56),
        new THREE.Vector3(sdmX + 32, sdmY + 12, sdmZ + 4),
        900
      );
      return;
    }
    if (id === 'sdm-gardens-east-wing') {
      this.flyToCameraPose(
        new THREE.Vector3(sdmX + 96, sdmY + 62, sdmZ - 72),
        new THREE.Vector3(sdmX + 32, sdmY + 14, sdmZ - 26),
        900
      );
      return;
    }

    const loc = store.getLocation(id);
    if (!loc) return;
    this.flyToNormalized(loc.x, loc.y, 2.8);
  }

  public zoomByFactor(factor: number) {
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    dir.multiplyScalar(1 / factor);
    const len = dir.length();
    if (len < this.controls.minDistance) dir.setLength(this.controls.minDistance);
    if (len > this.controls.maxDistance) dir.setLength(this.controls.maxDistance);
    this.flyToCameraPose(
      new THREE.Vector3().addVectors(this.controls.target, dir),
      this.controls.target.clone(),
      300
    );
  }

  public resetView() {
    this.flyToCameraPose(
      new THREE.Vector3(0, 860, 920),
      new THREE.Vector3(0, 10, 40),
      850
    );
  }
}
