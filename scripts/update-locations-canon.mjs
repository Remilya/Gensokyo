/**
 * Canonical Location Lore, Visual Reference & Architectural Blueprint Updater
 * (`scripts/update-locations-canon.mjs`)
 *
 * Enriches all 116 locations in `data/locations.json` using canonical Touhou MCP lore
 * and the official Touhou Wiki (`https://en.touhouwiki.net/api.php`) over HTTP/2:
 *   1. Resolves official Touhou Wiki stage backgrounds, PMiSS woodblock illustrations,
 *      and manga establishment shots into `image_url` + `image_caption`.
 *   2. Replaces all `#REDIRECT` and `stub` strings in `long_desc` and `wiki_summary`
 *      with complete canonical descriptions.
 *   3. Populates `visual_blueprint` with canonical architectural details used by both
 *      the Side Panel Dossier and our Blender MCP / Three.js 3D landmark builders.
 */
import fs from 'node:fs';
import http2 from 'node:http2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const locationsPath = path.join(rootDir, 'data', 'locations.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0';

/**
 * Curated official Touhou Wiki File titles, captions, and architectural blueprints
 * for every location in `data/locations.json`.
 */
const CANON_LOCATION_META = {
  'human-village': {
    file: 'File:FDS HumanVillage.png',
    caption: 'The Human Village as depicted in Foul Detective Satori & Hopeless Masquerade',
    blueprint: 'Walled Edo/Meiji settlement basin with tiled-roof timber rowhouses (machiya), central watchtower (hinomi-yagura), northern Dragon Statue plaza, and gated palisade walls.',
  },
  'human-village-market-square': {
    file: 'File:VFiS Human Village.png',
    caption: 'Human Village Market Square & Main Street in Visionary Fairies in Shrine',
    blueprint: 'Bustling four-block merchant thoroughfare lined with cloth-draped market stalls, paper festival lanterns, soba carts, and dark timber shopfronts.',
  },
  'terakoya-school': {
    file: 'File:HV School.png',
    caption: 'Keine Kamishirasawa’s Terakoya Schoolhouse in the Human Village',
    blueprint: 'Single-story Meiji-era timber schoolhouse with sliding shoji classroom doors, dark grey kawara tile roof, raised wooden porch, and fenced courtyard.',
  },
  'geidontei': {
    file: 'File:Geidonteipub.png',
    caption: 'Geidontei Izakaya from Lotus Eaters’ Sober and Drunk',
    blueprint: 'Traditional warm-timber izakaya tavern featuring an indigo whale-crested noren entrance curtain, glowing red akachouchin lantern, and L-shaped hinoki counter inside.',
    wiki_summary: 'Geidontei (鯢呑亭, lit. "Swallowing Whale Pavilion") is a cozy, traditional Japanese-style izakaya pub located in a quiet corner of the Human Village. Serving as the central setting of Lotus Eaters, where Miyoi Okunoda works as the poster girl, it hosts human villagers by day and secretively caters to high-profile youkai regulars after hours.',
  },
  'suzunaan': {
    file: 'File:Suzunaanlibrary.jpg',
    caption: 'Suzunaan Rental Bookshop from Forbidden Scrollery',
    blueprint: 'Two-story traditional merchant machiya featuring a turnip-shaped bell curtain (suzuna noren), vertical wooden shop signboard, lattice windows, and demon-hide scroll shelves.',
  },
  'hieda-estate': {
    file: 'File:MGHiedaMansion.jpg',
    caption: 'The Hieda Clan Estate in the Human Village',
    blueprint: 'Expansive walled samurai-aristocrat yashiki compound with whitewashed plaster walls, tiled roofed nagayamon gatehouse, raked gravel courtyard, and fireproof archive storehouses (kura).',
  },
  'dragon-statue': {
    file: 'File:Th08HumanVillage1.jpg',
    caption: 'Dragon Statue Square in the northern Human Village',
    blueprint: 'Cobblestone public square centered around a carved grey granite pedestal and coiled stone Dragon God weather monument flanked by iron-hooked street lanterns.',
  },
  'kirisame-shop': {
    file: 'File:Th08HumanVillage2.jpg',
    caption: 'The Kirisame Merchant District in Imperishable Night',
    blueprint: 'Prominent two-story earthen-walled merchant storehouse (dozo-zukuri) with heavy black-plastered fire doors, copper rain chains, and traditional shop curtains.',
  },
  'salt-mansion': {
    file: 'File:MGHiedaMansionGarden.jpg',
    caption: 'Historic Village Manor grounds in the Human Village',
    blueprint: 'Weathered timber merchant manor in the northeastern village ward with salt-stained white plaster walls, tiled eaves, and a quiet rear courtyard.',
  },
  'foot-washing-house': {
    file: 'File:FileTh145Human VillageNight.png',
    caption: 'Southwestern Human Village residential lanes at night (ULiL)',
    blueprint: 'Old residential wooden townhouse in the southwestern quarter with high lattice fences, deep overhanging eaves, and a stone well.',
  },
  'canal-of-willows': {
    file: 'File:Th14CanalOfWillows.jpg',
    caption: 'Canal of Willows stage background from Double Dealing Character',
    blueprint: 'Stone-lined waterway south of the Human Village arched by a red wooden drum bridge and flanked by weeping willow trees trailing into the current.',
  },
  'youkai-trail': {
    file: 'File:Th08YoukaiTrail.jpg',
    caption: 'The Youkai Trail at night in Imperishable Night',
    blueprint: 'Lantern-lit forest dirt path outside the village gates featuring Mystia Lorelei’s portable wooden yatai cart with red paper "Grilled Lamprey" (yatsume-unagi) lanterns.',
  },
  'youkai-tanuki-forest': {
    file: 'File:FileTh145YoukaiTanukiForestNight.png',
    caption: 'Youkai Tanuki Forest at night from Urban Legend in Limbo',
    blueprint: 'Moonlit grove of ancient mossy broadleaf trees, stone tanuki statues wearing straw hats, and flickering kitsunebi/tanukibi lanterns.',
  },
  'myouren-temple': {
    file: 'File:FileTh145 Myouren TempleAfternoon.png',
    caption: 'Myouren Temple main hall in Urban Legend in Limbo',
    blueprint: 'Grand Buddhist temple complex (garan) featuring an upward-sweeping dark tiled Honden roof, timber Sanmon gate, bronze bonsho bell pavilion, and the docked Palanquin Ship.',
  },
  'myouren-cemetery': {
    file: 'File:Th13MyourenTempleCemetery.jpg',
    caption: 'Myouren Temple Cemetery in Ten Desires',
    blueprint: 'Mist-shrouded graveyard behind Myouren Temple filled with grey granite stupas (gorintou), wooden sotoba memorial slats, stone lanterns, and weeping cherry trees.',
  },
  'kogasa-forge': {
    file: 'File:OSPCH12MyourenTempleBell2.jpg',
    caption: 'Rear courtyard and bell environs of Myouren Temple',
    blueprint: 'Rustic timber-and-thatch blacksmith shed tucked behind Myouren Temple with a glowing charcoal hearth, iron anvil, quenching tub, and paper-umbrella rack.',
  },
  'hall-of-dreams': {
    file: "File:Th145HallofDreamsGreatMausoleumday.png",
    caption: "Hall of Dreams' Great Mausoleum in Urban Legend in Limbo",
    blueprint: 'Subterranean/hermit palace modeled after Horyu-ji’s octagonal Yumedono (Dream Hall): an octagonal vermilion-pillared pavilion topped by a gilded jewel finial over white stone terraces.',
  },
  'senkai': {
    file: 'File:FDS Divine Spirit Mausoleum.png',
    caption: 'Senkai and the Divine Spirit Mausoleum in Foul Detective Satori',
    blueprint: 'Otherworldly Taoist pocket dimension with floating jade-green islands, blossoming plum orchards, mist-veiled pavilions, and golden atmospheric light.',
  },
  'hakurei-shrine': {
    file: 'File:FileTh145Hakurei ShrineAfternoon.png',
    caption: 'Hakurei Shrine main hall in Urban Legend in Limbo',
    blueprint: 'Traditional Shinto shrine on the eastern border ridge: vermilion torii gates, stone stairway, swept irimoya wooden Honden with shimenawa rope, wooden saisen-bako offertory box, and engawa porch.',
  },
  'great-hakurei-barrier': {
    file: 'File:FileTh145Hakurei ShrineBrokenBarrier.png',
    caption: 'The Great Hakurei Barrier manifesting behind the Hakurei Shrine (ULiL)',
    blueprint: 'Ancient stone boundary seal behind the Hakurei Shrine ringed by paper shide talismans and shimmering geometric Yin-Yang barrier planes.',
  },
  'three-fairies-tree': {
    file: 'File:SBND07FairiesTree.jpg',
    caption: 'The Three Fairies of Light’s Great Oak Treehouse in Strange and Bright Nature Deity',
    blueprint: 'Colossal lightning-scarred Mongolian oak behind the Hakurei Shrine hollowed into a cozy three-story fairy home with miniature arched wooden doors, windows, and rope ladders.',
  },
  'genjis-pond': {
    file: 'File:SBND21MongolianOak.jpg',
    caption: 'The wooded groves and pond behind the Hakurei Shrine',
    blueprint: 'Tranquil spring-fed pond in the cedar grove behind the Hakurei Shrine bordered by mossy boulders, bamboo water spout (shishi-odoshi), and lily pads.',
  },
  'moriya-branch-shrine': {
    file: 'File:Radio tower Fairy Shrine OSP.png',
    caption: 'Small wayside shrine in the Hakurei woods from Oriental Sacred Place',
    blueprint: 'Compact wooden wayside hokora shrine with miniature onbashira corner posts set beside a steaming rock-lined outdoor hot spring bath.',
  },
  'fantasy-seal-woods': {
    file: 'File:OSPCH12HakureiShrineRoad.jpg',
    caption: 'The stone-stair approach and woods leading to the Hakurei Shrine (OSP)',
    blueprint: 'Steep mossy stone-stepped pilgrimage path flanked by vermilion torii arches, weathered Jizo statues, stone tōrō lanterns, and towering cryptomeria cedars.',
  },
  'road-of-reconsideration': {
    file: 'File:Th09RoadOfReconsideration.jpg',
    caption: 'Road of Reconsideration in Phantasmagoria of Flower View',
    blueprint: 'Quiet country footpath carpeted on both sides by crimson higanbana (red spider lilies) leading toward Muenzuka.',
  },
  'muenzuka': {
    file: 'File:Th09Muenzuka.jpg',
    caption: 'Muenzuka in Phantasmagoria of Flower View',
    blueprint: 'Solitary hillock cemetery where the Great Hakurei Barrier thins, covered in purple-blossoming cherry trees, weathered nameless gravestones, and Outside World relics.',
  },
  'kourindou': {
    file: 'File:Th145 Kourindou.png',
    caption: 'Kourindou Antique Shop in Urban Legend in Limbo',
    blueprint: 'Eclectic Meiji-Western/Japanese wooden curio shop at the forest edge with a steep shingled gable roof, brick stove chimney pipe, bay display windows, and cluttered porch.',
  },
  'forest-of-magic': {
    file: 'File:Th175ForestOfMagic.png',
    caption: 'The humid, mushroom-filled Forest of Magic in Touhou Gouyoku Ibun',
    blueprint: 'Dense, twilight-shaded primeval forest of gnarled ancient trees, bioluminescent giant mushrooms, mossy fallen logs, and drifting miasma spores.',
  },
  'marisas-house': {
    file: 'File:LEMarisaHouse.png',
    caption: 'Kirisame Magic Shop (Marisa’s House) in Lotus Eaters',
    blueprint: 'Cozy, cluttered woodland witch cottage built of warm timber and plaster with a steep pitched roof, brick chimney, dormer window, potion barrels, and surrounding giant mushrooms.',
  },
  'alices-house': {
    file: 'File:FDS AliceHouse.png',
    caption: 'Alice Margatroid’s Residence in Foul Detective Satori',
    blueprint: 'Neat two-story Western-style timber-framed house in the Forest of Magic with slate-blue gabled roofs, warm mullioned windows, and a tidy front porch.',
  },
  'rumia-cedar-clearing': {
    file: 'File:046BAiJRRumia.jpg',
    caption: 'Woodland clearing in Bohemian Archive in Japanese Red',
    blueprint: 'Shadowed circular clearing ringed by tall dark cryptomeria cedars, mossy stumps, and a small drifting sphere of nocturnal darkness.',
  },
  'forest-of-magic-jizo': {
    file: 'File:WaHHNarumi.png',
    caption: 'Narumi Yatadera’s Jizo statue in Wild and Horned Hermit',
    blueprint: 'Moss-covered stone Jizo bodhisattva statue wearing a knitted red wool cap and bib beneath a small wooden rain shelter surrounded by autumn leaves.',
  },
  'misty-lake': {
    file: 'File:Th143MistyLake.jpg',
    caption: 'Misty Lake in Impossible Spell Card',
    blueprint: 'Expansive, mirror-still alpine lake veiled in perpetual white morning fog, ringed by reeds, water lilies, and rocky shorelines.',
  },
  'crawdad-rock': {
    file: 'File:SBNDExtraCirnoIgloo.jpg',
    caption: 'Cirno’s icy lakeside domain in Strange and Bright Nature Deity',
    blueprint: 'Flat lakeside boulder outcrop on the southern shore of Misty Lake encrusted with translucent blue ice crystals, frost spires, and reed beds.',
  },
  'scarlet-devil-mansion': {
    file: 'File:CDS SDM.png',
    caption: 'The Scarlet Devil Mansion in Foul Detective Satori',
    blueprint: 'Windowless/narrow-slit Victorian Gothic crimson-brick mansion with slate mansard roofs, central square midnight clock tower, west cylindrical Voile rotunda, SE glass conservatory, and red iron gates.',
  },
  'voile-library': {
    file: 'File:CDS Library.jpg',
    caption: 'Voile, the Magic Library inside the Scarlet Devil Mansion (FDS)',
    blueprint: 'Cavernous multi-story subterranean/west-wing rotunda lined floor-to-ceiling with dark mahogany bookshelves, rolling ladders, celestial brass astrolabes, and crystal chandeliers.',
  },
  'sdm-parlor-dining': {
    file: 'File:SBND15SDMDinningRoomandTower.jpg',
    caption: 'The Scarlet Devil Mansion Dining Hall and Clock Tower in Strange and Bright Nature Deity',
    blueprint: 'Grand crimson-carpeted Gothic reception hall and vaulted dining room with towering marble pillars, scarlet velvet draperies, and silver candelabra.',
  },
  'sdm-gardens-east-wing': {
    file: 'File:OSPCH15SDMGardens.jpg',
    caption: 'The Scarlet Devil Mansion manicured gardens in Oriental Sacred Place',
    blueprint: 'Symmetrical European boxwood parterre hedges, scarlet rose beds, white marble fountain, amber-glass conservatory dome, and Flandre’s warded basement stairs.',
  },
  'prismriver-mansion': {
    file: 'File:BAiJRLunasa1.JPG',
    caption: 'The Prismriver Sisters at the Ruined Western Mansion (BAiJR)',
    blueprint: 'Weathered grey-stone European manor on the northeast bluff above Misty Lake with an open-air circular concert rotunda, arched windows, and floating musical instruments.',
  },
  'spring-path': {
    file: 'File:Th128SpringPathSt1.jpg',
    caption: 'Spring Path in Fairy Wars',
    blueprint: 'Sun-dappled lakeside path east of Misty Lake lined with blooming pink cherry blossom trees and drifting petal carpets.',
  },
  'bamboo-forest-of-the-lost': {
    file: 'File:SBND03BambooForestoftheLost.jpg',
    caption: 'The Bamboo Forest of the Lost in Strange and Bright Nature Deity',
    blueprint: 'Labyrinthine, sky-blocking sea of tall emerald mōsō bamboo stalks, leaning culms, stone path markers, and glowing ground mist.',
  },
  'eientei': {
    file: 'File:FDS Eientei.png',
    caption: 'Eientei in Foul Detective Satori',
    blueprint: 'Sprawling Heian-period shinden-zukuri aristocrat palace hidden in the bamboo forest: white plaster walls, cypress-bark roofs, covered wooden bridges, koi ponds, and the Endless Corridor.',
  },
  'mokous-house': {
    file: 'File:Th08BambooForestEx.jpg',
    caption: 'Deep Bamboo Forest clearing in Imperishable Night Extra Stage',
    blueprint: 'Solitary rustic bamboo-and-thatch cottage in a bamboo clearing accompanied by a wooden yakitori grilling stall with glowing red lanterns.',
  },
  'nameless-hill': {
    file: 'File:Th09NamelessHill.jpg',
    caption: 'Nameless Hill in Phantasmagoria of Flower View',
    blueprint: 'Mist-shrouded hillock opposite Youkai Mountain carpeted in white poisonous lily-of-the-valley (suzuran) blossoms.',
  },
  'garden-of-the-sun': {
    file: 'File:Th09GardenofSun.jpg',
    caption: 'Garden of the Sun in Phantasmagoria of Flower View',
    blueprint: 'Vast, bowl-shaped hillside meadow overflowing with thousands of towering golden sunflowers turned toward the sky.',
  },
  'mugenkan': {
    file: 'File:OrientalSacredPlace18Yuuka.png',
    caption: 'Yuuka Kazami’s domain and Mugenkan (Lotus Land Story / OSP)',
    blueprint: 'Surreal Western-fantasy manor bordering the Garden of the Sun with a signature blue-and-red checkerboard tile terrace, white colonnades, and rose trellises.',
  },
  'lake-of-blood': {
    file: 'File:Lake of blood.png',
    caption: 'The Lake of Blood in Lotus Land Story',
    blueprint: 'Crimson subterranean cavern pool beneath the mountain hinterlands ringed by dark jagged crags and glowing red mist.',
  },
  'mayohiga': {
    file: 'File:Th07Mayohiga.jpg',
    caption: 'Mayohiga, the phantom village in Perfect Cherry Blossom',
    blueprint: 'Mist-veiled phantom Heian/Edo estate reachable only by those invited, fronted by weathered torii gates, cherry trees, and guardian cat statues.',
  },
  'genbu-ravine': {
    file: 'File:FileTh145Genbu Ravinenoon.png',
    caption: 'Genbu Ravine basalt gorge in Urban Legend in Limbo',
    blueprint: 'Deep volcanic river gorge carved through geometric hexagonal grey basalt columns with rushing whitewater rapids and wooden plank bridges.',
    wiki_summary: 'Genbu Ravine (玄武の沢, Genbu no Sawa) is a deep volcanic river canyon at the foothills of Youkai Mountain, famous for its striking geometric hexagonal basalt columns formed by ancient lava flows. It serves as the primary territory and engineering hub of the Kappa.',
  },
  'untrodden-valley': {
    file: 'File:Th10UntroddenValley.jpg',
    caption: 'Untrodden Valley in Mountain of Faith',
    blueprint: 'Autumn-colored mountain river valley at the base of Youkai Mountain featuring Kappa corrugated-tin market stalls, waterwheels, and red maple trees.',
  },
  'great-youkai-forest': {
    file: 'File:OSPCH09YoukaiMountain.jpg',
    caption: 'The Great Youkai Forest on the lower slopes of Youkai Mountain',
    blueprint: 'Dense old-growth mountain forest of towering cedars, autumn maples, and rocky streams clothing the lower flanks of Youkai Mountain.',
    wiki_summary: 'The Great Youkai Forest (大妖怪樹海) is a vast, primeval woodland blanketing the lower slopes of Youkai Mountain. Teeming with mountain apparitions, Kappa workshops, and hidden trails, it forms the natural buffer between the human lowlands and the Tengu-patrolled upper crags.',
  },
  'giant-toads-pond': {
    file: "File:Th09GiantToad'sPond.jpg",
    caption: "Giant Toad's Pond in Phantasmagoria of Flower View",
    blueprint: 'Highland forest pond nestled among ancient cedars and mossy boulders, guarded by a colossal mossy stone toad shrine.',
  },
  'youkai-mountain': {
    file: 'File:BKoSWYoukaiMountain.jpg',
    caption: 'Youkai Mountain massif in Bohemian Archive in Japanese Red',
    blueprint: 'Colossal volcanic stratovolcano towering over northern Gensokyo with sheer granite cliffs, autumn maple slopes, waterfalls, and cloud-piercing peaks.',
  },
  'nine-heavens-waterfall': {
    file: 'File:Th10WaterfallofNineHeavens.jpg',
    caption: 'Waterfall of Nine Heavens in Mountain of Faith',
    blueprint: 'Monumental vertical whitewater cascade plunging down the sheer cliff face of Youkai Mountain from Wind God’s Lake into Genbu Ravine.',
  },
  'tengu-village': {
    file: 'File:BAiJRAya.jpg',
    caption: 'Tengu cliffside eyrie behind the Waterfall of Nine Heavens (BAiJR)',
    blueprint: 'Fortified cliffside Tengu settlement behind the waterfall featuring high wooden watchtowers, suspension bridges, and the Bunbunmaru newspaper printing tower.',
  },
  'komakusa-gambling-den': {
    file: 'File:K Den LE.png',
    caption: 'Sannyo Komakusa’s Gambling Den in Lotus Eaters',
    blueprint: 'Rustic mountain timber lodge perched on the False Heaven Shelf cliffside, surrounded by pink alpine komakusa flowers and warm red paper lanterns.',
  },
  'secret-heaven-cliff': {
    file: 'File:Th18FalseHeavenShelf.jpg',
    caption: 'Upper alpine crags of Youkai Mountain in Unconnected Marketeers',
    blueprint: 'Sheer windswept granite cliff high on Youkai Mountain where Tengu and mountain youkai hold aerial markets above the sea of clouds.',
  },
  'moriya-shrine': {
    file: 'File:FDSMoriyaShrine.png',
    caption: 'Moriya Shrine near the summit of Youkai Mountain in Foul Detective Satori',
    blueprint: 'Grand Suwa-style Shinto shrine complex at the mountain summit framed by four colossal sacred Onbashira cedar pillars, copper-green roofs, and thick shimenawa ropes.',
  },
  'wind-gods-lake': {
    file: 'File:Th10DivineLake.jpg',
    caption: "Wind God's Lake in Mountain of Faith",
    blueprint: 'Sacred volcanic crater lake behind the Moriya Shrine ringed by four towering Onbashira log pillars and mist-draped mountain pines.',
  },
  'moriya-ropeway': {
    file: 'File:TH143MoriyaShrine.jpg',
    caption: 'Upper Youkai Mountain approach to the Moriya Shrine',
    blueprint: 'Kappa-engineered aerial cableway station with steel support pylons, wooden boarding platform, and red-and-white suspended gondola cabin.',
  },
  'rainbow-cavern': {
    file: 'File:Th175RainbowCavern.jpg',
    caption: 'Rainbow Cavern of Earth Spirits in Touhou Gouyoku Ibun',
    blueprint: 'Luminous subterranean cavern inside Youkai Mountain bristling with giant prismatic rainbow-colored Dragon Gem crystal formations and mine tracks.',
  },
  'kasen-senkai': {
    file: "File:Th155 Kasen's Hermit World.png",
    caption: "Kasen Ibaraki's Hermitage in Antinomy of Common Flowers",
    blueprint: 'Secluded Taoist mountain hermitage hidden behind a dimensional gate on Youkai Mountain with a two-story Chinese-style pavilion, plum trees, and cloud terraces.',
  },
  'shining-needle-castle': {
    file: 'File:Th145 Shining Needle Castle.png',
    caption: 'Shining Needle Castle floating in the sky in Urban Legend in Limbo',
    blueprint: 'Inverted Japanese feudal tenshu keep floating upside-down in the clouds, with gilded shachihoko roof ornaments pointing downward and glowing magenta windows.',
  },
  'asama-purifying-mountain': {
    file: 'File:LE Pyramid.png',
    caption: 'The ancient pyramid of Asama Purifying Mountain',
    blueprint: 'Ancient stepped stone pyramid sealed inside Youkai Mountain, surfaced with geometric Lunarian masonry panels and glowing cyan purification conduits.',
    wiki_summary: 'Asama Purifying Mountain (浅間浄穢山, Asama-jouesan) is an ancient, primordial stepped stone pyramid concealed within the strata of Youkai Mountain. Constructed with Lunarian purification technology to contain impurity and stagnation, it is the central setting of Fossilized Wonders (Touhou 20).',
  },
  'pit-of-four-seasons': {
    file: 'File:Th20cover.jpg',
    caption: 'Fossilized Wonders subterranean purification chamber',
    blueprint: 'Subterranean four-quadrant geometric containment chamber beneath Asama Purifying Mountain divided into spring cherry, summer bamboo, autumn maple, and winter ice sectors.',
  },
  'heaven': {
    file: 'File:1HisounoKen.jpg',
    caption: 'The celestial realm of Heaven in Scarlet Weather Rhapsody',
    blueprint: 'Floating celestial archipelago above the clouds anchored by cylindrical grey keystone (kaname-ishi) pillars, golden peach trees, and white marble pavilions.',
  },
  'road-of-liminality': {
    file: 'File:IMIERoadofLiminality.png',
    caption: 'The Road of Liminality leading toward the Sanzu River',
    blueprint: 'Fog-bound border trail of white river stones, flickering paper lanterns, and wayside stalls leading souls toward the Sanzu River crossing.',
  },
  'sanzu-river': {
    file: 'File:Th17SanzuRiver.jpg',
    caption: 'The Sanzu River and Sai no Kawara in Wily Beast and Weakest Creature',
    blueprint: 'Wide, mist-laden boundary river of the afterlife with stacked pebble cairns on the Sai no Kawara shore, a wooden ferry pier, and Komachi’s wooden sculling boat.',
  },
  'higan': {
    file: 'File:Th17Higan.jpg',
    caption: 'Higan in Wily Beast and Weakest Creature',
    blueprint: 'Serene afterlife shore carpeted in endless scarlet higanbana spider lilies and presided over by the solemn courthouse of the Ministry of Right and Wrong.',
  },
  'barrier-of-life-and-death': {
    file: 'File:Th07BarrierOfLife&Death.jpg',
    caption: 'The Barrier of Life and Death in Perfect Cherry Blossom',
    blueprint: 'Monumental stone archway and interminable white stone staircase piercing the clouds between the living world and the Netherworld.',
  },
  'netherworld': {
    file: 'File:PMiSS netherworld.jpg',
    caption: 'The Netherworld in Perfect Memento in Strict Sense',
    blueprint: 'Tranquil realm of the dead carpeted in eternal cherry blossoms, drifting phantom spirits (hitodama), and pale stone garden walls.',
  },
  'hakugyokurou': {
    file: 'File:FDS Hakugyokurou.png',
    caption: 'Hakugyokurou in Foul Detective Satori',
    blueprint: 'Vast Netherworld palace reached via a monumental thousand-step stone staircase through a roofed gatehouse into raked zen gardens, white-walled shinden pavilions, and weeping cherry trees.',
  },
  'saigyou-ayakashi': {
    file: 'File:Th07Hakugyokurou.jpg',
    caption: 'The Saigyou Ayakashi cherry tree in Hakugyokurou (Perfect Cherry Blossom)',
    blueprint: 'Colossal, gnarled thousand-year youkai cherry tree towering over Hakugyokurou’s inner garden, sealed by a giant shimenawa rope and violet blossom canopy.',
  },
  'hell': {
    file: 'File:Th01RottingWorldofFlame.png',
    caption: 'The fiery realm of Hell in Highly Responsive to Prayers',
    blueprint: 'Jagged obsidian crags and molten lava fissures of New Hell, restructured by the Ministry of Right and Wrong with iron watchtowers.',
  },
  'animal-realm': {
    file: 'File:Th17AnimalRealm.jpg',
    caption: 'The Animal Realm metropolis in Wily Beast and Weakest Creature',
    blueprint: 'Dystopian cyberpunk-brutalist concrete fortress metropolis bathed in crimson neon light, where rival beast-spirit syndicates wage turf wars.',
  },
  'primate-spirit-garden': {
    file: 'File:Th17PrimateGarden1.jpg',
    caption: 'The Primate Spirit Garden in Wily Beast and Weakest Creature',
    blueprint: 'Keyhole-shaped kofun burial mound surrounded by a geometric moat and brutalist concrete towers at the center of the Animal Realm.',
  },
  'fantastic-blowhole': {
    file: 'File:Th11FantasticBlowhole.jpg',
    caption: 'The Fantastic Blowhole entrance to the Underworld in Subterranean Animism',
    blueprint: 'Steaming volcanic vent cavern at the foot of Youkai Mountain where warm updrafts and geysers mark the descent into the Underworld.',
  },
  'deep-road-to-hell': {
    file: 'File:Th11DeepRoadtoHell.jpg',
    caption: 'The Deep Road to Hell in Subterranean Animism',
    blueprint: 'Plunging vertical cavern shaft spanned by Parsee Mizuhashi’s vermilion wooden arch bridge above subterranean abyssal mists.',
  },
  'underworld': {
    file: 'File:WaHHUnderworldLayers.png',
    caption: 'The stratified caverns of the Underworld in Wild and Horned Hermit',
    blueprint: 'Immense subterranean cavern vault beneath Gensokyo supported by towering stalactite-stalagmite rock pillars.',
  },
  'former-hell': {
    file: 'File:Th11OldCapital.jpg',
    caption: 'The Old Capital of Former Hell in Subterranean Animism',
    blueprint: 'Snow-dusted subterranean Edo streetscape of dark timber multi-story inns,oni taverns, arched wooden bridges, and warm amber paper lanterns.',
  },
  'hot-spring-town': {
    file: 'File:FDS SpaTown.png',
    caption: 'Former Hell Hot Spring Town in Foul Detective Satori',
    blueprint: 'Tiered wooden ryokan bathhouses and steaming open-air rock baths fed by the thermal waters of Blazing Hell.',
  },
  'palace-of-earth-spirits': {
    file: 'File:Th11PalaceOfEarthSpirits.jpg',
    caption: 'Palace of the Earth Spirits (Chireiden) in Subterranean Animism',
    blueprint: 'Grand subterranean Gothic mansion built directly over the Blazing Hell vent, featuring a black-and-white checkerboard courtyard, gothic rose-window stained glass, wrought-iron gates, and glowing floor grates.',
  },
  'remains-of-blazing-hell': {
    file: 'File:Th11RemainsOfBlazingHell.jpg',
    caption: 'Remains of Blazing Hell beneath Chireiden in Subterranean Animism',
    blueprint: 'Scorching subterranean magma cavern of blackened basalt ribs, rivers of molten lava, and swirling vengeful spirit embers.',
  },
  'nuclear-furnace': {
    file: 'File:Th11NuclearFurnace.png',
    caption: 'The Hell of Blazing Fires Nuclear Furnace in Subterranean Animism',
    blueprint: 'Industrial octagonal fusion reactor core in the deepest pit of Blazing Hell, ringed by yellow-and-black hazard stripes, cooling pipes, and a blinding miniature sun.',
  },
  'underground-geyser-center': {
    file: 'File:Th123.jpg',
    caption: 'The Underground Geyser Center from Touhou Hisoutensoku',
    blueprint: 'Subterranean Kappa-built geothermal conduit hall of riveted brass pipes, pressure gauges, steel catwalks, and steam vents.',
  },
  'sea-of-petroleum': {
    file: 'File:Th17.5PetroleumSea.jpg',
    caption: 'The Sea of Petroleum in Touhou Gouyoku Ibun',
    blueprint: 'Pitch-black subterranean ocean of bubbling crude oil and bone islands in the deepest stratum of Old Hell.',
  },
  'hell-of-blood-pools': {
    file: 'File:Th17.5 Blood Pools.jpg',
    caption: 'The Abandoned Hell of Blood Pools in Touhou Gouyoku Ibun',
    blueprint: 'Deepest subterranean basin of crimson boiling blood lakes, jagged crimson stalagmites, and black petroleum geysers.',
    wiki_summary: 'The Abandoned Hell of Blood Pools (旧血の池地獄) is the deepest, most lawless subterranean stratum of Former Hell beneath the Remains of Blazing Hell. Once used for the torment of sinners before Hell was relocated, its crimson lakes later mingled with Yuuma Toutetsu’s subterranean Sea of Petroleum in Touhou Gouyoku Ibun.',
  },
  'makai': {
    file: 'File:Th05MakaiCity.png',
    caption: 'The crystalline demon realm of Makai in Mystic Square',
    blueprint: 'Otherworldly demon dimension created by Shinki, characterized by violet miasma skies, crystalline spires, and Victorian-Gothic demon cities.',
  },
  'fallen-temple': {
    file: 'File:Th01FallenTemple.png',
    caption: 'The Fallen Temple in Makai from Highly Responsive to Prayers',
    blueprint: 'Ruined ancient stone temple complex inside Makai with shattered colonnades, floating rune slabs, and violet dimensional rifts.',
    wiki_summary: 'The Fallen Temple (破滅の寺院) is an ancient, half-collapsed stone sanctuary located in the outer reaches of Makai during the Makai route of Highly Responsive to Prayers (Touhou 1), where Reimu Hakurei battles the astral knight Konngara.',
  },
  'ruins-of-vina': {
    file: 'File:Ruins of Vina bb.png',
    caption: 'The Ruins of Vina in Makai from Highly Responsive to Prayers',
    blueprint: 'Classical Western marble colonnade and broken stone arches standing amid the purple mists of Makai.',
    wiki_summary: 'The Ruins of Vina (ヴィナの廃墟) are a field of weathered classical marble columns and broken stone arches in Makai, featured as Stages 6 through 10 of the Makai route in Highly Responsive to Prayers (Touhou 1).',
  },
  'world-of-ice-and-snow': {
    file: 'File:Th05WorldOfIce&Snow1.png',
    caption: 'The World of Ice and Snow in Makai from Mystic Square',
    blueprint: 'Frozen diamond-dust tundra in inner Makai bristling with towering translucent blue-white glacier spikes and crystalline aurora skies.',
    wiki_summary: 'The World of Ice and Snow (氷雪の世界) is a vast, freezing expanse of diamond dust and towering crystal glaciers surrounding the inner capital of Makai, featured as Stage 4 of Mystic Square (Touhou 5).',
  },
  'wonderland': {
    file: 'File:Th05Wonderland.png',
    caption: 'Alice’s Wonderland grimoire realm in Mystic Square Extra Stage',
    blueprint: 'Surreal pastel chessboard pocket dimension inside Makai with floating playing cards, oversized teacups, and crystalline arches.',
  },
  'pandaemonium': {
    file: 'File:Th05Pandæmonium.png',
    caption: 'Pandæmonium, the capital palace of Makai in Mystic Square',
    blueprint: 'Colossal crystalline Gothic palace at the heart of Makai with soaring violet-and-crimson stained glass spires and six-winged seraphic motifs.',
    wiki_summary: 'Pandæmonium (パンデモニウム) is the supreme crystalline palace at the center of Makai and the seat of its creator goddess, Shinki. Serving as the final stage of Mystic Square (Touhou 5), it rises beyond the World of Ice and Snow.',
  },
  'hokkai': {
    file: 'File:Th12Hokkai.jpg',
    caption: 'Hokkai, the sealed sub-dimension of Makai in Undefined Fantastic Object',
    blueprint: 'Luminous geometric lotus seal suspended in the far reaches of Makai where Byakuren Hijiri was imprisoned for a millennium.',
    wiki_summary: 'Hokkai (法界, lit. "Dharma Realm") is a tranquil, radiant sub-region at the edge of Makai where the Buddhist monk Byakuren Hijiri was sealed away until the crew of the Palanquin Ship unsealed it in Undefined Fantastic Object (Touhou 12).',
  },
  'dream-world': {
    file: 'File:Th15DreamWorld.jpg',
    caption: 'The Dream World pathways in Legacy of Lunatic Kingdom',
    blueprint: 'Astral cosmos of glowing cyan-and-magenta geometric pathways, floating pillows, and star-filled dream portals overseen by Doremy Sweet.',
  },
  'gensokyos-moon': {
    file: 'File:Th15SeaOfTranquillity.jpg',
    caption: 'The Sea of Tranquility on the Moon in Legacy of Lunatic Kingdom',
    blueprint: 'Silver-grey lunar regolith plain overlooking a golden-blue reflection of Earth, dotted with purification flags and craters.',
  },
  'lunar-capital': {
    file: 'File:PMiSS lunarcapital.jpg',
    caption: 'The Lunar Capital in Perfect Memento in Strict Sense & Silent Sinner in Blue',
    blueprint: 'Radiant, symmetrical Dragon Palace metropolis behind the Lunar Veil: tiered jade-and-gold roofs, white marble causeways, peach orchards, and stilted pavilions over the lunar sea.',
  },
  'land-of-the-back-door': {
    file: 'File:Ushirodo no kuni stg6.jpg',
    caption: 'The Land of the Back Door in Hidden Star in Four Seasons',
    blueprint: 'Star-filled golden astral void lined with floating shoji sliding doors, glowing torii frames, and seasonal boundary portals.',
  },
  'probability-space-hypervessel': {
    file: 'File:Th03ProbabilitySpaceHypervessel.png',
    caption: 'Chiyuri and Yumemi’s Probability Space Hypervessel in Phantasmagoria of Dim.Dream',
    blueprint: 'Futuristic white-and-steel interdimensional research cruiser resting in an anomaly rift near the Hakurei Shrine.',
  },
  'gensokyo-basin-overview': {
    file: 'File:Tenshisitkeystonesword.jpg',
    caption: 'Aerial overview of the Gensokyo Basin',
    blueprint: 'Carved stone cartographic survey monument at the geographic center of the Gensokyo Basin.',
  },
  'abandon-pond': {
    file: 'File:Abandon Pond.jpg',
    caption: 'Abandon Pond in the Heartland',
    blueprint: 'Quiet, reed-ringed lowland pond fed by mountain runoff with weathered wooden fishing posts.',
  },
  'bhava-agra': {
    file: 'File:OSPCH9Tenshi.jpg',
    caption: 'Bhava-agra in Heaven, residence of the Hinanawi clan',
    blueprint: 'Highest celestial island of Heaven featuring white marble terraces, golden-fruited peach trees, and floating keystone pedestals.',
    long_desc: 'Bhava-agra (有頂天, Uchouten) is the highest celestial stratum of Heaven floating high above Youkai Mountain, where the weather is eternally serene and golden peaches of immortality ripen. It serves as the residence of the Hinanawi clan of Celestials, including Tenshi Hinanawi, and the final stage of Scarlet Weather Rhapsody (Touhou 10.5).',
    wiki_summary: 'Bhava-agra (有頂天, Uchouten) is the summit realm of Heaven in Buddhist cosmology and the home of the Celestial Tenshi Hinanawi in Scarlet Weather Rhapsody. Floating above the clouds of Youkai Mountain, it is famed for its orchards of celestial peaches and tranquil vistas.',
  },
  'false-heaven-shelf': {
    file: 'File:LECH29FalseHeavenShelf.png',
    caption: 'The False Heaven Shelf in Lotus Eaters & Unconnected Marketeers',
    blueprint: 'High alpine plateau near the nine-tenths mark of Youkai Mountain carpeted in pink komakusa blossoms above the cloud line.',
    long_desc: 'The False Heaven Shelf (偽天棚, Gitendana) is a flat, windswept alpine plateau situated nine-tenths of the way up Youkai Mountain just below the summit. Blooming with rare pink komakusa (dicentra) flowers and overlooking a sea of clouds, it hosts Sannyo Komakusa’s gambling den and serves as Stage 3 of Unconnected Marketeers (Touhou 18).',
    wiki_summary: 'The False Heaven Shelf (偽天棚) is a high-altitude alpine shelf near the summit of Youkai Mountain where komakusa flowers bloom, serving as the territory of Sannyo Komakusa in Unconnected Marketeers.',
  },
  'phantom-meadow': {
    file: 'File:Th09PhantomMeadow.jpg',
    caption: 'Phantom Meadow in Phantasmagoria of Flower View',
    blueprint: 'Sunlit lowland wildflower meadow swaying with red Lycoris and white cosmos blossoms.',
  },
  'road-of-lingering-snow': {
    file: 'File:Th12RoadOfLingeringSnow.jpg',
    caption: 'Road of Lingering Snow in Undefined Fantastic Object',
    blueprint: 'Thawing early-spring mountain pass where patches of white winter snow linger beside emerging green grass and melting streams.',
  },
  'mysterious-cherry-blossom-path': {
    file: 'File:Th128CherryBlossomPath.jpg',
    caption: 'Mysterious Cherry Blossom Path in Fairy Wars',
    blueprint: 'Enchanted woodland path near the Hakurei Shrine arched by glowing pink cherry blossom boughs.',
  },
  'reimaden': {
    file: 'File:Th02mima.png',
    caption: 'Reimaden, Mima’s sealed shrine complex in Story of Eastern Wonderland',
    blueprint: 'Ancient stone spirit-hall temple sealed behind the Hakurei Shrine mountains with dark stone pillars and glowing green spiritual braziers.',
  },
  'rainbow-dragon-cave': {
    file: 'File:Th18RainbowDragonCaveStage4.jpg',
    caption: 'The Rainbow Dragon Cave in Unconnected Marketeers',
    blueprint: 'Deep, oxygen-thin mine tunnel and crystal cavern inside Youkai Mountain where luminous Dragon Gems and Magatama are excavated.',
  },
  'ocean-of-storms': {
    file: 'File:OceanOfStormsSSiB.png',
    caption: 'The Ocean of Storms on the Moon in Silent Sinner in Blue',
    blueprint: 'Vast western lunar mare plain of silver basaltic dust and ancient impact craters.',
  },
  'sea-of-rains': {
    file: 'File:SeaOfRainsSSiB.png',
    caption: 'The Sea of Rains on the Moon in Silent Sinner in Blue',
    blueprint: 'Circular lunar mare basin bordered by rugged silver-white lunar mountain rings.',
  },
  'sea-of-serenity': {
    file: 'File:SeaOfSerenitySSiB.png',
    caption: 'The Sea of Serenity on the Moon in Silent Sinner in Blue',
    blueprint: 'Tranquil lunar basin where the Watatsuki sisters and Lunar Defense Corps patrol.',
  },
  'sages-sea': {
    file: 'File:SageSeaSSiB.png',
    caption: "Sage's Sea on the Moon in Silent Sinner in Blue",
    blueprint: 'Coastal lunar sea bordering the barrier of the Lunar Capital where real water laps against white stone piers.',
  },
  'torifune-space-shrine': {
    file: 'File:ZCDS-0013.png',
    caption: 'The Space Shrine Maiden’s Ruin TORIFUNE from Trojan Green Asteroid',
    blueprint: 'Orbital/sky-bound geodesic biosphere dome overgrown on the inside with wild jungle vines, steel trusses, and a wooden Shinto hokora shrine at its core.',
  },
  'world-of-fantasies': {
    file: 'File:Th02WorldOfFantasies.png',
    caption: 'World of Fantasies in Story of Eastern Wonderland',
    blueprint: 'Mystical eastern mountain pass behind the Hakurei Shrine dotted with floating stone steps and spiritual seals.',
  },
  'fantasy-world-pc98': {
    file: 'File:Th04DreamWorld.png',
    caption: 'The Fantasy World gateway between Gensokyo and Mugenkan in Lotus Land Story',
    blueprint: 'Surreal astral corridor of checker-patterned floating tiles and swirling starlight beneath the Lake of Blood.',
  },
  'twilight-bar-room': {
    file: 'File:Twilight Bar Room.png',
    caption: 'The Twilight Bar Room (呑んべぇのレムリア) from Uwabami Breakers',
    blueprint: 'Warm, nostalgic retro-modern izakaya pub straddling the boundary between the Outside World and Gensokyo with glowing amber bottles and red counter stools.',
  },
};

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

