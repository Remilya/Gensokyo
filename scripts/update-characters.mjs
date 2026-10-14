/**
 * Character Files Updater (`scripts/update-characters.mjs`)
 *
 * Fetches canonical character articles from https://en.touhouwiki.net/api.php over HTTP/2,
 * merges them with curated character portraits (Who They Are, Key Facts, Personality),
 * classifies and cleans Relationships (Who They Like / Allies, Enemies & Rivals, Associates),
 * performs bidirectional relationship linking and location cross-referencing,
 * and writes `data/characters.json`.
 *
 * Usage:
 *   npm run update-characters
 */
import fs from 'node:fs';
import http2 from 'node:http2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const locationsPath = path.join(rootDir, 'data', 'locations.json');
const outPath = path.join(rootDir, 'data', 'characters.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeResidentName(raw) {
  const base = raw
    .replace(/\s*\([^)]*\)\s*/g, '')
    .replace(/, Yamaxanadu$/i, '')
    .trim();

  const ALIAS_MAP = {
    'Eiki Shiki': 'Eiki Shiki, Yamaxanadu',
    'Reisen': 'Reisen (Imperishable Night)',
    'Reisen II': 'Reisen',
    'Kirisame Family': 'Marisa Kirisame',
    'Hourai Doll': 'Alice Margatroid',
    'Shanghai Doll': 'Alice Margatroid',
    'Biten Son': 'Son Biten',
    'Genji': 'Minor Characters',
    'Rumi Arie': 'Minor Characters',
    'Kume': 'Minor Characters',
    'Saisen': 'Minor Characters',
    'Manzairaku': 'Minor Characters',
  };

  return ALIAS_MAP[base] || base;
}

const GENERIC_RESIDENTS = new Set([
  'Human Villagers',
  'Geidontei Regulars',
  'Wandering Apparitions',
  'Bake-danuki',
  'Kappa',
  'Kappa Engineers',
  'Kappa Operators',
  'Hobgoblins',
  'Merchant Spirits',
  'Phantom Spirits',
  'Yamawaro',
  'Giant Toad',
  'Five Magic Stones',
  'Mugenkan',
  'Minor Characters',
]);

