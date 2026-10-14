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
 * Renders 2.5D Three-Quarter Isometric Architectural Miniatures (Path B)
 * with sunlit front walls, shaded eastern side walls, overhanging curved roof eaves, and cast shadows.
 */
function renderCustomLandmarkArt(icon: string): string {
  switch (icon) {
    case 'hakurei-shrine':
      return `
        <g class="landmark-illust" transform="translate(0, -8)">
          <!-- 2.5D Cast Shadow -->
          <ellipse cx="1.5" cy="9.5" rx="19" ry="5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- 2.5D Honden Shrine Hall behind Torii (Front Wall + Shaded Side Wall + Curved Irimoya Roof) -->
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
          <!-- 2.5D Cast Shadow -->
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
    case 'human-village':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- 2.5D Gatehouse Front Wall & Shaded Side Wall -->
          <rect x="-16" y="-4" width="29" height="14" fill="#efe2c6" stroke="#3b2818" stroke-width="1.4" />
          <polygon points="13,-4 18,-1 18,10 13,10" fill="#c7b28c" stroke="#3b2818" stroke-width="1.2" stroke-linejoin="round" />
          <!-- Overhanging Curved Irimoya Tile Roof -->
          <path d="M -21 -3.5 Q -1 -17.5 18 -3.5 L 21 -1.5 L -19 -1.5 Z" fill="#473527" stroke="#24180e" stroke-width="1.4" stroke-linejoin="round" />
          <line x1="-10" y1="-10.5" x2="9" y2="-10.5" stroke="#d9a74a" stroke-width="1.5" stroke-linecap="round" />
          <!-- Arched Timber Gate Passage -->
          <rect x="-5.5" y="0" width="9.5" height="10" rx="4.2" fill="#2b1b0f" />
          <!-- Golden Dragon Finial -->
          <circle cx="-0.5" cy="-14" r="2.8" fill="#d9a74a" stroke="#3b2818" stroke-width="1" />
        </g>
      `;
    case 'myouren-temple':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10" rx="20" ry="4.8" fill="rgba(22, 12, 6, 0.32)" />
          <!-- 2.5D 3-Tier Buddhist Pagoda Spire on Right -->
          <rect x="10" y="-18" width="6.5" height="26" fill="#784e35" stroke="#24180e" stroke-width="1.1" />
          <polygon points="16.5,-18 19.5,-16 19.5,8 16.5,8" fill="#4f3220" stroke="#24180e" stroke-width="1.0" />
          <path d="M 7.5 -7.5 L 21.5 -7.5 M 8.5 -12.5 L 20.5 -12.5 M 9.5 -17.5 L 19.5 -17.5" stroke="#383e45" stroke-width="2.5" stroke-linecap="round" />
          <line x1="14" y1="-18" x2="14" y2="-24" stroke="#d9a74a" stroke-width="1.5" />
          <!-- 2.5D Main Hondo Temple Hall -->
          <rect x="-17" y="-3" width="25" height="13" fill="#efe2c6" stroke="#2e2925" stroke-width="1.3" />
          <polygon points="8,-3 12,-0.5 12,10 8,10" fill="#c9b898" stroke="#2e2925" stroke-width="1.1" stroke-linejoin="round" />
          <path d="M -22 -2.5 Q -12 -14.5 -3 -16.5 Q 6 -14.5 15 -2.5 Z" fill="#454c54" stroke="#1f2226" stroke-width="1.45" stroke-linejoin="round" />
          <circle cx="-3" cy="-17" r="2.4" fill="#d9a74a" />
        </g>
      `;
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
          <ellipse cx="1.5" cy="9.5" rx="15" ry="3.8" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-12" y="-4" width="21" height="13" fill="#966040" stroke="#2b1a10" stroke-width="1.3" />
          <polygon points="9,-4 13,-1.5 13,9 9,9" fill="#6b4128" stroke="#2b1a10" stroke-width="1.1" />
          <polygon points="-16,-3.5 0,-16 15,-3.5" fill="#364f42" stroke="#1b2922" stroke-width="1.4" />
          <rect x="-4" y="-11" width="8" height="6" fill="#6e4228" stroke="#1b2922" stroke-width="1" />
          <circle cx="0" cy="-8" r="2.2" fill="#ffe58f" />
        </g>
      `;
    case 'marisas-house':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="15" ry="3.8" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-11" y="-2" width="19" height="11" fill="#825a3e" stroke="#291a10" stroke-width="1.3" />
          <polygon points="8,-2 12,0.5 12,9 8,9" fill="#593c28" stroke="#291a10" stroke-width="1.1" />
          <path d="M -16 -1.5 L -0.5 -18.5 L 15 -1.5 Z" fill="#2b2233" stroke="#140f1a" stroke-width="1.4" />
          <path d="M -10 -4 L 9 -4" stroke="#f5e6c8" stroke-width="2.2" />
          <circle cx="-12" cy="7" r="3" fill="#9c41ab" stroke="#140f1a" stroke-width="0.8" />
          <circle cx="12" cy="7" r="2.6" fill="#d63855" stroke="#140f1a" stroke-width="0.8" />
        </g>
      `;
    case 'alices-house':
      return `
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="14" ry="3.6" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-10" y="-3" width="18" height="12" fill="#efe4ce" stroke="#3b281a" stroke-width="1.3" />
          <polygon points="8,-3 12,-0.5 12,9 8,9" fill="#cbb999" stroke="#3b281a" stroke-width="1.1" />
          <line x1="-10" y1="3" x2="8" y2="3" stroke="#5c3d28" stroke-width="1.2" />
          <polygon points="-13,-2.5 -0.5,-15.5 13,-2.5" fill="#3a5980" stroke="#1c2d42" stroke-width="1.3" />
          <rect x="-3.5" y="-1" width="6" height="6" fill="#ffe89e" stroke="#3b281a" stroke-width="0.9" />
        </g>
      `;
    case 'eientei':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="20" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-17" y="-2" width="31" height="11" fill="#efe2c6" stroke="#362517" stroke-width="1.3" />
          <polygon points="14,-2 18,0.5 18,9 14,9" fill="#c7b592" stroke="#362517" stroke-width="1.1" />
          <path d="M -22 -1.5 L -14 -12 L 13 -12 L 21 -1.5 Z" fill="#354d32" stroke="#1b2919" stroke-width="1.4" stroke-linejoin="round" />
          <circle cx="-0.5" cy="-15.5" r="4.4" fill="#fff099" stroke="#8c6d1f" stroke-width="1.0" />
        </g>
      `;
    case 'moriya-shrine':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Four Sacred Onbashira Pillars -->
          <line x1="-17" y1="-19" x2="-17" y2="10" stroke="#7d522b" stroke-width="3.2" stroke-linecap="round" />
          <line x1="17" y1="-19" x2="17" y2="10" stroke="#7d522b" stroke-width="3.2" stroke-linecap="round" />
          <line x1="-11" y1="-16" x2="-11" y2="8" stroke="#966538" stroke-width="2.4" stroke-linecap="round" />
          <line x1="11" y1="-16" x2="11" y2="8" stroke="#966538" stroke-width="2.4" stroke-linecap="round" />
          <!-- 2.5D Shrine Hall & Shimenawa -->
          <rect x="-11" y="-3" width="20" height="12" fill="#efe2c6" stroke="#2e241b" stroke-width="1.3" />
          <polygon points="9,-3 12.5,-0.5 12.5,9 9,9" fill="#c7b89c" stroke="#2e241b" stroke-width="1.1" />
          <polygon points="-15,-2.5 -0.5,-14.5 14,-2.5" fill="#296655" stroke="#14362c" stroke-width="1.4" />
          <path d="M -9.5 -2.5 Q -0.5 1.5 8.5 -2.5" fill="none" stroke="#d9b44a" stroke-width="1.8" />
        </g>
      `;
    case 'shining-needle-castle':
      return `
        <g class="landmark-illust" transform="translate(0, -8)">
          <!-- Inverted 2.5D Floating Japanese Keep -->
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
          <!-- Giant Weeping Cherry Tree (Saigyou Ayakashi) in Scalloped Pink Bloom -->
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
          <!-- Satori's Third-Eye Rose Window -->
          <ellipse cx="-1" cy="1" rx="6" ry="3.8" fill="#ff4d73" stroke="#ffd6e0" stroke-width="1.1" />
          <circle cx="-1" cy="1" r="1.8" fill="#240812" />
        </g>
      `;
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
    case 'heaven':
      return `
        <g class="landmark-illust" transform="translate(0, -6)">
          <path d="M -16 4 Q 0 13 16 4 Z" fill="#b8afa0" stroke="#4a4238" stroke-width="1.2" />
          <path d="M -19 4 Q -10 -1 0 3 Q 10 -1 19 4" fill="none" stroke="#fff9eb" stroke-width="3" stroke-linecap="round" />
          <polygon points="-9,2 0,-9 9,2" fill="#c94a6a" stroke="#4a1c28" stroke-width="1.2" />
        </g>
      `;
    case 'makai':
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
          <!-- 2.5D Izakaya Timber Front + Side Wall -->
          <rect x="-10" y="-2" width="18" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <!-- Indigo Noren Shop Curtain & Red Izakaya Paper Lantern -->
          <rect x="-7" y="-1" width="11" height="4.5" fill="#2c4a6f" stroke="#1b2d45" stroke-width="0.7" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#543d2c" stroke="#24170f" stroke-width="1.3" />
          <circle cx="6.5" cy="2.2" r="2.4" fill="#ff6b4a" stroke="#4a160b" stroke-width="0.8" />
        </g>
      `;
    case 'suzunaan':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <!-- 2.5D Bookshop Timber & Plaster Facade + Side Wall -->
          <rect x="-10" y="-2" width="18" height="10" fill="#f2e6cc" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#465448" stroke="#1e2920" stroke-width="1.3" />
          <!-- Overhead Suzunaan Book Signboard -->
          <rect x="-5" y="-6.5" width="9" height="3.5" rx="0.8" fill="#e8d2a6" stroke="#362417" stroke-width="0.8" />
        </g>
      `;
    case 'terakoya':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="14" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <!-- 2.5D Schoolhouse Hall + Roof Bell Belfry -->
          <rect x="-11" y="-2" width="19" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-14,-1.5 -1,-11 12,-1.5" fill="#594230" stroke="#24170f" stroke-width="1.3" />
          <circle cx="-1" cy="-12" r="2.0" fill="#d9a74a" stroke="#362417" stroke-width="0.8" />
        </g>
      `;
    case 'hieda':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="14" ry="3.4" fill="rgba(22, 12, 6, 0.30)" />
          <!-- 2.5D Aristocratic White-Plaster Manor & Slate Roof -->
          <rect x="-11" y="-2" width="19" height="10" fill="#f7f2e6" stroke="#2e2925" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#d6cbb8" stroke="#2e2925" stroke-width="1.0" />
          <polygon points="-14,-1.5 -1,-11.5 12,-1.5" fill="#464d54" stroke="#1e2226" stroke-width="1.3" />
          <line x1="-7" y1="-6.5" x2="5" y2="-6.5" stroke="#d9a74a" stroke-width="1.1" />
        </g>
      `;
    case 'youkai-mountain':
      return `
        <g class="landmark-illust" transform="translate(0, -4)">
          <polygon points="-18,8 -4,-16 10,8" fill="#6e6559" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-6,8 6,-13 18,8" fill="#857a6b" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-4,-16 -9,-6 1,-6" fill="#f5f2eb" />
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
    // Filter check
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
    const customArt = loc.icon ? renderCustomLandmarkArt(loc.icon) : '';

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
