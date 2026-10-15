export type LocationKind =
  | 'shrine'
  | 'temple'
  | 'residence'
  | 'village'
  | 'landmark'
  | 'water'
  | 'mountain'
  | 'forest'
  | 'otherworld';

export type GensokyoRegion =
  | 'Heartland'
  | 'Hakurei'
  | 'Forest of Magic'
  | 'Misty Lake'
  | 'Bamboo Forest'
  | 'Youkai Mountain'
  | 'Underworld'
  | 'Netherworld'
  | 'Otherworld';

export interface LocationEntry {
  id: string;
  name_en: string;
  name_jp: string;
  kind: LocationKind;
  region: GensokyoRegion;
  x: number;
  y: number;
  importance: 1 | 2 | 3;
  short_desc: string;
  long_desc: string;
  residents: string[];
  first_appearance: string;
  sources: string[];
  confidence: 'canon' | 'fanon';
  placement_note: string;
  icon?: string;
  atlas_sector?: string;
  travel_time?: string;
  approach_route?: string;
  local_customs?: string;
  connected_ids?: string[];
  wiki_title?: string;
  wiki_url?: string;
  wiki_romaji?: string;
  wiki_summary?: string;
  wiki_sublocations?: string[];
  image_url?: string;
  image_caption?: string;
  visual_blueprint?: string;
  model_url?: string;
}

export type RouteKind = 'road' | 'path' | 'secret' | 'ropeway' | 'ferry' | 'portal';

export interface RouteEntry {
  id: string;
  name: string;
  from: string;
  to: string;
  kind: RouteKind;
  minutes: number;
  distance_km: number;
  points: [number, number][];
}

export interface TerrainRegion {
  id: string;
  name: string;
  biome: string;
  points: [number, number][];
}

export interface TerrainLake {
  id: string;
  name: string;
  kind: 'water' | 'blood';
  points: [number, number][];
}

export interface TerrainRiver {
  id: string;
  name: string;
  width: number;
  points: [number, number][];
}

export interface TerrainData {
  regions: TerrainRegion[];
  lakes: TerrainLake[];
  rivers: TerrainRiver[];
}

export type TimeOfDay = 'day' | 'dusk' | 'night';

export interface ComputedRoute {
  from: LocationEntry;
  to: LocationEntry;
  hops: LocationEntry[];
  segments: RouteEntry[];
  totalMinutes: number;
  totalKm: number;
  flightMinutes: number;
  crowKm: number;
  isDirectGraphPath: boolean;
}

export interface ZoomState {
  x: number;
  y: number;
  k: number;
}

export interface CharacterRelation {
  name: string;
  id: string;
  summary: string;
}

export interface CharacterEntry {
  id: string;
  name_en: string;
  name_jp: string;
  title: string;
  tagline?: string;
  species: string;
  occupation: string;
  abilities: string;
  age?: string;
  theme_music?: string;
  first_appearance: string;
  wiki_url: string;
  sprite_url?: string;
  who_they_are: string;
  key_facts?: string[];
  personality: string;
  allies: CharacterRelation[];
  rivals: CharacterRelation[];
  acquaintances: CharacterRelation[];
  home_location_ids: string[];
}

export interface AppState {
  selectedId: string | null;
  selectedCharacterId: string | null;
  popupCharacterId: string | null;
  hoveredId: string | null;
  searchQuery: string;
  regionFilter: GensokyoRegion | 'All';
  kindFilter: LocationKind | 'All';
  timeOfDay: TimeOfDay;
  routeMode: boolean;
  routeStartId: string | null;
  routeEndId: string | null;
  computedRoute: ComputedRoute | null;
  showFootprints: boolean;
  showRoutes: boolean;
  showResidents: boolean;
  view3d: boolean;
  zoom: ZoomState;
}
