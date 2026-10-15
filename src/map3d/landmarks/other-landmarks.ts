import * as THREE from 'three';
import type { LocationEntry } from '../../types';

function createGableRoofX(
  width: number,
  depth: number,
  height: number,
  roofMat: THREE.Material,
  ridgeMat?: THREE.Material
): THREE.Group {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1, height, 4), roofMat);
  cone.rotation.y = Math.PI / 4;
  cone.scale.set(width / Math.SQRT2, 1, depth / Math.SQRT2);
  cone.position.y = height / 2;
  cone.castShadow = true;
  g.add(cone);

  if (ridgeMat) {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, 0.35, 0.45), ridgeMat);
    ridge.position.y = height * 0.92;
    g.add(ridge);
  }
  return g;
}

function createGableRoofZ(
  width: number,
  depth: number,
  height: number,
  roofMat: THREE.Material,
  ridgeMat?: THREE.Material
): THREE.Group {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1, height, 4), roofMat);
  cone.rotation.y = Math.PI / 4;
  cone.scale.set(width / Math.SQRT2, 1, depth / Math.SQRT2);
  cone.position.y = height / 2;
  cone.castShadow = true;
  g.add(cone);

  if (ridgeMat) {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, depth * 0.85), ridgeMat);
    ridge.position.y = height * 0.92;
    g.add(ridge);
  }
  return g;
}

/**
 * 1. HUMAN VILLAGE 3D WALLED PALISADE, 4 GATEHOUSES, DRAGON CANAL & MACHIYA TOWNHOUSES
 */
export function buildHumanVillage3D(): THREE.Group {
  const village = new THREE.Group();
  village.name = 'landmark-human-village';

  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xefe2c6, roughness: 0.78 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x543824, roughness: 0.85 });
  const roofSlateMat = new THREE.MeshStandardMaterial({ color: 0x454c54, roughness: 0.72 });
  const roofBrownMat = new THREE.MeshStandardMaterial({ color: 0x5e412f, roughness: 0.75 });
  const roadMat = new THREE.MeshStandardMaterial({ color: 0xd8c59e, roughness: 0.9 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x4380b0, roughness: 0.25, metalness: 0.15 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8c857b, roughness: 0.82 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a74a, roughness: 0.35, metalness: 0.6 });

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(86, 88, 0.8, 36), roadMat);
  ground.scale.set(1.38, 1, 0.96);
  ground.position.y = 0.4;
  ground.receiveShadow = true;
  village.add(ground);

  const canal = new THREE.Mesh(new THREE.BoxGeometry(10, 0.95, 158), waterMat);
  canal.position.set(12, 0.48, 0);
  const canalBanks = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.88, 158), stoneMat);
  canalBanks.position.set(12, 0.44, 0);
  village.add(canalBanks, canal);

  for (const bz of [-34, 0, 34]) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(15, 1.8, 7.5), timberMat);
    bridge.position.set(12, 1.4, bz);
    bridge.castShadow = true;
    village.add(bridge);
  }

  // Carved Stone Dragon Statue Monument at Dragon Statue Square (dx: 43.2, dz: -48.0)
  const dragonGroup = new THREE.Group();
  dragonGroup.position.set(43.2, 0, -48.0);
  dragonGroup.userData.locationId = 'dragon-statue';
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(20, 0.95, 20), stoneMat);
  plaza.position.set(0, 0.48, 0);
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.8, 4.5), stoneMat);
  pedestal.position.set(0, 2.3, 0);
  const dragonPillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5.2, 2.2), stoneMat);
  dragonPillar.position.set(0, 6.2, 0);
  const dragonRoof = createGableRoofX(4.2, 4.2, 2.0, roofSlateMat, goldMat);
  dragonRoof.position.set(0, 8.8, 0);
  dragonGroup.add(plaza, pedestal, dragonPillar, dragonRoof);
  village.add(dragonGroup);

  const reservedPlots: [number, number][] = [
    [-4.8, 73.6], // Suzunaan
    [-105.6, -6.4], // Geidontei
    [0.0, -32.0], // Terakoya
    [-57.6, -38.4], // Hieda Estate
    [43.2, -48.0], // Dragon Statue
    [81.6, -6.4], // Kirisame-ya
  ];

  const rows = [-52, -34, -18, 18, 34, 52];
  const cols = [-88, -66, -44, -24, 30, 50, 70, 88];
  for (const rz of rows) {
    for (const cx of cols) {
      if (Math.hypot(cx * 0.76, rz * 1.08) > 84) continue;
      if (cx === 30 && Math.abs(rz) === 18) continue;
      if (reservedPlots.some(([px, pz]) => Math.hypot(cx - px, rz - pz) < 20)) continue;
      const bw = 13 + ((Math.abs(cx + rz) % 3) * 2.5);
      const bd = 9.5 + ((Math.abs(cx * rz) % 2) * 2.0);
      const bh = 4.6 + ((Math.abs(cx + rz) % 2) * 1.4);
      const isSlate = (cx + rz) % 3 === 0;

      const house = new THREE.Group();
      house.position.set(cx, 0.8, rz);
      const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), plasterMat);
      body.position.y = bh / 2;
      body.castShadow = true;
      body.receiveShadow = true;

      const roof = createGableRoofX(bw + 1.4, bd + 1.4, 2.8, isSlate ? roofSlateMat : roofBrownMat);
      roof.position.y = bh;
      house.add(body, roof);
      village.add(house);
    }
  }

  const wallSegs = 48;
  for (let i = 0; i < wallSegs; i++) {
    const ang = (i / wallSegs) * Math.PI * 2;
    if (Math.abs(Math.cos(ang)) > 0.985 || Math.abs(Math.sin(ang)) > 0.985) {
      continue;
    }
    const wx = Math.cos(ang) * 116;
    const wz = Math.sin(ang) * 80;
    const post = new THREE.Mesh(new THREE.BoxGeometry(9.5, 4.8, 2.2), timberMat);
    post.position.set(wx, 2.8, wz);
    post.rotation.y = -ang + Math.PI / 2;
    post.castShadow = true;
    village.add(post);
  }

  const gates: [number, number, number][] = [
    [0, -80, 0],
    [0, 80, 0],
    [-116, 0, Math.PI / 2],
    [116, 0, Math.PI / 2],
  ];
  for (const [gx, gz, rotY] of gates) {
    const gate = new THREE.Group();
    gate.position.set(gx, 0.8, gz);
    gate.rotation.y = rotY;
    const gBase = new THREE.Mesh(new THREE.BoxGeometry(18, 6.8, 7.5), plasterMat);
    gBase.position.y = 3.4;
    gBase.castShadow = true;
    const gRoof = createGableRoofX(20.5, 9.2, 4.2, roofSlateMat, goldMat);
    gRoof.position.y = 6.8;
    gate.add(gBase, gRoof);
    village.add(gate);
  }

  return village;
}

