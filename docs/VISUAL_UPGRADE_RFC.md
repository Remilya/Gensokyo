# RFC: Gensokyo Atlas — Cartographic SVG, Procedural Detail & 2.5D/3D Upgrade

## 1. Role & Instructions for the Coding Agent

You are tasked with upgrading the visual fidelity, close-up cartographic detail, and spatial depth of the **Gensokyo Interactive Atlas** (`remilya.dev/Gensokyo/`). Before writing implementation code:

1. Read and analyze the current rendering pipeline in `package.json`, `src/main.ts`, `src/state.ts`, `src/map/canvas.ts`, `src/map/terrain.ts`, `src/map/markers.ts`, `src/map/roads.ts`, `src/map/water.ts`, and `src/map/labels.ts`.
2. Evaluate how the existing 2D camera transform (pan, zoom, `1:1 Scale`, and `Minimap` viewport tracking) and hit-testing work.
3. Review the **Current Visual Bottlenecks** and the **Three Architectural Paths** below, then recommend the best path (or hybrid combination) with a step-by-step migration plan.

---

## 2. Current Visual Bottlenecks to Solve (Close-Up & Full Atlas Audit)

* **Mechanical Close-Up Geometry (`src/map/terrain.ts`, `src/map/markers.ts`):** When zoomed in (`250 m` / `500 m` scale around `Human Village`), the surrounding agricultural rice paddies render as rigid, axis-aligned squares that clip directly over the river canal and main road. Small standalone trees (`Abandon Pond`, `Youkai Tanuki Forest`) use basic geometric primitives (circles and triangles), and the `Myouren Temple` ground courtyard renders as a stark, high-contrast rectangular box against the dark forest floor.
* **Ruler-Straight Local Sub-Routes (`src/map/roads.ts`, `data/routes.json`):** Secondary connection lines radiating from `Human Village` sub-locations (`Geidontei Izakaya`, `Suzunaan Bookshop`, `Terakoya Schoolhouse`) draw as straight point-to-point vectors that slice directly through the circular village wall, roofs, and farm plots rather than routing through the village gates and curving along terrain.
* **Flat Landmark Silhouettes (`src/map/markers.ts`):** Major estates and shrines (`Hakurei Shrine`, `Scarlet Devil Mansion`, `Myouren Temple`, `Eientei`, `Moriya Shrine`, and the `Human Village` building blocks) rely on flat 2D shapes that could benefit from either intricate hand-inked SVG linework or subtle 2.5D/isometric depth.
* **Label Stacking & Night Mode Kanji Contrast (`src/map/labels.ts`, `src/styles/theme.css`, `src/styles/main.css`):**
  * Inside `Human Village`, the banners for `Terakoya Schoolhouse`, `Human Village`, `Market Square & Craft Lanes`, and `Suzunaan Bookshop` stack vertically along the exact same axis, obscuring the central street and canal.
  * In `Night` mode, the dark red Kanji subtitle text inside dark slate location banners has low contrast and is difficult to read.
  * In the top region filter bar, the rightmost tab (`Sanzu & Netherwo...`) is slightly clipped by a few pixels.

---

## 3. Architectural Options & Reference Repositories

### Path A: Hand-Inked 2D Cartography & Procedural Brushwork (Low Risk, High Cohesion)
Preserves the existing 2D camera and coordinate system in `src/map/canvas.ts` while replacing geometric primitives with organic, hand-drawn cartography:
* **`rough-stuff/rough`:** Sketchy/hand-inked polygon and hachure generator for farm plots, village walls, and temple courtyards, plus river/road buffer clipping so paddies never overlap water or roads.
* **`LingDong-/shan-shui-inf`:** Procedural East-Asian ink brushwork for pine trees, bamboo stalks, deciduous boughs, and curved roofs.
* **`Azgaar/Fantasy-Map-Generator` & `mewo2/terrain`:** Gate-aware spline routing with organic midpoint displacement.
* **`game-icons/icons`:** Clean single-path vector silhouettes for shrines, pagodas, bridges, and lanterns.

### Path B: 2.5D Pseudo-3D Landmarks on the Existing 2D Scene Graph (Medium Effort, Zero WebGL Overhead)
Keeps the entire 2D vector pipeline intact (`src/map/canvas.ts`) while giving major landmarks and village buildings miniature 2.5D isometric architectural volume (sunlit front facade, shaded side wall, overhanging curved roof eaves, and cast ground shadows).

### Path C: Tilted 3D Tabletop / HD-2D Diorama (`three.js`)
Wraps the 2D map into a WebGL 3D terrain mesh with heightmap displacement and point lights.

---

## 4. Selected Architecture: **Path A + Path B Hybrid (Native SVG)**

Because `src/map/canvas.ts` uses a hardware-accelerated `<svg viewBox="0 0 2400 1600">` scene graph with `d3-zoom`, combining **Path A** (hand-inked irregular polygons, hachure fills, river/road buffer clipping, and `shan-shui-inf` procedural ink flora) with **Path B** (2.5D isometric architectural building blocks and landmark miniatures in pure SVG) delivers maximum close-up cartographic beauty while preserving infinite vector sharpness up to `9x` zoom and 60–120 FPS performance.
