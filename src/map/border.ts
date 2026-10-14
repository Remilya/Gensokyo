import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderBorderLayer(borderGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;
  const UI_CDN = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui';

  // Great Hakurei Barrier ellipse enclosing the main surface basin of Gensokyo
  const bx = 0.548 * w;
  const by = 0.488 * h;
  const brx = 0.398 * w;
  const bry = 0.428 * h;

  // Western Hakurei Barrier discharge rift
  const seamPath = `M ${0.155 * w} ${0.16 * h} Q ${0.142 * w} ${0.28 * h} ${0.156 * w} ${0.39 * h} T ${0.148 * w} ${0.53 * h} T ${0.156 * w} ${0.66 * h}`;

  borderGroup.innerHTML = `
    <!-- 1. Great Hakurei Barrier Shimmering Boundary Ring & Painted Western Arcane Rift -->
    <g class="hakurei-barrier-ring" opacity="0.92" pointer-events="none">
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="url(#barrier-gradient)" stroke-width="10" opacity="0.28" />
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="#9e3b33" stroke-width="1.9" stroke-dasharray="16 6 3 6" />
      <path d="${seamPath}" fill="none" stroke="#9882e0" stroke-width="24" stroke-linecap="round" opacity="0.18" />
      <image
        href="${UI_CDN}/barrier-rift-fx.webp"
        x="${(0.095 * w).toFixed(1)}"
        y="${(0.11 * h).toFixed(1)}"
        width="${(0.12 * w).toFixed(1)}"
        height="${(0.60 * h).toFixed(1)}"
        preserveAspectRatio="none"
        opacity="0.92"
      />
    </g>

    <!-- 2. Outer Antique Atlas Frame & Double Key-Fret Rules -->
    <g class="atlas-outer-frame" pointer-events="none">
      <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="var(--border-ink)" stroke-width="5.5" />
      <rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="var(--border-gold)" stroke-width="2.6" stroke-dasharray="10 4 3 4" />
      <rect x="26" y="26" width="${w - 52}" height="${h - 52}" fill="none" stroke="var(--border-ink)" stroke-width="1.4" />

      <!-- Corner Key-Fret Medallions -->
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

    <!-- 3. Hand-Painted Japanese Makimono Title Scroll Banner with Autumn Maple Leaves -->
    <g class="atlas-title-scroll" transform="translate(${0.27 * w}, 78)" pointer-events="none">
      <image
        href="${UI_CDN}/title-scroll-banner.webp"
        x="-380"
        y="-78"
        width="760"
        height="168"
        preserveAspectRatio="xMidYMid meet"
      />
      <!-- Vermilion Hanko Stamp Seal on Right of Scroll -->
      <g transform="translate(242, 4)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="rgba(182, 52, 42, 0.14)" stroke="#b6342a" stroke-width="1.8" />
        <text x="0" y="5" text-anchor="middle" font-family="var(--font-jp)" font-size="14" font-weight="700" fill="#b6342a">幻想</text>
      </g>

      <text x="8" y="-1" text-anchor="middle" font-family="var(--font-display)" font-size="24" font-weight="700" fill="#26170e" letter-spacing="3.2">
        GENSOKYO — 幻想郷全図
      </text>
      <text x="8" y="16" text-anchor="middle" font-family="var(--font-serif)" font-style="italic" font-size="13.8" font-weight="600" fill="#4a3322">
        1:1 Interactive Cartographic Atlas • From Highest Peak to Deepest Underworld
      </text>
    </g>

    <!-- 4. Ornate Japanese Edo Brass & Lacquer Astrolabe Compass Rose (Top-Right) -->
    <g class="atlas-compass-rose" transform="translate(${w - 118}, 122)" pointer-events="none">
      <image
        href="${UI_CDN}/compass-rose.webp"
        x="-64"
        y="-64"
        width="128"
        height="128"
      />
      <text x="0" y="-70" text-anchor="middle" font-family="var(--font-display)" font-size="15" font-weight="700" fill="var(--accent-hakurei)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">N</text>
      <text x="74" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="13" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">E</text>
      <text x="0" y="80" text-anchor="middle" font-family="var(--font-display)" font-size="13" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">S</text>
      <text x="-74" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="13" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">W</text>
    </g>

    <!-- 5. Cartographic Scale Bar Cartouche -->
    <g class="atlas-scale-bar" transform="translate(${0.40 * w}, ${h - 54})" pointer-events="none" opacity="0.90">
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
