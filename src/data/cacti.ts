import { CactusVariety } from '../types';

export const CACTUS_VARIETIES: CactusVariety[] = [
  {
    id: 'saguaro_sprout',
    name: 'Saguaro Sprout',
    latinName: 'Carnegiea gigantea (juv.)',
    requiredStreak: 0,
    description: 'Your starter companion! A cheerful little seedling bursting with thirst and curious energy.',
    funFact: 'In the wild, baby saguaros spend their first years hiding under "nurse trees" like desert ironwood.',
    colorFamily: '#22c55e',
    bloomType: 'White Blossom',
    rarity: 'Starter',
  },
  {
    id: 'barrel_cactus',
    name: 'Barrel Cactus',
    latinName: 'Ferocactus wislizeni',
    requiredStreak: 10,
    description: 'A robust, round globe with pleated ribs and hooked coral spines that loves soaking up every drop.',
    funFact: 'Barrel cacti often tilt toward the southwest to avoid sunburn, earning the nickname "Compass Cactus"!',
    colorFamily: '#10b981',
    bloomType: 'Golden Ring Flower',
    rarity: 'Common',
  },
  {
    id: 'prickly_pear',
    name: 'Prickly Pear',
    latinName: 'Opuntia ficus-indica',
    requiredStreak: 20,
    description: 'Distinctive flattened beaver-tail pads that produce vibrant magenta blossoms and sweet nectar.',
    funFact: 'Its edible fruit ("tuna") has been cultivated in the Americas for over 9,000 years.',
    colorFamily: '#059669',
    bloomType: 'Pink Silk Bloom',
    rarity: 'Rare',
  },
  {
    id: 'giant_saguaro',
    name: 'Giant Saguaro',
    latinName: 'Carnegiea gigantea (mat.)',
    requiredStreak: 30,
    description: 'The iconic monarch of the Sonoran Desert, standing tall with majestic upward-reaching arms.',
    funFact: 'A full-grown giant saguaro can weigh up to 4,800 pounds and drink 200 gallons during a heavy rainstorm!',
    colorFamily: '#15803d',
    bloomType: 'Arizona Crown Flower',
    rarity: 'Rare',
  },
  {
    id: 'moon_cactus',
    name: 'Ruby Moon Cactus',
    latinName: 'Gymnocalycium mihanovichii',
    requiredStreak: 40,
    description: 'A striking neon ruby cap grafted onto a rich green stalk. Lacks chlorophyll, making it a vivid gem.',
    funFact: 'Moon cacti come in fiery crimson, orange, and hot pink because they express anthocyanin pigments.',
    colorFamily: '#e11d48',
    bloomType: 'Ruby Starburst',
    rarity: 'Epic',
  },
  {
    id: 'golden_barrel',
    name: 'Golden Barrel',
    latinName: 'Echinocactus grusonii',
    requiredStreak: 50,
    description: 'Affectionately known as "Golden Ball", this shimmering specimen glows under the sun with golden spines.',
    funFact: 'Prized by botanical gardens worldwide for its mesmerizing geometric golden radial symmetry.',
    colorFamily: '#eab308',
    bloomType: 'Sunburst Halo',
    rarity: 'Epic',
  },
  {
    id: 'star_astrophytum',
    name: 'Star Astrophytum',
    latinName: 'Astrophytum myriostigma',
    requiredStreak: 60,
    description: 'A spineless, sculptural masterpiece with five distinct star ribs speckled with millions of white dots.',
    funFact: 'Also called "Bishop\'s Cap" because its five-fold symmetry resembles an ancient ecclesiastical miter.',
    colorFamily: '#0d9488',
    bloomType: 'Celestial Silk Bloom',
    rarity: 'Legendary',
  },
];

/**
 * Returns a distinct cactus variety for each calendar day to provide
 * daily botanical diversity and fresh motivation.
 */
export const getDailyCactusForDate = (dateStr: string): CactusVariety => {
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10) || 2026;
    const month = (parseInt(parts[1], 10) || 1) - 1;
    const day = parseInt(parts[2], 10) || 1;
    const d = new Date(year, month, day);

    // Calculate day index within the calendar year
    const startOfYear = new Date(year, 0, 1);
    const diffTime = d.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = Math.abs(dayOfYear) % CACTUS_VARIETIES.length;

    return CACTUS_VARIETIES[index];
  } catch {
    return CACTUS_VARIETIES[0];
  }
};

/**
 * Returns the upcoming cactus variety that will appear tomorrow.
 */
export const getTomorrowDailyCactus = (dateStr: string): CactusVariety => {
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10) || 2026;
    const month = (parseInt(parts[1], 10) || 1) - 1;
    const day = (parseInt(parts[2], 10) || 1) + 1;
    const d = new Date(year, month, day);
    const nextDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return getDailyCactusForDate(nextDateStr);
  } catch {
    return CACTUS_VARIETIES[1];
  }
};

