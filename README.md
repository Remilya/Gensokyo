# Gensokyo — 1:1 Interactive 2D & 3D Cartographic Atlas (幻想郷全図)

**Live Map:** [**https://remilya.dev/Gensokyo/**](https://remilya.dev/Gensokyo/)

An interactive, 60–120 FPS **2D Woodblock Vector & 3D Diorama Cartographic Atlas** of **Gensokyo**, calibrated to **Touhou Project 1–20+** official canon and print works (*Perfect Memento in Strict Sense*, *Symposium of Post-mysticism*, *Forbidden Scrollery*, *Lotus Eaters*, *Wild and Horned Hermit*).

---

## Key Features

### 🗺️ Dual-Engine 2D Vector & 3D Diorama Atlas
- **116 Canonical & Sub-Location Pins:** Covers the Human Village, Hakurei Shrine, Forest of Magic, Misty Lake & Scarlet Devil Mansion, Bamboo Forest of the Lost & Eientei, Youkai Mountain & Moriya Shrine, Sanzu River, Higan, Netherworld, Animal Realm, Former Hell & Chireiden, Makai, Lunar Capital, and Dream World.
- **Seamless 2D ↔ 3D Mode Switching:** Switch instantly between the classic 2D topographic/woodblock SVG map and the full Three.js + Blender 3D diorama view with synchronized selection, search, routing, and camera fly-to animations.
- **Day / Autumn Dusk / Night Themes:** Dynamic atmospheric lighting across both 2D and 3D views with night lanterns, glowing windows, and fireflies.

### 🏯 3D Blender Landmarks & 2D Architectural SVG Illustrations
- **26 Bespoke Blender 3D Landmark Complexes (`public/models/*.glb`):** Custom-modeled in Blender from canonical architectural reference sheets (`PlacefRef/`), including:
  - *Major Compounds:* Scarlet Devil Mansion (`scarlet-devil-mansion.glb`), Hakurei Shrine (`hakurei-shrine.glb`), Human Village (`human-village.glb`), Myouren Temple (`myouren-temple.glb`), Eientei (`eientei.glb`), Moriya Shrine (`moriya-shrine.glb`), Palace of the Earth Spirits (`palace-of-earth-spirits.glb`), and Hakugyokurou (`hakugyokurou.glb`).
  - *Regional & Sub-Location Landmarks:* Heaven / Bhava-agra (`heaven.glb`), Lunar Capital (`lunar-capital.glb`), Former Hell Streets (`former-hell-streets.glb`), Underground Geyser Center / Nuclear Furnace (`nuclear-furnace.glb`), Forest of Magic (`forest-of-magic.glb`), Kirisame Magic Shop (`kirisame-magic-shop.glb`), Margatroid Mansion (`margatroid-mansion.glb`), SDM Main Gate (`scarlet-mansion-gate.glb`), Tengu Village (`tengu-village.glb`), Kourindou (`kourindou.glb`), Mayohiga (`mayohiga.glb`), Three Fairies' Tree (`three-fairies-tree.glb`), Suzunaan (`suzunaan.glb`), Geidontei (`geidontei.glb`), Hieda Estate (`hieda-estate.glb`), Terakoya (`terakoya.glb`), Palanquin Ship (`byakuren-ship.glb`), and Moriya Ropeway (`moriya-ropeway.glb`).
- **3D World Diorama Dressings (`gensokyo-diorama-dressings.glb`):** Layered sedimentary cliff strata on Youkai Mountain, snowy summit caps, arched timber bridges, torii approaches, and riverside waterwheels.
- **33+ Isometric 2D Architectural SVG Landmarks (`src/map/svgLandmarks2d.ts`):** Detailed multi-building vector illustrations rendered directly on the 2D SVG map—complete with curved kawara roofs, gables, clock towers, pagodas, bridges, and interactive hover magnification (`1.8x` scale with automatic label offset).

### 🎀 74 On-Map Resident Characters (2D Chibi Sprites & 3D Low-Poly Figurines)
- **Portrait-Sampled 24×24 Pixel-Art Chibi Sprites (`src/data/resident-sprites.ts`):** Every on-map resident features a custom 24×24 pixel-art sprite color-sampled and silhouette-matched from official Touhou character portraits (`public/portraits/*.png`), complete with signature hats, ribbons, wings, halos, animal ears, and held items (e.g., Reimu's gohei, Marisa's broom & Hakkero, Sakuya's knives, Flandre's crystal wings & Laevateinn, Yuyuko's folding fan, Okuu's control rod & chest eye).
- **3D Low-Poly Blender Character Kit (`public/models/characters-kit.glb`):** 74 custom 3D low-poly figurines placed across Gensokyo's courtyards, shrines, streets, and sky decks, batched into just 2 GPU draw calls (`Opaque` + `Emissive`).
- **9-Point Footprint Raycast Grounding:** Characters in 3D are automatically validated via a 9-point footprint disc raycast against rendered terrain triangles, carved lake polygons, world diorama crags, and scaled GLB courtyards—ensuring every character stands flush on courtyards, steps, sky decks (`Heaven`), or water surfaces (`Wakasagihime` on Misty Lake) with zero floating, sinking, or wall/tree clipping.
- **Interactive Resident Profile Popups & 143 Character Chronicles:** Click any character sprite/figurine on the 2D or 3D map to open their quick profile card, or open the full **Character Dossier** featuring **Who They Are**, **Personality & Demeanor**, **💚 Who They Like (Friends, Family & Allies)**, **⚔️ Enemies, Rivals & Friction**, and home locations.

### 🧭 Overland Route & Travel Time Calculator
- **117 Connected Overland, Ropeway, Ferry & Portal Routes:** Compute shortest paths, walking time in minutes, distance in km, aerial flight duration, danger ratings, and step-by-step waypoint chains across both 2D and 3D views.

### ⚡ 60–120 FPS Performance Architecture
- **Minimal WebGL Draw Calls:** All ~90 minor procedural landmarks merge into 1 draw call; all 74 3D characters merge into 2 draw calls; thousands of trees (pines, bamboo, cherry blossoms, autumn maples, deadwood) render via `THREE.InstancedMesh` with automatic exclusion zones around all 116 locations and 74 characters.
- **Zero-Raycast `O(1)` Hover/Click Picking:** Fast bounding-sphere intersection replaces expensive per-frame triangle raycasting during mouse movement.
- **On-Demand Shadows & Virtualized DOM:** Shadow maps re-render only when geometry or lighting changes; 2D/3D HTML labels update only when screen coordinates change by `>= 0.5px`; off-screen view loops pause automatically when switching between 2D and 3D.

---

## Local Development & Scripts

```bash
npm install
npm run dev               # Starts local Vite dev server at http://localhost:5179
npm run update-characters # Updates data/characters.json from Touhou Wiki over HTTP/2
npm run update-sprites    # Downloads official character portraits & generates sprite sheets
npm run validate          # Validates all 116 locations, 143 characters, 117 routes, and 19 biomes
npm run build             # Type-checks (tsc) and builds production bundle into ./dist
npm run deploy            # Builds and deploys to GitHub Pages (remilya.dev/Gensokyo)
```

### Blender & Asset Generation Scripts (`scripts/`)
- `node scripts/generate-portrait-sampled-sprites.mjs` — Samples `public/portraits/*.png` to generate the 74 24×24 pixel-art chibi templates in `src/data/resident-sprites.ts`.
- `scripts/blender-build-landmarks.py` / `scripts/blender-build-world-landmarks-p1.py` / `scripts/blender-build-world-landmarks-p2.py` / `scripts/blender-rebuild-ref-landmarks.py` — Builds and exports the 26 architectural landmark GLBs into `public/models/`.
- `scripts/blender-build-world-diorama.py` — Builds and exports `public/models/gensokyo-diorama-dressings.glb`.
- `scripts/blender-build-characters-kit.py` — Builds and exports all 74 3D character figurines into `public/models/characters-kit.glb`.