/**
 * 2. HAKUREI SHRINE 3D HILLTOP COMPOUND, CRIMSON TORII & STONE STAIRCASE
 */
export function buildHakureiShrine3D(): THREE.Group {
  const shrine = new THREE.Group();
  shrine.name = 'landmark-hakurei-shrine';

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xc8beaa, roughness: 0.85 });
  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xf2e6cc, roughness: 0.75 });
  const toriiRedMat = new THREE.MeshStandardMaterial({ color: 0xb6342a, roughness: 0.55 });
  const roofBarkMat = new THREE.MeshStandardMaterial({ color: 0x5c3c28, roughness: 0.78 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a74a, roughness: 0.35, metalness: 0.6 });

  const terrace = new THREE.Mesh(new THREE.CylinderGeometry(36, 40, 2.2, 24), stoneMat);
  terrace.scale.set(1.25, 1, 0.88);
  terrace.position.y = 1.1;
  terrace.receiveShadow = true;
  shrine.add(terrace);

  const honden = new THREE.Mesh(new THREE.BoxGeometry(24, 9.5, 15), plasterMat);
  honden.position.set(-4, 2.2 + 4.75, -6);
  honden.castShadow = true;
  const hondenRoof = createGableRoofX(28, 18.5, 6.5, roofBarkMat, goldMat);
  hondenRoof.position.set(-4, 2.2 + 9.5, -6);
  shrine.add(honden, hondenRoof);

  const annex = new THREE.Mesh(new THREE.BoxGeometry(15, 7.2, 12), plasterMat);
  annex.position.set(16, 2.2 + 3.6, -4);
  annex.castShadow = true;
  const annexRoof = createGableRoofX(17, 13.5, 4.2, roofBarkMat);
  annexRoof.position.set(16, 2.2 + 7.2, -4);
  shrine.add(annex, annexRoof);

  const torii = new THREE.Group();
  torii.position.set(-2, 2.2, 18);
  for (const px of [-7.5, 7.5]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 14.5, 12), toriiRedMat);
    pillar.position.set(px, 7.25, 0);
    pillar.castShadow = true;
    torii.add(pillar);
  }
  const kasagi = new THREE.Mesh(new THREE.BoxGeometry(21, 1.3, 1.6), toriiRedMat);
  kasagi.position.set(0, 14.2, 0);
  const nuki = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.95, 1.1), toriiRedMat);
  nuki.position.set(0, 11.4, 0);
  torii.add(kasagi, nuki);
  shrine.add(torii);

  const stairs = new THREE.Mesh(new THREE.BoxGeometry(12, 2.0, 48), stoneMat);
  stairs.position.set(-2, 0.6, 46);
  stairs.rotation.x = 0.08;
  shrine.add(stairs);

  return shrine;
}

