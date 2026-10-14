import charactersData from '../data/characters.json';
import locationsData from '../data/locations.json';
import routesData from '../data/routes.json';
import terrainData from '../data/terrain.json';
import { MapCanvas } from './map/canvas';
import { store } from './state';
import './styles/main.css';
import type { CharacterEntry, LocationEntry, RouteEntry, TerrainData } from './types';
import { mountControlsAndLegend } from './ui/controls';
import { mountMinimap } from './ui/minimap';
import { mountSearchAndRealmBar } from './ui/search';
import { mountSidePanel } from './ui/side-panel';

function bootstrap() {
  const app = document.getElementById('app');
  if (!app) return;

  store.initData(
    locationsData as unknown as LocationEntry[],
    routesData as unknown as RouteEntry[],
    charactersData as unknown as CharacterEntry[]
  );

  const mapCanvas = new MapCanvas(app, terrainData as unknown as TerrainData);
  mountSearchAndRealmBar(app, mapCanvas);
  mountControlsAndLegend(app, mapCanvas);
  mountMinimap(terrainData as unknown as TerrainData, mapCanvas);
  mountSidePanel(app, mapCanvas);

  // Check URL hash deep link (#loc=hakurei-shrine or #char=reimu-hakurei)
  const hash = window.location.hash;
  if (hash.startsWith('#loc=')) {
    const id = decodeURIComponent(hash.slice(5));
    if (store.getLocation(id)) {
      setTimeout(() => {
        store.update({ selectedId: id, selectedCharacterId: null });
        mapCanvas.flyToLocation(id, 2.5);
      }, 120);
    }
  } else if (hash.startsWith('#char=')) {
    const cid = decodeURIComponent(hash.slice(6));
    const ch = store.getCharacter(cid);
    if (ch) {
      setTimeout(() => {
        const homeId = ch.home_location_ids?.[0] ?? null;
        store.update({ selectedId: homeId, selectedCharacterId: ch.id });
        if (homeId) mapCanvas.flyToLocation(homeId, 2.5);
      }, 120);
    }
  }
}

bootstrap();
