/**
 * Fetches Dairi's canonical standing character sprites from Safebooru (`pool:26125` / `dairi`),
 * selects the base/default standing expression (`_p0` / `alphes_(style)` / `tachi-e`),
 * converts each PNG into a lightweight transparent WebP via `ffmpeg`,
 * saves them into `../gensokyo-assets/sprites/<id>.webp` for jsDelivr CDN hosting,
 * and updates `data/characters.json` with `sprite_url`.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const charsPath = path.join(rootDir, 'data', 'characters.json');
const assetsRepoDir = path.resolve(rootDir, '..', 'gensokyo-assets');
const spritesDir = path.join(assetsRepoDir, 'sprites');

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/sprites';
const UA = 'GensokyoAtlas/1.0 (https://remilya.dev/Gensokyo)';

const SPECIAL_TAG_MAP = {
  'reisen-imperishable-night': ['reisen_(touhou_bougetsushou)'],
  'reisen-udongein-inaba': ['reisen_udongein_inaba'],
  'eiki-shiki': ['shiki_eiki'],
  'rin-kaenbyou': ['kaenbyou_rin'],
  'fujiwara-no-mokou': ['fujiwara_no_mokou'],
  'hieda-no-akyuu': ['hieda_no_akyuu'],
  'mononobe-no-futo': ['mononobe_no_futo'],
  'toyosatomimi-no-miko': ['toyosatomimi_no_miko'],
  'soga-no-tojiko': ['soga_no_tojiko'],
  'hata-no-kokoro': ['hata_no_kokoro'],
  'watatsuki-no-toyohime': ['watatsuki_no_toyohime'],
  'watatsuki-no-yorihime': ['watatsuki_no_yorihime'],
  'hong-meiling': ['hong_meiling'],
  'remilia-scarlet': ['remilia_scarlet'],
  'flandre-scarlet': ['flandre_scarlet'],
  'alice-margatroid': ['alice_margatroid'],
  'patchouli-knowledge': ['patchouli_knowledge'],
  'maribel-hearn': ['maribel_hearn'],
  'doremy-sweet': ['doremy_sweet'],
  'hecatia-lapislazuli': ['hecatia_lapislazuli'],
  'eternity-larva': ['eternity_larva'],
  'lily-white': ['lily_white'],
  'luna-child': ['luna_child'],
  'sunny-milk': ['sunny_milk'],
  'star-sapphire': ['star_sapphire'],
  'merlin-prismriver': ['merlin_prismriver'],
  'lunasa-prismriver': ['lunasa_prismriver'],
  'lyrica-prismriver': ['lyrica_prismriver'],
  'medicine-melancholy': ['medicine_melancholy'],
  'son-biten': ['son_biten'],
  'mai-PC-98': ['mai_(touhou)'],
  'mai': ['mai_(touhou)'],
  'yuki': ['yuki_(touhou)'],
  'kurumi': ['kurumi_(touhou)'],
  'elly': ['elly_(touhou)'],
  'louise': ['louise_(touhou)'],
  'sariel': ['sariel_(touhou)'],
  'shinki': ['shinki_(touhou)'],
  'mugetsu': ['mugetsu_(touhou)'],
  'gengetsu': ['gengetsu_(touhou)'],
  'mima': ['mima_(touhou)'],
  'kana-anaberal': ['kana_anaberal'],
  'ruukoto': ['ruukoto'],
  'tokiko': ['tokiko_(touhou)'],
  'joon-yorigami': ["yorigami_jo'on"],
};

function getCandidateTags(char) {
  if (SPECIAL_TAG_MAP[char.id]) {
    return SPECIAL_TAG_MAP[char.id];
  }
  const clean = char.name_en
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return [parts[0], `${parts[0]}_(touhou)`];
  }
  if (parts.length === 2) {
    // Try Japanese order (last_first) then Western order (first_last)
    return [`${parts[1]}_${parts[0]}`, `${parts[0]}_${parts[1]}`];
  }
  return [parts.join('_')];
}

function scorePost(p) {
  if (!p.file_url || p.file_ext !== 'png') return -9999;
  const g = ' ' + (p.tag_string_general || '') + ' ';
  if (
    g.includes(' chibi ') ||
    g.includes(' 2girls ') ||
    g.includes(' 3girls ') ||
    g.includes(' multiple_girls ') ||
    g.includes(' 2boys ') ||
    g.includes(' defeat ') ||
    g.includes(' beaten ') ||
    g.includes(' torn_clothes ') ||
    g.includes(' silhouette ')
  ) {
    return -9999;
  }

  let score = 0;
  const src = p.source || '';
  if (/_p0\./.test(src)) score += 65;
  else if (/_p1\./.test(src)) score += 45;
  else if (/_p[23]\./.test(src)) score += 25;

  if (g.includes(' alphes_(style) ')) score += 55;
  if (g.includes(' tachi-e ')) score += 25;
  if (g.includes(' transparent_background ')) score += 25;
  if (g.includes(' full_body ')) score += 15;
  if (
    !g.includes(' alternate_costume ') &&
    !g.includes(' pajamas ') &&
    !g.includes(' swimsuit ') &&
    !g.includes(' modern_clothes ') &&
    !g.includes(' santa_costume ') &&
    !g.includes(' maid_bikini ')
  ) {
    score += 40;
  }
  if (g.includes(' smile ') || g.includes(' closed_mouth ')) score += 15;
  if (
    g.includes(' crying ') ||
    g.includes(' tears ') ||
    g.includes(' angry ') ||
    g.includes(' shaded_face ') ||
    g.includes(' crazy_smile ') ||
    g.includes(' sweatdrop ') ||
    g.includes(' embarrassed ')
  ) {
    score -= 35;
  }
  return score;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function findBestSpriteForCharacter(char) {
  const candidateTags = getCandidateTags(char);

  // 1. Try pool:26125 + tag
  for (const tag of candidateTags) {
    const posts = await fetchJson(
      `https://safebooru.donmai.us/posts.json?tags=pool%3A26125+${encodeURIComponent(tag)}&limit=200`
    );
    if (posts.length === 0) continue;

    // If exactly 200 posts and no _p0 with alphes_(style) yet, also check page 2
    let all = [...posts];
    const hasTopScore = all.some((p) => scorePost(p) >= 180);
    if (posts.length === 200 && !hasTopScore) {
      const page2 = await fetchJson(
        `https://safebooru.donmai.us/posts.json?tags=pool%3A26125+${encodeURIComponent(tag)}&limit=200&page=2`
      );
      all.push(...page2);
    }

    all.sort((a, b) => scorePost(b) - scorePost(a));
    if (all[0] && scorePost(all[0]) > -1000) {
      return { post: all[0], tag };
    }
  }

  // 2. Fallback: dairi + tag (for newer characters not yet added to pool:26125)
  for (const tag of candidateTags) {
    const posts = await fetchJson(
      `https://safebooru.donmai.us/posts.json?tags=dairi+${encodeURIComponent(tag)}&limit=100`
    );
    if (posts.length === 0) continue;
    posts.sort((a, b) => scorePost(b) - scorePost(a));
    if (posts[0] && scorePost(posts[0]) > -1000) {
      return { post: posts[0], tag };
    }
  }

  // 3. Fallback: tag + tachi-e (for brand-new Touhou 20 characters)
  for (const tag of candidateTags) {
    const posts = await fetchJson(
      `https://safebooru.donmai.us/posts.json?tags=${encodeURIComponent(tag)}+transparent_background&limit=50`
    );
    if (posts.length === 0) continue;
    posts.sort((a, b) => scorePost(b) - scorePost(a));
    if (posts[0] && scorePost(posts[0]) > -1000) {
      return { post: posts[0], tag };
    }
  }

  return null;
}

async function downloadAndConvertToWebp(fileUrl, outWebpPath) {
  const tmpPng = path.join(
    os.tmpdir(),
    `dairi_${Date.now()}_${Math.random().toString(36).slice(2)}.png`
  );
  try {
    const res = await fetch(fileUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${fileUrl}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(tmpPng, buf);

    execFileSync('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-i',
      tmpPng,
      '-vf',
      'scale=520:-1',
      '-c:v',
      'libwebp',
      '-lossless',
      '0',
      '-q:v',
      '82',
      '-compression_level',
      '6',
      outWebpPath,
    ]);
  } finally {
    if (fs.existsSync(tmpPng)) {
      fs.unlinkSync(tmpPng);
    }
  }
}

async function main() {
  fs.mkdirSync(spritesDir, { recursive: true });
  const chars = JSON.parse(fs.readFileSync(charsPath, 'utf-8'));

  console.log(`Processing Dairi standing sprites for ${chars.length} characters...`);

  const manifest = {};
  let completed = 0;
  let matchedCount = 0;
  const missing = [];

  // Process with concurrency of 6
  const concurrency = 6;
  let idx = 0;

  async function worker() {
    while (idx < chars.length) {
      const curIdx = idx++;
      const char = chars[curIdx];
      const outWebp = path.join(spritesDir, `${char.id}.webp`);

      try {
        if (fs.existsSync(outWebp) && fs.statSync(outWebp).size > 1000) {
          char.sprite_url = `${CDN_BASE}/${char.id}.webp`;
          matchedCount++;
          completed++;
          continue;
        }

        const found = await findBestSpriteForCharacter(char);
        if (!found) {
          missing.push(char.name_en);
          completed++;
          continue;
        }

        await downloadAndConvertToWebp(found.post.file_url, outWebp);
        char.sprite_url = `${CDN_BASE}/${char.id}.webp`;
        manifest[char.id] = {
          name_en: char.name_en,
          safebooru_id: found.post.id,
          pixiv_source: found.post.source,
          tag: found.tag,
          bytes: fs.statSync(outWebp).size,
        };
        matchedCount++;
      } catch (err) {
        console.error(`Error on ${char.name_en}:`, err.message);
        missing.push(char.name_en);
      }

      completed++;
      if (completed % 15 === 0 || completed === chars.length) {
        console.log(`Progress: ${completed} / ${chars.length} (Matched: ${matchedCount})`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  fs.writeFileSync(charsPath, JSON.stringify(chars, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(
    path.join(assetsRepoDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  );
  fs.writeFileSync(
    path.join(assetsRepoDir, 'README.md'),
    `# Gensokyo Character Standing Portraits (WebP Asset Mirror)\n\nStanding character illustrations by **Dairi & Haruka** ([Safebooru Pool #26125](https://safebooru.donmai.us/pools/26125)), optimized to transparent WebP for the [Gensokyo 1:1 Interactive Cartographic Atlas](https://remilya.dev/Gensokyo/).\n`,
    'utf-8'
  );

  console.log(`✅ Done! Converted ${matchedCount} / ${chars.length} character sprites to WebP.`);
  if (missing.length > 0) {
    console.log('Missing:', missing);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
