import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderBorderLayer(borderGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;

  // Great Hakurei Barrier ellipse enclosing the main surface basin of Gensokyo
  const bx = 0.545 * w;
  const by = 0.485 * h;
  const brx = 0.395 * w;
  const bry = 0.425 * h;

  // Western Hakurei Barrier discharge seam (matching image4.png's glowing barrier rift on the left!)
  const seamPath = `M ${0.155 * w} ${0.22 * h} Q ${0.145 * w} ${0.38 * h} ${0.158 * w} ${0.52 * h} T ${0.152 * w} ${0.66 * h}`;

  borderGroup.innerHTML = `
    <!-- 1. Great Hakurei Barrier Shimmering Boundary Ring -->
    <g class="hakurei-barrier-ring" opacity="0.76">
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="url(#barrier-gradient)" stroke-width="8" opacity="0.32" />
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="#9e3b33" stroke-width="1.8" stroke-dasharray="14 6 3 6" />
      <!-- Glowing Western Barrier Seam (image4.png homage) -->
      <path d="${seamPath}" fill="none" stroke="#b8a8e8" stroke-width="16" stroke-linecap="round" opacity="0.18" />
      <path d="${seamPath}" fill="none" stroke="#b8a8e8" stroke-width="8" stroke-linecap="round" opacity="0.32" />
      <path d="${seamPath}" fill="none" stroke="#ece6ff" stroke-width="2.2" stroke-dasharray="8 3" opacity="0.85" />
    </g>

    <!-- 2. Outer Antique Atlas Frame & Double Rules -->
    <g class="atlas-outer-frame">
      <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="var(--border-ink)" stroke-width="4" />
      <rect x="22" y="22" width="${w - 44}" height="${h - 44}" fill="none" stroke="var(--border-gold)" stroke-width="1.8" />
      <rect x="27" y="27" width="${w - 54}" height="${h - 54}" fill="none" stroke="var(--border-ink)" stroke-width="1.2" />

      <!-- Corner Key-Fret Ornaments (Raimon / Armixi Atlas Homage) -->
      <g stroke="var(--border-ink)" stroke-width="2" fill="var(--paper-card)">
        <rect x="14" y="14" width="28" height="28" />
        <rect x="20" y="20" width="16" height="16" fill="none" stroke="var(--border-gold)" />
        <rect x="${w - 42}" y="14" width="28" height="28" />
        <rect x="${w - 36}" y="20" width="16" height="16" fill="none" stroke="var(--border-gold)" />
        <rect x="14" y="${h - 42}" width="28" height="28" />
        <rect x="20" y="${h - 36}" width="16" height="16" fill="none" stroke="var(--border-gold)" />
        <rect x="${w - 42}" y="${h - 42}" width="28" height="28" />
        <rect x="${w - 36}" y="${h - 36}" width="16" height="16" fill="none" stroke="var(--border-gold)" />
      </g>
    </g>

    <!-- 3. Ornate Top-Left / Top-Center Storybook Scroll Banner (image4.png Homage) -->
    <g class="atlas-title-scroll" transform="translate(${0.26 * w}, 72)">
      <!-- Ribbon Tails -->
      <path d="M -310 -12 L -345 -24 L -330 4 L -348 22 L -305 18 Z" fill="#d5c098" stroke="var(--border-ink)" stroke-width="2" />
      <path d="M 310 -12 L 345 -24 L 330 4 L 348 22 L 305 18 Z" fill="#d5c098" stroke="var(--border-ink)" stroke-width="2" />
      <!-- Vector Drop Shadow + Main Parchment Banner -->
      <path d="M -315 -22 Q 0 -34 315 -22 L 308 28 Q 0 16 -308 28 Z" fill="rgba(26, 15, 8, 0.34)" />
      <path d="M -315 -26 Q 0 -38 315 -26 L 308 24 Q 0 12 -308 24 Z" fill="var(--paper-card)" stroke="var(--border-ink)" stroke-width="2.5" />
      <path d="M -308 -20 Q 0 -32 308 -20 L 302 18 Q 0 6 -302 18 Z" fill="none" stroke="var(--border-gold)" stroke-width="1.2" />
      <text x="0" y="-3" text-anchor="middle" font-family="var(--font-display)" font-size="24" font-weight="700" fill="var(--ink-primary)" letter-spacing="3">
        GENSOKYO — 幻想郷全図
      </text>
      <text x="0" y="13" text-anchor="middle" font-family="var(--font-serif)" font-style="italic" font-size="13.5" fill="var(--ink-secondary)">
        1:1 Interactive Cartographic Atlas • From Highest Peak to Deepest Underworld
      </text>
    </g>

    <!-- 4. Hand-Crafted Compass Rose (Top-Right inside Canvas) -->
    <g class="atlas-compass-rose" transform="translate(${w - 115}, 115)">
      <circle cx="0" cy="0" r="46" fill="var(--paper-card)" fill-opacity="0.7" stroke="var(--border-ink)" stroke-width="1.5" />
      <circle cx="0" cy="0" r="38" fill="none" stroke="var(--border-gold)" stroke-width="1" stroke-dasharray="4 3" />
      <!-- Minor Points (NE, SE, SW, NW) -->
      <polygon points="0,-32 6,-6 32,0 6,6 0,32 -6,6 -32,0 -6,-6" fill="var(--ink-secondary)" transform="rotate(45)" opacity="0.7" />
      <!-- Major Points (N, E, S, W) -->
      <polygon points="0,-44 8,-8 44,0 8,8 0,44 -8,8 -44,0 -8,-8" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="0.8" />
      <polygon points="0,-44 8,-8 0,0" fill="var(--accent-hakurei)" />
      <circle cx="0" cy="0" r="5" fill="var(--border-gold)" stroke="var(--ink-primary)" stroke-width="1.2" />
      <text x="0" y="-50" text-anchor="middle" font-family="var(--font-display)" font-size="14" font-weight="700" fill="var(--accent-hakurei)">N</text>
      <text x="53" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" fill="var(--ink-primary)">E</text>
      <text x="0" y="60" text-anchor="middle" font-family="var(--font-display)" font-size="12" fill="var(--ink-primary)">S</text>
      <text x="-53" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" fill="var(--ink-primary)">W</text>
    </g>
  `;
}