/**
 * 3. MYOUREN TEMPLE 3D MONASTERY & FIVE-STORY PAGODA
 */
export function buildMyourenTemple3D(): THREE.Group {
  const temple = new THREE.Group();
  temple.name = 'landmark-myouren-temple';

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd6cab2, roughness: 0.85 });
  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xefe4ce, roughness: 0.75 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x6e432c, roughness: 0.8 });
  const slateMat = new THREE.MeshStandardMaterial({ color: 0x424952, roughness: 0.7 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a74a, roughness: 0.35, metalness: 0.65 });

  const courtyard = new THREE.Mesh(new THREE.BoxGeometry(68, 1.2, 48), stoneMat);
  courtyard.position.y = 0.6;
  courtyard.receiveShadow = true;
  temple.add(courtyard);

  const hondo = new THREE.Mesh(new THREE.BoxGeometry(28, 11, 18), plasterMat);
  hondo.position.set(-6, 1.2 + 5.5, -4);
  hondo.castShadow = true;
  const hondoRoof = createGableRoofX(32, 21, 7.2, slateMat, goldMat);
  hondoRoof.position.set(-6, 1.2 + 11, -4);
  temple.add(hondo, hondoRoof);

  const pagoda = new THREE.Group();
  pagoda.position.set(20, 1.2, -4);
  for (let tier = 0; tier < 4; tier++) {
    const w = 10.5 - tier * 1.6;
    const y = tier * 6.2;
    const core = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 5.8, w * 0.72), timberMat);
    core.position.y = y + 2.9;
    core.castShadow = true;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.88, 2.6, 4), slateMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = y + 5.8;
    roof.castShadow = true;
    pagoda.add(core, roof);
  }
  const sorinSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 6.5, 8), goldMat);
  sorinSpire.position.y = 4 * 6.2 + 2.8;
  pagoda.add(sorinSpire);
  temple.add(pagoda);

  return temple;
}

/**
 * 4. EIENTEI 3D BAMBOO PALACE COMPOUND & HOURAI PHARMACY CLINIC (MCP Canon)
 *    - Grand Heian-style shinden-zukuri main residence of Kaguya Houraisan
 *    - Impossibly long tatami corridor extending northward ("hallways that lead out into the sky")
 *    - Raked white gravel courtyard garden
 *    - East-Entrance Medical Dispensary (Eirin Yagokoro's Hourai Pharmacy) on the east flank
 */
