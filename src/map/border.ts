import { MAP_HEIGHT, MAP_WIDTH } from '../state';

export function renderBorderLayer(borderGroup: SVGGElement) {
  const w = MAP_WIDTH;
  const h = MAP_HEIGHT;
  const UI_CDN = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui';

  // Great Hakurei Barrier ellipse enclosing the main surface basin of Gensokyo
  const bx = 0.555 * w;
  const by = 0.492 * h;
  const brx = 0.392 * w;
  const bry = 0.422 * h;

  borderGroup.innerHTML = `
    <!-- 1. Great Hakurei Barrier Cartographic Boundary Ring -->
    <g class="hakurei-barrier-ring" opacity="0.68" pointer-events="none">
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="url(#barrier-gradient)" stroke-width="6" opacity="0.22" />
      <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="none" stroke="#8f322a" stroke-width="1.6" stroke-dasharray="14 6 3 6" />
    </g>

    <!-- 2. Outer Antique Atlas Frame & Double Key-Fret Rules -->
    <g class="atlas-outer-frame" pointer-events="none">
      <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="var(--border-ink)" stroke-width="5.5" />
      <rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="var(--border-gold)" stroke-width="2.4" stroke-dasharray="10 4 3 4" />
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

    <!-- 3. Hand-Painted Japanese Makimono Title Scroll Banner (Fitted cleanly inside the open parchment area) -->
    <g class="atlas-title-scroll" transform="translate(${0.485 * w}, 82)" pointer-events="none">
      <image
        href="${UI_CDN}/title-scroll-banner.webp"
        x="-340"
        y="-70"
        width="680"
        height="150"
        preserveAspectRatio="xMidYMid meet"
      />
      <!-- Text shifted +26px right to sit squarely inside the blank parchment between the left maple leaves and right roller -->
      <text
        x="26"
        y="-2"
        text-anchor="middle"
        font-family="var(--font-display)"
        font-size="19"
        font-weight="700"
        fill="#22130b"
        stroke="#f7ebd2"
        stroke-width="3"
        paint-order="stroke"
        letter-spacing="1.6"
      >
        GENSOKYO — 幻想郷全図
      </text>
      <text
        x="26"
        y="15"
        text-anchor="middle"
        font-family="var(--font-serif)"
        font-style="italic"
        font-size="12"
        font-weight="700"
        fill="#3d2718"
        stroke="#f7ebd2"
        stroke-width="2.5"
        paint-order="stroke"
      >
        1:1 Interactive Cartographic Atlas • From Highest Peak to Deepest Underworld
      </text>
    </g>

    <!-- 4. Ornate Japanese Edo Brass & Lacquer Astrolabe Compass Rose (Placed in open eastern margin, clear of Lunar Capital) -->
    <g class="atlas-compass-rose" transform="translate(${0.935 * w}, ${0.605 * h})" pointer-events="none">
      <image
        href="${UI_CDN}/compass-rose.webp"
        x="-56"
        y="-56"
        width="112"
        height="112"
      />
      <text x="0" y="-62" text-anchor="middle" font-family="var(--font-display)" font-size="14" font-weight="700" fill="var(--accent-hakurei)" stroke="var(--paper-bg)" stroke-width="3.2" paint-order="stroke">N</text>
      <text x="66" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">E</text>
      <text x="0" y="72" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">S</text>
      <text x="-66" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">W</text>
    </g>
  `;
}
