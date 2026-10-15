import { MAP_HEIGHT, MAP_WIDTH } from '../state';
import type { LocationEntry, LocationKind } from '../types';

export const KIND_COLOR: Record<LocationKind, string> = {
  shrine: '#b6342a',
  temple: '#7b4b94',
  residence: '#b57c2e',
  village: '#2e6b56',
  landmark: '#8a5a36',
  water: '#366f8f',
  mountain: '#5c5449',
  forest: '#3d6b42',
  otherworld: '#63458a',
};

/**
 * Renders 2.5D Three-Quarter Isometric Architectural Miniatures for the 2D SVG Map,
 * faithfully matching the `PlacefRef/` reference sheets and 3D Blender `.glb` landmark models.
 */
function renderCustomLandmarkArt(id: string, icon?: string): string {
  const key = id || icon || '';
  switch (key) {
    case 'hakurei-shrine':
      return `
        <g class="landmark-illust" transform="translate(0, -8)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- 2.5D Honden Shrine Hall behind Torii -->
          <rect x="-15" y="-14" width="26" height="13" fill="#efe2c6" stroke="#2a1812" stroke-width="1.2" />
          <polygon points="11,-14 16,-11 16,-1 11,-1" fill="#cbb792" stroke="#2a1812" stroke-width="1.1" stroke-linejoin="round" />
          <line x1="-8" y1="-14" x2="-8" y2="-1" stroke="#7a2820" stroke-width="1.4" />
          <line x1="4" y1="-14" x2="4" y2="-1" stroke="#7a2820" stroke-width="1.4" />
          <path d="M -21 -13 Q -2 -25 17 -13 L 20 -10 L -18 -10 Z" fill="#593a28" stroke="#24140c" stroke-width="1.35" stroke-linejoin="round" />
          <line x1="-11" y1="-18.5" x2="9" y2="-18.5" stroke="#d9a74a" stroke-width="1.5" stroke-linecap="round" />
          <!-- Grand Crimson Shinto Torii Gate in Foreground -->
          <path d="M -20 -8.5 Q 0 -12.5 20 -8.5" fill="none" stroke="#b6342a" stroke-width="4.2" stroke-linecap="round" />
          <line x1="-15" y1="-4.5" x2="15" y2="-4.5" stroke="#b6342a" stroke-width="2.5" stroke-linecap="round" />
          <line x1="-12" y1="-8.5" x2="-13" y2="10.5" stroke="#b6342a" stroke-width="3.0" />
          <line x1="12" y1="-8.5" x2="13" y2="10.5" stroke="#b6342a" stroke-width="3.0" />
          <rect x="-15" y="8.5" width="4" height="3" fill="#2e2620" />
          <rect x="11" y="8.5" width="4" height="3" fill="#2e2620" />
          <!-- Shimenawa Rope & White Gohei Paper Zigzags -->
          <path d="M -11 -3.2 Q 0 -0.2 11 -3.2" fill="none" stroke="#d9b44a" stroke-width="1.8" />
          <polygon points="-6,-2.8 -8,2.5 -4,2.5" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
          <polygon points="0,-2.2 -2,3 2,3" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
          <polygon points="6,-2.8 4,2.5 8,2.5" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
        </g>
      `;

    case 'scarlet-devil-mansion':
      return `
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="2" cy="10" rx="22" ry="5.5" fill="rgba(20, 8, 10, 0.38)" />
          <!-- Left & Right 2.5D Gothic Wings (Front Crimson Brick + Shaded East Wall) -->
          <rect x="-20" y="-6" width="38" height="16" fill="#942028" stroke="#240b0d" stroke-width="1.3" />
          <polygon points="18,-6 23,-3 23,10 18,10" fill="#5e1217" stroke="#240b0d" stroke-width="1.1" stroke-linejoin="round" />
          <polygon points="-22,-6 -12,-17 -2,-6" fill="#3a1620" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="2,-6 12,-17 22,-6" fill="#3a1620" stroke="#240b0d" stroke-width="1.2" />
          <!-- Side Turret Spires -->
          <rect x="-19" y="-14" width="6" height="24" fill="#7a181e" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="-20,-14 -16,-24 -12,-14" fill="#2b0f16" stroke="#240b0d" stroke-width="1.1" />
          <rect x="13" y="-14" width="6" height="24" fill="#7a181e" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="12,-14 16,-24 20,-14" fill="#2b0f16" stroke="#240b0d" stroke-width="1.1" />
          <!-- 2.5D Tall Central Clock Tower -->
          <rect x="-6.5" y="-21" width="12" height="31" fill="#ab2630" stroke="#240b0d" stroke-width="1.4" />
          <polygon points="5.5,-21 9,-18.5 9,10 5.5,10" fill="#6e151c" stroke="#240b0d" stroke-width="1.1" stroke-linejoin="round" />
          <polygon points="-8.5,-21 0,-34 8.5,-21" fill="#2b0f16" stroke="#240b0d" stroke-width="1.3" />
          <line x1="0" y1="-34" x2="0" y2="-38" stroke="#d9a74a" stroke-width="1.4" />
          <!-- Illuminated Clock Face & Gothic Rose Windows -->
          <circle cx="-0.5" cy="-12.5" r="4.0" fill="#fff4c8" stroke="#240b0d" stroke-width="1.0" />
          <line x1="-0.5" y1="-12.5" x2="-0.5" y2="-15" stroke="#240b0d" stroke-width="1.0" />
          <line x1="-0.5" y1="-12.5" x2="1.8" y2="-12.5" stroke="#240b0d" stroke-width="1.0" />
          <rect x="-13" y="-2" width="3.5" height="6" rx="1.5" fill="#ffdf9e" />
          <rect x="8" y="-2" width="3.5" height="6" rx="1.5" fill="#ffdf9e" />
        </g>
      `;

    case 'alices-house':
      // Reference: `PlacefRef/AliceHouse.png` — Half-timbered white plaster cottage with lavender-indigo gable roof,
      // blue-grey stone chimney, 4-pillar porch with deep-purple awning, and attached 2-story octagonal half-timbered tower!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10" rx="20" ry="4.5" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Blue-Grey Cobblestone Chimney on Left Roof Slope -->
          <rect x="-12" y="-20" width="4.5" height="7" fill="#688098" stroke="#242c38" stroke-width="1.0" />
          <rect x="-13" y="-21.5" width="6.5" height="1.8" fill="#f0ece4" stroke="#242c38" stroke-width="0.8" />
          <!-- Main Half-Timbered White Plaster Cottage (Left) -->
          <rect x="-18" y="-6" width="21" height="14" fill="#f5f2ec" stroke="#3b2618" stroke-width="1.3" />
          <line x1="-18" y1="1" x2="3" y2="1" stroke="#6b442a" stroke-width="1.3" />
          <line x1="-11" y1="-6" x2="-11" y2="8" stroke="#6b442a" stroke-width="1.2" />
          <line x1="-4" y1="-6" x2="-4" y2="8" stroke="#6b442a" stroke-width="1.2" />
          <!-- Lavender-Indigo Pitched Gable Roof with White Eave Trim -->
          <polygon points="-21,-5 -15,-16 3,-16 6,-5" fill="#686ca8" stroke="#282a48" stroke-width="1.3" stroke-linejoin="round" />
          <line x1="-15" y1="-16" x2="3" y2="-16" stroke="#484b7e" stroke-width="2.0" stroke-linecap="round" />
          <line x1="-20" y1="-5" x2="5" y2="-5" stroke="#ffffff" stroke-width="1.4" />
          <!-- 4-Pillar Covered Front Porch with Deep Indigo-Purple Awning & Stone Footings -->
          <polygon points="-20,1 -17,-3 1,-3 3,1" fill="#464a7e" stroke="#222442" stroke-width="1.1" />
          <line x1="-18" y1="1" x2="-18" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-13" y1="1" x2="-13" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-7" y1="1" x2="-7" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-1" y1="1" x2="-1" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <rect x="-19" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-14" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-8" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-2" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <!-- Attached 2-Story Octagonal Half-Timbered Tower on Right (AliceHouse.png) -->
          <rect x="2" y="-14" width="14" height="22" fill="#f5f2ec" stroke="#4a2e1b" stroke-width="1.3" />
          <polygon points="16,-14 20,-11 20,8 16,8" fill="#d8d2c5" stroke="#4a2e1b" stroke-width="1.1" />
          <line x1="2" y1="-3" x2="20" y2="-3" stroke="#6b442a" stroke-width="1.5" />
          <line x1="7" y1="-14" x2="7" y2="8" stroke="#6b442a" stroke-width="1.4" />
          <line x1="12" y1="-14" x2="12" y2="8" stroke="#6b442a" stroke-width="1.4" />
          <!-- Glowing Tower Windows with Pink Flower Planter Boxes -->
          <rect x="4" y="-11" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="3.5" y="-6.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <rect x="8.5" y="-11" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="8" y="-6.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <rect x="4" y="-0.5" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="3.5" y="3.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <!-- Conical Stepped Indigo-Purple Tower Roof -->
          <polygon points="0,-14 10,-25 22,-14" fill="#686ca8" stroke="#282a48" stroke-width="1.3" stroke-linejoin="round" />
        </g>
      `;

    case 'marisas-house':
      // Reference: `PlacefRef/MarisaHouse.png` — Two-story cream-plaster cottage with twin front dormer gables,
      // tall front-left cream chimney with white smoke, climbing green ivy, dark-grey cylindrical stone observatory/silo tower,
      // and foreground stone garden bed with purple lupine flower spikes!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10.5" rx="21" ry="4.8" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Two-Story Cream-Plaster Cottage (Left) -->
          <rect x="-18" y="-6" width="21" height="14" fill="#eae5d9" stroke="#2e2a24" stroke-width="1.3" />
          <!-- Dark Slate Roof & Twin Front Dormer Gables (MarisaHouse.png) -->
          <polygon points="-21,-5 -15,-16 3,-16 6,-5" fill="#4f565e" stroke="#22262b" stroke-width="1.3" stroke-linejoin="round" />
          <polygon points="-13,-8 -9,-13 -5,-8" fill="#636b75" stroke="#22262b" stroke-width="1.0" />
          <rect x="-10.5" y="-9.5" width="3" height="2.5" fill="#ffdf9e" />
          <polygon points="-4,-8 0,-13 4,-8" fill="#636b75" stroke="#22262b" stroke-width="1.0" />
          <rect x="-1.5" y="-9.5" width="3" height="2.5" fill="#ffdf9e" />
          <!-- Tall Cream Exterior Chimney on Front-Left with White Smoke Puffs -->
          <rect x="-17" y="-19" width="4.2" height="27" fill="#dfd9cc" stroke="#2e2a24" stroke-width="1.1" />
          <rect x="-17.8" y="-20" width="5.8" height="2" fill="#636b75" stroke="#22262b" stroke-width="0.9" />
          <circle cx="-15" cy="-23" r="2.2" fill="#ffffff" opacity="0.85" />
          <circle cx="-13" cy="-26" r="2.8" fill="#ffffff" opacity="0.70" />
          <!-- Climbing Green Ivy Vines & Shuttered Windows -->
          <path d="M -11 8 L -11 -3 M -3 8 L -3 -2" stroke="#487e36" stroke-width="2.4" stroke-linecap="round" />
          <rect x="-9" y="-3.5" width="3.5" height="3.5" fill="#ffdf9e" stroke="#4a3020" stroke-width="0.9" />
          <rect x="-1" y="-3.5" width="3.5" height="3.5" fill="#ffdf9e" stroke="#4a3020" stroke-width="0.9" />
          <!-- Attached Cylindrical Dark-Grey Stone Observatory/Silo Tower on Right (MarisaHouse.png) -->
          <rect x="3" y="-17" width="15" height="25" rx="3" fill="#5e646b" stroke="#22262a" stroke-width="1.3" />
          <line x1="7" y1="-17" x2="7" y2="8" stroke="#787f87" stroke-width="1.3" />
          <line x1="13" y1="-17" x2="13" y2="8" stroke="#787f87" stroke-width="1.3" />
          <path d="M 2 -16 Q 10.5 -24 19 -16 Z" fill="#454b52" stroke="#1e2226" stroke-width="1.3" />
          <rect x="8.5" y="-11" width="3" height="3.5" fill="#eae5d9" stroke="#22262a" stroke-width="0.8" />
          <rect x="8.5" y="-3" width="3" height="3.5" fill="#eae5d9" stroke="#22262a" stroke-width="0.8" />
          <!-- Foreground Stone Garden Wall & Purple Lupine Flower Spikes (MarisaHouse.png bottom-right) -->
          <rect x="-1" y="6.5" width="19" height="3.2" rx="1" fill="#858a90" stroke="#2e3236" stroke-width="0.9" />
          <polygon points="1,6.5 2.2,1.5 3.4,6.5" fill="#cbb4f0" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="5,6.5 6.2,1.0 7.4,6.5" fill="#d8c4f8" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="9,6.5 10.2,1.8 11.4,6.5" fill="#cbb4f0" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="13,6.5 14.2,1.2 15.4,6.5" fill="#d8c4f8" stroke="#5e4488" stroke-width="0.6" />
        </g>
      `;

    case 'hieda-estate':
    case 'hieda':
      // Reference: `PlacefRef/Humanvillage-thumb.png` — Walled compound with koi pond, arched vermilion bridge,
      // lush green garden trees, and two-story black-roofed Hieda main mansion!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- White Plaster Tsukiji-bei Compound Wall -->
          <rect x="-17" y="-5" width="34" height="14" rx="1.5" fill="#e8dfc8" stroke="#f7f2e6" stroke-width="2.2" />
          <rect x="-17" y="-5" width="34" height="14" rx="1.5" fill="none" stroke="#262930" stroke-width="1.1" />
          <!-- Central Koi Pond & Arched Vermilion Bridge -->
          <ellipse cx="4" cy="3" rx="9.5" ry="5.2" fill="#2e7bb5" stroke="#4a6348" stroke-width="0.9" />
          <rect x="0" y="-0.5" width="8" height="3.8" rx="1" transform="rotate(-18 4 1.5)" fill="#c82e24" stroke="#24100c" stroke-width="0.8" />
          <!-- Two-Story Black-Roofed Hieda Main Mansion -->
          <rect x="-13" y="-12" width="20" height="9" fill="#f7f2e6" stroke="#1e2226" stroke-width="1.1" />
          <polygon points="-16,-5 -11,-13 5,-13 10,-5" fill="#262930" stroke="#14161a" stroke-width="1.2" />
          <polygon points="-12,-10 -8,-18 2,-18 6,-10" fill="#323640" stroke="#14161a" stroke-width="1.1" />
          <!-- Green Courtyard Trees -->
          <circle cx="-10" cy="3.5" r="4.2" fill="#3e7432" stroke="#1b3814" stroke-width="0.8" />
          <circle cx="12" cy="-3.5" r="3.8" fill="#48843a" stroke="#1b3814" stroke-width="0.8" />
        </g>
      `;

    case 'moriya-branch-shrine':
      // Reference: `PlacefRef/RadioTower.png` — Tapered 4-legged steel truss lattice Outside World Radio Tower
      // overgrown with climbing green forest vines and topped with a silver lightning-rod spire!
      return `
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1" cy="10" rx="13" ry="3.5" fill="rgba(22, 12, 6, 0.30)" />
          <!-- Tapered 4-Legged Steel Lattice Tower Frame -->
          <line x1="-9" y1="9" x2="-2.2" y2="-22" stroke="#dfe3ec" stroke-width="2.2" stroke-linecap="round" />
          <line x1="9" y1="9" x2="2.2" y2="-22" stroke="#785038" stroke-width="2.2" stroke-linecap="round" />
          <!-- Horizontal Ring Struts & Diagonal X-Bracing -->
          <line x1="-7.5" y1="2" x2="7.5" y2="2" stroke="#dfe3ec" stroke-width="1.4" />
          <line x1="-5.8" y1="-6" x2="5.8" y2="-6" stroke="#dfe3ec" stroke-width="1.3" />
          <line x1="-4.0" y1="-14" x2="4.0" y2="-14" stroke="#dfe3ec" stroke-width="1.2" />
          <line x1="-2.4" y1="-22" x2="2.4" y2="-22" stroke="#dfe3ec" stroke-width="1.2" />
          <path d="M -8.5 8 L 7.2 2 L -5.5 -6 L 4.0 -14 L -2.2 -22 M 8.5 8 L -7.2 2 L 5.5 -6 L -4.0 -14 L 2.2 -22" fill="none" stroke="#8c5e42" stroke-width="1.0" />
          <!-- Overgrown Climbing Green Forest Vines (RadioTower.png) -->
          <circle cx="-5.5" cy="3" r="3.2" fill="#3e742e" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="4.5" cy="-3" r="3.0" fill="#4e8c3a" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="-2.8" cy="-10" r="2.6" fill="#3e742e" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="2.0" cy="-17" r="2.2" fill="#4e8c3a" stroke="#1e3c16" stroke-width="0.7" />
          <!-- Top Silver Lightning-Rod Antenna Mast -->
          <line x1="0" y1="-22" x2="0" y2="-31" stroke="#eef2f8" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="0" cy="-31" r="1.3" fill="#ffffff" />
        </g>
      `;

    case 'moriya-shrine':
      // Reference: `PlacefRef/mountain shrine refs.png` & `detailed shrine sides.png`
      return `
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1.5" cy="10" rx="21" ry="4.8" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Four Towering Rope-Bound Onbashira Cedar Pillars -->
          <line x1="-18" y1="-22" x2="-18" y2="9" stroke="#6e4427" stroke-width="3.4" stroke-linecap="round" />
          <line x1="18" y1="-22" x2="18" y2="9" stroke="#6e4427" stroke-width="3.4" stroke-linecap="round" />
          <line x1="-12" y1="-18" x2="-12" y2="7" stroke="#8c5a34" stroke-width="2.6" stroke-linecap="round" />
          <line x1="12" y1="-18" x2="12" y2="7" stroke="#8c5a34" stroke-width="2.6" stroke-linecap="round" />
          <!-- Elevated Honden Sanctuary behind Haiden -->
          <polygon points="-11,-10 0,-21 11,-10" fill="#225e4e" stroke="#123028" stroke-width="1.2" />
          <!-- Wide Patinated Green-Copper Roofed Haiden Worship Hall & Chigi Gables -->
          <rect x="-13" y="-3" width="26" height="11" fill="#f5eee0" stroke="#2e241b" stroke-width="1.3" />
          <polygon points="-17,-2 -11,-13 11,-13 17,-2" fill="#296e5c" stroke="#14362c" stroke-width="1.4" stroke-linejoin="round" />
          <polygon points="-7,-1 0,-9 7,-1" fill="#368570" stroke="#d9b44a" stroke-width="1.0" />
          <!-- Heavy Braided Shimenawa Rope & White Shide Streamers -->
          <path d="M -11 -1.5 Q 0 2.5 11 -1.5" fill="none" stroke="#d9b44a" stroke-width="2.0" />
          <polygon points="-5,-1 -6.5,3.5 -3.5,3.5" fill="#ffffff" />
          <polygon points="0,-0.5 -1.5,4 1.5,4" fill="#ffffff" />
          <polygon points="5,-1 3.5,3.5 6.5,3.5" fill="#ffffff" />
        </g>
      `;

    case 'tengu-village':
    case 'nine-heavens-waterfall':
      // Reference: `PlacefRef/yokai mountain.png` — Cliffside waterfall, vermilion bridge, red-pillared Tengu watchtower & autumn maples!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Craggy Cliff & Cascading White Waterfall -->
          <rect x="-16" y="-8" width="32" height="17" rx="2" fill="#6e665c" stroke="#2b2620" stroke-width="1.2" />
          <rect x="-12" y="-8" width="7" height="17" fill="#58ace0" />
          <line x1="-8.5" y1="-7" x2="-8.5" y2="8" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 2" />
          <!-- Arched Vermilion Suspension Bridge across Waterfall -->
          <path d="M -16 2 Q -8 -2 0 2" fill="none" stroke="#c82824" stroke-width="3.2" stroke-linecap="round" />
          <!-- Multi-Tier Red-Pillared Tengu Watchtower on Right Cliff -->
          <rect x="1" y="-12" width="12" height="18" fill="#b82824" stroke="#24100c" stroke-width="1.1" />
          <polygon points="-2,-5 7,-13 16,-5" fill="#2c3038" stroke="#14161a" stroke-width="1.2" />
          <polygon points="0,-12 7,-20 14,-12" fill="#383e48" stroke="#14161a" stroke-width="1.2" />
          <!-- Fiery Crimson & Gold Autumn Maples -->
          <circle cx="-14" cy="-9" r="4.5" fill="#cf3824" stroke="#4a140c" stroke-width="0.8" />
          <circle cx="15" cy="3" r="4.0" fill="#e08824" stroke="#4a280c" stroke-width="0.8" />
        </g>
      `;

    case 'eientei':
      // Reference: `PlacefRef/eintei ref.png` — Walled bamboo palace, stone lotus pond with twin bridges, Shinden hall & rear 3-story pagoda!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="21" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Rear 3-Story Eientei Pagoda Spire (Right) & Full Moon -->
          <circle cx="-11" cy="-16" r="4.5" fill="#fff2a6" stroke="#8c6d1f" stroke-width="0.9" />
          <rect x="8" y="-19" width="7" height="18" fill="#dfd2bc" stroke="#24170e" stroke-width="1.0" />
          <polygon points="5,-11 11.5,-16 18,-11" fill="#2b3038" stroke="#14161a" stroke-width="1.1" />
          <polygon points="6,-16 11.5,-22 17,-16" fill="#2b3038" stroke="#14161a" stroke-width="1.1" />
          <line x1="11.5" y1="-22" x2="11.5" y2="-26" stroke="#d9b44a" stroke-width="1.3" />
          <!-- Grand Multi-Bay Shinden Hall with Karahafu Entrance Gable -->
          <rect x="-17" y="-3" width="32" height="10" fill="#f5eee0" stroke="#2b1e14" stroke-width="1.2" />
          <path d="M -22 -2 L -14 -12 L 13 -12 L 21 -2 Z" fill="#2b3038" stroke="#14161a" stroke-width="1.4" stroke-linejoin="round" />
          <polygon points="-6,-2 0,-8 6,-2" fill="#3a404a" stroke="#d9b44a" stroke-width="1.0" />
          <!-- Foreground Rectangular Stone Pond & Twin Bridges -->
          <rect x="-14" y="5.5" width="28" height="4.5" rx="1" fill="#2e729e" stroke="#5c564c" stroke-width="0.9" />
          <rect x="-8" y="4.8" width="3.5" height="5.8" fill="#9c6a3e" />
          <rect x="4.5" y="4.8" width="3.5" height="5.8" fill="#9c6a3e" />
        </g>
      `;

    case 'muenzuka':
      // Reference: `PlacefRef/magenzuka ref.png` — Weeping purple-pink cherry tree, Outside World wooden gatehouse, gravestones & red spider lilies!
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="4.2" fill="rgba(22, 12, 6, 0.30)" />
          <!-- Weathered Wooden Outside World Gatehouse Pavilion (Left) -->
          <rect x="-16" y="-4" width="13" height="11" fill="#8c6244" stroke="#2b1c12" stroke-width="1.1" />
          <polygon points="-19,-3 -13,-12 -5,-12 0,-3" fill="#3a2c24" stroke="#1e1510" stroke-width="1.2" />
          <!-- Cascading Purple-Pink Weeping Cherry Tree (Shidarezakura) on Right -->
          <path d="M 8 8 L 8 -6 M 8 -2 L 3 -7 M 8 -3 L 13 -7" stroke="#4a2c21" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="8" cy="-10" r="8.5" fill="#d878b4" stroke="#6e2854" stroke-width="1.1" />
          <circle cx="6" cy="-12" r="5.5" fill="#f4b2dc" />
          <!-- Stone Stele Gravestones & Red Spider Lilies -->
          <rect x="-2" y="1" width="3.5" height="7" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.9" />
          <rect x="3" y="2" width="3.2" height="6" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.9" />
          <circle cx="-7" cy="8" r="2.4" fill="#d62828" />
          <circle cx="13" cy="8" r="2.4" fill="#d62828" />
        </g>
      `;

    case 'heaven':
      // Reference: `PlacefRef/yokai mountain.png` (top) — Floating Cloud-Sea Archipelago (Unkai), golden-vermilion palace, marble bridge & peach trees!
      return `
        <g class="landmark-illust" transform="translate(0, -7)">
          <!-- Billowy White Unkai Cloud Platform -->
          <path d="M -20 5 C -22 0, -14 -3, -8 0 C -4 -4, 6 -4, 10 0 C 16 -3, 22 0, 20 5 C 16 10, -16 10, -20 5 Z" fill="#fffdf7" stroke="#8c9bb0" stroke-width="1.2" />
          <!-- Golden & Vermilion Celestial Palace Pavilion -->
          <rect x="-10" y="-8" width="20" height="10" fill="#d43228" stroke="#3b1410" stroke-width="1.1" />
          <polygon points="-15,-7 -9,-16 9,-16 15,-7" fill="#e8b842" stroke="#5c4210" stroke-width="1.3" />
          <polygon points="-10,-13 0,-21 10,-13" fill="#f4ca58" stroke="#5c4210" stroke-width="1.1" />
          <!-- Pink Heavenly Peach Trees & Arched White Marble Bridge -->
          <circle cx="-14" cy="-3" r="4.5" fill="#f498b8" stroke="#7a2c48" stroke-width="0.8" />
          <circle cx="14" cy="-3" r="4.5" fill="#f498b8" stroke="#7a2c48" stroke-width="0.8" />
          <path d="M -6 5 Q 0 1 6 5" fill="none" stroke="#e8e4dc" stroke-width="2.4" stroke-linecap="round" />
        </g>
      `;

    case 'youkai-mountain':
      // Reference: `PlacefRef/Youkaimountain-thumb.jpg` — Snow-crowned peak, mid-slope white mist & multi-color autumn foothills!
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <polygon points="-20,9 -5,-19 10,9" fill="#6e6559" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-6,9 7,-15 20,9" fill="#857a6b" stroke="#2b2620" stroke-width="1.4" />
          <!-- Snow-Crowned Summit Ridge -->
          <polygon points="-5,-19 -11,-7 1,-7" fill="#f7f4ec" />
          <polygon points="7,-15 3,-7 11,-7" fill="#f7f4ec" />
          <!-- Multi-Colored Autumn Foothill Foliage & Drifting Mid-Slope Mist -->
          <circle cx="-13" cy="5" r="4.2" fill="#cf3824" />
          <circle cx="-5" cy="6" r="4.5" fill="#e08824" />
          <circle cx="4" cy="6" r="4.2" fill="#487e36" />
          <circle cx="13" cy="5" r="4.2" fill="#d95824" />
          <path d="M -16 -1 Q -6 -4 4 -1 T 18 -1" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.85" />
        </g>
      `;

    case 'human-village':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-16" y="-4" width="29" height="14" fill="#efe2c6" stroke="#3b2818" stroke-width="1.4" />
          <polygon points="13,-4 18,-1 18,10 13,10" fill="#c7b28c" stroke="#3b2818" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M -21 -3.5 Q -1 -17.5 18 -3.5 L 21 -1.5 L -19 -1.5 Z" fill="#262930" stroke="#14161a" stroke-width="1.4" stroke-linejoin="round" />
          <line x1="-10" y1="-10.5" x2="9" y2="-10.5" stroke="#d9a74a" stroke-width="1.5" stroke-linecap="round" />
          <rect x="-5.5" y="0" width="9.5" height="10" rx="4.2" fill="#2b1b0f" />
          <circle cx="-0.5" cy="-14" r="2.8" fill="#4a6b5d" stroke="#243830" stroke-width="1" />
        </g>
      `;

    case 'myouren-temple':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10" rx="20" ry="4.8" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="10" y="-18" width="6.5" height="26" fill="#784e35" stroke="#24180e" stroke-width="1.1" />
          <polygon points="16.5,-18 19.5,-16 19.5,8 16.5,8" fill="#4f3220" stroke="#24180e" stroke-width="1.0" />
          <path d="M 7.5 -7.5 L 21.5 -7.5 M 8.5 -12.5 L 20.5 -12.5 M 9.5 -17.5 L 19.5 -17.5" stroke="#383e45" stroke-width="2.5" stroke-linecap="round" />
          <line x1="14" y1="-18" x2="14" y2="-24" stroke="#d9a74a" stroke-width="1.5" />
          <rect x="-17" y="-3" width="25" height="13" fill="#efe2c6" stroke="#2e2925" stroke-width="1.3" />
          <polygon points="8,-3 12,-0.5 12,10 8,10" fill="#c9b898" stroke="#2e2925" stroke-width="1.1" stroke-linejoin="round" />
          <path d="M -22 -2.5 Q -12 -14.5 -3 -16.5 Q 6 -14.5 15 -2.5 Z" fill="#454c54" stroke="#1f2226" stroke-width="1.45" stroke-linejoin="round" />
          <circle cx="-3" cy="-17" r="2.4" fill="#d9a74a" />
        </g>
      `;

    case 'hall-of-dreams':
    case 'mausoleum':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="18" ry="4.2" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-15" y="-2" width="27" height="11" fill="#f5ead2" stroke="#4a3219" stroke-width="1.3" />
          <polygon points="12,-2 16,0.5 16,9 12,9" fill="#d4c29e" stroke="#4a3219" stroke-width="1.1" />
          <path d="M -20 -1.5 Q -1 -14.5 19 -1.5 Z" fill="#c8963e" stroke="#4a3219" stroke-width="1.4" />
          <path d="M -14 -8 Q -0.5 -19 13 -8 Z" fill="#dab056" stroke="#4a3219" stroke-width="1.2" />
          <circle cx="-0.5" cy="-16.5" r="2.5" fill="#fff6c2" stroke="#4a3219" stroke-width="0.9" />
        </g>
      `;

    case 'kourindou':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="16" ry="3.8" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-13" y="-4" width="22" height="13" fill="#f0e4ce" stroke="#2b1a10" stroke-width="1.3" />
          <polygon points="9,-4 13,-1.5 13,9 9,9" fill="#c7b592" stroke="#2b1a10" stroke-width="1.1" />
          <line x1="-13" y1="2" x2="9" y2="2" stroke="#5c3824" stroke-width="1.3" />
          <polygon points="-17,-3.5 0,-16 15,-3.5" fill="#2e6b56" stroke="#16382c" stroke-width="1.4" />
          <rect x="-4" y="-11" width="8" height="6" fill="#6e4228" stroke="#1b2922" stroke-width="1" />
          <circle cx="0" cy="-8" r="2.2" fill="#ffe58f" />
        </g>
      `;

    case 'mugenkan':
    case 'garden-of-the-sun':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4.0" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-14" y="-5" width="26" height="13" fill="#9e382e" stroke="#2b1210" stroke-width="1.2" />
          <polygon points="-17,-4 0,-15 15,-4" fill="#323842" stroke="#181c22" stroke-width="1.3" />
          <circle cx="-11" cy="7" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
          <circle cx="0" cy="7.5" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
          <circle cx="11" cy="7" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
        </g>
      `;

    case 'mayohiga':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4.0" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-14" y="-3" width="26" height="11" fill="#f2e6ce" stroke="#2b1e14" stroke-width="1.2" />
          <polygon points="-18,-2 -12,-13 12,-13 18,-2" fill="#383442" stroke="#1a1820" stroke-width="1.3" />
          <circle cx="-13" cy="-8" r="4.0" fill="#d94828" />
          <circle cx="14" cy="-7" r="4.0" fill="#e88824" />
        </g>
      `;

    case 'mokous-house':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.28)" />
          <rect x="-9" y="-1" width="18" height="9" fill="#d8c8a8" stroke="#3b2818" stroke-width="1.1" />
          <polygon points="-13,0 0,-11 13,0" fill="#8c6e42" stroke="#3b2818" stroke-width="1.2" />
          <line x1="-11" y1="8" x2="-11" y2="-10" stroke="#2e6b3e" stroke-width="2.0" />
          <line x1="11" y1="8" x2="11" y2="-11" stroke="#2e6b3e" stroke-width="2.0" />
        </g>
      `;

    case 'three-fairies-tree':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1" cy="9.5" rx="14" ry="3.5" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-6" y="-4" width="12" height="13" rx="2" fill="#6e482c" stroke="#2b1a0e" stroke-width="1.2" />
          <circle cx="0" cy="2" r="2.8" fill="#ffdf88" stroke="#2b1a0e" stroke-width="0.8" />
          <circle cx="-7" cy="-9" r="7.5" fill="#467a38" stroke="#1e3c16" stroke-width="1.0" />
          <circle cx="7" cy="-9" r="7.5" fill="#467a38" stroke="#1e3c16" stroke-width="1.0" />
          <circle cx="0" cy="-13" r="8.5" fill="#589446" stroke="#1e3c16" stroke-width="1.1" />
        </g>
      `;

    case 'asama-purifying-mountain':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <polygon points="-16,8 -10,-2 10,-2 16,8" fill="#7a7468" stroke="#2b2824" stroke-width="1.2" />
          <polygon points="-11,-2 -6,-10 6,-10 11,-2" fill="#948e82" stroke="#2b2824" stroke-width="1.2" />
          <polygon points="-5,-10 0,-18 5,-10" fill="#e8b842" stroke="#4a3610" stroke-width="1.1" />
        </g>
      `;

    case 'shining-needle-castle':
      return `
        <g class="landmark-illust" transform="translate(0, -8)">
          <rect x="-13" y="-18" width="23" height="8" fill="#efe4ce" stroke="#2b1e16" stroke-width="1.2" />
          <polygon points="10,-18 14,-16 14,-10 10,-10" fill="#c9b898" stroke="#2b1e16" stroke-width="1.1" />
          <path d="M -18 -10 L 18 -10 L 13 -5 L -13 -5 Z" fill="#8f242c" stroke="#2b1e16" stroke-width="1.3" />
          <rect x="-9" y="-5" width="16" height="7" fill="#efe4ce" stroke="#2b1e16" stroke-width="1.2" />
          <polygon points="-13,2 13,2 0,13" fill="#6e1b22" stroke="#2b1e16" stroke-width="1.3" />
        </g>
      `;

    case 'hakugyokurou':
    case 'saigyou-ayakashi':
      return `
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1" cy="9.5" rx="14" ry="3.6" fill="rgba(22, 12, 6, 0.28)" />
          <path d="M -13 -6 C -15 -11, -10 -16, -5 -15 C -2 -20, 4 -20, 7 -15 C 12 -16, 15 -10, 12 -5 C 10 -2, -10 -2, -13 -6 Z" fill="#f5a6c4" stroke="#8a3858" stroke-width="1.1" />
          <path d="M -9 -9 C -10 -13, -5 -18, 0 -17 C 5 -18, 9 -13, 8 -9 C 5 -6, -5 -6, -9 -9 Z" fill="#ffd1e3" stroke="#8a3858" stroke-width="1.0" />
          <path d="M 0 9 L 0 -6 M 0 -2 L -6 -8 M 0 -3 L 6 -8" stroke="#4a2c21" stroke-width="2.4" stroke-linecap="round" />
        </g>
      `;

    case 'palace-of-earth-spirits':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="17" ry="4.2" fill="rgba(20, 8, 18, 0.36)" />
          <rect x="-14" y="-5" width="25" height="15" fill="#4f304e" stroke="#1a0e19" stroke-width="1.3" />
          <polygon points="11,-5 15,-2.5 15,10 11,10" fill="#331c32" stroke="#1a0e19" stroke-width="1.1" />
          <polygon points="-17,-4.5 -0.5,-18.5 16,-4.5" fill="#732242" stroke="#1a0e19" stroke-width="1.4" />
          <ellipse cx="-1" cy="1" rx="6" ry="3.8" fill="#ff4d73" stroke="#ffd6e0" stroke-width="1.1" />
          <circle cx="-1" cy="1" r="1.8" fill="#240812" />
        </g>
      `;

    case 'former-hell':
    case 'former-capital':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-14" y="-1" width="25" height="10" fill="#e6d4b5" stroke="#2b1c12" stroke-width="1.3" />
          <polygon points="11,-1 15,1.5 15,9 11,9" fill="#baa482" stroke="#2b1c12" stroke-width="1.1" />
          <polygon points="-18,-1 0,-11 18,-1" fill="#593e2e" stroke="#2b1c12" stroke-width="1.3" />
          <rect x="-9" y="-10" width="18" height="6" fill="#f0e0c4" stroke="#2b1c12" stroke-width="1.2" />
          <polygon points="-13,-10 0,-19 13,-10" fill="#473023" stroke="#2b1c12" stroke-width="1.3" />
          <circle cx="-7" cy="3" r="1.8" fill="#ffae42" />
          <circle cx="6" cy="3" r="1.8" fill="#ffae42" />
        </g>
      `;

    case 'nuclear-furnace':
    case 'remains-of-blazing-hell':
    case 'blazing-hell':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <polygon points="-11,9 -8,-11 8,-11 11,9" fill="#544946" stroke="#1f1715" stroke-width="1.4" />
          <line x1="-5" y1="-7" x2="-6" y2="6" stroke="#ff5e2b" stroke-width="1.6" />
          <line x1="0" y1="-7" x2="0" y2="6" stroke="#ff9d2b" stroke-width="1.6" />
          <line x1="5" y1="-7" x2="6" y2="6" stroke="#ff5e2b" stroke-width="1.6" />
          <path d="M -7 -11 Q -3 -20 0 -13 Q 4 -22 7 -11" fill="#ff4d24" stroke="#ffcf5c" stroke-width="1" />
        </g>
      `;

    case 'lunar-capital':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <rect x="-14" y="-2" width="25" height="10" fill="#f7f4ec" stroke="#364254" stroke-width="1.3" />
          <polygon points="11,-2 15,0.5 15,8 11,8" fill="#d5d0c5" stroke="#364254" stroke-width="1.1" />
          <path d="M -19 -2 Q 0 -14 19 -2 Z" fill="#587091" stroke="#283547" stroke-width="1.4" />
          <path d="M -12 -9 Q 0 -19 12 -9 Z" fill="#748eb0" stroke="#283547" stroke-width="1.2" />
          <circle cx="0" cy="-17" r="2.8" fill="#ffe885" />
        </g>
      `;

    case 'makai':
    case 'pandaemonium':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <polygon points="-12,8 -7,-9 0,-4 7,-9 12,8" fill="#5e3a78" stroke="#21112e" stroke-width="1.3" />
          <polygon points="-5,8 0,-18 5,8" fill="#8f5bb3" stroke="#21112e" stroke-width="1.3" />
          <circle cx="0" cy="-12" r="2" fill="#f0c4ff" />
        </g>
      `;

    case 'geidontei':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-10" y="-2" width="18" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <rect x="-7" y="-1" width="11" height="4.5" fill="#2c4a6f" stroke="#1b2d45" stroke-width="0.7" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#543d2c" stroke="#24170f" stroke-width="1.3" />
          <circle cx="6.5" cy="2.2" r="2.4" fill="#ff6b4a" stroke="#4a160b" stroke-width="0.8" />
        </g>
      `;

    case 'suzunaan':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-10" y="-2" width="18" height="10" fill="#f2e6cc" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#465448" stroke="#1e2920" stroke-width="1.3" />
          <rect x="-5" y="-6.5" width="9" height="3.5" rx="0.8" fill="#e8d2a6" stroke="#362417" stroke-width="0.8" />
        </g>
      `;

    case 'terakoya-school':
    case 'terakoya':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="14" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-11" y="-2" width="19" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-14,-1.5 -1,-11 12,-1.5" fill="#594230" stroke="#24170f" stroke-width="1.3" />
          <circle cx="-1" cy="-12" r="2.0" fill="#d9a74a" stroke="#362417" stroke-width="0.8" />
        </g>
      `;

    default:
      return '';
  }
}