export function buildEientei3D(): THREE.Group {
  const eientei = new THREE.Group();
  eientei.name = 'landmark-eientei';

  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xefe2c6, roughness: 0.75 });
  const roofGreenMat = new THREE.MeshStandardMaterial({ color: 0x344f32, roughness: 0.7 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x4f3826, roughness: 0.82 });
  const gravelMat = new THREE.MeshStandardMaterial({ color: 0xe6dfd0, roughness: 0.9 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9b44a, roughness: 0.35, metalness: 0.6 });
  const clinicBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b647a, roughness: 0.7 });

  // Raked white gravel Zen courtyard base
  const gravelCourt = new THREE.Mesh(new THREE.BoxGeometry(54, 0.6, 40), gravelMat);
  gravelCourt.position.set(0, 0.3, 0);
  gravelCourt.receiveShadow = true;
  eientei.add(gravelCourt);

  // Main Shinden Hall (Kaguya's residence)
  const hall = new THREE.Mesh(new THREE.BoxGeometry(28, 9.5, 16), plasterMat);
  hall.position.set(0, 4.75, 0);
  hall.castShadow = true;
  const roof = createGableRoofX(32, 19, 6.0, roofGreenMat, goldMat);
  roof.position.set(0, 9.5, 0);
  eientei.add(hall, roof);

  // Impossibly long rear tatami corridor ("hallways that lead out into the sky" from TH08 Stage 6)
  const longCorridor = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4.8, 34), timberMat);
  longCorridor.position.set(0, 2.4, -24);
  longCorridor.castShadow = true;
  const longRoof = createGableRoofZ(8.0, 35, 2.8, roofGreenMat);
  longRoof.position.set(0, 4.8, -24);
  eientei.add(longCorridor, longRoof);

  // Perimeter cloister corridors & South karamon gate
  for (const [x, z, w, d] of [
    [0, 20, 56, 4.2],
    [0, -20, 56, 4.2],
    [-26, 0, 4.2, 42],
    [26, 0, 4.2, 42],
  ] as [number, number, number, number][]) {
    const corr = new THREE.Mesh(new THREE.BoxGeometry(w, 4.5, d), timberMat);
    corr.position.set(x, 2.25, z);
    corr.castShadow = true;
    eientei.add(corr);
  }

  // East-Entrance Medical Clinic ("Hourai Pharmacy" - Eirin's dispensary wing on East Gate X = +32)
  const clinic = new THREE.Mesh(new THREE.BoxGeometry(11, 6.5, 14), plasterMat);
  clinic.position.set(32, 3.25, 4);
  clinic.castShadow = true;
  const clinicRoof = createGableRoofZ(13, 16, 3.8, clinicBlueMat, goldMat);
  clinicRoof.position.set(32, 6.5, 4);
  eientei.add(clinic, clinicRoof);

  return eientei;
}

/**
 * 5. MORIYA SHRINE, ONBASHIRA PILLARS, THICK SHIMENAWA & ROPEWAY STATION (MCP Canon)
 */
export function buildMoriyaShrine3D(): THREE.Group {
  const moriya = new THREE.Group();
  moriya.name = 'landmark-moriya-shrine';

  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xefe2c6, roughness: 0.75 });
  const roofJadeMat = new THREE.MeshStandardMaterial({ color: 0x286654, roughness: 0.68 });
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x7d522b, roughness: 0.85 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9b44a, roughness: 0.35, metalness: 0.6 });
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd8c28a, roughness: 0.85 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8f8a80, roughness: 0.88 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x295939, roughness: 0.82 });

  // Stone summit platform
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(44, 1.8, 36), stoneMat);
  terrace.position.set(0, 0.9, 0);
  terrace.receiveShadow = true;
  moriya.add(terrace);

  // Main Haiden & Honden Sanctuary
  const hall = new THREE.Mesh(new THREE.BoxGeometry(22, 10, 15), plasterMat);
  hall.position.set(0, 6.8, -2);
  hall.castShadow = true;
  const roof = createGableRoofX(25, 17.5, 6.2, roofJadeMat, goldMat);
  roof.position.set(0, 11.8, -2);
  moriya.add(hall, roof);

  // Distinctively thick twisted Shimenawa rope across the front entrance (Silent Sinner in Blue canon)
  const shimenawa = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 16, 10), ropeMat);
  shimenawa.rotation.z = Math.PI / 2;
  shimenawa.position.set(0, 9.2, 6.1);
  moriya.add(shimenawa);

  // Four Sacred Onbashira Logs at the corners
  for (const [px, pz] of [
    [-16, -12],
    [16, -12],
    [-16, 12],
    [16, 12],
  ]) {
    const onbashira = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 26, 10), pillarMat);
    onbashira.position.set(px, 14.5, pz);
    onbashira.castShadow = true;
    moriya.add(onbashira);
  }

  // Moriya Sacred Tree behind the shrine (Unfinished Dream of All Living Ghost canon)
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 9, 7), pillarMat);
  trunk.position.set(-11, 6.3, -13);
  const crown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2, 0), leafMat);
  crown1.position.set(-11, 12.2, -13);
  const crown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.1, 0), leafMat);
  crown2.position.set(-8.5, 10.8, -14.2);
  moriya.add(trunk, crown1, crown2);

  // Moriya Aerial Tramway / Ropeway Summit Station on the western cliff edge
  const station = new THREE.Mesh(new THREE.BoxGeometry(9, 6.5, 11), plasterMat);
  station.position.set(-26, 4.2, 8);
  station.castShadow = true;
  const stationRoof = createGableRoofZ(10.5, 12.5, 3.2, roofJadeMat);
  stationRoof.position.set(-26, 7.5, 8);
  moriya.add(station, stationRoof);

  return moriya;
}