function createWikiSession() {
  const client = http2.connect('https://en.touhouwiki.net');
  client.on('error', (err) => {
    console.error('HTTP/2 client error:', err.message);
  });

  function requestJson(apiPath) {
    return new Promise((resolve, reject) => {
      const req = client.request({
        ':path': apiPath,
        ':method': 'GET',
        'user-agent': UA,
        accept: 'application/json',
      });
      let body = '';
      req.setEncoding('utf8');
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse JSON for ${apiPath}: ${body.slice(0, 180)}`));
        }
      });
      req.on('error', reject);
      req.end();
    });
  }

  return { client, requestJson };
}

function cleanWikiInline(raw) {
  if (!raw) return '';
  let s = raw;
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  s = s.replace(/<ref[^/]*\/>/gi, '');
  s = s.replace(/\[\[(?:File|Image|Media|Category):[^\]]+\]\]/gi, '');
  s = s.replace(/\{\{lang\|[^|}]+\|([^|}]+)\}\}/gi, '$1');
  s = s.replace(/\{\{ruby[^|}]*\|([^|}]+)\|[^}]*\}\}/gi, '$1');
  s = s.replace(/\{\{H:title\|([^|}]+)\|([^|}]+)\}\}/gi, (_, a, b) => {
    const aHasLatin = /[A-Za-z]{2,}/.test(a);
    const bHasLatin = /[A-Za-z]{2,}/.test(b);
    if (aHasLatin && !bHasLatin) return a.trim();
    if (bHasLatin && !aHasLatin) return b.trim();
    return a.trim();
  });
  s = s.replace(/\{\{[Nn]ihongo\|([^|}]*)\|([^|}]+)(?:\|([^|}]+))?[^}]*\}\}/g, (_, en, jp) => {
    return en ? `${en.trim()} (${jp.trim()})` : jp.trim();
  });
  s = s.replace(/\{\{([A-Za-z0-9_ -]+)\}\}/g, '$1');
  let prev = '';
  while (prev !== s) {
    prev = s;
    s = s.replace(/\{\{[^{}]*\}\}/g, '');
  }
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
  s = s.replace(/'''+/g, '').replace(/''/g, '');
  s = s.replace(/<br\s*\/?>/gi, ', ');
  s = s.replace(/<\/?[a-z][^>]*>/gi, '');
  s = s.replace(/\(\s*♫\s*\)/g, '').replace(/\(\s*,\s*/g, '(').replace(/\(\s*\)/g, '');
  s = s.replace(/[ \t]+/g, ' ').trim();
  return s;
}

function stripWikiMeta(text) {
  return text
    .replace(/citation needed/gi, '')
    .replace(/\bIn the PC-98 (?:games|canon|era),\s*/gi, '')
    .replace(/\b(?:After|During|Following|Prior to|Since) the events of [A-Z][A-Za-z0-9\s'’~.:-]{3,45}?,\s*/g, '')
    .replace(/\b(?:In|During|Throughout|According to|As stated in|As seen in|As shown in|As of)\s+(?:chapter\s+\d+\s+of\s+)?(?:the\s+(?:extra\s+)?stage\s+(?:\d+\s+)?of\s+)?[A-Z][A-Za-z0-9\s'’~.:-]{3,45}?,\s*/g, '')
    .replace(/\s+in\s+(?:chapter\s+\d+\s+of\s+)?(?:Embodiment of Scarlet Devil|Perfect Cherry Blossom|Imperishable Night|Phantasmagoria of Flower View|Mountain of Faith|Subterranean Animism|Undefined Fantastic Object|Ten Desires|Double Dealing Character|Legacy of Lunatic Kingdom|Hidden Star in Four Seasons|Wily Beast and Weakest Creature|Unconnected Marketeers|Unfinished Dream of All Living Ghost|Immaterial and Missing Power|Scarlet Weather Rhapsody|Hisoutensoku|Hopeless Masquerade|Urban Legend in Limbo|Antinomy of Common Flowers|Sunken Fossil World|Forbidden Scrollery|Wild and Horned Hermit|Lotus Eaters|Silent Sinner in Blue|Cage in Lunatic Runagate|Bohemian Archive in Japanese Red|Perfect Memento in Strict Sense|Symposium of Post-mysticism|Foul Detective Satori|Strange and Bright Nature Deity|Eastern and Little Nature Deity|Oriental Sacred Place|Curiosities of Lotus Asia|The Grimoire of Marisa|The Grimoire of Usami|Violet Detector)(?=['’.,;)\s]|$)/gi, '')
    .replace(/\s+such as(?=[,.;]|$)/gi, '')
    .replace(/,\s*such as,\s*/gi, ', including ')
    .replace(/\s+for reasons mentioned in her backstory/gi, ' due to their thousand-year history with the Hourai Elixir')
    .replace(/\bZUN has (?:also )?(?:stated|said) that\s*/gi, '')
    .replace(/\s*\((?:see|from|in|NB:)[^)]*\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;])/g, '$1')
    .trim();
}

function distillParagraphs(rawText, maxSentences = 2, maxChars = 320) {
  const cleaned = stripWikiMeta(cleanWikiInline(rawText));
  if (!cleaned) return '';

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => {
      const t = s.trim();
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .filter((s) => {
      if (s.length < 20) return false;
      if (/^(?:She|He|They|It)\s+(?:first\s+)?appeared\s+as\s+(?:the\s+)?(?:Stage|Final|Extra|Phantasm)/i.test(s)) return false;
      if (/^In\s+the\s+events\s+of\b/i.test(s)) return false;
      if (/^Her\s+surname\b|^Her\s+first\s+name\b|^The\s+characters\s+for\b|^Literally\s+translated/i.test(s)) return false;
      if (/^===/.test(s)) return false;
      return true;
    });

  let out = '';
  let count = 0;
  for (const s of sentences) {
    if (count >= maxSentences) break;
    if (out.length + s.length + 1 > maxChars && count > 0) break;
    out = out ? `${out} ${s}` : s;
    count++;
  }
  return out;
}

function extractInfoboxAndBody(rawWikitext) {
  const wikitext = rawWikitext.replace(/<!--[\s\S]*?-->/g, '');
  const fields = {};
  const startIdx = wikitext.search(/\{\{\s*Infobox\s+Character/i);
  if (startIdx === -1) return { fields, bodyText: wikitext };

  const firstH2 = wikitext.search(/\n==[^=]/);
  const searchLimit = firstH2 !== -1 ? firstH2 : wikitext.length;
  let endIdx = searchLimit;

  const closeMatch = wikitext.slice(startIdx, searchLimit).match(/\n\}\}\s*(?=\n|$)/);
  if (closeMatch && closeMatch.index !== undefined) {
    endIdx = startIdx + closeMatch.index + closeMatch[0].length;
  }

  const box = wikitext.slice(startIdx, endIdx);
  const bodyText = wikitext.slice(endIdx).trim();
  let currentKey = null;
  let currentVal = [];

  for (const line of box.split(/\r?\n/)) {
    const m = line.match(/^\s*\|\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) {
      if (currentKey) fields[currentKey] = currentVal.join('\n').trim();
      currentKey = m[1].trim();
      currentVal = [m[2]];
    } else if (currentKey && !line.trim().startsWith('}}')) {
      currentVal.push(line);
    }
  }
  if (currentKey) fields[currentKey] = currentVal.join('\n').trim();
  return { fields, bodyText };
}

function extractSections(bodyText) {
  const sections = {};
  const lines = bodyText.split(/\r?\n/);
  let currentH2 = 'Lead';
  let currentH3 = '';
  sections['Lead'] = [];

  for (const line of lines) {
    const h3 = line.match(/^===\s*([^=]+?)\s*===\s*$/);
    const h2 = !h3 ? line.match(/^==\s*([^=]+?)\s*==\s*$/) : null;
    if (h2) {
      currentH2 = h2[1].trim();
      currentH3 = '';
      if (!sections[currentH2]) sections[currentH2] = [];
    } else if (h3) {
      currentH3 = h3[1].trim();
      const key = `${currentH2} > ${currentH3}`;
      if (!sections[key]) sections[key] = [];
      if (!sections[currentH2]) sections[currentH2] = [];
      sections[currentH2].push(`===${currentH3}===`);
    } else {
      if (currentH3) {
        sections[`${currentH2} > ${currentH3}`].push(line);
      }
      if (sections[currentH2]) {
        sections[currentH2].push(line);
      }
    }
  }

  const out = {};
  for (const [k, arr] of Object.entries(sections)) {
    out[k] = arr.join('\n').trim();
  }
  return out;
}

const ALLY_RE =
  /\b(friend|friends|befriended|close|ally|allies|sister|brother|siblings|family|mother|father|daughter|serves|servant|maid|mistress|master|loyal|trust|trusts|trusted|respect|respects|cares|fond|fondness|likes|admires|mentor|teacher|student|disciple|apprentice|companion|partner|partners|protects|guardian|lives with|roommate|employ|subordinate|shikigami|pet|hangs out|drinking|visits often|good terms|good relationship|amicable|affection|helped|rescued|saved|at ease|welcomes)\b/i;

const RIVAL_RE =
  /\b(enemy|enemies|rival|rivals|rivalry|nemesis|foe|hates|hatred|dislikes|despises|despised|fears|afraid|terrified|hostile|antagonis|distrust|suspicio|looks down|bully|bullies|fought|fights|attacked|exterminat|feud|grudge|conflict|clash|clashes|annoyed|irritated|bothered|nuisance|target|quarrel|argues|bitterness|resent|competitor|competes|threat|wanted|criminal|avoid|avoids|broken off|killing each other|slaughter|murdered|unflattering|shut down)\b/i;

function classifyRelationship(summaryText) {
  if (
    /\b(good relationship|close friend|best friend|befriended|friends with|mutual fondness|sister|older sister|younger sister|serves|loyal|mistress|master|mentor|disciple|shikigami|partner|friendly terms|cares for|protects|guardian|pet|hangs out|regular at the shrine)\b/i.test(
      summaryText
    ) &&
    !/\b(despised|slaughter|killing each other|murdered|target of pranks|broken off relations)\b/i.test(summaryText)
  ) {
    return 'ally';
  }
  if (
    /\b(despised|despises|strongly dislikes|killing each other|arch-?enemy|nemesis|mortal enemy|bitter rival|rival|rivalry|hates|feud|grudge|hostile|broken off relations|murdered|target of pranks|annoying|unflattering|shut down)\b/i.test(
      summaryText
    )
  ) {
    return 'rival';
  }
  const hasRival = RIVAL_RE.test(summaryText);
  const hasAlly = ALLY_RE.test(summaryText);
  if (hasRival && !hasAlly) return 'rival';
  if (hasAlly && !hasRival) return 'ally';
  if (hasAlly && hasRival) return 'ally';
  return 'acquaintance';
}

function parseRelationships(relWikitext, selfName) {
  const allies = [];
  const rivals = [];
  const acquaintances = [];
  if (!relWikitext) return { allies, rivals, acquaintances };

  const lines = relWikitext.split(/\r?\n/);
  let currentTargets = [];
  let currentBuf = [];

  const flush = () => {
    if (currentTargets.length === 0 || currentBuf.length === 0) return;
    const rawBody = currentBuf.join(' ').trim();
    const summary = distillParagraphs(rawBody, 2, 320);
    if (!summary || summary.length < 15) return;

    const kind = classifyRelationship(summary);
    for (const targetName of currentTargets) {
      if (targetName.toLowerCase() === selfName.toLowerCase()) continue;
      if (
        /^(Minor Characters|Minor Relationships|Residents|General|Others|Humans|Youkai|Gods|Fairies|Villagers|Other servants|Other Residents)/i.test(
          targetName
        )
      ) {
        continue;
      }
      const entry = {
        name: targetName,
        id: slugify(targetName.replace(/, Yamaxanadu$/i, '')),
        summary,
      };
      if (kind === 'ally') allies.push(entry);
      else if (kind === 'rival') rivals.push(entry);
      else acquaintances.push(entry);
    }
  };

  for (const line of lines) {
    const dtMatch = line.match(/^;\s*(.+)$/);
    const h3Match = line.match(/^===\s*([^=]+?)\s*===\s*$/);

    if (dtMatch || h3Match) {
      flush();
      currentBuf = [];
      const headerRaw = (dtMatch ? dtMatch[1] : h3Match[1]).trim();
      if (
        h3Match &&
        /\b(Residents|Associates|Subordinates|Allies|Enemies|Other|Friends|Inhabitants|Members|Minor Relationships|companions)\b/i.test(
          headerRaw
        )
      ) {
        currentTargets = [];
        continue;
      }

      const links = [...headerRaw.matchAll(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g)]
        .map((m) => (m[2] || m[1]).trim())
        .filter((n) => !n.startsWith('File:') && !n.startsWith('Category:'));

      if (links.length > 3) {
        currentTargets = [];
        continue;
      }

      if (links.length > 0) {
        currentTargets = links;
      } else {
        const cleanedHeader = cleanWikiInline(headerRaw);
        currentTargets = cleanedHeader ? [cleanedHeader] : [];
      }
    } else if (!line.startsWith('[[File:') && !line.startsWith('[[Image:')) {
      currentBuf.push(line);
    }
  }
  flush();

  return {
    allies: allies.slice(0, 8),
    rivals: rivals.slice(0, 8),
    acquaintances: acquaintances.slice(0, 6),
  };
}

function parseCharacterPage(pageTitle, wikitext, homeLocIds, existingChar) {
  const { fields: info, bodyText } = extractInfoboxAndBody(wikitext);
  const sections = extractSections(bodyText);

  const name_en = cleanWikiInline(info.nameEn || pageTitle).replace(/, Yamaxanadu$/i, '');

  const nihongoMatch = (sections['Lead'] || '').match(/\{\{[Nn]ihongo\|[^|}]*\|([^|}]+)/);
  const name_jp = cleanWikiInline(nihongoMatch ? nihongoMatch[1] : info.nameJp || '')
    .replace(/\s+/g, ' ')
    .trim();

  const title = cleanWikiInline(info.chartitle || '')
    .replace(/^["“]|["”]$/g, '')
    .split(',')[0]
    .trim();

  const species = cleanWikiInline(info.species || 'Unknown');
  const abilities = cleanWikiInline(info.abilities || '')
    .replace(/^\*\s*/gm, '')
    .split(/\n/)[0]
    .slice(0, 160);
  const occupation = cleanWikiInline(info.occupation || '')
    .replace(/^\*\s*/gm, '')
    .slice(0, 150);
  const age = cleanWikiInline(info.age || '').slice(0, 90);

  const firstMusicLine = (info.MusicThemes || '')
    .split(/\r?\n/)
    .find((l) => l.trim().length > 0);
  const theme_music = cleanWikiInline(firstMusicLine || '').replace(/^\*\s*/, '').slice(0, 120);

  const firstAppLine = (info.appOfficialgames || info.appPrintworks || '')
    .split(/\r?\n/)
    .find((l) => l.trim().length > 0);
  const first_appearance = cleanWikiInline(firstAppLine || '').replace(/^\*\s*/, '').slice(0, 120);

  const leadParagraphs = (sections['Lead'] || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('{') && !p.startsWith('[[File:') && !p.startsWith('==='));

  const wikiWho =
    distillParagraphs(leadParagraphs.join(' '), 3, 460) ||
    distillParagraphs(sections['General Information'] || '', 3, 460);

  const persRaw =
    sections['General Information > Personality'] ||
    sections['Character Design > Personality'] ||
    sections['Personality'] ||
    '';
  const wikiPers = distillParagraphs(persRaw, 3, 440);

  const relRaw = sections['Relationships'] || '';
  const { allies, rivals, acquaintances } = parseRelationships(relRaw, name_en);

  return {
    id: slugify(name_en),
    name_en,
    name_jp,
    title: title || occupation || species,
    tagline: existingChar?.tagline || `${title || species}; ${occupation || 'Notable figure of Gensokyo'}`,
    species,
    occupation: occupation || 'Resident of Gensokyo',
    abilities: abilities || 'Spiritual & Danmaku arts',
    age: age || undefined,
    theme_music: theme_music || undefined,
    first_appearance: first_appearance || 'Touhou Project Canon',
    wiki_url: `https://en.touhouwiki.net/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`,
    sprite_url: existingChar?.sprite_url || undefined,
    who_they_are:
      existingChar?.who_they_are ||
      wikiWho ||
      `${name_en} is a notable ${species.toLowerCase()} figure of Gensokyo associated with ${occupation || 'local incidents and lore'}.`,
    key_facts: existingChar?.key_facts || undefined,
    personality:
      existingChar?.personality ||
      wikiPers ||
      `Known across Gensokyo for their distinctive presence and mastery of ${abilities ? abilities.toLowerCase() : 'spiritual arts'}.`,
    allies,
    rivals,
    acquaintances,
    home_location_ids: homeLocIds,
  };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function enrichRelationships(chars, locations) {
  const byId = new Map(chars.map((c) => [c.id, c]));
  const locById = new Map(locations.map((l) => [l.id, l]));

  // 1. Scan who_they_are & key_facts for explicit mentions of other characters
  for (const c of chars) {
    const existingIds = new Set([
      ...c.allies.map((r) => r.id),
      ...c.rivals.map((r) => r.id),
      ...c.acquaintances.map((r) => r.id),
    ]);

    const bioText = [c.tagline || '', c.who_they_are || '', ...(c.key_facts || [])].join(' ');
    for (const other of chars) {
      if (other.id === c.id || existingIds.has(other.id)) continue;
      const firstName = other.name_en.split(' ')[0];
      const fullRe = new RegExp('\\b' + escapeRegExp(other.name_en) + '\\b', 'i');
      const shortRe =
        firstName.length >= 4 && !['Human', 'Three', 'Giant'].includes(firstName)
          ? new RegExp('\\b' + escapeRegExp(firstName) + '\\b')
          : null;

      if (fullRe.test(bioText) || (shortRe && shortRe.test(bioText))) {
        const sent = bioText
          .split(/(?<=[.!?])\s+/)
          .find((s) => fullRe.test(s) || (shortRe && shortRe.test(s)));
        if (sent) {
          const isRival =
            /\b(rival|dislikes|kills|enemy|fought|sealed|feud|opposes|grudge|stole|overthrow|compete|antagonis|hatred)\b/i.test(
              sent
            );
          const relObj = { name: other.name_en, id: other.id, summary: sent };
          if (isRival) c.rivals.push(relObj);
          else c.allies.push(relObj);
          existingIds.add(other.id);
        }
      }
    }
  }

  // 2. Co-resident household / faction companions (for specific estates, shrines, temples)
  const BROAD_LOCS = new Set([
    'human-village',
    'youkai-mountain',
    'forest-of-magic',
    'misty-lake',
    'bamboo-forest-of-the-lost',
    'former-hell',
    'sanzu-river',
    'higan',
    'netherworld',
    'makai',
    'lunar-capital',
    'animal-realm',
  ]);

  for (const c of chars) {
    const existingIds = new Set([
      ...c.allies.map((r) => r.id),
      ...c.rivals.map((r) => r.id),
      ...c.acquaintances.map((r) => r.id),
    ]);

    for (const locId of c.home_location_ids || []) {
      if (BROAD_LOCS.has(locId)) continue;
      const loc = locById.get(locId);
      if (!loc) continue;
      const coResidents = chars.filter(
        (other) => other.id !== c.id && (other.home_location_ids || []).includes(locId)
      );
      if (coResidents.length > 7) continue;
      for (const peer of coResidents) {
        if (existingIds.has(peer.id) || c.allies.length >= 8) continue;
        c.allies.push({
          name: peer.name_en,
          id: peer.id,
          summary: `Fellow resident and companion associated with ${loc.name_en} (${loc.name_jp}).`,
        });
        existingIds.add(peer.id);
      }
    }
  }

  // 3. Canonical relationship & location overrides for characters with sparse wiki sections
  const CANON_LOC_FALLBACKS = {
    'benben-tsukumo': ['human-village', 'shining-needle-castle'],
    'yatsuhashi-tsukumo': ['human-village', 'shining-needle-castle'],
    'raiko-horikawa': ['human-village', 'muenzuka'],
    'hata-no-kokoro': ['human-village', 'myouren-temple', 'hall-of-dreams-great-mausoleum'],
    'joon-yorigami': ['human-village', 'myouren-temple'],
    'shion-yorigami': ['hakurei-shrine', 'bhavaagra-heaven'],
    'mike-goutokuji': ['youkai-mountain', 'rainbow-dragon-cave'],
    'zanmu-nippaku': ['former-hell', 'higan'],
  };

  for (const [cid, locs] of Object.entries(CANON_LOC_FALLBACKS)) {
    const ch = byId.get(cid);
    if (ch && (!ch.home_location_ids || ch.home_location_ids.length === 0)) {
      ch.home_location_ids = locs;
    }
  }

  const CANON_REL_PAIRS = [
    ['seija-kijin', 'shinmyoumaru-sukuna', 'ally', 'Former co-conspirator in the Miracle Mallet rebellion; Seija manipulated Shinmyoumaru into attempting to overturn Gensokyo’s hierarchy before their falling out.'],
    ['seija-kijin', 'reimu-hakurei', 'rival', 'Hunted fugitive during the Impossible Spell Card manhunt after refusing to surrender the Miracle Mallet.'],
    ['mayumi-joutouguu', 'keiki-haniyasushin', 'ally', 'Directly sculpted by Keiki Haniyasushin as the loyal commander of the Haniwa idol army defending the Primate Spirit Garden.'],
    ['mayumi-joutouguu', 'yachie-kicchou', 'rival', 'Fierce military opponent of the Kiketsu Family and other Animal Realm syndicates seeking to enslave human spirits.'],
    ['sagume-kishin', 'eirin-yagokoro', 'ally', 'Fellow high-ranking Lunarian sage with whom she shares a long history of protecting the Lunar Capital.'],
    ['sagume-kishin', 'doremy-sweet', 'ally', 'Collaborated with Doremy Sweet to shelter the Lunar Capital’s citizens inside the Dream World during the Lunarian invasion crisis.'],
    ['sagume-kishin', 'junko', 'rival', 'Commander of the Lunar Defense Corps opposing Junko and Hecatia Lapislazuli’s siege of the Lunar Capital.'],
    ['urumi-ushizaki', 'eika-ebisu', 'ally', 'Close riverside neighbor and friend along the Sanzu River shoreline who watches over Eika’s stone-stacking contests.'],
    ['urumi-ushizaki', 'kutaka-niwatari', 'ally', 'Friendly colleague working along the border checkpoints between the Sanzu River, Higan, and Hell.'],
    ['mike-goutokuji', 'takane-yamashiro', 'ally', 'Fellow Youkai Mountain merchant involved in the Ability Card trade networks.'],
    ['mike-goutokuji', 'chimata-tenkyuu', 'ally', 'Participates in the marketplace festivals overseen by the god of markets, Chimata Tenkyuu.'],
    ['lily-white', 'cirno', 'rival', 'Frequent springtime rival among the fairies whenever Lily White’s herald of spring clashes with Cirno’s frost.'],
    ['lily-white', 'sunny-milk', 'ally', 'Fellow nature fairy who celebrates the arrival of spring across the trails of Gensokyo.'],
    ['louise', 'shinki', 'ally', 'Created denizen of Makai who admires Shinki and enjoys sightseeing in the human world.'],
    ['louise', 'alice-margatroid', 'ally', 'Fellow resident associated with the mystic realm of Makai.'],
    ['hata-no-kokoro', 'koishi-komeiji', 'rival', 'Friendly rival after Koishi stole her Mask of Hope, sparking Kokoro’s awakening to genuine emotion.'],
    ['hata-no-kokoro', 'toyosatomimi-no-miko', 'ally', 'Original creator of Kokoro’s sixty-six Noh masks who helped craft her a new Mask of Hope.'],
    ['hata-no-kokoro', 'byakuren-hijiri', 'ally', 'Regularly performs Noh plays at Myouren Temple as well as the Human Village and Hakurei Shrine.'],
    ['joon-yorigami', 'shion-yorigami', 'ally', 'Twin older sister and partner in crime during the Perfect Possession incident, though Joon constantly exploits Shion’s misfortune aura.'],
    ['shion-yorigami', 'tenshi-hinanawi', 'ally', 'Befriended Tenshi Hinanawi, whose boundless celestial luck completely cancels out Shion’s aura of poverty.'],
    ['raiko-horikawa', 'benben-tsukumo', 'ally', 'Mentored the Tsukumo sisters on how to replace their fading Miracle Mallet energy with Outside World drum magic.'],
    ['raiko-horikawa', 'yatsuhashi-tsukumo', 'ally', 'Fellow tsukumogami musician who performs alongside the Tsukumo sisters at concerts in the Human Village.'],
    ['benben-tsukumo', 'yatsuhashi-tsukumo', 'ally', 'Inseparable tsukumogami sister awakened during the Miracle Mallet incident; they perform biwa and koto duets together.'],
    ['zanmu-nippaku', 'hisami-yomotsu', 'ally', 'Commands the fiercely devoted Hisami Yomotsu in the administration of Former Hell and the New Hell borderlands.'],
    ['zanmu-nippaku', 'suika-ibuki', 'ally', 'Old acquaintance from her oni dealings in the Underworld who respects Zanmu’s quiet scheming.'],
  ];

  for (const [idA, idB, kind, summary] of CANON_REL_PAIRS) {
    const a = byId.get(idA);
    const b = byId.get(idB);
    if (!a || !b) continue;
    const hasB = [...a.allies, ...a.rivals, ...a.acquaintances].some((r) => r.id === idB);
    if (!hasB) {
      if (kind === 'rival') a.rivals.push({ name: b.name_en, id: b.id, summary });
      else a.allies.push({ name: b.name_en, id: b.id, summary });
    }
  }

  // 4. Bidirectional reciprocity: if A lists B in allies or rivals, ensure B also lists A
  for (const a of chars) {
    for (const rel of a.allies) {
      const b = byId.get(rel.id);
      if (!b) continue;
      const hasA = [...b.allies, ...b.rivals, ...b.acquaintances].some((r) => r.id === a.id);
      if (!hasA && b.allies.length < 8) {
        b.allies.push({ name: a.name_en, id: a.id, summary: rel.summary });
      }
    }
    for (const rel of a.rivals) {
      const b = byId.get(rel.id);
      if (!b) continue;
      const hasA = [...b.allies, ...b.rivals, ...b.acquaintances].some((r) => r.id === a.id);
      if (!hasA && b.rivals.length < 8) {
        b.rivals.push({ name: a.name_en, id: a.id, summary: rel.summary });
      }
    }
  }
}

async function main() {
  const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));

  // Load existing characters.json if present to preserve curated bios
  const existingById = new Map();
  if (fs.existsSync(outPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
      for (const c of prev) existingById.set(c.id, c);
    } catch {
      // ignore
    }
  }

  const charToLocs = new Map();

  for (const loc of locations) {
    for (const rawRes of loc.residents || []) {
      const cleanedBase = rawRes.replace(/\s*\([^)]*\)\s*/g, '').trim();
      if (GENERIC_RESIDENTS.has(cleanedBase)) continue;
      const wikiTitle = normalizeResidentName(rawRes);
      if (GENERIC_RESIDENTS.has(wikiTitle)) continue;

      if (!charToLocs.has(wikiTitle)) {
        charToLocs.set(wikiTitle, new Set());
      }
      charToLocs.get(wikiTitle).add(loc.id);
    }
  }

  const EXTRA_CHARACTERS = [
    'Reimu Hakurei',
    'Marisa Kirisame',
    'Remilia Scarlet',
    'Flandre Scarlet',
    'Sakuya Izayoi',
    'Patchouli Knowledge',
    'Hong Meiling',
    'Koakuma',
    'Cirno',
    'Daiyousei',
    'Rumia',
    'Yuyuko Saigyouji',
    'Youmu Konpaku',
    'Yukari Yakumo',
    'Ran Yakumo',
    'Chen',
    'Alice Margatroid',
    'Kaguya Houraisan',
    'Eirin Yagokoro',
    'Fujiwara no Mokou',
    'Reisen Udongein Inaba',
    'Tewi Inaba',
    'Keine Kamishirasawa',
    'Mystia Lorelei',
    'Wriggle Nightbug',
    'Aya Shameimaru',
    'Eiki Shiki, Yamaxanadu',
    'Komachi Onozuka',
    'Yuuka Kazami',
    'Medicine Melancholy',
    'Sanae Kochiya',
    'Kanako Yasaka',
    'Suwako Moriya',
    'Nitori Kawashiro',
    'Momiji Inubashiri',
    'Hina Kagiyama',
    'Suika Ibuki',
    'Iku Nagae',
    'Tenshi Hinanawi',
    'Satori Komeiji',
    'Koishi Komeiji',
    'Rin Kaenbyou',
    'Utsuho Reiuji',
    'Yuugi Hoshiguma',
    'Parsee Mizuhashi',
    'Yamame Kurodani',
    'Kisume',
    'Byakuren Hijiri',
    'Shou Toramaru',
    'Nazrin',
    'Ichirin Kumoi',
    'Minamitsu Murasa',
    'Nue Houjuu',
    'Kogasa Tatara',
    'Hatate Himekaidou',
    'Toyosatomimi no Miko',
    'Mononobe no Futo',
    'Soga no Tojiko',
    'Seiga Kaku',
    'Yoshika Miyako',
    'Mamizou Futatsuiwa',
    'Kyouko Kasodani',
    'Shinmyoumaru Sukuna',
    'Seija Kijin',
    'Raiko Horikawa',
    'Kagerou Imaizumi',
    'Wakasagihime',
    'Sekibanki',
    'Benben Tsukumo',
    'Yatsuhashi Tsukumo',
    'Hata no Kokoro',
    'Kasen Ibaraki',
    'Kosuzu Motoori',
    'Hieda no Akyuu',
    'Rinnosuke Morichika',
    'Sumireko Usami',
    'Junko',
    'Hecatia Lapislazuli',
    'Clownpiece',
    'Doremy Sweet',
    'Sagume Kishin',
    'Seiran',
    'Ringo',
    'Okina Matara',
    'Satono Nishida',
    'Mai Teireida',
    'Aunn Komano',
    'Narumi Yatadera',
    'Nemuno Sakata',
    'Eternity Larva',
    'Joon Yorigami',
    'Shion Yorigami',
    'Keiki Haniyasushin',
    'Yachie Kicchou',
    'Saki Kurokoma',
    'Yuuma Toutetsu',
    'Mayumi Joutouguu',
    'Kutaka Niwatari',
    'Urumi Ushizaki',
    'Eika Ebisu',
    'Chimata Tenkyuu',
    'Megumu Iizunamaru',
    'Tsukasa Kudamaki',
    'Momoyo Himemushi',
    'Takane Yamashiro',
    'Sannyo Komakusa',
    'Misumaru Tamatsukuri',
    'Mike Goutokuji',
    'Miyoi Okunoda',
    'Mizuchi Miyadeguchi',
    'Hisami Yomotsu',
    'Zanmu Nippaku',
    'Son Biten',
    'Enoko Mitsugashira',
    'Chiyari Tenkajin',
  ];

  for (const c of EXTRA_CHARACTERS) {
    if (!charToLocs.has(c)) {
      charToLocs.set(c, new Set());
    }
  }

  const allTitles = [...charToLocs.keys()].sort();
  console.log(`Fetching ${allTitles.length} canonical characters from Touhou Wiki over HTTP/2...`);

  const { client, requestJson } = createWikiSession();
  const charactersById = new Map();

  try {
    const batchSize = 25;
    for (let i = 0; i < allTitles.length; i += batchSize) {
      const batch = allTitles.slice(i, i + batchSize);
      const joined = batch.map((t) => encodeURIComponent(t)).join('|');
      const apiPath = `/api.php?action=query&redirects=1&prop=revisions&rvprop=content&rvslots=main&titles=${joined}&format=json`;
      const resp = await requestJson(apiPath);

      const redirects = new Map();
      for (const r of resp?.query?.redirects ?? []) {
        redirects.set(r.to, r.from);
      }

      const pages = resp?.query?.pages ?? {};
      for (const page of Object.values(pages)) {
        if (!page.title || page.missing !== undefined) continue;
        if (page.title.startsWith('Minor Characters')) continue;
        const raw =
          page.revisions?.[0]?.slots?.main?.['*'] ||
          page.revisions?.[0]?.['*'] ||
          '';
        if (!raw) continue;

        const origTitle = redirects.get(page.title) || page.title;
        const locSet = new Set([
          ...(charToLocs.get(origTitle) || []),
          ...(charToLocs.get(page.title) || []),
        ]);

        const cleanId = slugify(page.title.replace(/, Yamaxanadu$/i, ''));
        const existingChar = existingById.get(cleanId);

        const parsed = parseCharacterPage(page.title, raw, [...locSet], existingChar);
        charactersById.set(parsed.id, parsed);
      }
      console.log(`Processed ${Math.min(i + batchSize, allTitles.length)} / ${allTitles.length} characters...`);
    }
  } finally {
    client.close();
  }

  const finalCharacters = [...charactersById.values()].sort((a, b) =>
    a.name_en.localeCompare(b.name_en)
  );

  enrichRelationships(finalCharacters, locations);

  fs.writeFileSync(outPath, JSON.stringify(finalCharacters, null, 2) + '\n', 'utf-8');
  console.log(
    `✅ Wrote ${finalCharacters.length} character dossiers to ${outPath} (Allies: ${
      finalCharacters.filter((c) => c.allies.length > 0).length
    }, Rivals: ${finalCharacters.filter((c) => c.rivals.length > 0).length})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