/**
 * Renders a crisp inner category glyph inside the marker pin so every location has a thematic symbol
 */
function renderKindGlyph(kind: LocationKind, scale: number): string {
  const s = scale.toFixed(2);
  switch (kind) {
    case 'shrine':
      return `<path transform="scale(${s})" d="M -3.5 -2 L 3.5 -2 M -2.2 -2 L -2.2 3 M 2.2 -2 L 2.2 3" stroke="#fff8ec" stroke-width="1.3" stroke-linecap="round" />`;
    case 'temple':
      return `<polygon transform="scale(${s})" points="0,-3.5 3.5,0 0,3.5 -3.5,0" fill="#fff8ec" />`;
    case 'village':
      return `<rect transform="scale(${s})" x="-2.8" y="-2.8" width="5.6" height="5.6" fill="#fff8ec" />`;
    case 'mountain':
      return `<polygon transform="scale(${s})" points="-3.5,2.5 0,-3.2 3.5,2.5" fill="#fff8ec" />`;
    default:
      return `<circle cx="0" cy="0" r="${(2.6 * scale).toFixed(1)}" fill="#fff8ec" />`;
  }
}

export function renderMarkersLayer(
  markersGroup: SVGGElement,
  locations: LocationEntry[],
  selectedId: string | null,
  _zoomK: number,
  searchQuery: string,
  regionFilter: string,
  kindFilter: string
) {
  const q = searchQuery.trim().toLowerCase();
  let html = '';

  for (const loc of locations) {
    if (regionFilter !== 'All' && loc.region !== regionFilter) continue;
    if (kindFilter !== 'All' && loc.kind !== kindFilter) continue;

    const matchesSearch =
      !q ||
      loc.name_en.toLowerCase().includes(q) ||
      loc.name_jp.toLowerCase().includes(q) ||
      loc.residents.some((r) => r.toLowerCase().includes(q)) ||
      loc.short_desc.toLowerCase().includes(q);

    const isSelected = loc.id === selectedId;
    const x = loc.x * MAP_WIDTH;
    const y = loc.y * MAP_HEIGHT;
    const color = KIND_COLOR[loc.kind] ?? '#8a5a36';
    const opacity = matchesSearch ? 1 : 0.22;

    const r = loc.importance === 1 ? 8.8 : loc.importance === 2 ? 6.8 : 5.2;
    const customArt = renderCustomLandmarkArt(loc.id, loc.icon) || (loc.icon ? renderCustomLandmarkArt(loc.icon) : '');

    // Night-mode glowing lantern for inhabited places
    const hasLantern = ['shrine', 'temple', 'residence', 'village'].includes(loc.kind);
    const lanternSvg = hasLantern
      ? `<circle cx="0" cy="0" r="${r * 3.0}" fill="url(#lantern-radial)" class="night-only" />`
      : '';

    const selectedRing = isSelected
      ? `
        <circle cx="0" cy="0" r="${r + 10}" fill="none" stroke="#b6342a" stroke-width="2.6" class="marker-pulse-ring" />
        <circle cx="0" cy="0" r="${r + 5.5}" fill="none" stroke="#d9a74a" stroke-width="2.2" />
      `
      : '';

    const glyphScale = loc.importance === 1 ? 1.05 : loc.importance === 2 ? 0.85 : 0.7;

    html += `
      <g
        class="map-marker${isSelected ? ' is-selected' : ''}"
        data-id="${loc.id}"
        data-importance="${loc.importance}"
        transform="translate(${x.toFixed(1)}, ${y.toFixed(1)})"
        opacity="${opacity}"
      >
        <g class="marker-scale-wrap">
          <circle cx="0" cy="0" r="${(r + 8).toFixed(1)}" fill="transparent" />
          ${lanternSvg}
          ${selectedRing}
          ${customArt}
          <circle
            cx="0"
            cy="2.2"
            r="${(r + 1.0).toFixed(1)}"
            fill="rgba(26, 15, 8, 0.42)"
          />
          <circle
            cx="0"
            cy="0"
            r="${r}"
            fill="${color}"
            stroke="#fff8ec"
            stroke-width="${loc.importance === 1 ? 2.2 : 1.6}"
          />
          ${renderKindGlyph(loc.kind, glyphScale)}
        </g>
      </g>
    `;
  }

  markersGroup.innerHTML = html;
}