/**
 * 6. PALACE OF THE EARTH SPIRITS (CHIREIDEN) & BLAZING HELL VENT (MCP Canon)
 *    - Ornate Western Gothic mansion with rose-patterned stained glass windows
 *    - Chequered courtyard floor with central iron-grated shaft leading to Blazing Hell below
 */
export function buildChireiden3D(): THREE.Group {
  const palace = new THREE.Group();
  palace.name = 'landmark-chireiden';

  const stonePurple = new THREE.MeshStandardMaterial({ color: 0x4f304e, roughness: 0.75 });
  const roofCrimson = new THREE.MeshStandardMaterial({ color: 0x7a2244, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe0b24c, roughness: 0.35, metalness: 0.6 });
  const darkTile = new THREE.MeshStandardMaterial({ color: 0x26202a, roughness: 0.8 });
  const lightTile = new THREE.MeshStandardMaterial({ color: 0xd8cbb8, roughness: 0.8 });
  const hellGlow = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff3300,
    emissiveIntensity: 0.85,
    roughness: 0.3,
  });
  const stainedRose = new THREE.MeshStandardMaterial({
    color: 0xff4d88,
    emissive: 0xd92662,
    emissiveIntensity: 0.65,
    roughness: 0.25,
  });

  // Chequered Courtyard Floor (Symposium of Post-mysticism canon)
  const courtBase = new THREE.Mesh(new THREE.BoxGeometry(44, 1.0, 42), darkTile);
  courtBase.position.set(0, 0.5, 4);
  courtBase.receiveShadow = true;
  palace.add(courtBase);

  for (let gx = -3; gx <= 3; gx++) {
    for (let gz = 1; gz <= 4; gz++) {
      if ((gx + gz) % 2 === 0) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 4.5), lightTile);
        tile.position.set(gx * 4.5, 1.05, gz * 4.5 + 2);
        palace.add(tile);
      }
    }
  }

  // Central Courtyard Iron-Grated Vent Shaft to the Hell of Blazing Fires below
  const ventRim = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 1.4, 12), darkTile);
  ventRim.position.set(0, 1.2, 16);
  const ventCore = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1.5, 12), hellGlow);
  ventCore.position.set(0, 1.25, 16);
  palace.add(ventRim, ventCore);

  // Main Gothic Mansion Hall & Twin Side Wings
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(26, 14, 18), stonePurple);
  mainBody.position.set(0, 7.5, -4);
  mainBody.castShadow = true;
  const mainRoof = createGableRoofZ(28, 20, 8.5, roofCrimson, goldMat);
  mainRoof.position.set(0, 14.5, -4);
  palace.add(mainBody, mainRoof);

  for (const sx of [-16, 16]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(9, 11, 14), stonePurple);
    wing.position.set(sx, 6.0, -2);
    wing.castShadow = true;
    const wRoof = createGableRoofZ(10.5, 15.5, 6.0, roofCrimson, goldMat);
    wRoof.position.set(sx, 11.5, -2);
    palace.add(wing, wRoof);
  }

  // Glowing Rose-Patterned Stained Glass Window & Lancet Windows
  const roseArch = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.5, 16), stainedRose);
  roseArch.rotation.x = Math.PI / 2;
  roseArch.position.set(0, 11.2, 5.1);
  palace.add(roseArch);

  return palace;
}

const sharedMats = {
  plaster: new THREE.MeshStandardMaterial({ color: 0xefe2c6, roughness: 0.78 }),
  timber: new THREE.MeshStandardMaterial({ color: 0x5c3c26, roughness: 0.85 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x8e939b, roughness: 0.8 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x595e66, roughness: 0.85 }),
  roofSlate: new THREE.MeshStandardMaterial({ color: 0x424a52, roughness: 0.72 }),
  roofBrown: new THREE.MeshStandardMaterial({ color: 0x63432e, roughness: 0.76 }),
  roofCrimson: new THREE.MeshStandardMaterial({ color: 0x992429, roughness: 0.65 }),
  roofBlue: new THREE.MeshStandardMaterial({ color: 0x3b5c85, roughness: 0.68 }),
  roofJade: new THREE.MeshStandardMaterial({ color: 0x2f6652, roughness: 0.68 }),
  roofGold: new THREE.MeshStandardMaterial({ color: 0xc8963e, roughness: 0.45, metalness: 0.4 }),
  toriiRed: new THREE.MeshStandardMaterial({ color: 0xb6342a, roughness: 0.55 }),
  windowGlow: new THREE.MeshStandardMaterial({
    color: 0xffd275,
    emissive: 0xff9d2e,
    emissiveIntensity: 0.7,
    roughness: 0.3,
  }),
  sakuraPink: new THREE.MeshStandardMaterial({ color: 0xf294bc, roughness: 0.75 }),
  foliageGreen: new THREE.MeshStandardMaterial({ color: 0x3d6642, roughness: 0.85 }),
};