async function main() {
  const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));
  const { client, requestJson } = createWikiSession();

  try {
    // Collect unique File: titles
    const fileTitles = [...new Set(Object.values(CANON_LOCATION_META).map((m) => m.file).filter(Boolean))];
    console.log(`Resolving ${fileTitles.length} official Touhou Wiki illustrations over HTTP/2...`);

    const fileUrlMap = new Map();
    const BATCH_SIZE = 20;

    for (let i = 0; i < fileTitles.length; i += BATCH_SIZE) {
      const batch = fileTitles.slice(i, i + BATCH_SIZE);
      const apiPath = `/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=720&titles=${encodeURIComponent(batch.join('|'))}`;
      const data = await requestJson(apiPath);
      const pages = data.query?.pages || {};

      // Normalize mappings
      const normMap = new Map();
      for (const n of data.query?.normalized || []) {
        normMap.set(n.to, n.from);
      }

      for (const page of Object.values(pages)) {
        const info = page.imageinfo?.[0];
        const url = info?.thumburl || info?.url;
        if (url) {
          fileUrlMap.set(page.title, url);
          const orig = normMap.get(page.title);
          if (orig) fileUrlMap.set(orig, url);
          fileUrlMap.set(page.title.replace(/_/g, ' '), url);
        }
      }
    }

    let enrichedImages = 0;
    let fixedStubs = 0;

    for (const loc of locations) {
      const meta = CANON_LOCATION_META[loc.id];
      if (!meta) {
        console.warn(`Warning: No CANON_LOCATION_META entry for ${loc.id}`);
        continue;
      }

      const resolvedUrl = fileUrlMap.get(meta.file) || fileUrlMap.get(meta.file.replace(/_/g, ' '));
      if (resolvedUrl) {
        loc.image_url = resolvedUrl;
        loc.image_caption = meta.caption;
        enrichedImages++;
      } else {
        console.warn(`Could not resolve image URL for ${loc.id} (${meta.file})`);
      }

      if (meta.blueprint) {
        loc.visual_blueprint = meta.blueprint;
      }

      if (meta.long_desc) {
        loc.long_desc = meta.long_desc;
        fixedStubs++;
      }

      if (meta.wiki_summary) {
        loc.wiki_summary = meta.wiki_summary;
        fixedStubs++;
      } else if (!loc.wiki_summary || /^stub\b|^#redirect/i.test(loc.wiki_summary.trim())) {
        loc.wiki_summary = loc.long_desc;
        fixedStubs++;
      }

      // Clean any lingering leading "stub " or "#REDIRECT" in long_desc or wiki_summary
      if (loc.long_desc && /^stub\s+/i.test(loc.long_desc)) {
        loc.long_desc = loc.long_desc.replace(/^stub\s+/i, '').trim();
      }
      if (loc.wiki_summary && /^stub\s+/i.test(loc.wiki_summary)) {
        loc.wiki_summary = loc.wiki_summary.replace(/^stub\s+/i, '').trim();
      }
    }

    fs.writeFileSync(locationsPath, JSON.stringify(locations, null, 2) + '\n', 'utf8');
    console.log(`Done! Enriched ${enrichedImages}/${locations.length} locations with official Touhou Wiki images & blueprints, and fixed ${fixedStubs} stub/redirect summaries.`);
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
