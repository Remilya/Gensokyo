import * as THREE from 'three';

/**
 * Original Canonical 3D Model of the Scarlet Devil Mansion (紅魔館 - Koumakan)
 * Built directly from the `touhou-gensokyo` MCP canonical lore dossiers:
 *  - `scarlet-devil-mansion`: Windowless/scarlet-slit Gothic manor on Misty Lake's ridge,
 *    central Midnight Clock Tower, Red Iron Front Gates guarded by Hong Meiling.
 *  - `voile-library` (West Wing, x=0.805): Patchouli Knowledge's cavernous subterranean &
 *    west-wing grimoire archive with arcane skylight dome & flying buttresses.
 *  - `sdm-parlor-dining` (South-East Main Wing, x=0.848): Sun-draped reception hall,
 *    ceremonial dining room, portrait gallery & adjoining Amber-Glass Conservatory.
 *  - `sdm-gardens-east-wing` (North-East Wing & Perimeter, x=0.855): Meiling's manicured
 *    rose hedges, 2nd-floor iron-shuttered East Wing lakeside guest suites & balconies,
 *    and Flandre Scarlet's warded sunken basement entrance.
 */
export function buildScarletDevilMansion3D(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ScarletDevilMansion3D';

  // Shared low-poly materials
  const matWallCream = new THREE.MeshStandardMaterial({ color: 0xdfd3be, roughness: 0.85 });
  const matWallStone = new THREE.MeshStandardMaterial({ color: 0x766e65, roughness: 0.9 });
  const matDarkSlate = new THREE.MeshStandardMaterial({ color: 0x2a2730, roughness: 0.8 });
  const matRoofCrimson = new THREE.MeshStandardMaterial({ color: 0x8f1d24, roughness: 0.65 });
  const matRoofBright = new THREE.MeshStandardMaterial({ color: 0xb0252e, roughness: 0.6 });
  const matTimber = new THREE.MeshStandardMaterial({ color: 0x4f3524, roughness: 0.85 });
  const matGold = new THREE.MeshStandardMaterial({
    color: 0xe6b84d,
    roughness: 0.35,
    metalness: 0.65,
  });
  const matScarletWindow = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    emissive: 0xd9232e,
    emissiveIntensity: 0.55,
    roughness: 0.25,
  });
  const matAmberGlass = new THREE.MeshStandardMaterial({
    color: 0xffbf5e,
    emissive: 0xe07a22,
    emissiveIntensity: 0.65,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
  });
  const matBasementWard = new THREE.MeshStandardMaterial({
    color: 0x9b26b6,
    emissive: 0x7b1fa2,
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
  const matClockFace = new THREE.MeshStandardMaterial({
    color: 0xfff8e7,
    emissive: 0xffe0a3,
    emissiveIntensity: 0.35,
    roughness: 0.4,
  });
  const matGrass = new THREE.MeshStandardMaterial({ color: 0x3f6a3c, roughness: 0.92 });
  const matHedge = new THREE.MeshStandardMaterial({ color: 0x244a26, roughness: 0.9 });
  const matRoseRed = new THREE.MeshStandardMaterial({ color: 0xb81d2a, roughness: 0.75 });
  const matRoseGold = new THREE.MeshStandardMaterial({ color: 0xdba832, roughness: 0.75 });
  const matGravel = new THREE.MeshStandardMaterial({ color: 0xcbbfa6, roughness: 0.9 });
  const matRedCarpet = new THREE.MeshStandardMaterial({ color: 0x961b24, roughness: 0.8 });
  const matWater = new THREE.MeshStandardMaterial({
    color: 0x3b8ea5,
    roughness: 0.18,
    metalness: 0.25,
  });

  const addBox = (
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    ry = 0
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y + h / 2, z);
    if (ry !== 0) mesh.rotation.y = ry;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const addPyramidRoof = (
    radius: number,
    height: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    sides = 4,
    ry = Math.PI / 4
  ) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(radius, height, sides), mat);
    cone.position.set(x, y + height / 2, z);
    cone.rotation.y = ry;
    cone.castShadow = true;
    group.add(cone);
    return cone;
  };

  const addClusteredTree = (
    x: number,
    y: number,
    z: number,
    scale: number,
    leafColors: number[]
  ) => {
    const tree = new THREE.Group();
    tree.position.set(x, y, z);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45 * scale, 0.75 * scale, 3.6 * scale, 6),
      matTimber
    );
    trunk.position.y = 1.8 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const offsets: [number, number, number, number][] = [
      [0, 4.4, 0, 2.3],
      [-1.3, 3.6, 0.9, 1.75],
      [1.4, 3.7, 0.8, 1.7],
      [-1.0, 3.8, -1.2, 1.65],
      [1.1, 3.5, -1.1, 1.65],
      [0, 5.3, 0.2, 1.5],
    ];
    offsets.forEach(([ox, oy, oz, r], idx) => {
      const cMat = new THREE.MeshStandardMaterial({
        color: leafColors[idx % leafColors.length],
        roughness: 0.82,
      });
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(r * scale, 0), cMat);
      crown.position.set(ox * scale, oy * scale, oz * scale);
      crown.rotation.set(idx * 0.5, idx * 0.8, 0);
      crown.castShadow = true;
      tree.add(crown);
    });

    group.add(tree);
  };

  // ============================================================================
  // 1. ESTATE TERRACE FOUNDATION & WROUGHT-IRON PERIMETER WALL
  // ============================================================================
  // Main stone ridge platform overlooking Misty Lake to the north/west
  addBox(88, 1.4, 96, matWallStone, 0, 0, 6);
  addBox(84, 0.35, 92, matGrass, 0, 1.4, 6);

  // Red & Dark-Iron Perimeter Fence with Brick Piers
  const fenceNorthZ = -38;
  const fenceSouthZ = 50;
  const fenceWestX = -41;
  const fenceEastX = 41;

  // North, West, East perimeter walls
  addBox(82, 2.4, 0.9, matDarkSlate, 0, 1.7, fenceNorthZ);
  addBox(0.9, 2.4, 88, matDarkSlate, fenceWestX, 1.7, 6);
  addBox(0.9, 2.4, 88, matDarkSlate, fenceEastX, 1.7, 6);
  // South wall split by the Red Iron Front Gates
  addBox(33, 2.4, 0.9, matDarkSlate, -24.5, 1.7, fenceSouthZ);
  addBox(33, 2.4, 0.9, matDarkSlate, 24.5, 1.7, fenceSouthZ);

  // Crimson brick fence pillars along the front wall
  for (const px of [-41, -30, -19, -8, 8, 19, 30, 41]) {
    addBox(1.8, 4.2, 1.8, matRoofCrimson, px, 1.7, fenceSouthZ);
    addBox(2.2, 0.6, 2.2, matWallCream, px, 5.9, fenceSouthZ);
  }

  // ============================================================================
  // 2. RED IRON FRONT GATES & HONG MEILING'S GUARDHOUSE (South Entrance, Z = +50)
  // ============================================================================
  // Twin monumental gate piers with gold lanterns
  for (const side of [-1, 1]) {
    addBox(2.8, 7.5, 2.8, matRoofCrimson, side * 7.5, 1.7, fenceSouthZ);
    addBox(3.2, 0.8, 3.2, matWallCream, side * 7.5, 9.2, fenceSouthZ);
    addBox(1.1, 1.6, 1.1, matAmberGlass, side * 7.5, 10.0, fenceSouthZ);
    addPyramidRoof(1.2, 1.4, matGold, side * 7.5, 11.6, fenceSouthZ, 4);
  }
  // Ornate Wrought-Iron Arch & Double Red Iron Gates (slightly ajar per canon)
  addBox(15.5, 1.0, 0.8, matRoofCrimson, 0, 8.2, fenceSouthZ);
  addBox(6.2, 5.8, 0.4, matRoofBright, -3.4, 1.8, fenceSouthZ + 0.4, 0.18);
  addBox(6.2, 5.8, 0.4, matRoofBright, 3.4, 1.8, fenceSouthZ + 0.4, -0.18);

  // Hong Meiling's Gatekeeper Lodge (tucked inside the West Front Gate corner)
  addBox(8.5, 4.8, 6.5, matWallCream, -15.5, 1.7, 44.5);
  addPyramidRoof(6.8, 3.6, matRoofCrimson, -15.5, 6.5, 44.5, 4);
  addBox(3.5, 0.5, 2.2, matRoofBright, -15.5, 4.6, 41.0); // Siesta porch awning

  // ============================================================================
  // 3. MEILING'S MANICURED ROSE COURTYARD & MARBLE FOUNTAIN (Z = +6 to +48)
  // ============================================================================
  // Grand central gravel carriageway & cross-axis garden promenade
  addBox(10.5, 0.18, 46, matGravel, 0, 1.75, 27);
  addBox(68, 0.18, 6.5, matGravel, 0, 1.75, 25);

  // Central Blood-Rose Marble Fountain Plaza (Z = +25)
  const fountainRim = new THREE.Mesh(
    new THREE.CylinderGeometry(6.8, 7.2, 1.2, 16),
    matWallCream
  );
  fountainRim.position.set(0, 2.3, 25);
  group.add(fountainRim);

  const fountainPool = new THREE.Mesh(
    new THREE.CylinderGeometry(6.0, 6.0, 0.9, 16),
    matWater
  );
  fountainPool.position.set(0, 2.45, 25);
  group.add(fountainPool);

  const fountainPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.6, 4.8, 10),
    matWallCream
  );
  fountainPillar.position.set(0, 4.1, 25);
  group.add(fountainPillar);

  const fountainCrown = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 2.4, 8),
    matGold
  );
  fountainCrown.position.set(0, 7.2, 25);
  group.add(fountainCrown);

  // Four Symmetrical Victorian Rose Parterres (tended by Hong Meiling)
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const px = sx * 20.5;
      const pz = 25 + sz * 12.5;
      // Outer boxwood hedge frame
      addBox(18, 1.3, 1.1, matHedge, px, 1.75, pz - 6.5);
      addBox(18, 1.3, 1.1, matHedge, px, 1.75, pz + 6.5);
      addBox(1.1, 1.3, 13, matHedge, px - 8.5, 1.75, pz);
      addBox(1.1, 1.3, 13, matHedge, px + 8.5, 1.75, pz);

      // Concentric Scarlet & Gold Rose Beds
      addBox(11.5, 0.65, 6.5, matRoseRed, px, 1.75, pz);
      addBox(5.5, 0.85, 3.2, matRoseGold, px, 1.75, pz);
    }
  }

  // Multi-crowned estate trees framing the rose gardens (no single spheres!)
  addClusteredTree(-31, 1.75, 37, 1.15, [0xf29cb8, 0xf7b6cc, 0xe37b9d]); // Blossom tree SW
  addClusteredTree(31, 1.75, 37, 1.15, [0xd46a28, 0xe08a38, 0xb84a1c]); // Autumn tree SE
  addClusteredTree(-32, 1.75, 12, 1.25, [0x2e5c34, 0x3d7344, 0x244a29]); // Deep green oak NW
  addClusteredTree(32, 1.75, 12, 1.25, [0x2e5c34, 0x3d7344, 0x244a29]); // Deep green oak NE

  // ============================================================================
  // 4. MAIN GOTHIC MANOR HOUSE & GRAND ENTRANCE PORTICO (Center, Z = -12)
  // ============================================================================
  // Stepped stone plinth & red-carpeted ceremonial stairs
  addBox(46, 2.4, 28, matWallStone, 0, 1.7, -12);
  addBox(12, 1.8, 7, matWallStone, 0, 1.7, 4.5);
  addBox(7.5, 1.95, 8.5, matRedCarpet, 0, 1.72, 4.2);

  // Main 3-story Gothic Corps de Logis (mostly windowless per vampire lore, with scarlet lancet slits)
  addBox(42, 18.5, 24, matWallCream, 0, 4.1, -12);
  addBox(42.8, 1.1, 24.8, matTimber, 0, 12.8, -12); // Mid-floor stone/timber cornice
  addBox(43.2, 1.2, 25.2, matDarkSlate, 0, 22.0, -12); // Eaves cornice

  // Steep pitched Crimson Mansard/Gable Roof over the main hall
  const mainRoof = new THREE.Mesh(new THREE.ConeGeometry(28.5, 13.5, 4), matRoofCrimson);
  mainRoof.position.set(0, 29.3, -12);
  mainRoof.rotation.y = Math.PI / 4;
  mainRoof.scale.set(1.18, 1, 0.72);
  mainRoof.castShadow = true;
  group.add(mainRoof);

  // Grand Columned South Entrance Portico & Pediment
  addBox(13, 15.5, 5.5, matWallCream, 0, 4.1, 1.8);
  addPyramidRoof(9.2, 7.5, matRoofBright, 0, 19.6, 1.8, 4);
  for (const cx of [-4.8, -1.8, 1.8, 4.8]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 12.5, 8), matWallStone);
    col.position.set(cx, 10.3, 4.4);
    col.castShadow = true;
    group.add(col);
  }
  // Unlocked Double Scarlet Entrance Doors
  addBox(3.6, 6.2, 0.5, matTimber, 0, 4.1, 4.45);
  // Great Scarlet Rose Window above the entrance pediment
  const roseWin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.5, 12), matScarletWindow);
  roseWin.rotation.x = Math.PI / 2;
  roseWin.position.set(0, 15.2, 4.55);
  group.add(roseWin);

  // Sparse Scarlet-Tinted Lancet Windows across the front facade
  for (const wx of [-15.5, -10.5, 10.5, 15.5]) {
    addBox(1.3, 4.2, 0.4, matScarletWindow, wx, 6.8, 0.05);
    addBox(1.3, 4.2, 0.4, matScarletWindow, wx, 15.2, 0.05);
  }

  // ============================================================================
  // 5. CENTRAL MIDNIGHT CLOCK TOWER (Rises above the main roof, rings only at night)
  // ============================================================================
  const ctX = 0;
  const ctZ = -15;
  addBox(10.5, 22, 10.5, matWallCream, ctX, 24.0, ctZ);
  // Corner Gothic buttress pilasters on the Clock Tower
  for (const dx of [-5.1, 5.1]) {
    for (const dz of [-5.1, 5.1]) {
      addBox(1.4, 23, 1.4, matTimber, ctX + dx, 24.0, ctZ + dz);
      addPyramidRoof(1.3, 4.2, matRoofBright, ctX + dx, 47.0, ctZ + dz, 4);
    }
  }
  // Belfry arch openings & 4 illuminated Clock Faces
  addBox(11.4, 1.2, 11.4, matDarkSlate, ctX, 38.5, ctZ);
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const fx = ctX + Math.sin(angle) * 5.35;
    const fz = ctZ + Math.cos(angle) * 5.35;
    const face = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.3, 16), matClockFace);
    face.rotation.x = Math.PI / 2;
    face.rotation.z = -angle;
    face.position.set(fx, 42.2, fz);
    group.add(face);
  }
  // Tall Gothic Witch-Hat Belfry Spire & Golden Weathervane Finial
  addPyramidRoof(8.2, 18.5, matRoofCrimson, ctX, 46.0, ctZ, 8, Math.PI / 8);
  addPyramidRoof(0.8, 5.5, matGold, ctX, 64.5, ctZ, 6, 0);

  // ============================================================================
  // 6. WEST WING: VOILE, THE MAGIC LIBRARY (`voile-library`, West X = -28, Z = -12)
  //    Patchouli Knowledge's subterranean & west-wing grimoire archive
  // ============================================================================
  // Arched West Corridor & Flying Buttresses connecting Main Hall to Voile Rotunda
  addBox(10, 11.5, 11, matWallCream, -23, 4.1, -12);
  addPyramidRoof(8.2, 5.5, matRoofCrimson, -23, 15.6, -12, 4);

  // Grand Octagonal Voile Archive Rotunda & Subterranean Grimoire Vault
  const voileX = -31.5;
  const voileZ = -12;
  const voileBase = new THREE.Mesh(
    new THREE.CylinderGeometry(9.5, 10.2, 16.5, 8),
    matWallCream
  );
  voileBase.position.set(voileX, 1.7 + 8.25, voileZ);
  voileBase.rotation.y = Math.PI / 8;
  voileBase.castShadow = true;
  voileBase.receiveShadow = true;
  group.add(voileBase);

  // Subterranean Skylight Clerestory (glowing elemental grimoire windows around base)
  const voileSkylight = new THREE.Mesh(
    new THREE.CylinderGeometry(10.4, 10.4, 2.2, 8),
    matAmberGlass
  );
  voileSkylight.position.set(voileX, 3.8, voileZ);
  voileSkylight.rotation.y = Math.PI / 8;
  group.add(voileSkylight);

  // Stone Flying Buttresses bracing Voile's domed roof
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    addBox(
      1.2,
      14.5,
      2.2,
      matWallStone,
      voileX + Math.cos(a) * 9.6,
      1.7,
      voileZ + Math.sin(a) * 9.6,
      -a
    );
  }

  // Steep Octagonal Crimson Dome & Astrological Spire over Voile Library
  addPyramidRoof(10.8, 12.0, matRoofCrimson, voileX, 18.2, voileZ, 8, Math.PI / 8);
  addPyramidRoof(2.2, 5.5, matGold, voileX, 29.8, voileZ, 6, 0);

  // ============================================================================
  // 7. SOUTH-EAST RECEPTION WING: PARLOR, DINING HALL & AMBER-GLASS CONSERVATORY
  //    (`sdm-parlor-dining`, East/South-East X = +24, Z = -4)
  // ============================================================================
  // Velvet-draped Parlor & Banquet Wing adjoining the main foyer
  addBox(14, 13.5, 16, matWallCream, 24, 4.1, -6);
  addPyramidRoof(11.2, 7.2, matRoofCrimson, 24, 17.6, -6, 4);

  // Adjoining Amber-Glass Conservatory overlooking the mist (canonical from SaBND/MCP)
  const consX = 27.5;
  const consZ = 5.5;
  addBox(11.5, 2.2, 9.5, matWallStone, consX, 1.7, consZ);
  addBox(10.8, 6.2, 8.8, matAmberGlass, consX, 3.9, consZ);
  // Wrought-iron conservatory ribs
  for (const rx of [-4.2, -1.4, 1.4, 4.2]) {
    addBox(0.35, 6.5, 9.1, matDarkSlate, consX + rx, 3.9, consZ);
  }
  addPyramidRoof(7.4, 4.2, matAmberGlass, consX, 10.1, consZ, 4);
  addPyramidRoof(7.6, 0.6, matGold, consX, 10.1, consZ, 4);

  // ============================================================================
  // 8. NORTH-EAST WING: 2ND-FLOOR LAKESIDE GUEST SUITES, BALCONIES & FLANDRE'S BASEMENT
  //    (`sdm-gardens-east-wing`, North-East X = +24, Z = -24)
  // ============================================================================
  // 2nd-Floor East Wing Guest Suites with Iron-Shuttered Windows
  addBox(15, 16.5, 16, matWallCream, 23.5, 4.1, -22);
  addPyramidRoof(11.8, 8.5, matRoofBright, 23.5, 20.6, -22, 4);

  // Lakeside Stone Viewing Balcony & Balustrade overlooking Misty Lake (North-East)
  addBox(18, 8.2, 8, matWallStone, 24, 1.7, -33);
  addBox(18.6, 1.2, 8.6, matWallCream, 24, 9.9, -33);
  // Twin Turrets flanking the East Wing & Rear Balcony
  for (const [tx, tz] of [
    [32.5, -22],
    [-21.5, -24],
  ]) {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 23, 8), matWallCream);
    turret.position.set(tx, 1.7 + 11.5, tz);
    turret.castShadow = true;
    group.add(turret);
    addPyramidRoof(5.2, 9.5, matRoofBright, tx, 24.7, tz, 8, Math.PI / 8);
  }

  // Flandre Scarlet's Restricted Deep Basement Stairwell (Sunken warded vault on NE flank)
  addBox(7.5, 3.2, 6.5, matDarkSlate, 34.5, 1.7, -11);
  addBox(5.2, 2.2, 4.8, matBasementWard, 34.5, 1.9, -11); // Warded violet-scarlet seal glow

  return group;
}