/**
 * Builds lore-accurate 3D architectural / environmental miniatures for any location across Gensokyo
 * (Replaces the generic floating sphere pins with real 3D structures).
 */
export function buildProceduralLandmark3D(loc: LocationEntry): THREE.Group {
  const g = new THREE.Group();
  const s = loc.importance === 1 ? 1.25 : loc.importance === 2 ? 0.95 : 0.72;
  g.scale.setScalar(s);

  // Special Canonical Estates & Buildings
  if (
    loc.id === 'prismriver-mansion' ||
    loc.id === 'mugenkan' ||
    loc.id === 'pandaemonium'
  ) {
    // Western European Mansion (Central Hall + Twin Gabled Side Wings)
    const center = new THREE.Mesh(new THREE.BoxGeometry(11, 7.5, 7), sharedMats.stone);
    center.position.y = 3.75;
    center.castShadow = true;
    const cRoof = createGableRoofX(11.8, 7.8, 3.8, sharedMats.roofBlue, sharedMats.plaster);
    cRoof.position.y = 7.5;
    g.add(center, cRoof);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8.2, 9.5), sharedMats.stone);
      wing.position.set(side * 6.5, 4.1, 1.0);
      wing.castShadow = true;
      const wRoof = createGableRoofZ(5.1, 10.2, 3.6, sharedMats.roofCrimson, sharedMats.plaster);
      wRoof.position.set(side * 6.5, 8.2, 1.0);
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, 0.2), sharedMats.windowGlow);
      win.position.set(side * 6.5, 4.2, 5.8);
      g.add(wing, wRoof, win);
    }
    return g;
  }

  if (loc.id === 'hakugyokurou' || loc.id === 'saigyou-ayakashi') {
    // Netherworld Palace Pavilion + Giant Weeping Cherry Blossom Tree (Saigyou Ayakashi)
    const hall = new THREE.Mesh(new THREE.BoxGeometry(14, 6.5, 9), sharedMats.plaster);
    hall.position.set(-4, 3.25, 0);
    hall.castShadow = true;
    const roof = createGableRoofX(16, 11, 4.2, sharedMats.roofSlate);
    roof.position.set(-4, 6.5, 0);
    g.add(hall, roof);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 7.5, 8), sharedMats.timber);
    trunk.position.set(7, 3.75, 0);
    g.add(trunk);
    for (const [dx, dy, dz, r] of [
      [7, 8.5, 0, 3.6],
      [4.5, 7.2, 1.8, 2.6],
      [9.5, 7.4, -1.5, 2.7],
      [7.2, 7.0, 2.5, 2.4],
    ]) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), sharedMats.sakuraPink);
      crown.position.set(dx, dy, dz);
      crown.scale.set(1.2, 0.78, 1.2);
      crown.castShadow = true;
      g.add(crown);
    }
    return g;
  }

  if (loc.id === 'shining-needle-castle') {
    // Floating Inverted Japanese Castle Keep
    const keep = new THREE.Group();
    keep.position.y = 11;
    keep.rotation.z = Math.PI;
    const base = new THREE.Mesh(new THREE.BoxGeometry(11, 5.5, 11), sharedMats.plaster);
    base.position.y = 2.75;
    const r1 = new THREE.Mesh(new THREE.ConeGeometry(9.5, 3.5, 4), sharedMats.roofCrimson);
    r1.rotation.y = Math.PI / 4;
    r1.position.y = 6.5;
    const top = new THREE.Mesh(new THREE.BoxGeometry(7, 4.5, 7), sharedMats.plaster);
    top.position.y = 9.5;
    const r2 = new THREE.Mesh(new THREE.ConeGeometry(6.5, 4.2, 4), sharedMats.roofCrimson);
    r2.rotation.y = Math.PI / 4;
    r2.position.y = 13.5;
    keep.add(base, r1, top, r2);
    g.add(keep);
    return g;
  }

  if (loc.id === 'mayohiga' || loc.id === 'hall-of-dreams' || loc.id === 'lunar-capital' || loc.id === 'higan' || loc.id === 'heaven' || loc.id === 'bhava-agra') {
    // Grand Classical Japanese/Imperial Palace Pavilion
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(16, 1.4, 12), sharedMats.stone);
    plinth.position.y = 0.7;
    const hall = new THREE.Mesh(new THREE.BoxGeometry(13, 6.5, 9), sharedMats.plaster);
    hall.position.y = 1.4 + 3.25;
    hall.castShadow = true;
    const roofMat =
      loc.id === 'hall-of-dreams' || loc.id === 'heaven' || loc.id === 'bhava-agra'
        ? sharedMats.roofGold
        : loc.id === 'lunar-capital'
        ? sharedMats.roofBlue
        : sharedMats.roofSlate;
    const roof = createGableRoofX(15.5, 11.2, 4.5, roofMat);
    roof.position.y = 1.4 + 6.5;
    g.add(plinth, hall, roof);
    return g;
  }

  if (loc.id === 'three-fairies-tree') {
    // Lightning-scarred Great Oak Treehouse with miniature fairy doors & windows
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.0, 9.5, 10), sharedMats.timber);
    trunk.position.y = 4.75;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.3), sharedMats.windowGlow);
    door.position.set(0, 1.4, 2.65);
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(5.5, 1), sharedMats.foliageGreen);
    crown.position.y = 11.0;
    crown.scale.set(1.15, 0.9, 1.15);
    g.add(trunk, door, crown);
    return g;
  }

  if (loc.id === 'crawdad-rock' || loc.id === 'world-of-ice-and-snow') {
    // Cirno's Ice Crystal Outcrop / Glacier Spikes
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x6cd8ff,
      roughness: 0.15,
      metalness: 0.25,
      emissive: 0x1e88cc,
      emissiveIntensity: 0.35,
    });
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(3.4, 0), sharedMats.stoneDark);
    boulder.position.y = 1.4;
    boulder.scale.set(1.3, 0.65, 1.1);
    g.add(boulder);
    for (const [dx, dz, r, h, rx, rz] of [
      [0, 0, 1.4, 6.8, 0.1, -0.08],
      [-2.2, 0.8, 1.0, 4.8, -0.22, 0.25],
      [2.1, -0.6, 1.1, 5.2, 0.18, -0.28],
    ]) {
      const crystal = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), iceMat);
      crystal.position.set(dx, h / 2 + 1.0, dz);
      crystal.rotation.set(rx, 0, rz);
      g.add(crystal);
    }
    return g;
  }

  if (loc.id === 'nine-heavens-waterfall') {
    // Vertical Whitewater Cascade & Cliff Basin
    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xd8f4ff,
      roughness: 0.2,
      emissive: 0x4fa8d8,
      emissiveIntensity: 0.25,
    });
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(12, 16, 6), sharedMats.stoneDark);
    cliff.position.set(0, 8, -2);
    const fall = new THREE.Mesh(new THREE.BoxGeometry(5.5, 16.2, 1.2), foamMat);
    fall.position.set(0, 8, 1.0);
    g.add(cliff, fall);
    return g;
  }

  if (loc.id === 'moriya-ropeway') {
    // Kappa Aerial Cableway Station & Red Gondola Cabin
    const station = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.0, 6.5), sharedMats.plaster);
    station.position.y = 2.5;
    const roof = createGableRoofX(9.6, 7.4, 2.8, sharedMats.roofJade);
    roof.position.y = 5.0;
    const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 11.5, 6), sharedMats.stoneDark);
    pylon.position.set(6.5, 5.75, 0);
    const gondola = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 2.0), sharedMats.toriiRed);
    gondola.position.set(6.5, 8.5, 2.2);
    g.add(station, roof, pylon, gondola);
    return g;
  }

  if (loc.id === 'torifune-space-shrine') {
    // Geodesic Space-Ark Biosphere Dome with Inner Shrine
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x7bc8a4,
      roughness: 0.3,
      metalness: 0.5,
      wireframe: true,
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 7.2, 2.4, 12), sharedMats.stoneDark);
    base.position.y = 14.0;
    const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(8.2, 1), domeMat);
    dome.position.y = 17.5;
    const innerShrine = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.8, 4.5), sharedMats.toriiRed);
    innerShrine.position.y = 17.0;
    g.add(base, dome, innerShrine);
    return g;
  }

  // Category-based 3D Architecture
  switch (loc.kind) {
    case 'shrine': {
      // Shinto Torii Gate + Small Shrine Hall
      for (const px of [-2.8, 2.8]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 6.8, 10), sharedMats.toriiRed);
        pillar.position.set(px, 3.4, 2.5);
        g.add(pillar);
      }
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.65, 0.75), sharedMats.toriiRed);
      topBar.position.set(0, 6.6, 2.5);
      const subBar = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.45, 0.55), sharedMats.toriiRed);
      subBar.position.set(0, 5.2, 2.5);
      const honden = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4.5, 5.5), sharedMats.plaster);
      honden.position.set(0, 2.25, -2.5);
      honden.castShadow = true;
      const roof = createGableRoofX(7.6, 6.6, 3.0, sharedMats.roofBrown);
      roof.position.set(0, 4.5, -2.5);
      g.add(topBar, subBar, honden, roof);
      break;
    }

    case 'temple': {
      const hall = new THREE.Mesh(new THREE.BoxGeometry(9.5, 5.5, 7.2), sharedMats.plaster);
      hall.position.y = 2.75;
      hall.castShadow = true;
      const roof = createGableRoofX(11.2, 8.6, 3.8, sharedMats.roofSlate);
      roof.position.y = 5.5;
      g.add(hall, roof);
      break;
    }

    case 'residence':
    case 'village': {
      // Cozy Timber & Plaster Cottage / Shop with Glowing Window
      const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 5.0, 6.4), sharedMats.plaster);
      body.position.y = 2.5;
      body.castShadow = true;
      const roofColor =
        loc.id === 'alices-house'
          ? sharedMats.roofBlue
          : loc.id === 'kourindou'
          ? sharedMats.roofJade
          : sharedMats.roofBrown;
      const roof = createGableRoofX(9.4, 7.6, 3.4, roofColor);
      roof.position.y = 5.0;
      const win = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.2), sharedMats.windowGlow);
      win.position.set(0, 2.6, 3.22);
      g.add(body, roof, win);
      break;
    }

    case 'mountain': {
      // Rugged 3D Rocky Peak Cluster
      for (const [dx, dz, r, h] of [
        [0, 0, 4.2, 8.5],
        [-3.2, 1.8, 2.8, 5.5],
        [3.0, -1.5, 2.6, 5.0],
      ]) {
        const crag = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), sharedMats.stoneDark);
        crag.position.set(dx, h / 2, dz);
        crag.castShadow = true;
        g.add(crag);
      }
      break;
    }

    case 'forest': {
      // Sacred Grove of 3 Layered Conifers + Wayside Stone Shrine
      for (const [dx, dz, sc] of [
        [-2.8, -1.5, 1.0],
        [2.8, -1.2, 0.9],
        [0, 2.2, 1.1],
      ]) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.5, 6), sharedMats.timber);
        trunk.position.set(dx, 1.25, dz);
        const c1 = new THREE.Mesh(new THREE.ConeGeometry(2.2 * sc, 4.5 * sc, 6), sharedMats.foliageGreen);
        c1.position.set(dx, 3.8 * sc, dz);
        const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.6 * sc, 3.6 * sc, 6), sharedMats.foliageGreen);
        c2.position.set(dx, 6.0 * sc, dz);
        g.add(trunk, c1, c2);
      }
      break;
    }

    case 'water': {
      // Waterside Wooden Pier & Small Torii
      const deck = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.5, 7.5), sharedMats.timber);
      deck.position.y = 0.8;
      g.add(deck);
      break;
    }

    default: {
      // Traditional Japanese Stone Lantern (Tōrō) / Stele Monument (Landmark & Otherworld)
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.0, 3.2), sharedMats.stoneDark);
      base.position.y = 0.5;
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 3.8, 6), sharedMats.stone);
      shaft.position.y = 2.9;
      const lightBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.8), sharedMats.windowGlow);
      lightBox.position.y = 5.4;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.6, 6), sharedMats.stoneDark);
      cap.position.y = 6.9;
      g.add(base, shaft, lightBox, cap);
      break;
    }
  }

  return g;
}
