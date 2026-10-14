import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

interface LocationEntry {
  id: string;
  name_en: string;
  name_jp: string;
  kind: string;
  region: string;
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
}

const VALID_KINDS = new Set([
  'shrine',
  'temple',
  'residence',
  'village',
  'landmark',
  'water',
  'mountain',
  'forest',
  'otherworld',
]);

const VALID_REGIONS = new Set([
  'Heartland',
  'Hakurei',
  'Forest of Magic',
  'Misty Lake',
  'Bamboo Forest',
  'Youkai Mountain',
  'Underworld',
  'Netherworld',
  'Otherworld',
]);

function fail(msg: string): never {
  console.error(`❌ [validate-data] ${msg}`);
  process.exit(1);
}

const locationsPath = path.join(rootDir, 'data', 'locations.json');
const routesPath = path.join(rootDir, 'data', 'routes.json');
const terrainPath = path.join(rootDir, 'data', 'terrain.json');

if (!fs.existsSync(locationsPath)) fail('Missing data/locations.json');
if (!fs.existsSync(routesPath)) fail('Missing data/routes.json');
if (!fs.existsSync(terrainPath)) fail('Missing data/terrain.json');

const locations: LocationEntry[] = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
const terrain = JSON.parse(fs.readFileSync(terrainPath, 'utf-8'));

if (!Array.isArray(locations) || locations.length < 55) {
  fail(`Expected at least 55 locations, found ${locations?.length ?? 0}`);
}

const ids = new Set<string>();
const idRegex = /^[a-z0-9-]+$/;

for (const loc of locations) {
  if (!loc.id || !idRegex.test(loc.id)) fail(`Invalid id: ${loc.id}`);
  if (ids.has(loc.id)) fail(`Duplicate id: ${loc.id}`);
  ids.add(loc.id);

  if (!loc.name_en || loc.name_en.trim().length < 1) fail(`${loc.id}: missing name_en`);
  if (!loc.name_jp || loc.name_jp.trim().length < 1) fail(`${loc.id}: missing name_jp`);
  if (!VALID_KINDS.has(loc.kind)) fail(`${loc.id}: invalid kind '${loc.kind}'`);
  if (!VALID_REGIONS.has(loc.region)) fail(`${loc.id}: invalid region '${loc.region}'`);
  if (typeof loc.x !== 'number' || loc.x < 0 || loc.x > 1) fail(`${loc.id}: x out of [0,1] (${loc.x})`);
  if (typeof loc.y !== 'number' || loc.y < 0 || loc.y > 1) fail(`${loc.id}: y out of [0,1] (${loc.y})`);
  if (![1, 2, 3].includes(loc.importance)) fail(`${loc.id}: invalid importance ${loc.importance}`);
  if (!loc.short_desc || loc.short_desc.length < 10 || loc.short_desc.length > 240) {
    fail(`${loc.id}: short_desc length out of [10,240] (${loc.short_desc?.length})`);
  }
  if (!loc.long_desc || loc.long_desc.length < 40) {
    fail(`${loc.id}: long_desc too short (${loc.long_desc?.length})`);
  }
  if (!Array.isArray(loc.residents)) fail(`${loc.id}: residents must be array`);
  if (!loc.first_appearance) fail(`${loc.id}: missing first_appearance`);
  if (!Array.isArray(loc.sources) || loc.sources.length < 1) fail(`${loc.id}: sources must be non-empty array`);
  if (loc.confidence !== 'canon' && loc.confidence !== 'fanon') fail(`${loc.id}: invalid confidence`);
  if (!loc.placement_note || loc.placement_note.length < 10) fail(`${loc.id}: placement_note too short`);
}

// Check pairwise minimum separation >= 0.015
const MIN_SEP = 0.015;
for (let i = 0; i < locations.length; i++) {
  for (let j = i + 1; j < locations.length; j++) {
    const a = locations[i];
    const b = locations[j];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < MIN_SEP) {
      fail(`Locations '${a.id}' and '${b.id}' are too close: ${dist.toFixed(4)} < ${MIN_SEP}`);
    }
  }
}

// Validate routes
if (!Array.isArray(routes) || routes.length < 20) {
  fail(`Expected at least 20 routes, found ${routes?.length ?? 0}`);
}
for (const r of routes) {
  if (!ids.has(r.from)) fail(`Route '${r.id}' references unknown from='${r.from}'`);
  if (!ids.has(r.to)) fail(`Route '${r.id}' references unknown to='${r.to}'`);
  if (!Array.isArray(r.points) || r.points.length < 2) fail(`Route '${r.id}' must have >= 2 points`);
}

// Validate terrain
if (!terrain || !Array.isArray(terrain.regions) || !Array.isArray(terrain.lakes) || !Array.isArray(terrain.rivers)) {
  fail('terrain.json must contain regions, lakes, and rivers arrays');
}

// Validate characters
const charactersPath = path.join(rootDir, 'data', 'characters.json');
if (!fs.existsSync(charactersPath)) fail('Missing data/characters.json');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));
if (!Array.isArray(characters) || characters.length < 100) {
  fail(`Expected at least 100 characters, found ${characters?.length ?? 0}`);
}

console.log(`✅ [validate-data] Passed! Validated ${locations.length} locations, ${characters.length} characters, ${routes.length} routes, ${terrain.regions.length} biome regions, ${terrain.lakes.length} lakes, and ${terrain.rivers.length} rivers.`);
