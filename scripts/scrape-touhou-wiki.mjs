/**
 * Scrapes all pages in Category:Locations (plus Returning PC-98 Locations & Unnamed Locations)
 * from https://en.touhouwiki.net/api.php over native HTTP/2 and outputs
 * data/touhou_wiki_locations.json with structured canonical lore, kanji, appearances, and sub-locations.
 */
import fs from 'node:fs';
import http2 from 'node:http2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outPath = path.join(rootDir, 'data', 'touhou_wiki_locations.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0';

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

function cleanWikitext(raw) {
  if (!raw) return '';
  let s = raw;
  // Remove HTML comments and refs
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  s = s.replace(/<ref[^/]*\/>/gi, '');
  // Convert {{nihongo|English|Kanji|Romaji}} -> English (Kanji, Romaji)
  s = s.replace(/\{\{[Nn]ihongo\|([^|}]+)\|([^|}]+)(?:\|([^|}]+))?[^}]*\}\}/g, (_, en, jp, ro) => {
    return en ? `${en} (${jp}${ro ? `, ${ro}` : ''})` : jp;
  });
  // Convert {{H:title|...|text}} -> text
  s = s.replace(/\{\{H:title\|[^|}]+\|([^|}]+)\}\}/g, '$1');
  // Convert simple templates like {{TH06}} or {{PMiSS}} -> template name
  s = s.replace(/\{\{([A-Za-z0-9_ -]+)\}\}/g, '$1');
  // Strip remaining complex multiline templates/infoboxes
  let prev = '';
  while (prev !== s) {
    prev = s;
    s = s.replace(/\{\{[^{}]*\}\}/g, '');
  }
  // Convert [[File:...]] / [[Image:...]] -> empty
  s = s.replace(/\[\[(?:File|Image|Category):[^\]]+\]\]/gi, '');
  // Convert [[Target|Label]] -> Label, [[Target]] -> Target
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // Strip bold/italics wiki markup
  s = s.replace(/'''+/g, '').replace(/''/g, '');
  // Strip HTML tags
  s = s.replace(/<\/?[a-z][^>]*>/gi, '');
  // Collapse whitespace
  s = s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

function parseLocationWikitext(title, wikitext) {
  // 1. Extract Kanji & Romaji from {{nihongo|...|Kanji|Romaji}} or |nameJp=
  let name_jp = '';
  let romaji = '';
  const nihongoMatch = wikitext.match(/\{\{[Nn]ihongo\|[^|}]*\|([^|}]+)(?:\|([^|}]+))?/);
  if (nihongoMatch) {
    name_jp = nihongoMatch[1].trim();
    romaji = (nihongoMatch[2] || '').trim();
  }

  // 2. Extract sections
  const sections = {};
  const lines = wikitext.split(/\r?\n/);
  let currentSec = 'Lead';
  let buf = [];
  const sublocations = [];

  for (const line of lines) {
    const h2 = line.match(/^==\s*([^=]+?)\s*==$/);
    const h3 = line.match(/^===\s*([^=]+?)\s*===$/);
    if (h2) {
      sections[currentSec] = buf.join('\n').trim();
      currentSec = h2[1].trim();
      buf = [];
    } else if (h3) {
      const subName = cleanWikitext(h3[1].trim());
      if (
        subName &&
        !['Games', 'Literature', 'Spin-offs', 'Print Works', 'Name', 'Design', 'Location', 'History'].includes(subName)
      ) {
        sublocations.push(subName);
      }
      buf.push(`\n[${subName}]`);
    } else {
      buf.push(line);
    }
  }
  sections[currentSec] = buf.join('\n').trim();

  // Extract residents from wikitext links in Residents / Notable Residents or Lead
  const residents = new Set();
  const resBlock =
    wikitext.match(/(?:residents|inhabitants)\s*=\s*([^\n|}]+)/i)?.[1] ||
    sections['Notable Residents'] ||
    '';
  const linkMatches = resBlock.matchAll(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g);
  for (const m of linkMatches) {
    const target = (m[2] || m[1]).trim();
    if (target && !target.startsWith('Category:') && !target.startsWith('File:') && target.length < 40) {
      residents.add(target);
    }
  }

  // Extract official appearances
  const appearances = [];
  const appSec =
    (sections['Official Appearances'] || '') +
    '\n' +
    (sections["Location's Appearances"] || '') +
    '\n' +
    (sections['Appearances'] || '');
  for (const line of appSec.split('\n')) {
    const cleaned = cleanWikitext(line).replace(/^\*\s*/, '').trim();
    if (cleaned && cleaned.length > 2 && !cleaned.startsWith('[')) {
      appearances.push(cleaned.slice(0, 160));
    }
  }

  const leadClean = cleanWikitext(sections['Lead'] || '');
  const genInfoClean = cleanWikitext(
    (sections['General Information'] || '') + '\n' + (sections['Background Information'] || '')
  );

  const summary = (leadClean + (genInfoClean ? '\n\n' + genInfoClean : '')).trim();

  return {
    title,
    url: `https://en.touhouwiki.net/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    name_jp,
    romaji,
    summary: summary.slice(0, 2400),
    lead: leadClean.slice(0, 700),
    sublocations: [...new Set(sublocations)].slice(0, 20),
    appearances: appearances.slice(0, 18),
    wiki_residents: [...residents].slice(0, 20),
  };
}

async function main() {
  const { client, requestJson } = createWikiSession();

  try {
    const catTitles = ['Category:Locations', 'Category:Returning PC-98 Locations', 'Category:Unnamed Locations'];
    const pageTitleSet = new Set();

    for (const cat of catTitles) {
      const url = `/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(cat)}&cmlimit=500&format=json`;
      const data = await requestJson(url);
      const members = data?.query?.categorymembers ?? [];
      for (const m of members) {
        if (m.ns === 0 && !m.title.includes('/')) {
          pageTitleSet.add(m.title);
        }
      }
    }

    const allTitles = [...pageTitleSet].sort();
    console.log(`Found ${allTitles.length} canonical location articles on Touhou Wiki.`);

    // Fetch revisions in batches of 25
    const results = [];
    const batchSize = 25;
    for (let i = 0; i < allTitles.length; i += batchSize) {
      const batch = allTitles.slice(i, i + batchSize);
      const joined = batch.map((t) => encodeURIComponent(t)).join('|');
      const apiPath = `/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&titles=${joined}&format=json`;
      const resp = await requestJson(apiPath);
      const pages = resp?.query?.pages ?? {};
      for (const page of Object.values(pages)) {
        if (!page.title || page.missing !== undefined) continue;
        const raw =
          page.revisions?.[0]?.slots?.main?.['*'] ||
          page.revisions?.[0]?.['*'] ||
          '';
        if (!raw) continue;
        const parsed = parseLocationWikitext(page.title, raw);
        results.push(parsed);
      }
      console.log(`Scraped ${ Math.min(i + batchSize, allTitles.length) } / ${allTitles.length} articles...`);
    }

    results.sort((a, b) => a.title.localeCompare(b.title));
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`✅ Saved ${results.length} Touhou Wiki location records to ${outPath}`);
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
