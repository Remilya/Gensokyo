import { RESIDENT_PLACEMENTS, type ResidentPlacement } from '../data/resident-placements';
import { MAP_HEIGHT, MAP_WIDTH, store } from '../state';
import type { GensokyoRegion } from '../types';

const SPRITE_CACHE = new Map<string, string>();

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function shadeHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r * factor)},${clamp(g * factor)},${clamp(b * factor)})`;
}

/**
 * Generates a crisp 32x36 Dairi-Referenced Chibi Pixel-Art Data URL for a Touhou resident.
 * Each character's silhouette, outfit pattern, sleeves, headgear, wings/tails/back-aura,
 * and held prop are modeled directly after Dairi's canonical standing artwork in `gensokyo-assets/sprites`.
 */
export function getResidentPixelSpriteDataUrl(p: ResidentPlacement): string {
  const cached = SPRITE_CACHE.get(p.id);
  if (cached) return cached;

  const W = 32;
  const H = 36;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, W, H);

  const grid: (string | null)[][] = Array.from({ length: H }, () => Array(W).fill(null));

  const px = (x: number, y: number, color: string) => {
    const rx = p.flipX ? W - 1 - Math.round(x) : Math.round(x);
    const ry = Math.round(y);
    if (rx >= 0 && rx < W && ry >= 0 && ry < H) {
      grid[ry][rx] = color;
    }
  };

  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        px(x + dx, y + dy, color);
      }
    }
  };

  const hairDark = shadeHex(p.hairColor, 0.75);
  const hairLight = shadeHex(p.hairColor, 1.18);
  const outfitDark = shadeHex(p.outfitPrimary, 0.74);
  const skin = '#ffe4d0';
  const skinShadow = '#f0c4a8';
  const blush = '#ff92a6';
  const white = '#f8f6f4';

  // =========================================================================
  // 1. BACK AURAS, WINGS, NINE-TAILS, SHIMENAWA & CAPES (Behind body)
  // =========================================================================
  if (p.id === 'ran-yakumo') {
    // 9 fluffy golden-blonde fox tails fanning out behind Ran (`dairi_ref_sheet_2.png` [1,4])
    const tailGold = '#f6d862';
    const tailTip = '#fff8d4';
    const tailShade = '#d8a838';
    const tailCenters = [
      [4, 15], [3, 18], [4, 21], [6, 24],
      [16, 13],
      [27, 15], [28, 18], [27, 21], [25, 24],
    ];
    for (const [tx, ty] of tailCenters) {
      rect(tx - 2, ty - 1, 4, 3, tailGold);
      px(tx - 2, ty + 1, tailShade);
      px(tx < 16 ? tx - 2 : tx + 1, ty - 1, tailTip);
      px(tx < 16 ? tx - 3 : tx + 2, ty, tailTip);
    }
  } else if (p.id === 'kanako-yasaka') {
    // Giant braided straw shimenawa rope ring + 4 onbashira pillars + paper shide (`dairi_ref_sheet_1.png` [3,3])
    const rope = '#c89e58';
    const ropeDark = '#987238';
    const logCol = '#785030';
    for (let a = 0; a < 24; a++) {
      const ang = (a / 24) * Math.PI * 2;
      const rx = Math.round(16 + Math.cos(ang) * 10);
      const ry = Math.round(17 + Math.sin(ang) * 9);
      rect(rx - 1, ry - 1, 2, 2, a % 2 === 0 ? rope : ropeDark);
    }
    // 4 Onbashira corner logs
    rect(4, 15, 3, 4, logCol); rect(25, 15, 3, 4, logCol);
    rect(5, 22, 3, 4, logCol); rect(24, 22, 3, 4, logCol);
    // White shide zig-zags
    rect(7, 20, 2, 4, white); rect(23, 20, 2, 4, white);
  } else if (p.id === 'utsuho-reiuji') {
    // Cosmic blue starry-sky cape + huge black/red crow wings (`dairi_ref_sheet_2.png` [3,3])
    rect(7, 18, 18, 11, '#163868');
    rect(9, 19, 14, 9, '#1e5088');
    for (const [sx, sy] of [[9, 21], [12, 25], [19, 20], [22, 24], [15, 27], [10, 27]]) {
      px(sx, sy, '#98f0ff');
    }
    px(11, 22, white); px(20, 23, white);
    // Giant black/red crow wings
    rect(2, 14, 6, 8, '#1a1620'); rect(3, 14, 4, 2, '#981820');
    rect(24, 14, 6, 8, '#1a1620'); rect(25, 14, 4, 2, '#981820');
    px(1, 17, '#1a1620'); px(1, 19, '#1a1620');
    px(30, 17, '#1a1620'); px(30, 19, '#1a1620');
  } else if (p.id === 'toyosatomimi-no-miko') {
    // Billowing magenta & crimson royal cape (`dairi_ref_sheet_2.png` [4,2])
    rect(4, 15, 24, 9, '#c82878');
    rect(5, 16, 22, 7, '#e83858');
    rect(3, 18, 3, 5, '#d82878');
    rect(26, 18, 3, 5, '#d82878');
  } else if (p.id === 'junko') {
    // 7 glowing magenta/pink pure-fury energy tails (`dairi_ref_sheet_5.png` [3,1])
    for (const [tx, ty] of [[4, 14], [3, 19], [5, 24], [16, 11], [27, 14], [28, 19], [26, 24]]) {
      rect(tx - 1, ty - 2, 3, 5, '#d848a8');
      px(tx, ty - 1, '#ff98e8');
    }
  } else if (p.id === 'okina-matara') {
    // Glowing cyan portal frame behind Okina (`dairi_ref_sheet_5.png` [3,2])
    rect(6, 10, 20, 20, '#4878a8');
    rect(8, 12, 16, 16, '#1e2c38');
    for (let y = 13; y <= 26; y += 2) {
      px(26, y, '#68e8cf');
      px(28, y + 1, '#f4c858');
    }
  } else if (p.id === 'minamitsu-murasa') {
    // Colossal pink/iron ship anchor behind Murasa (`dairi_ref_sheet_4.png` [2,1])
    for (let i = 0; i < 16; i++) {
      rect(6 + i, 12 + Math.floor(i * 0.7), 3, 2, '#c898a8');
    }
    rect(4, 18, 5, 6, '#b88898');
    rect(22, 10, 5, 5, '#c898a8');
  } else if (p.id === 'nitori-kawashiro') {
    // Huge purple kappa backpack behind Nitori (`dairi_ref_sheet_1.png` [4,3])
    rect(18, 15, 9, 11, '#886498');
    rect(19, 16, 7, 9, '#9c78ac');
  } else if (p.id === 'mamizou-futatsuiwa') {
    // Giant striped brown tanuki tail (`dairi_ref_sheet_4.png` [1,3])
    rect(21, 18, 8, 9, '#9c6e4c');
    rect(22, 19, 6, 2, '#68442c');
    rect(22, 23, 6, 2, '#68442c');
  } else if (p.id === 'momiji-inubashiri') {
    // Fluffy white wolf tail (`dairi_ref_sheet_1.png` [4,2])
    rect(21, 20, 6, 6, white);
    rect(25, 22, 3, 4, '#e4e0dc');
  } else if (p.id === 'chen' || p.id === 'rin-kaenbyou') {
    // Twin curving brown/black cat tails + Orin's blue skull spirit flames
    const tailCol = p.id === 'rin-kaenbyou' ? '#58342c' : '#684434';
    for (let dy = 0; dy < 6; dy++) {
      px(22 + (dy >> 1), 22 - dy, tailCol);
      px(24 + (dy >> 1), 24 - dy, tailCol);
    }
    if (p.id === 'rin-kaenbyou') {
      // Blue spirit fireballs with white skull cores (`dairi_ref_sheet_2.png` [3,4])
      rect(2, 15, 4, 5, '#48a8ff'); rect(3, 17, 2, 2, white);
      rect(25, 12, 4, 5, '#48a8ff'); rect(26, 14, 2, 2, white);
    }
  } else if (p.id === 'shou-toramaru' || p.id === 'seiga-kaku' || p.id === 'iku-nagae') {
    // Billowing celestial hagoromo scarf looping around shoulders
    const scarfCol = p.id === 'iku-nagae' ? '#e82828' : white;
    const scarfTrim = p.id === 'iku-nagae' ? white : '#d8e4f8';
    rect(4, 12, 4, 12, scarfCol);
    rect(24, 12, 4, 12, scarfCol);
    rect(8, 10, 16, 3, scarfTrim);
  } else if (p.id === 'keiki-haniyasushin') {
    // Fiery orange clay dragon aura (`dairi_ref_sheet_5.png` [1,4])
    rect(3, 14, 4, 12, '#ff6828');
    rect(25, 13, 4, 13, '#ff6828');
    rect(5, 24, 22, 4, '#ff8838');
  } else if (p.id === 'ariya-iwanaga') {
    // Dark void wings with white eyes & orange fire (`dairi_ref_sheet_5.png` [1,1])
    rect(2, 15, 7, 12, '#1e2832');
    rect(23, 15, 7, 12, '#1e2832');
    px(5, 18, white); px(4, 22, white); px(26, 19, white); px(25, 23, white);
    rect(18, 10, 8, 6, '#ff5824');
  } else if (p.wings === 'bat') {
    const batCol = '#2a1836';
    const batMem = '#682c78';
    rect(3, 17, 6, 5, batMem);
    px(2, 16, batCol); px(3, 16, batCol); px(8, 17, batCol); px(2, 21, batCol); px(5, 21, batCol);
    rect(23, 17, 6, 5, batMem);
    px(29, 16, batCol); px(28, 16, batCol); px(23, 17, batCol); px(29, 21, batCol); px(26, 21, batCol);
  } else if (p.wings === 'flandre_crystal') {
    // Iconic 8-colored rainbow crystal wings on crooked black metal branches (`dairi_ref_sheet_1.png` [1,4])
    const branch = '#281e28';
    for (let dx = 2; dx <= 10; dx++) px(dx, 17 + (dx < 5 ? 1 : 0), branch);
    for (let dx = 21; dx <= 29; dx++) px(dx, 17 + (dx > 26 ? 1 : 0), branch);
    const crystals = [
      [2, 20, '#58b8ff'],
      [4, 19, '#ff3848'],
      [7, 19, '#ff9828'],
      [9, 20, '#f8e838'],
      [22, 20, '#48d868'],
      [24, 19, '#4868f8'],
      [27, 19, '#a848f8'],
      [29, 20, '#ff68c8'],
    ] as const;
    for (const [cx, cy, col] of crystals) {
      rect(cx, cy - 1, 2, 3, col);
      px(cx, cy, white);
    }
  } else if (p.wings === 'cirno_ice') {
    // 6 translucent cyan ice-shard wings (`dairi_ref_sheet_1.png` [2,4])
    const ice = '#80ecff';
    const iceCore = '#ecffff';
    for (const dy of [-3, 0, 3]) {
      rect(2, 18 + dy, 6, 2, ice);
      rect(4, 18 + dy, 3, 1, iceCore);
      rect(24, 18 + dy, 6, 2, ice);
      rect(25, 18 + dy, 3, 1, iceCore);
    }
    // Giant mint-green back hair bow visible behind Cirno's head
    rect(7, 7, 5, 4, '#58c888');
    rect(20, 7, 5, 4, '#58c888');
  } else if (p.wings === 'fairy') {
    const fw = '#eefaff';
    const fe = '#98dcf8';
    rect(3, 16, 6, 5, fw); rect(3, 21, 5, 3, fe);
    rect(23, 16, 6, 5, fw); rect(24, 21, 5, 3, fe);
  } else if (p.wings === 'crow') {
    const cw = p.id === 'mystia-lorelei' ? '#e898b8' : '#1e1c28';
    const ch = p.id === 'mystia-lorelei' ? '#fcf0f6' : '#443e58';
    rect(2, 16, 6, 6, cw); rect(3, 16, 4, 2, ch);
    rect(24, 16, 6, 6, cw); rect(25, 16, 4, 2, ch);
  } else if (p.wings === 'angel') {
    // Shinki's 6 purple/magenta demonic wings (`dairi_ref_sheet_5.png` [2,3])
    rect(2, 15, 7, 10, '#782898'); rect(4, 16, 4, 7, '#c858e8');
    rect(23, 15, 7, 10, '#782898'); rect(24, 16, 4, 7, '#c858e8');
  } else if (p.wings === 'myon') {
    // Large swirling white Myon phantom half (`dairi_ref_sheet_2.png` [1,2])
    rect(2, 16, 6, 6, white);
    rect(3, 15, 4, 8, '#f0fcf8');
    rect(25, 13, 3, 9, white);
  }

  // Yuyuko's floating pink/white ghostly wisps (`dairi_ref_sheet_2.png` [1,1])
  if (p.id === 'yuyuko-saigyouji') {
    rect(2, 14, 3, 8, '#fce4f0'); px(3, 15, white);
    rect(27, 15, 3, 8, '#fce4f0'); px(28, 16, white);
  }

  // =========================================================================
  // 2. BACK HAIR
  // =========================================================================
  if (p.hairStyle === 'long' || p.hairStyle === 'wavy') {
    const backLen = p.id === 'fujiwara-no-mokou' || p.id === 'kaguya-houraisan' || p.id === 'shinki' ? 14 : 11;
    rect(8, 13, 16, backLen, hairDark);
    if (p.id === 'byakuren-hijiri') {
      // Gradient hair: purple top fading to golden-blonde tips (`dairi_ref_sheet_2.png` [4,1])
      rect(7, 18, 18, 6, '#e8b868');
      rect(6, 20, 4, 4, '#f2ca78');
      rect(22, 20, 4, 4, '#f2ca78');
    } else {
      rect(7, 15, 2, backLen - 3, p.hairColor);
      rect(23, 15, 2, backLen - 3, p.hairColor);
    }
  } else if (p.hairStyle === 'twintails') {
    rect(5, 11, 4, 10, p.hairColor); rect(5, 18, 4, 3, hairDark);
    rect(23, 11, 4, 10, p.hairColor); rect(23, 18, 4, 3, hairDark);
  } else if (p.hairStyle === 'side_tail') {
    rect(23, 11, 4, 8, p.hairColor); px(25, 13, hairLight);
  } else if (p.hairStyle === 'ponytail') {
    rect(21, 9, 5, 8, hairDark);
  } else if (p.hairStyle === 'braid') {
    rect(6, 13, 3, 9, p.hairColor); rect(6, 21, 3, 2, white);
  }

  // =========================================================================
  // 3. LEGS, TROUSERS, MERMAID TAIL & SKIRT / OUTFIT SILHOUETTE
  // =========================================================================
  if (p.id === 'wakasagihime') {
    // Mermaid aquatic tail fin instead of legs (`dairi_ref_sheet_3.png` [1,3])
    rect(11, 24, 10, 4, '#a8dce8');
    rect(13, 28, 8, 3, '#98cce0');
    rect(15, 31, 9, 3, '#f4b8c8');
    rect(12, 32, 4, 2, '#f4b8c8');
    // Green kimono with purple obi & pink frills
    rect(9, 18, 14, 7, '#4c8858');
    rect(10, 21, 12, 2, '#783888');
    rect(9, 24, 14, 1, '#f4a8b8');
  } else if (p.id === 'fujiwara-no-mokou') {
    // White shirt + high-waisted baggy crimson suspender pants with white ofuda patches (`dairi_ref_sheet_2.png` [2,4])
    rect(10, 18, 12, 5, white);
    // Red suspenders + collar tie
    rect(12, 18, 1, 5, '#d8382c');
    rect(19, 18, 1, 5, '#d8382c');
    rect(15, 18, 2, 3, '#d8382c');
    // Baggy crimson trousers (left & right legs)
    rect(9, 22, 6, 10, '#d84434');
    rect(17, 22, 6, 10, '#d84434');
    rect(11, 22, 10, 3, '#d84434');
    // White geometric talisman patches on trousers
    rect(10, 25, 2, 2, white);
    rect(19, 26, 2, 2, white);
    rect(9, 31, 6, 1, white);
    rect(17, 31, 6, 1, white);
    // Red shoes
    rect(9, 32, 5, 2, '#c82828');
    rect(18, 32, 5, 2, '#c82828');
  } else if (p.id === 'rinnosuke-morichika') {
    // Half-black, half-blue haori & baggy blue hakama pants (`dairi_ref_sheet_3.png` [3,2])
    rect(10, 24, 5, 7, '#5868b8');
    rect(17, 24, 5, 7, '#5868b8');
    rect(10, 31, 4, 3, white);
    rect(18, 31, 4, 3, white);
    rect(9, 18, 7, 9, '#282830');
    rect(16, 18, 7, 9, '#4858a8');
    rect(13, 22, 6, 2, '#e86828'); // Orange waist pouch
  } else {
    // Standard Chibi Legs & Shoes (y = 29..33)
    const sockCol = p.id === 'eiki-shiki' || p.id === 'yuuka-kazami' ? '#242028' : white;
    const shoeCol =
      p.id === 'reimu-hakurei' || p.id === 'remilia-scarlet' || p.id === 'flandre-scarlet' || p.id === 'rumia' || p.id === 'medicine-melancholy'
        ? '#d82834'
        : p.id === 'koakuma' || p.id === 'tewi-inaba' || p.id === 'kosuzu-motoori'
          ? '#d88838'
          : '#28202c';
    rect(11, 29, 3, 3, sockCol);
    rect(18, 29, 3, 3, sockCol);
    rect(10, 32, 4, 2, shoeCol);
    rect(18, 32, 4, 2, shoeCol);
    if (p.id === 'utsuho-reiuji') {
      // Okuu's heavy grey concrete nuclear containment foot on right leg!
      rect(10, 29, 4, 5, '#888480');
    }

    // Character-Specific Skirt & Dress Lower Body (y = 22..28)
    if (p.id === 'eirin-yagokoro') {
      // Split half-crimson (left) / half-royal-blue (right) dress (`dairi_ref_sheet_2.png` [2,2])
      rect(8, 22, 8, 6, '#283888');
      rect(16, 22, 8, 6, '#d42c3c');
      rect(8, 28, 16, 1, white);
      rect(10, 18, 6, 5, '#d42c3c');
      rect(16, 18, 6, 5, '#283888');
    } else if (p.id === 'tenshi-hinanawi') {
      // Blue skirt with 7-color rainbow apron + white ruffle (`dairi_ref_sheet_1.png` [4,4])
      rect(8, 22, 16, 6, '#2858b8');
      const rainbow = ['#ff3848', '#ff9828', '#f8e838', '#48d868', '#4898ff', '#a858f8'];
      for (let i = 0; i < 6; i++) {
        rect(10 + i * 2, 22, 2, 4, rainbow[i]);
      }
      rect(8, 28, 16, 1, white);
    } else if (p.id === 'cirno') {
      // Blue dress with jagged white icicle hem (`dairi_ref_sheet_1.png` [2,4])
      rect(8, 22, 16, 5, '#2868d8');
      for (let x = 8; x <= 23; x++) {
        rect(x, x % 2 === 0 ? 26 : 27, 1, x % 2 === 0 ? 3 : 2, white);
      }
    } else if (p.id === 'momiji-inubashiri') {
      // Black skirt with bold red maple-flame hem (`dairi_ref_sheet_1.png` [4,2])
      rect(8, 22, 16, 5, '#1e1c24');
      for (let x = 8; x <= 23; x++) {
        rect(x, x % 2 === 0 ? 26 : 27, 1, 2, '#d82828');
      }
      rect(8, 28, 16, 1, white);
    } else if (p.id === 'marisa-kirisame' || p.id === 'sakuya-izayoi' || p.id === 'kosuzu-motoori' || p.id === 'miyoi-okunoda') {
      // Skirt with prominent front apron (`dairi_ref_sheet_1.png` [1,2], [2,1])
      const skirtCol =
        p.id === 'marisa-kirisame' ? '#2c2224' : p.id === 'sakuya-izayoi' ? '#243a88' : p.id === 'kosuzu-motoori' ? '#687838' : '#f4a8b8';
      const apronCol = p.id === 'kosuzu-motoori' ? '#f4c868' : p.id === 'miyoi-okunoda' ? '#1e6898' : white;
      rect(8, 22, 16, 6, skirtCol);
      rect(8, 28, 16, 1, white);
      rect(10, 22, 12, 5, apronCol);
      if (p.id === 'miyoi-okunoda') {
        rect(12, 25, 8, 2, white); // Whale belly wave on apron
      }
    } else if (p.id === 'yukari-yakumo' || p.id === 'ran-yakumo' || p.id === 'kasen-ibaraki' || p.id === 'okina-matara') {
      // Dress with vertical center Taoist/sage tabard
      const baseSkirt = p.id === 'kasen-ibaraki' ? '#888c28' : p.id === 'okina-matara' ? '#285828' : p.outfitPrimary;
      const tabardCol = p.id === 'ran-yakumo' ? '#283888' : p.id === 'kasen-ibaraki' ? '#d82828' : p.id === 'okina-matara' ? '#e88828' : white;
      rect(8, 22, 16, 6, baseSkirt);
      rect(12, 20, 8, 8, tabardCol);
      rect(13, 21, 6, 6, white);
      rect(14, 22, 4, 4, tabardCol);
    } else if (p.id === 'yuugi-hoshiguma') {
      // Pleated blue-and-red striped maxi skirt (`dairi_ref_sheet_5.png` [2,1])
      for (let x = 8; x <= 23; x++) {
        rect(x, 22, 1, 7, x % 2 === 0 ? '#2c4898' : '#d82838');
      }
    } else if (p.id === 'medicine-melancholy') {
      // Rounded crimson bell skirt with black cross motifs (`dairi_ref_sheet_4.png` [3,4])
      rect(7, 22, 18, 6, '#d82c28');
      rect(10, 24, 3, 1, '#201c24'); rect(11, 23, 1, 3, '#201c24');
      rect(19, 24, 3, 1, '#201c24'); rect(20, 23, 1, 3, '#201c24');
    } else if (p.id === 'suwako-moriya') {
      // Purple dress with green frog decals (`dairi_ref_sheet_1.png` [3,4])
      rect(8, 22, 16, 6, '#6844a8');
      rect(11, 25, 2, 2, '#58d868');
      rect(18, 26, 2, 2, '#58d868');
    } else if (p.id === 'byakuren-hijiri') {
      // Split black outer robe over white/pink center dress (`dairi_ref_sheet_2.png` [4,1])
      rect(8, 22, 16, 7, '#201c24');
      rect(11, 21, 10, 8, '#fceef4');
    } else {
      // Default flared skirt with shading & frill hem
      rect(8, 22, 16, 6, p.outfitPrimary);
      for (let y = 22; y <= 27; y++) {
        px(8, y, outfitDark);
        px(23, y, outfitDark);
      }
      for (let x = 8; x <= 23; x++) {
        px(x, 28, x % 2 === 0 ? p.outfitSecondary : p.outfitPrimary);
      }
    }

    // Torso, Sleeves & Collar (y = 17..22)
    if (p.id === 'reimu-hakurei' || p.id === 'sanae-kochiya') {
      // Miko top with bare shoulders & wide detached billowy sleeves (`dairi_ref_sheet_1.png` [1,1], [3,2])
      rect(10, 17, 12, 5, p.outfitPrimary);
      rect(12, 18, 8, 4, p.id === 'reimu-hakurei' ? p.outfitPrimary : white);
      // Yellow bow for Reimu, blue tie for Sanae
      rect(14, 18, 4, 2, p.id === 'reimu-hakurei' ? '#f4d048' : '#3878d8');
      // Bare shoulders + wide detached white miko sleeves
      px(8, 17, skin); px(23, 17, skin);
      rect(5, 18, 4, 5, white);
      rect(23, 18, 4, 5, white);
      rect(5, 19, 4, 1, p.outfitPrimary);
      rect(23, 19, 4, 1, p.outfitPrimary);
    } else if (p.id === 'yuugi-hoshiguma') {
      // Plain white short-sleeve T-shirt (`dairi_ref_sheet_5.png` [2,1])
      rect(10, 17, 12, 5, white);
      rect(7, 17, 3, 3, white);
      rect(22, 17, 3, 3, white);
      rect(6, 20, 2, 2, skin);
      rect(24, 20, 2, 2, skin);
    } else if (p.id === 'koishi-komeiji') {
      // Mustard-yellow long-sleeve blouse with green collar (`dairi_ref_sheet_2.png` [3,2])
      rect(10, 17, 12, 5, '#f2b844');
      rect(6, 18, 4, 4, '#f2b844');
      rect(22, 18, 4, 4, '#f2b844');
      rect(13, 17, 6, 2, '#488858');
    } else if (p.id === 'satori-komeiji') {
      // Pale-blue blouse with pink collar & glowing red Third Eye with looping cords (`dairi_ref_sheet_2.png` [3,1])
      rect(10, 17, 12, 5, '#b8d4f4');
      rect(7, 18, 3, 4, '#b8d4f4');
      rect(22, 18, 3, 4, '#b8d4f4');
      rect(13, 17, 6, 2, '#f498b8');
    } else if (p.id === 'utsuho-reiuji') {
      // White blouse with big glowing red diamond solar-eye on chest (`dairi_ref_sheet_2.png` [3,3])
      rect(10, 17, 12, 5, white);
      rect(7, 17, 3, 4, white);
      rect(22, 17, 3, 4, white);
      rect(14, 18, 4, 4, '#ff2020');
      rect(15, 19, 2, 2, '#ff9838');
    } else if (p.id === 'kanako-yasaka') {
      // Bright red blouse with round silver/black Yata Mirror on chest (`dairi_ref_sheet_1.png` [3,3])
      rect(10, 17, 12, 5, '#d82834');
      rect(7, 17, 3, 4, '#d82834');
      rect(22, 17, 3, 4, '#d82834');
      rect(13, 18, 6, 4, white);
      rect(14, 19, 4, 2, '#202028');
    } else if (p.id === 'eiki-shiki') {
      // Blue Yama uniform with gold shoulder epaulets over white sleeves (`dairi_ref_sheet_2.png` [4,3])
      rect(10, 17, 12, 5, '#284498');
      rect(8, 17, 3, 2, '#f4d048');
      rect(21, 17, 3, 2, '#f4d048');
      rect(7, 19, 3, 3, white);
      rect(22, 19, 3, 3, white);
      rect(14, 17, 4, 2, '#d82838');
    } else if (p.id === 'kosuzu-motoori') {
      // Red-and-white checkered haori sleeves (`dairi_ref_sheet_3.png` [4,1])
      rect(10, 17, 12, 5, '#f4c868');
      for (let sy = 17; sy <= 21; sy++) {
        for (let sx of [6, 7, 8, 9, 22, 23, 24, 25]) {
          px(sx, sy, (sx + sy) % 2 === 0 ? '#d8382c' : white);
        }
      }
    } else if (p.id !== 'eirin-yagokoro') {
      rect(10, 17, 12, 5, p.outfitPrimary);
      rect(13, 18, 6, 4, p.outfitSecondary);
      rect(14, 17, 4, 2, p.accentColor);
      rect(7, 17, 3, 4, p.outfitSecondary);
      rect(22, 17, 3, 4, p.outfitSecondary);
      px(7, 21, skin);
      px(24, 21, skin);
    }
  }

  // Satori & Koishi Third Eye + looping cords in front of torso
  if (p.wings === 'satori_eye') {
    const cord = p.id === 'koishi-komeiji' ? '#8858b8' : '#e82848';
    const eyeCol = p.id === 'koishi-komeiji' ? '#9868c8' : '#ff2848';
    for (let x = 6; x <= 25; x += 2) {
      px(x, 20, cord);
      px(x, 24, cord);
    }
    rect(14, 19, 4, 3, eyeCol);
    px(15, 20, white); px(16, 20, '#201824');
  }

  // =========================================================================
  // 4. CHIBI HEAD, EXPRESSIVE ANIME EYES, BLUSH & FRONT HAIR (y = 7..16)
  // =========================================================================
  // Hair crown base
  rect(9, 7, 14, 7, p.hairColor);
  rect(8, 9, 16, 6, p.hairColor);
  for (let x = 10; x <= 21; x += 2) {
    px(x, 8, hairLight);
  }

  // Face skin (y = 10..16)
  rect(10, 10, 12, 7, skin);
  rect(9, 11, 14, 5, skin);
  rect(11, 16, 10, 1, skinShadow);

  // Side locks framing face
  rect(8, 10, 2, 7, p.hairColor);
  rect(22, 10, 2, 7, p.hairColor);
  px(8, 16, hairDark);
  px(23, 16, hairDark);

  if (p.id === 'reimu-hakurei') {
    // Reimu's signature white & red hair-tubes (ontama) framing her cheeks
    rect(7, 12, 2, 4, white);
    rect(23, 12, 2, 4, white);
    px(7, 12, '#d82834'); px(24, 12, '#d82834');
  } else if (p.id === 'sakuya-izayoi') {
    // Sakuya's twin front side-braids with green ribbons at the tips
    rect(8, 12, 2, 6, p.hairColor);
    rect(22, 12, 2, 6, p.hairColor);
    rect(8, 17, 2, 1, '#36a868');
    rect(22, 17, 2, 1, '#36a868');
  } else if (p.id === 'sanae-kochiya') {
    // Sanae's coiled white snake hair ornament on her side lock
    rect(22, 12, 2, 5, white);
    px(22, 14, '#58c878');
  }

  // Front bangs
  rect(10, 10, 12, 1, p.hairColor);
  px(11, 11, p.hairColor);
  px(14, 11, p.hairColor);
  px(16, 11, p.hairColor);
  px(18, 11, p.hairColor);
  px(20, 11, p.hairColor);

  // Expressive 2x3 Chibi Anime Eyes with white specular shine
  const leftEyeCol = p.eyeColor;
  const rightEyeCol = p.id === 'kogasa-tatara' ? '#2878d8' : p.eyeColor; // Kogasa's heterochromia!
  rect(10, 12, 2, 3, leftEyeCol);
  px(10, 12, white);
  px(11, 14, shadeHex(leftEyeCol, 1.25));

  rect(20, 12, 2, 3, rightEyeCol);
  px(20, 12, white);
  px(21, 14, shadeHex(rightEyeCol, 1.25));

  // Cute rosy cheeks
  rect(9, 14, 1, 1, blush);
  rect(22, 14, 1, 1, blush);

  // =========================================================================
  // 5. SIGNATURE HEADGEAR, HATS, EARS & HORNS (y = 1..8)
  // =========================================================================
  switch (p.headgear) {
    case 'reimu_bow': {
      // Giant crimson bow (`dairi_ref_sheet_1.png` [1,1], `dairi_ref_sheet_2.png` [2,4])
      rect(5, 4, 7, 5, '#d8242e');
      rect(20, 4, 7, 5, '#d8242e');
      rect(13, 5, 6, 3, '#f43842');
      rect(4, 5, 1, 3, white);
      rect(27, 5, 1, 3, white);
      break;
    }
    case 'witch_hat': {
      // Marisa's huge black witch hat with enormous white front bow (`dairi_ref_sheet_1.png` [1,2])
      rect(4, 6, 24, 3, '#1e1c26');
      rect(8, 4, 16, 2, '#282434');
      rect(11, 2, 10, 2, '#1e1c26');
      rect(14, 1, 6, 1, '#1e1c26');
      // Giant white bow across the front brim
      rect(9, 4, 12, 3, white);
      rect(13, 5, 4, 2, '#e8e4dc');
      break;
    }
    case 'mob_cap': {
      // Puffy mob cap with crimson/accent ribbon (`dairi_ref_sheet_1.png` [1,3], [1,4])
      rect(7, 4, 18, 4, '#fcf4f8');
      rect(9, 3, 14, 1, '#fcf4f8');
      rect(9, 5, 14, 2, p.accentColor);
      if (p.id === 'remilia-scarlet') {
        // Remilia's wide red ribbon wings on top of cap
        rect(6, 3, 4, 2, '#d82438');
        rect(22, 3, 4, 2, '#d82438');
      }
      break;
    }
    case 'yukari_cap': {
      rect(7, 4, 18, 4, '#fcf6fc');
      rect(9, 3, 14, 1, '#fcf6fc');
      rect(8, 5, 16, 1, '#d8283c');
      break;
    }
    case 'ran_cap': {
      // Wide two-peaked white fox-ear cap (`dairi_ref_sheet_2.png` [1,4])
      rect(5, 3, 6, 5, '#f8f6fc');
      rect(21, 3, 6, 5, '#f8f6fc');
      rect(8, 4, 16, 4, '#f8f6fc');
      rect(6, 5, 2, 2, '#d83838');
      rect(24, 5, 2, 2, '#d83838');
      break;
    }
    case 'chen_cap': {
      // Green mob cap with brown cat ears poking out (`dairi_ref_sheet_4.png` [4,1])
      rect(8, 4, 16, 3, '#2c7848');
      rect(6, 3, 3, 3, '#684434');
      rect(23, 3, 3, 3, '#684434');
      px(6, 4, '#ffd848'); // Gold earring on left cat ear
      break;
    }
    case 'maid_band': {
      rect(9, 5, 14, 2, white);
      rect(7, 6, 2, 2, '#36a868');
      rect(23, 6, 2, 2, '#36a868');
      break;
    }
    case 'meiling_beret': {
      const beretCol = p.id === 'minamitsu-murasa' ? white : '#887828';
      rect(8, 4, 16, 3, beretCol);
      rect(10, 3, 12, 1, beretCol);
      rect(15, 5, 2, 2, '#ffd848');
      break;
    }
    case 'patchouli_cap': {
      if (p.id === 'eirin-yagokoro') {
        // Half-blue, half-red nurse cap
        rect(8, 4, 8, 3, '#d42c3c');
        rect(16, 4, 8, 3, '#283888');
      } else if (p.id === 'iku-nagae') {
        // Wide black hat with red ribbons (`dairi_ref_sheet_5.png` [1,2])
        rect(5, 5, 22, 2, '#1e1c24');
        rect(9, 3, 14, 2, '#1e1c24');
        rect(10, 4, 12, 1, '#e82828');
      } else if (p.id === 'keiki-haniyasushin') {
        // Green/yellow sculptor bandana (`dairi_ref_sheet_5.png` [1,4])
        rect(8, 4, 16, 3, '#288868');
        rect(9, 6, 14, 1, '#f4c848');
      } else {
        // Patchouli's puffy lavender cap with gold crescent moon (`dairi_ref_sheet_1.png` [2,2])
        rect(7, 3, 18, 4, '#e8d0f0');
        rect(9, 2, 14, 1, '#e8d0f0');
        rect(19, 4, 3, 2, '#ffd848');
      }
      break;
    }
    case 'yuyuko_veil': {
      // Light-blue cap + white triangular hitaikakushi ghost headband (`dairi_ref_sheet_2.png` [1,1])
      rect(7, 4, 18, 3, '#88c8f4');
      rect(12, 3, 8, 4, white);
      rect(15, 4, 2, 2, '#e83858');
      break;
    }
    case 'tengu_tokin': {
      if (p.id === 'mystia-lorelei') {
        // Purple beret cap (`dairi_ref_sheet_4.png` [1,2])
        rect(8, 4, 16, 3, '#683878');
      } else {
        // Tiny red tengu tokin box hat on forehead (`dairi_ref_sheet_1.png` [4,1])
        rect(13, 3, 6, 4, '#d82834');
        rect(10, 5, 3, 1, '#d82834');
        rect(19, 5, 3, 1, '#d82834');
      }
      break;
    }
    case 'kappa_cap': {
      if (p.id === 'miyoi-okunoda') {
        // Giant teal whale hat (`dairi_ref_sheet_3.png` [4,4])
        rect(6, 3, 20, 5, '#288898');
        rect(9, 2, 14, 2, '#288898');
        px(9, 5, white); px(22, 5, white); // Whale eyes
      } else {
        // Nitori's lime-green kappa cap (`dairi_ref_sheet_1.png` [4,3])
        rect(7, 4, 18, 3, '#98b848');
        rect(9, 3, 14, 1, '#a8c858');
        rect(6, 6, 20, 1, '#789838');
      }
      break;
    }
    case 'suwako_hat': {
      if (p.id === 'sanae-kochiya') {
        // Green frog hairclip on bangs (`dairi_ref_sheet_1.png` [3,2])
        rect(19, 6, 4, 3, '#58d878');
        px(19, 6, '#181820'); px(22, 6, '#181820');
      } else {
        // Suwako's wide tan straw hat with two popping googly frog eyes (`dairi_ref_sheet_1.png` [3,4])
        rect(4, 6, 24, 2, '#d8b878');
        rect(8, 4, 16, 2, '#e4c888');
        rect(10, 2, 3, 3, white); px(11, 3, '#181820');
        rect(19, 2, 3, 3, white); px(20, 3, '#181820');
      }
      break;
    }
    case 'miko_earmuffs': {
      // Miko's twin horned blonde hair tufts + purple/gold earmuffs (`dairi_ref_sheet_2.png` [4,2])
      rect(7, 2, 4, 5, p.hairColor);
      rect(21, 2, 4, 5, p.hairColor);
      rect(7, 10, 2, 4, '#f2ca48');
      rect(23, 10, 2, 4, '#f2ca48');
      break;
    }
    case 'futo_eboshi': {
      // Tall blue-and-white striped court eboshi (`dairi_ref_sheet_4.png` [2,4])
      rect(11, 1, 10, 6, '#3858a8');
      rect(11, 3, 10, 1, white);
      rect(11, 5, 10, 1, white);
      break;
    }
    case 'eiki_yama': {
      // Stepped navy & gold Yama crown (`dairi_ref_sheet_2.png` [4,3])
      rect(7, 2, 18, 5, '#1e2c58');
      rect(5, 5, 22, 2, '#e8c448');
      rect(13, 3, 6, 3, '#ffd848');
      break;
    }
    case 'tenshi_hat': {
      // Black wide-brimmed bowler hat with golden peaches (`dairi_ref_sheet_1.png` [4,4])
      rect(5, 5, 22, 2, '#282430');
      rect(9, 3, 14, 2, '#34303e');
      rect(19, 4, 3, 2, '#ff8898');
      rect(17, 4, 2, 2, '#58c868');
      break;
    }
    case 'koishi_hat': {
      // Black dome bowler hat with big yellow bow (`dairi_ref_sheet_2.png` [3,2])
      rect(5, 5, 22, 2, '#24222c');
      rect(9, 3, 14, 2, '#2e2c38');
      rect(7, 3, 5, 3, '#f4b838');
      break;
    }
    case 'okuu_ribbon': {
      // Green hair bow (`dairi_ref_sheet_2.png` [3,3])
      rect(10, 4, 12, 3, '#58b868');
      break;
    }
    case 'satori_band': {
      rect(9, 5, 14, 2, '#242028');
      break;
    }
    case 'oni_horns': {
      if (p.id === 'yuugi-hoshiguma') {
        // Single glowing red horn on forehead (`dairi_ref_sheet_5.png` [2,1])
        rect(15, 2, 2, 5, '#ff2828');
        px(15, 6, '#ffd848');
      } else if (p.id === 'yuuma-toutetsu') {
        // Curved red/black ram horns with blue bows (`dairi_ref_sheet_5.png` [1,3])
        rect(5, 3, 5, 4, '#b82428');
        rect(22, 3, 5, 4, '#b82428');
        rect(4, 5, 3, 3, '#68a8f8');
        rect(25, 5, 3, 3, '#68a8f8');
      } else {
        // Suika's long curved tan horns (`dairi_ref_sheet_3.png` [2,1]) or Seija's horns
        const hCol = p.id === 'seija-kijin' ? white : '#e8c888';
        rect(6, 2, 3, 5, hCol);
        rect(23, 2, 3, 5, hCol);
        if (p.id === 'suika-ibuki') {
          rect(22, 2, 3, 2, '#3858d8'); // Blue bow on Suika's horn
        }
      }
      break;
    }
    case 'bunny_ears': {
      const earOut = p.id === 'tewi-inaba' ? white : '#f6d8e8';
      const earIn = '#ff98b8';
      rect(8, 1, 4, 6, earOut); rect(9, 2, 2, 4, earIn);
      rect(20, 1, 4, 6, earOut); rect(21, 2, 2, 4, earIn);
      break;
    }
    case 'wolf_ears': {
      if (p.id === 'mamizou-futatsuiwa') {
        // Giant green lotus-leaf hat with frog eyes (`dairi_ref_sheet_4.png` [1,3])
        rect(6, 3, 20, 4, '#388828');
        rect(12, 2, 2, 2, '#d8c868');
        rect(18, 2, 2, 2, '#d8c868');
      } else {
        const earCol = p.id === 'nazrin' ? '#7c7884' : white;
        rect(7, 3, 4, 4, earCol); px(8, 5, '#ff98a8');
        rect(21, 3, 4, 4, earCol); px(22, 5, '#ff98a8');
        if (p.id === 'momiji-inubashiri') {
          rect(14, 3, 4, 3, '#d82834'); // Momiji's red tokin between wolf ears
        }
      }
      break;
    }
    case 'cat_ears': {
      rect(7, 3, 4, 4, '#242028');
      rect(21, 3, 4, 4, '#242028');
      rect(5, 5, 3, 2, '#d82834');
      rect(24, 5, 3, 2, '#d82834');
      break;
    }
    case 'crown': {
      if (p.id === 'keine-kamishirasawa') {
        // Blue scholar box hat with red plume (`dairi_ref_sheet_3.png` [4,3])
        rect(10, 3, 12, 4, '#384888');
        rect(14, 1, 6, 2, '#e83838');
      } else if (p.id === 'junko') {
        // Black & gold Chinese court hat (`dairi_ref_sheet_5.png` [3,1])
        rect(8, 3, 16, 4, '#242028');
        rect(10, 4, 12, 1, '#f4c848');
      } else {
        rect(10, 3, 12, 4, '#f4d048');
        px(15, 5, '#e82838');
      }
      break;
    }
    case 'shinmy_bowl': {
      // Inverted red & gold lacquer bowl (`dairi_ref_sheet_3.png` [2,2])
      rect(5, 3, 22, 4, '#781820');
      rect(8, 2, 16, 2, '#b82838');
      rect(7, 6, 18, 1, '#f4b838');
      break;
    }
    case 'narumi_kasa': {
      // Wide speckled stone Jizo kasa hat (`dairi_ref_sheet_3.png` [3,3])
      rect(3, 4, 26, 3, '#d8d4c8');
      rect(7, 2, 18, 2, '#e8e4dc');
      break;
    }
    case 'ribbon': {
      if (p.id === 'kasen-ibaraki') {
        // Twin pink hair-bun covers (`dairi_ref_sheet_4.png` [4,3])
        rect(6, 4, 4, 4, '#fce4ec');
        rect(22, 4, 4, 4, '#fce4ec');
      } else {
        rect(18, 4, 6, 3, p.accentColor);
      }
      break;
    }
    default:
      if (p.id === 'byakuren-hijiri') {
        // Wide tan bamboo kasa hat (`dairi_ref_sheet_2.png` [4,1])
        rect(4, 4, 24, 3, '#e8b868');
        rect(8, 2, 16, 2, '#f2ca78');
      }
      break;
  }

  // =========================================================================
  // 6. HELD PROPS, WEAPONS, DOLLS & SIGNATURE ITEMS
  // =========================================================================
  if (p.id === 'alice-margatroid') {
    // Floating blonde Shanghai doll beside Alice (`dairi_ref_sheet_1.png` [3,1])
    rect(24, 10, 5, 4, '#f6d868'); // Doll head
    rect(25, 9, 3, 1, '#d82838'); // Doll red bow
    rect(24, 14, 5, 4, '#242028'); // Doll black dress
    rect(25, 15, 3, 2, white); // Doll apron
  } else if (p.id === 'sekibanki') {
    // Floating detached Sekibanki head (`dairi_ref_sheet_4.png` [1,1])
    rect(2, 8, 6, 6, '#e84858');
    rect(3, 10, 4, 3, skin);
    rect(2, 6, 6, 2, '#9898e8');
  } else if (p.id === 'suika-ibuki') {
    // Suika's big yellow sphere + pink pyramid + blue cube (`dairi_ref_sheet_3.png` [2,1])
    rect(4, 22, 6, 6, '#f4c848');
    rect(24, 25, 4, 4, '#f46888');
  } else if (p.id === 'eirin-yagokoro') {
    // Eirin's giant bow & arrow (`dairi_ref_sheet_2.png` [2,2])
    for (let y = 7; y <= 27; y++) px(27, y, '#282028');
    for (let x = 18; x <= 29; x++) px(x, 18, white);
  } else if (p.id === 'kogasa-tatara') {
    // Giant purple one-eyed karakasa umbrella with sticking-out red tongue (`dairi_ref_sheet_4.png` [2,3])
    rect(8, 2, 18, 4, '#783898');
    rect(16, 3, 3, 2, white); px(17, 3, '#2858c8'); // Single eye
    rect(23, 5, 5, 7, '#e82828'); // Big red tongue!
  }

  switch (p.prop) {
    case 'gungnir': {
      for (let y = 5; y <= 30; y++) rect(26, y, 2, 1, '#ff2848');
      rect(24, 7, 6, 2, '#ff7898');
      rect(26, 3, 2, 3, white);
      break;
    }
    case 'laevateinn': {
      for (let y = 6; y <= 30; y++) rect(26, y, 2, 1, '#ff3828');
      rect(24, 12, 6, 2, '#ffd848');
      rect(24, 16, 6, 2, '#ffd848');
      break;
    }
    case 'gohei': {
      for (let y = 12; y <= 30; y++) px(26, y, '#8c5834');
      rect(24, 8, 5, 6, white);
      rect(23, 10, 7, 2, white);
      break;
    }
    case 'broom': {
      for (let y = 7; y <= 24; y++) rect(26, y, 2, 1, '#c89838');
      rect(23, 24, 7, 7, '#e8c458');
      rect(24, 24, 5, 1, '#c82834');
      break;
    }
    case 'katana':
    case 'shield_sword': {
      for (let y = 8; y <= 25; y++) rect(26, y, 2, 1, p.id === 'tenshi-hinanawi' ? '#ffd848' : '#dce4f0');
      rect(24, 25, 5, 1, '#e8c448');
      if (p.id === 'momiji-inubashiri') {
        // White buckler shield with red maple leaf in front!
        rect(11, 19, 8, 7, white);
        rect(13, 21, 4, 4, '#d82828');
      }
      break;
    }
    case 'parasol': {
      for (let y = 5; y <= 25; y++) px(25, y, '#683848');
      rect(14, 1, 16, 5, p.id === 'yukari-yakumo' ? '#fce8f4' : '#f498b8');
      rect(14, 5, 16, 1, '#e83858');
      break;
    }
    case 'control_rod': {
      // Okuu's hexagonal orange nuclear control cannon (`dairi_ref_sheet_2.png` [3,3])
      rect(5, 18, 5, 9, '#f49838');
      rect(6, 19, 3, 7, '#ffb858');
      break;
    }
    case 'scythe': {
      for (let y = 5; y <= 31; y++) px(27, y, '#784830');
      rect(18, 4, 10, 3, '#cfd8e8');
      break;
    }
    case 'spoon': {
      // Yuuma's giant silver spork dripping black oil (`dairi_ref_sheet_5.png` [1,3])
      for (let i = 0; i < 18; i++) rect(6 + i, 22 - Math.floor(i * 0.6), 2, 2, '#b8c4d8');
      rect(2, 20, 6, 5, '#201c24');
      break;
    }
    case 'fan': {
      rect(23, 16, 6, 5, p.accentColor);
      rect(24, 17, 4, 3, white);
      break;
    }
    case 'book':
    case 'scroll': {
      rect(22, 17, 6, 5, p.accentColor);
      rect(23, 18, 4, 3, '#f8f4e8');
      break;
    }
    case 'gourd': {
      if (p.id === 'yuugi-hoshiguma') {
        // Wide red sake dish (`dairi_ref_sheet_5.png` [2,1])
        rect(4, 16, 6, 2, '#e82828');
      } else {
        rect(24, 19, 5, 6, '#e8a848');
        rect(25, 18, 3, 1, '#c82828');
      }
      break;
    }
    default:
      break;
  }

  // =========================================================================
  // 7. RENDER BUFFER WITH CRISP 1PX DARK PIXEL OUTLINE
  // =========================================================================
  const outlineCol = '#1b121c';
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (grid[y][x] !== null) continue;
      const hasNeighbor =
        (y > 0 && grid[y - 1][x] !== null) ||
        (y < H - 1 && grid[y + 1][x] !== null) ||
        (x > 0 && grid[y][x - 1] !== null) ||
        (x < W - 1 && grid[y][x + 1] !== null);
      if (hasNeighbor) {
        ctx.fillStyle = outlineCol;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const col = grid[y][x];
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const url = canvas.toDataURL('image/png');
  SPRITE_CACHE.set(p.id, url);
  return url;
}

/**
 * Renders the 2D Pixel-Art Resident layer onto the SVG map.
 */
export function renderResidentsLayer(
  group: SVGGElement,
  activeCharId: string | null,
  searchQuery: string,
  regionFilter: GensokyoRegion | 'All'
) {
  const q = searchQuery.trim().toLowerCase();

  const html = RESIDENT_PLACEMENTS.map((p, idx) => {
    if (regionFilter !== 'All' && p.region !== regionFilter) {
      return '';
    }
    const ch = store.getCharacter(p.id);
    const matchesSearch =
      !q ||
      p.shortName.toLowerCase().includes(q) ||
      p.spotLabel.toLowerCase().includes(q) ||
      (ch &&
        (ch.name_en.toLowerCase().includes(q) ||
          ch.name_jp.toLowerCase().includes(q) ||
          ch.title.toLowerCase().includes(q)));

    const cx = (p.x * MAP_WIDTH).toFixed(1);
    const cy = (p.y * MAP_HEIGHT).toFixed(1);
    const spriteUrl = getResidentPixelSpriteDataUrl(p);
    const isSelected = activeCharId === p.id;
    const dimClass = q && !matchesSearch ? 'is-dimmed' : '';
    const selClass = isSelected ? 'is-selected' : '';
    const delay = ((idx * 0.17) % 1.8).toFixed(2);

    return `
      <g
        class="map-resident ${selClass} ${dimClass}"
        data-char-id="${p.id}"
        data-loc-id="${p.locationId}"
        transform="translate(${cx}, ${cy})"
      >
        <g class="resident-scale-wrap">
          <ellipse class="resident-shadow" cx="0" cy="2" rx="9.5" ry="3.8" />
          ${
            isSelected
              ? `<circle class="resident-select-ring" cx="0" cy="-11" r="17" stroke="${p.accentColor}" />`
              : ''
          }
          <g class="resident-bob-wrap" style="animation-delay: -${delay}s;">
            <image
              class="resident-pixel-img"
              href="${spriteUrl}"
              x="-16"
              y="-33"
              width="32"
              height="36"
            />
          </g>
          <g class="resident-tag-group" transform="translate(0, 8)">
            <rect
              class="resident-tag-bg"
              x="-24"
              y="-5"
              width="48"
              height="10.5"
              rx="3"
              stroke="${p.accentColor}"
            />
            <text class="resident-tag-text" x="0" y="2.4" text-anchor="middle">${p.shortName}</text>
          </g>
        </g>
      </g>
    `;
  }).join('');

  group.innerHTML = html;
}
