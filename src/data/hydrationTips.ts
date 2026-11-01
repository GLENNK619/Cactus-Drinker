export interface HydrationTip {
  id: string;
  title: string;
  fact: string;
  category: 'Brain' | 'Vitality' | 'Fitness' | 'Health' | 'Habits' | 'Desert Wisdom';
  tag: string;
}

export const HYDRATION_TIPS: HydrationTip[] = [
  {
    id: 'tip_1',
    title: 'Brain Power & Focus',
    fact: 'Your brain is roughly 73% water. Even mild dehydration of just 1-2% can measurably impair concentration, short-term memory, and alertness.',
    category: 'Brain',
    tag: 'Cognition',
  },
  {
    id: 'tip_2',
    title: 'The Morning Kickstart',
    fact: 'Drinking a glass of water right after waking up helps jumpstart your metabolism, activates internal organs, and counters natural overnight fluid loss.',
    category: 'Habits',
    tag: 'Morning Routine',
  },
  {
    id: 'tip_3',
    title: 'Natural Energy Recharge',
    fact: 'Fatigue is one of the very first signs of dehydration. Before reaching for another cup of coffee, try drinking a full glass of water first.',
    category: 'Vitality',
    tag: 'Energy',
  },
  {
    id: 'tip_4',
    title: 'Pre-Meal Digestion Boost',
    fact: 'Drinking water about 30 minutes before a meal aids digestion and helps your body properly absorb vital micronutrients from food.',
    category: 'Health',
    tag: 'Digestion',
  },
  {
    id: 'tip_5',
    title: 'Athletic Muscle Protection',
    fact: 'Muscle tissue is about 75% water. Adequate hydration cushions your joints, prevents painful muscle cramps, and accelerates post-workout recovery.',
    category: 'Fitness',
    tag: 'Athletics',
  },
  {
    id: 'tip_6',
    title: 'Cactus Survival Secret',
    fact: 'Desert cacti can store hundreds of litres of water for months. Like a cactus, consistent gradual sips keep your cells resilient and thriving.',
    category: 'Desert Wisdom',
    tag: 'Nature Fact',
  },
  {
    id: 'tip_7',
    title: 'Headache Prevention',
    fact: 'Dehydration causes temporary shrinkage in brain tissue volume, triggering tension headaches. A cold glass of water is often the best remedy.',
    category: 'Health',
    tag: 'Wellness',
  },
  {
    id: 'tip_8',
    title: 'Glowing Skin Elasticity',
    fact: 'Proper cellular hydration supports collagen synthesis and flushes toxins, giving skin a healthier tone, improved elasticity, and a natural glow.',
    category: 'Vitality',
    tag: 'Skin Health',
  },
  {
    id: 'tip_9',
    title: 'Sip Gradually, Not All at Once',
    fact: 'Drinking water evenly throughout the day gives your kidneys and digestive system time to absorb fluids effectively without overwhelming your bladder.',
    category: 'Habits',
    tag: 'Smart Hydration',
  },
  {
    id: 'tip_10',
    title: 'Internal Climate Control',
    fact: 'Water regulates core body temperature through sweat and respiration. In hot weather or dry air, fluid requirements increase by up to 20%.',
    category: 'Health',
    tag: 'Temperature',
  },
  {
    id: 'tip_11',
    title: 'Natural Detox Partner',
    fact: 'Your kidneys filter around 120-150 quarts of blood daily. Drinking enough water keeps minerals diluted and prevents kidney stones from forming.',
    category: 'Health',
    tag: 'Kidney Function',
  },
  {
    id: 'tip_12',
    title: 'Hydration vs Hunger',
    fact: 'The hypothalamus regulates both thirst and hunger. Often when you experience sudden mid-afternoon food cravings, your body is actually asking for water.',
    category: 'Brain',
    tag: 'Appetite',
  },
  {
    id: 'tip_13',
    title: 'Joint Lubrication',
    fact: 'The cartilage in joints and spinal discs contains roughly 80% water. Good long-term hydration reduces friction and preserves smooth mobility.',
    category: 'Fitness',
    tag: 'Joint Health',
  },
  {
    id: 'tip_14',
    title: 'Mood & Emotional Balance',
    fact: 'Studies show that staying properly hydrated reduces feelings of tension, irritability, and anxiety, promoting a calm and balanced state of mind.',
    category: 'Brain',
    tag: 'Mental Clarity',
  },
];

/**
 * Returns the deterministic tip of the day based on the calendar date (YYYY-MM-DD).
 */
export function getDailyTip(dateStr?: string, offset = 0): HydrationTip {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  // Simple deterministic hash of the date string
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = (hash << 5) - hash + targetDate.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash + offset) % HYDRATION_TIPS.length;
  return HYDRATION_TIPS[index];
}
