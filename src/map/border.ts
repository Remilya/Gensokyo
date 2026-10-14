import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderBorderLayer(borderGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;

  // Great Hakurei Barrier ellipse enclosing the main surface basin of Gensokyo
  const bx = 0.548 * w;
  const by = 0.488 * h;
  const brx = 0.398 * w;
  const bry = 0.428 * h;

  // Western Hakurei Barrier discharge rift (image4.png glowing violet-white boundary seam)
  const seamPath = `M ${0.155 * w} ${0.16 * h} Q ${0.142 * w} ${0.28 * h} ${0.156 * w} ${0.39 * h} T ${0.148 * w} ${0.53 * h} T ${0.156 * w} ${0.66 * h}`;
  const seamArcA = `M ${0.155 * w} ${0.16 * h} L ${0.149 * w} ${0.22 * h} L ${0.158 * w} ${0.28 * h} L ${0.146 * w} ${0.35 * h} L ${0.157 * w} ${0.42 * h} L ${0.147 * w} ${0.49 * h} L ${0.155 * w} ${0.57 * h} L ${0.149 * w} ${0.63 * h} L ${0.156 * w} ${0.66 * h}`;

  borderGroup.innerHTML = `
    <!-- 1. Great Hakurei Barrier Shimmering Boundary Ring & Western Rift -->
    <g class="hakurei-barrier-ring" opacity="0.86" pointer-events="none">
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="url(#barrier-gradient)" stroke-width="10" opacity="0.28" />
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="#9e3b33" stroke-width="1.9" stroke-dasharray="16 6 3 6" />
      <!-- Glowing Western Barrier Rift (image4.png Homage) -->
      <path d="${seamPath}" fill="none" stroke="#9882e0" stroke-width="28" stroke-linecap="round" opacity="0.16" />
      <path d="${seamPath}" fill="none" stroke="#b8a8f0" stroke-width="14" stroke-linecap="round" opacity="0.32" />
      <path d="${seamPath}" fill="none" stroke="#dcd4ff" stroke-width="5.5" stroke-linecap="round" opacity="0.65" />
      <path d="${seamArcA}" fill="none" stroke="#ffffff" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />
    </g>

    <!-- 2. Outer Antique Atlas Frame & Double Key-Fret Rules -->
    <g class="atlas-outer-frame" pointer-events="none">
      <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="var(--border-ink)" stroke-width="5.5" />
      <rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="var(--border-gold)" stroke-width="2.6" stroke-dasharray="10 4 3 4" />
      <rect x="26" y="26" width="${w - 52}" height="${h - 52}" fill="none" stroke="var(--border-ink)" stroke-width="1.4" />

      <!-- Corner Key-Fret Medallions (Raimon / Armixi Atlas Homage) -->
      <g stroke="var(--border-ink)" stroke-width="2.2" fill="var(--paper-card)">
        <rect x="12" y="12" width="32" height="32" />
        <rect x="18" y="18" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="28" cy="28" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="${w - 44}" y="12" width="32" height="32" />
        <rect x="${w - 38}" y="18" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="${w - 28}" cy="28" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="12" y="${h - 44}" width="32" height="32" />
        <rect x="18" y="${h - 38}" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="28" cy="${h - 28}" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="${w - 44}" y="${h - 44}" width="32" height="32" />
        <rect x="${w - 38}" y="${h - 38}" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="${w - 28}" cy="${h - 28}" r="3.5" fill="var(--accent-hakurei)" stroke="none" />
      </g>
    </g>

    <!-- 3. Ornate Storybook Scroll Banner with Autumn Maple Leaves & Hanko Seal (image4.png Homage) -->
    <g class="atlas-title-scroll" transform="translate(${0.265 * w}, 74)" pointer-events="none">
      <!-- Ribbon Tails -->
      <path d="M -312 -12 L -352 -26 L -335 4 L -355 24 L -306 18 Z" fill="#cfb68a" stroke="var(--border-ink)" stroke-width="2.2" />
      <path d="M 312 -12 L 352 -26 L 335 4 L 355 24 L 306 18 Z" fill="#cfb68a" stroke="var(--border-ink)" stroke-width="2.2" />

      <!-- Autumn Maple Leaf Cluster on Left Scroll Curl (image4.png Signature Ornament) -->
      <g transform="translate(-318, 2)">
        <polygon points="0,0 -18,-18 -10,-6 -26,-8 -12,4 -22,16 -6,10 0,24 6,8 16,12 8,0 18,-10 4,-6" fill="#c94a29" stroke="#2a150d" stroke-width="1.3" />
        <polygon points="10,-8 0,-24 6,-12 -6,-16 2,-4 -4,6 8,2 14,14 16,2 26,4 18,-6 24,-16 14,-10" fill="#e08b2b" stroke="#2a150d" stroke-width="1.2" transform="translate(-8, 12) scale(0.82)" />
      </g>

      <!-- Vector Drop Shadow + Main Parchment Banner -->
      <path d="M -315 -22 Q 0 -36 315 -22 L 308 30 Q 0 18 -308 30 Z" fill="rgba(26, 15, 8, 0.36)" />
      <path d="M -315 -26 Q 0 -40 315 -26 L 308 25 Q 0 13 -308 25 Z" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="2.6" />
      <path d="M -307 -20 Q 0 -34 307 -20 L 301 19 Q 0 7 -301 19 Z" fill="none" stroke="var(--border-gold)" stroke-width="1.3" />

      <!-- Vermilion Hanko Stamp Seal on Right -->
      <g transform="translate(274, -2)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="rgba(182, 52, 42, 0.14)" stroke="#b6342a" stroke-width="1.8" />
        <text x="0" y="5" text-anchor="middle" font-family="var(--font-jp)" font-size="14" font-weight="700" fill="#b6342a">幻想</text>
      </g>

      <text x="-8" y="-3" text-anchor="middle" font-family="var(--font-display)" font-size="24.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="3.2">
        GENSOKYO — 幻想郷全図
      </text>
      <text x="-8" y="13.5" text-anchor="middle" font-family="var(--font-serif)" font-style="italic" font-size="13.8" fill="var(--ink-secondary)">
        1:1 Interactive Cartographic Atlas • From Highest Peak to Deepest Underworld
      </text>
    </g>

    <!-- 4. Hand-Crafted Compass Rose (Top-Right inside Canvas) -->
    <g class="atlas-compass-rose" transform="translate(${w - 115}, 115)" pointer-events="none">
      <circle cx="0" cy="0" r="48" fill="var(--paper-card)" fill-opacity="0.78" stroke="var(--border-ink)" stroke-width="1.8" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="var(--border-gold)" stroke-width="1.2" stroke-dasharray="4 3" />
      <polygon points="0,-34 6,-6 34,0 6,6 0,34 -6,6 -34,0 -6,-6" fill="var(--ink-secondary)" transform="rotate(45)" opacity="0.75" />
      <polygon points="0,-46 8.5,-8.5 46,0 8.5,8.5 0,46 -8.5,8.5 -46,0 -8.5,-8.5" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="0.9" />
      <polygon points="0,-46 8.5,-8.5 0,0" fill="var(--accent-hakurei)" />
      <circle cx="0" cy="0" r="5.5" fill="var(--border-gold)" stroke="var(--ink-primary)" stroke-width="1.3" />
      <text x="0" y="-52" text-anchor="middle" font-family="var(--font-display)" font-size="14.5" font-weight="700" fill="var(--accent-hakurei)">N</text>
      <text x="56" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12.5" fill="var(--ink-primary)">E</text>
      <text x="0" y="62" text-anchor="middle" font-family="var(--font-display)" font-size="12.5" fill="var(--ink-primary)">S</text>
      <text x="-56" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12.5" fill="var(--ink-primary)">W</text>
    </g>

    <!-- 5. Cartographic Scale Bar Cartouche (Bottom-Center-Left along Margin) -->
    <g class="atlas-scale-bar" transform="translate(${0.40 * w}, ${h - 54})" pointer-events="none" opacity="0.88">
      <rect x="-115" y="-16" width="230" height="30" rx="4" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="1.5" />
      <text x="0" y="-4" text-anchor="middle" font-family="var(--font-serif)" font-size="11" font-weight="700" fill="var(--ink-secondary)" letter-spacing="1">OVERLAND SCALE • 0 — 500 — 1000 — 2000 m</text>
      <g transform="translate(-90, 2)">
        <rect x="0" y="0" width="45" height="5" fill="var(--ink-primary)" stroke="var(--border-ink)" stroke-width="0.8" />
        <rect x="45" y="0" width="45" height="5" fill="var(--paper-bg)" stroke="var(--border-ink)" stroke-width="0.8" />
        <rect x="90" y="0" width="45" height="5" fill="var(--ink-primary)" stroke="var(--border-ink)" stroke-width="0.8" />
        <rect x="135" y="0" width="45" height="5" fill="var(--paper-bg)" stroke="var(--border-ink)" stroke-width="0.8" />
      </g>
    </g>
  `;
}
