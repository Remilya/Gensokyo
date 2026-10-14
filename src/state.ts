import type {
  AppState,
  ComputedRoute,
  LocationEntry,
  RouteEntry,
} from './types';

export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 1600;

type Listener = (state: AppState) => void;

class Store {
  private state: AppState = {
    selectedId: null,
    hoveredId: null,
    searchQuery: '',
    regionFilter: 'All',
    kindFilter: 'All',
    timeOfDay: 'day',
    routeMode: false,
    routeStartId: null,
    routeEndId: null,
    computedRoute: null,
    showFootprints: true,
    showRoutes: true,
    zoom: { x: 0, y: 0, k: 1 },
  };

  private listeners = new Set<Listener>();
  private locations: LocationEntry[] = [];
  private routes: RouteEntry[] = [];
  private locMap = new Map<string, LocationEntry>();

  public initData(locations: LocationEntry[], routes: RouteEntry[]) {
    this.locations = locations;
    this.routes = routes;
    this.locMap.clear();
    for (const loc of locations) {
      this.locMap.set(loc.id, loc);
    }
  }

  public getLocations(): LocationEntry[] {
    return this.locations;
  }

  public getLocation(id: string | null | undefined): LocationEntry | undefined {
    if (!id) return undefined;
    return this.locMap.get(id);
  }

  public getRoutes(): RouteEntry[] {
    return this.routes;
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public update(patch: Partial<AppState>) {
    this.state = { ...this.state, ...patch };
    for (const fn of this.listeners) {
      fn(this.state);
    }
  }

  public setRouteEndpoints(startId: string | null, endId: string | null) {
    let computedRoute: ComputedRoute | null = null;
    if (startId && endId && startId !== endId) {
      const from = this.locMap.get(startId);
      const to = this.locMap.get(endId);
      if (from && to) {
        computedRoute = this.computeShortestPath(from, to);
      }
    }
    this.update({
      routeStartId: startId,
      routeEndId: endId,
      computedRoute,
    });
  }

  /**
   * Computes shortest walking-time path along data/routes.json using Dijkstra's algorithm,
   * with automatic fallback to calibrated crow-flies distance if in disconnected realms.
   */
  public computeShortestPath(from: LocationEntry, to: LocationEntry): ComputedRoute {
    const crowUnits = Math.hypot(to.x - from.x, to.y - from.y);
    // 0.10 canvas units ≈ 1.2 km
    const crowKm = +(crowUnits * 12.0).toFixed(2);
    const flightMinutes = Math.max(2, Math.round(crowKm * 2.2));

    const adj = new Map<string, { neighbor: string; route: RouteEntry }[]>();
    for (const r of this.routes) {
      if (!adj.has(r.from)) adj.set(r.from, []);
      if (!adj.has(r.to)) adj.set(r.to, []);
      adj.get(r.from)!.push({ neighbor: r.to, route: r });
      adj.get(r.to)!.push({ neighbor: r.from, route: r });
    }

    const dist = new Map<string, number>();
    const prev = new Map<string, { prevId: string; route: RouteEntry }>();
    const visited = new Set<string>();

    for (const loc of this.locations) {
      dist.set(loc.id, Infinity);
    }
    dist.set(from.id, 0);

    while (true) {
      let u: string | null = null;
      let best = Infinity;
      for (const [id, d] of dist.entries()) {
        if (!visited.has(id) && d < best) {
          best = d;
          u = id;
        }
      }
      if (!u || u === to.id || best === Infinity) break;
      visited.add(u);

      const edges = adj.get(u) ?? [];
      for (const edge of edges) {
        if (visited.has(edge.neighbor)) continue;
        const alt = best + edge.route.minutes;
        if (alt < (dist.get(edge.neighbor) ?? Infinity)) {
          dist.set(edge.neighbor, alt);
          prev.set(edge.neighbor, { prevId: u, route: edge.route });
        }
      }
    }

    if ((dist.get(to.id) ?? Infinity) < Infinity) {
      const hops: LocationEntry[] = [];
      const segments: RouteEntry[] = [];
      let curr: string | undefined = to.id;
      while (curr) {
        const loc = this.locMap.get(curr);
        if (loc) hops.unshift(loc);
        const step = prev.get(curr);
        if (!step) break;
        segments.unshift(step.route);
        curr = step.prevId;
      }
      const totalMinutes = segments.reduce((acc, s) => acc + s.minutes, 0);
      const totalKm = +segments.reduce((acc, s) => acc + s.distance_km, 0).toFixed(2);
      return {
        from,
        to,
        hops,
        segments,
        totalMinutes,
        totalKm,
        flightMinutes,
        crowKm,
        isDirectGraphPath: true,
      };
    }

    // Fallback if one of the locations is a minor sub-location not directly wired into the trunk graph:
    // snap to nearest wired node or compute terrain-calibrated walking time
    const walkMinutes = Math.max(3, Math.round(crowKm * 15));
    return {
      from,
      to,
      hops: [from, to],
      segments: [],
      totalMinutes: walkMinutes,
      totalKm: crowKm,
      flightMinutes,
      crowKm,
      isDirectGraphPath: false,
    };
  }
}

export const store = new Store();
