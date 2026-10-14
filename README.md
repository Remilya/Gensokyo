# Gensokyo — 1:1 Interactive Cartographic Atlas (幻想郷全図)

**Live Map:** [**https://remilya.dev/Gensokyo/**](https://remilya.dev/Gensokyo/)

An interactive, 60–120 FPS vector cartographic atlas of **Gensokyo** calibrated to **Touhou Project 1–20+** official canon and print works (*Perfect Memento in Strict Sense*, *Symposium of Post-mysticism*, *Forbidden Scrollery*, *Lotus Eaters*, *Wild and Horned Hermit*).

---

## Features

- **116 Canonical & Sub-Location Pins:** Covers the Human Village, Hakurei Shrine, Forest of Magic, Misty Lake & Scarlet Devil Mansion, Bamboo Forest of the Lost & Eientei, Youkai Mountain & Moriya Shrine, Sanzu River, Higan, Netherworld, Animal Realm, Former Hell & Chireiden, Makai, Lunar Capital, and Dream World.
- **143 Interactive Character Chronicles:** Click any resident chip or search for any character to open their curated dossier—featuring **Who They Are**, **Personality & Demeanor**, **💚 Who They Like (Friends, Family & Allies)**, **⚔️ Enemies, Rivals & Friction**, and clickable home locations.
- **117 Connected Overland, Ropeway, Ferry & Portal Routes:** Interactive **Overland Route & Travel Time Calculator** computing walking minutes, distance in km, aerial flight time, and waypoint chains.
- **1:1 Architectural Building Footprints:** Toggleable 1:1 street grids and building footprints for the Human Village palisade, Hakurei Shrine steps, Scarlet Devil Mansion wings, Myouren Temple, and Eientei.
- **Touhou Wiki Canon Integration:** Merged with official Touhou Wiki location and character data (`npm run update-characters`).
- **Day / Autumn Dusk / Night Themes:** Dynamic lighting with night lanterns and fireflies.

---

## Local Development

```bash
npm install
npm run dev               # Starts local dev server at http://localhost:5179
npm run update-characters # Updates data/characters.json from Touhou Wiki over HTTP/2
npm run validate          # Validates all 116 locations, 143 characters, 117 routes, and 19 biomes
npm run build             # Builds static bundle into ./dist
npm run deploy            # Builds and deploys to GitHub Pages (remilya.dev/Gensokyo)
```
