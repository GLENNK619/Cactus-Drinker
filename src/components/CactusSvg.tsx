import React from 'react';
import { POT_DESIGNS } from '../data/pots';

interface CactusSvgProps {
  cactusId: string;
  growthPercentage: number; // 0 to 100
  potId: string;
  size?: number;
  isWatering?: boolean;
}

export const CactusSvg: React.FC<CactusSvgProps> = ({
  cactusId,
  growthPercentage,
  potId,
  size = 280,
  isWatering = false,
}) => {
  const pot = POT_DESIGNS.find((p) => p.id === potId) || POT_DESIGNS[0];
  const pct = Math.min(100, Math.max(0, growthPercentage));
  const t = pct / 100; // 0.0 to 1.0 continuous factor

  // Growth Stage (1 to 5)
  // Stage 1: 0% - 15% (Sprout emerging from soil)
  // Stage 2: 20% - 40% (Young growing cactus)
  // Stage 3: 45% - 70% (Branching & expanding)
  // Stage 4: 75% - 95% (Nearly mature & Budding)
  // Stage 5: 100% (Fully grown & Blooming)
  let stage = 1;
  if (pct >= 100) stage = 5;
  else if (pct >= 75) stage = 4;
  else if (pct >= 45) stage = 3;
  else if (pct >= 20) stage = 2;

  // Plant body color schemes based on variety
  const getCactusColors = () => {
    switch (cactusId) {
      case 'barrel_cactus':
        return {
          main: '#10b981',
          dark: '#047857',
          light: '#34d399',
          spine: '#fef08a',
          flower: '#facc15',
          flowerAccent: '#ca8a04',
        };
      case 'prickly_pear':
        return {
          main: '#059669',
          dark: '#065f46',
          light: '#10b981',
          spine: '#fed7aa',
          flower: '#ec4899',
          flowerAccent: '#be185d',
        };
      case 'giant_saguaro':
        return {
          main: '#15803d',
          dark: '#14532d',
          light: '#22c55e',
          spine: '#fef9c3',
          flower: '#fef08a',
          flowerAccent: '#eab308',
        };
      case 'moon_cactus':
        return {
          main: '#166534',
          dark: '#14532d',
          light: '#22c55e',
          spine: '#fed7aa',
          flower: '#f43f5e',
          flowerAccent: '#9f1239',
          cap: '#e11d48',
          capLight: '#fb7185',
        };
      case 'golden_barrel':
        return {
          main: '#ca8a04',
          dark: '#a16207',
          light: '#facc15',
          spine: '#fef08a',
          flower: '#eab308',
          flowerAccent: '#854d0e',
        };
      case 'star_astrophytum':
        return {
          main: '#0f766e',
          dark: '#115e59',
          light: '#14b8a6',
          spine: '#ffffff',
          flower: '#fef08a',
          flowerAccent: '#e11d48',
        };
      case 'saguaro_sprout':
      default:
        return {
          main: '#22c55e',
          dark: '#15803d',
          light: '#4ade80',
          spine: '#fef08a',
          flower: '#f472b6',
          flowerAccent: '#db2777',
        };
    }
  };

  const colors = getCactusColors();

  // Soil reference anchor Y: 224 (top surface of soil mound inside the pot)
  const SOIL_Y = 224;

  // CONTINUOUS SPROUT FORMULAS for Stage 1 (0% to 20%)
  // Sprout height grows smoothly from 18px at 0% to 64px at 20%
  const sproutProgress = Math.min(1, pct / 20);
  const sproutHeight = 18 + sproutProgress * 46;
  const sproutTopY = SOIL_Y - sproutHeight;
  const leafOpenAngle = 18 + sproutProgress * 36; // cotyledons unfold wider as it drinks
  const leafScale = 0.65 + sproutProgress * 0.45;

  // CONTINUOUS MATURE GROWTH FORMULAS (20% to 100%)
  // Normalized 0 to 1 progress for post-seedling stages
  const postSproutProgress = Math.max(0, Math.min(1, (pct - 20) / 80));

  // Saguaro trunk height: grows smoothly upward from y=168 (h=56) down to y=56 (h=168)
  const saguaroTrunkHeight = 56 + postSproutProgress * 112;
  const saguaroTrunkTopY = SOIL_Y - saguaroTrunkHeight;
  const saguaroTrunkWidth = 32 + postSproutProgress * 20;

  // Saguaro arms progress:
  // Left arm sprouts between 35% and 65%
  const saguaroLeftArmProgress = Math.max(0, Math.min(1, (pct - 35) / 30));
  // Right arm sprouts between 65% and 90%
  const saguaroRightArmProgress = Math.max(0, Math.min(1, (pct - 65) / 25));

  // Barrel cactus radius: expands smoothly from 24 up to 58
  const barrelRadius = 24 + postSproutProgress * 34;
  const barrelCenterY = SOIL_Y - barrelRadius * 0.95;

  // Prickly Pear pads:
  const pearBaseRy = 26 + postSproutProgress * 22;
  const pearBaseRx = 20 + postSproutProgress * 16;
  const pearBaseCy = SOIL_Y - pearBaseRy * 0.9;
  const pearLeftPadProgress = Math.max(0, Math.min(1, (pct - 35) / 30));
  const pearRightPadProgress = Math.max(0, Math.min(1, (pct - 65) / 25));

  // Moon Cactus:
  const moonStalkHeight = 40 + postSproutProgress * 46;
  const moonStalkTopY = SOIL_Y - moonStalkHeight;
  const moonCapProgress = Math.max(0, Math.min(1, (pct - 20) / 45));
  const moonCapRadius = 16 + moonCapProgress * 20;
  const moonCapCenterY = moonStalkTopY - moonCapRadius * 0.65;

  // Star Astrophytum:
  const starHeight = 42 + postSproutProgress * 80;
  const starWidth = 32 + postSproutProgress * 42;
  const starTopY = SOIL_Y - starHeight;

  // Flower Bud & Bloom progress
  // Bud swells from 70% to 95%
  const budProgress = Math.max(0, Math.min(1, (pct - 70) / 25));
  const isBudding = pct >= 70 && pct < 100;
  const isBlooming = pct >= 100;

  // Facial Y position calculation: rests near the upper-middle of plant body
  const getFaceY = () => {
    if (stage === 1) return sproutTopY + sproutHeight * 0.45;
    if (cactusId === 'barrel_cactus' || cactusId === 'golden_barrel') return barrelCenterY;
    if (cactusId === 'moon_cactus') return moonStalkTopY + 24;
    if (cactusId === 'prickly_pear') return pearBaseCy - 6;
    if (cactusId === 'star_astrophytum') return starTopY + starHeight * 0.55;
    // Saguaro
    return saguaroTrunkTopY + 45;
  };

  const faceY = getFaceY();

  // Flower placement apex
  const getFlowerY = () => {
    if (cactusId === 'barrel_cactus' || cactusId === 'golden_barrel') return barrelCenterY - barrelRadius + 3;
    if (cactusId === 'moon_cactus') return moonCapCenterY - moonCapRadius + 2;
    if (cactusId === 'prickly_pear') return pearBaseCy - pearBaseRy - (pearRightPadProgress > 0 ? 35 : 12);
    if (cactusId === 'star_astrophytum') return starTopY + 2;
    return saguaroTrunkTopY + 2;
  };

  const flowerApexY = getFlowerY();

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 300 320"
        className={`w-full h-full drop-shadow-md transition-all duration-700 ease-out ${
          isWatering ? 'scale-[1.04]' : 'scale-100'
        }`}
      >
        <defs>
          {/* Pot Gradient */}
          <linearGradient id={`potGrad-${pot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pot.accentColor || pot.bodyColor} />
            <stop offset="55%" stopColor={pot.bodyColor} />
            <stop offset="100%" stopColor={pot.shadowColor} />
          </linearGradient>

          {/* Plant Gradient */}
          <linearGradient id={`cactusGrad-${cactusId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="50%" stopColor={colors.main} />
            <stop offset="100%" stopColor={colors.dark} />
          </linearGradient>

          {/* Soil Depth Gradient */}
          <radialGradient id="soilDepthGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="65%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#271003" />
          </radialGradient>

          {/* Sprout Cotyledon Gradient */}
          <linearGradient id="cotyledonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Bloom Aura Glow Filter */}
          <filter id="bloomGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Celebratory Golden Sparkles & Floating Pollen (At 100% Bloom) */}
        {isBlooming && (
          <g className="animate-pulse">
            <circle cx="85" cy="70" r="3.5" fill="#facc15" filter="url(#bloomGlow)" />
            <circle cx="215" cy="65" r="4" fill="#facc15" filter="url(#bloomGlow)" />
            <circle cx="60" cy="115" r="3" fill="#fbbf24" />
            <circle cx="240" cy="110" r="3" fill="#fbbf24" />
            <path d="M150 15 L153 23 L161 26 L153 29 L150 37 L147 29 L139 26 L147 23 Z" fill="#fef08a" />
            <path d="M78 50 L80 55 L85 57 L80 59 L78 64 L76 59 L71 57 L76 55 Z" fill="#fde047" />
            <path d="M222 45 L224 50 L229 52 L224 54 L222 59 L220 54 L215 52 L220 50 Z" fill="#fde047" />
          </g>
        )}

        {/* 2. Animated Water Droplets falling onto the sprout/plant when 'Fill Up' is pressed */}
        {isWatering && (
          <g className="animate-bounce">
            <path d="M130 55 C130 48 135 38 135 38 C135 38 140 48 140 55 C140 59 135 62 130 55 Z" fill="#38bdf8" />
            <path d="M172 45 C172 38 177 30 177 30 C177 30 182 38 182 45 C182 49 177 52 172 45 Z" fill="#0284c7" />
            <path d="M152 70 C152 64 156 56 156 56 C156 56 160 64 160 70 C160 73 156 76 152 70 Z" fill="#38bdf8" />
            {/* Dew drop ripples near soil */}
            <circle cx="150" cy="223" r="6" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.7" />
          </g>
        )}

        {/* ================= LAYER A: FLOWER POT BASE & RIM ================= */}
        {/* Soft shadow under pot base */}
        <ellipse cx="150" cy="308" rx="52" ry="7" fill="#291104" opacity="0.35" />

        {/* Pot Main Body (Tapered trapezoid) */}
        <path
          d="M86 226 L102 296 C104 302 110 306 117 306 L183 306 C190 306 196 302 198 296 L214 226 Z"
          fill={`url(#potGrad-${pot.id})`}
          stroke={pot.shadowColor}
          strokeWidth="2.5"
        />

        {/* Pot Customization Patterns */}
        {pot.patternType === 'geometric' && (
          <g stroke={pot.shadowColor} strokeWidth="2" fill="none" opacity="0.75">
            <path d="M102 255 L112 245 L122 255 L132 245 L142 255 L152 245 L162 255 L172 245 L182 255 L192 245 L198 251" />
            <path d="M106 275 L116 265 L126 275 L136 265 L146 275 L156 265 L166 275 L176 265 L186 275 L194 267" />
          </g>
        )}

        {pot.patternType === 'ribbed' && (
          <g stroke={pot.shadowColor} strokeWidth="2.5" opacity="0.6">
            <line x1="93" y1="250" x2="207" y2="250" />
            <line x1="97" y1="265" x2="203" y2="265" />
            <line x1="101" y1="280" x2="199" y2="280" />
            <line x1="107" y1="293" x2="193" y2="293" />
          </g>
        )}

        {pot.patternType === 'gold_rim' && (
          <g>
            <circle cx="150" cy="270" r="10" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <circle cx="150" cy="270" r="3.5" fill="#facc15" />
          </g>
        )}

        {pot.patternType === 'speckled' && (
          <g fill={pot.accentColor || '#38bdf8'} opacity="0.8">
            <circle cx="112" cy="255" r="1.5" />
            <circle cx="135" cy="245" r="1" />
            <circle cx="150" cy="265" r="2" />
            <circle cx="172" cy="250" r="1.5" />
            <circle cx="188" cy="260" r="1" />
            <circle cx="125" cy="280" r="1.5" />
            <circle cx="165" cy="285" r="1" />
            <circle cx="145" cy="295" r="1.5" />
          </g>
        )}

        {pot.patternType === 'chevron' && (
          <g stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.8">
            <path d="M110 260 L150 275 L190 260" />
            <path d="M115 275 L150 290 L185 275" />
          </g>
        )}

        {pot.patternType === 'brass' && (
          <g opacity="0.6">
            <path d="M110 240 L120 300 L135 300 L125 240 Z" fill="#fef08a" />
            <path d="M165 240 L160 300 L170 300 L175 240 Z" fill="#ffffff" opacity="0.7" />
          </g>
        )}

        {/* Outer Pot Rim Lip */}
        <ellipse
          cx="150"
          cy="226"
          rx="68"
          ry="13"
          fill={pot.rimColor}
          stroke={pot.shadowColor}
          strokeWidth="2.5"
        />

        {/* ================= LAYER B: SOIL BED ================= */}
        {/* Rich dark potting loam recessed inside the pot rim */}
        <ellipse cx="150" cy="225" rx="61" ry="10" fill="url(#soilDepthGrad)" />
        <ellipse cx="150" cy="224" rx="57" ry="8" fill="#451a03" opacity="0.8" />

        {/* Soil pebbles & textured specks */}
        <circle cx="116" cy="225" r="2" fill="#a16207" />
        <circle cx="180" cy="226" r="2.5" fill="#78350f" />
        <circle cx="132" cy="228" r="1.5" fill="#92400e" />
        <circle cx="166" cy="224" r="1.5" fill="#a16207" />

        {/* Soil Mounding & Parting around the plant emergence base */}
        <ellipse cx="150" cy={SOIL_Y} rx="26" ry="6" fill="#381504" />
        <path
          d="M134 225 Q142 221 150 223 Q158 221 166 225 Q158 228 150 226 Q142 228 134 225 Z"
          fill="#5c2d12"
          stroke="#271003"
          strokeWidth="1.2"
        />
        {/* Cracked earth crumbs showing plant bursting out */}
        <circle cx="140" cy="224" r="2.2" fill="#78350f" />
        <circle cx="160" cy="224" r="2" fill="#78350f" />
        <circle cx="148" cy="227" r="1.5" fill="#451a03" />

        {/* ================= LAYER C: SPROUTING & GROWING PLANT ================= */}
        {/* The plant group is rooted at (150, SOIL_Y), and visually sprouts UPWARD */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transformOrigin: `150px ${SOIL_Y}px`,
            transform: isWatering ? 'scale(1.04) translateY(-2px)' : 'scale(1) translateY(0)',
          }}
        >
          {/* ================= STAGE 1 (0% to 15%): SPROUTING EMERGENCE ================= */}
          {stage === 1 && (
            <g className="transition-all duration-500">
              {/* Sprouting Shoot Base rooted in soil */}
              <path
                d={`M145 ${SOIL_Y} Q146 ${sproutTopY + sproutHeight * 0.5} 147 ${sproutTopY} Q150 ${sproutTopY - 4} 153 ${sproutTopY} Q154 ${sproutTopY + sproutHeight * 0.5} 155 ${SOIL_Y} Z`}
                fill="url(#cotyledonGrad)"
                stroke={colors.dark}
                strokeWidth="2.5"
              />

              {/* Vertical stem vein */}
              <line
                x1="150"
                y1={SOIL_Y - 2}
                x2="150"
                y2={sproutTopY + 4}
                stroke={colors.light}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Left Cotyledon Baby Leaf (fans open wider as sproutProgress increases) */}
              <g transform={`rotate(-${leafOpenAngle} 148 ${sproutTopY + 4})`}>
                <path
                  d={`M148 ${sproutTopY + 4} C132 ${sproutTopY} 124 ${sproutTopY - 14 * leafScale} 140 ${sproutTopY - 10 * leafScale} C146 ${sproutTopY - 7 * leafScale} 148 ${sproutTopY} 148 ${sproutTopY + 4}`}
                  fill="url(#cotyledonGrad)"
                  stroke={colors.dark}
                  strokeWidth="2"
                />
                {/* Leaf central rib */}
                <line
                  x1="148"
                  y1={sproutTopY + 4}
                  x2="135"
                  y2={sproutTopY - 7 * leafScale}
                  stroke={colors.light}
                  strokeWidth="1.2"
                />
                {/* Morning dewdrop on leaf tip */}
                <circle cx="134" cy={sproutTopY - 9 * leafScale} r="2" fill="#38bdf8" />
                <circle cx="133.5" cy={sproutTopY - 9.5 * leafScale} r="0.8" fill="#ffffff" />
              </g>

              {/* Right Cotyledon Baby Leaf */}
              <g transform={`rotate(${leafOpenAngle} 152 ${sproutTopY + 4})`}>
                <path
                  d={`M152 ${sproutTopY + 4} C168 ${sproutTopY} 176 ${sproutTopY - 14 * leafScale} 160 ${sproutTopY - 10 * leafScale} C154 ${sproutTopY - 7 * leafScale} 152 ${sproutTopY} 152 ${sproutTopY + 4}`}
                  fill={colors.main}
                  stroke={colors.dark}
                  strokeWidth="2"
                />
                <line
                  x1="152"
                  y1={sproutTopY + 4}
                  x2="165"
                  y2={sproutTopY - 7 * leafScale}
                  stroke={colors.light}
                  strokeWidth="1.2"
                />
                <circle cx="166" cy={sproutTopY - 9 * leafScale} r="2" fill="#38bdf8" />
                <circle cx="165.5" cy={sproutTopY - 9.5 * leafScale} r="0.8" fill="#ffffff" />
              </g>

              {/* At 10%-15%: The central young cactus bud emerges between cotyledons! */}
              {pct >= 10 && (
                <g className="animate-pulse">
                  <ellipse
                    cx="150"
                    cy={sproutTopY - 3}
                    rx="5"
                    ry="8"
                    fill={`url(#cactusGrad-${cactusId})`}
                    stroke={colors.dark}
                    strokeWidth="1.8"
                  />
                  {/* First tiny soft seedling spines */}
                  <line x1="145" y1={sproutTopY - 3} x2="140" y2={sproutTopY - 5} stroke={colors.spine} strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="155" y1={sproutTopY - 3} x2="160" y2={sproutTopY - 5} stroke={colors.spine} strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}

              {/* Cute seedling face */}
              <g>
                <circle cx="147" cy={faceY} r="1.8" fill="#0f172a" />
                <circle cx="153" cy={faceY} r="1.8" fill="#0f172a" />
                <circle cx="147.5" cy={faceY - 0.5} r="0.6" fill="#ffffff" />
                <circle cx="153.5" cy={faceY - 0.5} r="0.6" fill="#ffffff" />
                <path
                  d={`M148 ${faceY + 3.5} Q150 ${faceY + 5.5} 152 ${faceY + 3.5}`}
                  stroke="#0f172a"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Blushing baby cheeks */}
                <ellipse cx="144" cy={faceY + 2.5} rx="2" ry="1.2" fill="#fb7185" opacity="0.6" />
                <ellipse cx="156" cy={faceY + 2.5} rx="2" ry="1.2" fill="#fb7185" opacity="0.6" />
              </g>
            </g>
          )}

          {/* ================= STAGE 2 TO 5 (20% to 100%): MATURING VARIETIES ================= */}
          {stage >= 2 && (
            <g className="transition-all duration-700">
              {/* Botanical Baby Cotyledons at soil base (botanical realism for young cacti) */}
              <path
                d="M136 224 C126 220 122 212 132 212 C138 212 142 218 140 224 Z"
                fill="url(#cotyledonGrad)"
                stroke={colors.dark}
                strokeWidth="1.5"
                opacity="0.85"
              />
              <path
                d="M164 224 C174 220 178 212 168 212 C162 212 158 218 160 224 Z"
                fill="url(#cotyledonGrad)"
                stroke={colors.dark}
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* VARIETY 1 & 4: SAGUARO SPROUT & GIANT SAGUARO */}
              {(cactusId === 'saguaro_sprout' || cactusId === 'giant_saguaro') && (
                <g>
                  {/* Left Arm (Sprouts and shoots upward from trunk shoulder) */}
                  {saguaroLeftArmProgress > 0 && (
                    <g
                      transform={`translate(0, 0)`}
                      className="transition-all duration-700 ease-out"
                    >
                      <path
                        d={`M134 165 C${134 - 24 * saguaroLeftArmProgress} 165 ${134 - 32 * saguaroLeftArmProgress} ${
                          165 - 18 * saguaroLeftArmProgress
                        } ${134 - 32 * saguaroLeftArmProgress} ${165 - 45 * saguaroLeftArmProgress} C${
                          134 - 32 * saguaroLeftArmProgress
                        } ${165 - 60 * saguaroLeftArmProgress} ${134 - 18 * saguaroLeftArmProgress} ${
                          165 - 60 * saguaroLeftArmProgress
                        } ${134 - 18 * saguaroLeftArmProgress} ${165 - 45 * saguaroLeftArmProgress} C${
                          134 - 18 * saguaroLeftArmProgress
                        } ${165 - 28 * saguaroLeftArmProgress} ${134 - 12 * saguaroLeftArmProgress} ${
                          165 - 16 * saguaroLeftArmProgress
                        } 134 153 Z`}
                        fill={`url(#cactusGrad-${cactusId})`}
                        stroke={colors.dark}
                        strokeWidth="2.5"
                      />
                      {/* Left Arm Spines */}
                      {saguaroLeftArmProgress > 0.5 && (
                        <g>
                          <line
                            x1={134 - 34 * saguaroLeftArmProgress}
                            y1={165 - 48 * saguaroLeftArmProgress}
                            x2={134 - 40 * saguaroLeftArmProgress}
                            y2={165 - 52 * saguaroLeftArmProgress}
                            stroke={colors.spine}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1={134 - 34 * saguaroLeftArmProgress}
                            y1={165 - 34 * saguaroLeftArmProgress}
                            x2={134 - 41 * saguaroLeftArmProgress}
                            y2={165 - 33 * saguaroLeftArmProgress}
                            stroke={colors.spine}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* Right Arm (Sprouts and shoots upward) */}
                  {saguaroRightArmProgress > 0 && (
                    <g className="transition-all duration-700 ease-out">
                      <path
                        d={`M166 155 C${166 + 24 * saguaroRightArmProgress} 155 ${166 + 32 * saguaroRightArmProgress} ${
                          155 - 18 * saguaroRightArmProgress
                        } ${166 + 32 * saguaroRightArmProgress} ${155 - 50 * saguaroRightArmProgress} C${
                          166 + 32 * saguaroRightArmProgress
                        } ${155 - 65 * saguaroRightArmProgress} ${166 + 18 * saguaroRightArmProgress} ${
                          155 - 65 * saguaroRightArmProgress
                        } ${166 + 18 * saguaroRightArmProgress} ${155 - 50 * saguaroRightArmProgress} C${
                          166 + 18 * saguaroRightArmProgress
                        } ${155 - 28 * saguaroRightArmProgress} ${166 + 12 * saguaroRightArmProgress} ${
                          155 - 16 * saguaroRightArmProgress
                        } 166 143 Z`}
                        fill={`url(#cactusGrad-${cactusId})`}
                        stroke={colors.dark}
                        strokeWidth="2.5"
                      />
                      {/* Right Arm Spines */}
                      {saguaroRightArmProgress > 0.5 && (
                        <g>
                          <line
                            x1={166 + 34 * saguaroRightArmProgress}
                            y1={155 - 52 * saguaroRightArmProgress}
                            x2={166 + 41 * saguaroRightArmProgress}
                            y2={155 - 55 * saguaroRightArmProgress}
                            stroke={colors.spine}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1={166 + 34 * saguaroRightArmProgress}
                            y1={155 - 38 * saguaroRightArmProgress}
                            x2={166 + 41 * saguaroRightArmProgress}
                            y2={155 - 37 * saguaroRightArmProgress}
                            stroke={colors.spine}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* Main Saguaro Trunk emerging from soil */}
                  <rect
                    x={150 - saguaroTrunkWidth / 2}
                    y={saguaroTrunkTopY}
                    width={saguaroTrunkWidth}
                    height={saguaroTrunkHeight}
                    rx={saguaroTrunkWidth / 2}
                    fill={`url(#cactusGrad-${cactusId})`}
                    stroke={colors.dark}
                    strokeWidth="3"
                  />

                  {/* Vertical Rib lines that stretch with trunk height */}
                  <line
                    x1={150 - saguaroTrunkWidth * 0.28}
                    y1={saguaroTrunkTopY + 4}
                    x2={150 - saguaroTrunkWidth * 0.28}
                    y2={SOIL_Y}
                    stroke={colors.dark}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1="150"
                    y1={saguaroTrunkTopY + 2}
                    x2="150"
                    y2={SOIL_Y}
                    stroke={colors.light}
                    strokeWidth="2.5"
                  />
                  <line
                    x1={150 + saguaroTrunkWidth * 0.28}
                    y1={saguaroTrunkTopY + 4}
                    x2={150 + saguaroTrunkWidth * 0.28}
                    y2={SOIL_Y}
                    stroke={colors.dark}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Spines along trunk flanks */}
                  <line
                    x1={150 - saguaroTrunkWidth / 2 - 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.3}
                    x2={150 - saguaroTrunkWidth / 2 - 7}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.3 - 4}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 - saguaroTrunkWidth / 2 - 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.55}
                    x2={150 - saguaroTrunkWidth / 2 - 8}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.55}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 - saguaroTrunkWidth / 2 - 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.8}
                    x2={150 - saguaroTrunkWidth / 2 - 7}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.8 + 4}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + saguaroTrunkWidth / 2 + 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.3}
                    x2={150 + saguaroTrunkWidth / 2 + 7}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.3 - 4}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + saguaroTrunkWidth / 2 + 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.55}
                    x2={150 + saguaroTrunkWidth / 2 + 8}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.55}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + saguaroTrunkWidth / 2 + 1}
                    y1={saguaroTrunkTopY + saguaroTrunkHeight * 0.8}
                    x2={150 + saguaroTrunkWidth / 2 + 7}
                    y2={saguaroTrunkTopY + saguaroTrunkHeight * 0.8 + 4}
                    stroke={colors.spine}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* VARIETY 2 & 6: BARREL CACTUS / GOLDEN BARREL */}
              {(cactusId === 'barrel_cactus' || cactusId === 'golden_barrel') && (
                <g>
                  {/* Round Chubby Body rooted into soil */}
                  <circle
                    cx="150"
                    cy={barrelCenterY}
                    r={barrelRadius}
                    fill={`url(#cactusGrad-${cactusId})`}
                    stroke={colors.dark}
                    strokeWidth="3"
                  />
                  {/* Pleated Curved Ribs */}
                  <path
                    d={`M150 ${barrelCenterY - barrelRadius} Q${150 - barrelRadius * 0.6} ${barrelCenterY} 150 ${SOIL_Y}`}
                    stroke={colors.dark}
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d={`M150 ${barrelCenterY - barrelRadius} Q${150 + barrelRadius * 0.6} ${barrelCenterY} 150 ${SOIL_Y}`}
                    stroke={colors.dark}
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <line
                    x1="150"
                    y1={barrelCenterY - barrelRadius}
                    x2="150"
                    y2={SOIL_Y}
                    stroke={colors.light}
                    strokeWidth="3"
                  />

                  {/* Radial Curved Spines */}
                  <line
                    x1={150 - barrelRadius * 0.8}
                    y1={barrelCenterY - barrelRadius * 0.4}
                    x2={150 - barrelRadius * 0.8 - 9}
                    y2={barrelCenterY - barrelRadius * 0.4 - 5}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 - barrelRadius}
                    y1={barrelCenterY}
                    x2={150 - barrelRadius - 10}
                    y2={barrelCenterY}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 - barrelRadius * 0.8}
                    y1={barrelCenterY + barrelRadius * 0.4}
                    x2={150 - barrelRadius * 0.8 - 9}
                    y2={barrelCenterY + barrelRadius * 0.4 + 5}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + barrelRadius * 0.8}
                    y1={barrelCenterY - barrelRadius * 0.4}
                    x2={150 + barrelRadius * 0.8 + 9}
                    y2={barrelCenterY - barrelRadius * 0.4 - 5}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + barrelRadius}
                    y1={barrelCenterY}
                    x2={150 + barrelRadius + 10}
                    y2={barrelCenterY}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 + barrelRadius * 0.8}
                    y1={barrelCenterY + barrelRadius * 0.4}
                    x2={150 + barrelRadius * 0.8 + 9}
                    y2={barrelCenterY + barrelRadius * 0.4 + 5}
                    stroke={colors.spine}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* VARIETY 3: PRICKLY PEAR */}
              {cactusId === 'prickly_pear' && (
                <g>
                  {/* Left Top Beaver-tail Pad */}
                  {pearLeftPadProgress > 0 && (
                    <g
                      transform={`rotate(-28 124 ${pearBaseCy - 28}) scale(${pearLeftPadProgress})`}
                      style={{ transformOrigin: `124px ${pearBaseCy - 28}px` }}
                    >
                      <ellipse
                        cx="124"
                        cy={pearBaseCy - 48}
                        rx="24"
                        ry="34"
                        fill={`url(#cactusGrad-${cactusId})`}
                        stroke={colors.dark}
                        strokeWidth="2.5"
                      />
                      <circle cx="118" cy={pearBaseCy - 55} r="1.5" fill={colors.spine} />
                      <circle cx="130" cy={pearBaseCy - 40} r="1.5" fill={colors.spine} />
                    </g>
                  )}

                  {/* Right Top Beaver-tail Pad */}
                  {pearRightPadProgress > 0 && (
                    <g
                      transform={`rotate(25 174 ${pearBaseCy - 35}) scale(${pearRightPadProgress})`}
                      style={{ transformOrigin: `174px ${pearBaseCy - 35}px` }}
                    >
                      <ellipse
                        cx="174"
                        cy={pearBaseCy - 52}
                        rx="22"
                        ry="32"
                        fill={`url(#cactusGrad-${cactusId})`}
                        stroke={colors.dark}
                        strokeWidth="2.5"
                      />
                      <circle cx="168" cy={pearBaseCy - 58} r="1.5" fill={colors.spine} />
                      <circle cx="180" cy={pearBaseCy - 45} r="1.5" fill={colors.spine} />
                    </g>
                  )}

                  {/* Bottom Anchor Pad rooted in soil */}
                  <ellipse
                    cx="150"
                    cy={pearBaseCy}
                    rx={pearBaseRx}
                    ry={pearBaseRy}
                    fill={`url(#cactusGrad-${cactusId})`}
                    stroke={colors.dark}
                    strokeWidth="2.8"
                  />
                  {/* Spines dots */}
                  <circle cx="138" cy={pearBaseCy - 12} r="2" fill={colors.spine} />
                  <circle cx="162" cy={pearBaseCy - 8} r="2" fill={colors.spine} />
                  <circle cx="150" cy={pearBaseCy + 10} r="2" fill={colors.spine} />
                </g>
              )}

              {/* VARIETY 5: MOON CACTUS */}
              {cactusId === 'moon_cactus' && (
                <g>
                  {/* Green Stalk emerging from soil */}
                  <rect
                    x="136"
                    y={moonStalkTopY}
                    width="28"
                    height={moonStalkHeight}
                    rx="14"
                    fill="#166534"
                    stroke="#14532d"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="150"
                    y1={moonStalkTopY}
                    x2="150"
                    y2={SOIL_Y}
                    stroke="#22c55e"
                    strokeWidth="2.5"
                  />

                  {/* Ruby Neon Grafted Cap (swells as pct increases) */}
                  {moonCapProgress > 0 && (
                    <g className="transition-all duration-700 ease-out">
                      {/* Central Ruby Ball */}
                      <circle
                        cx="150"
                        cy={moonCapCenterY}
                        r={moonCapRadius}
                        fill="#e11d48"
                        stroke="#9f1239"
                        strokeWidth="2.5"
                      />
                      {/* Bulbous Satellite Knobs */}
                      {moonCapProgress > 0.4 && (
                        <g>
                          <circle
                            cx={150 - moonCapRadius * 0.55}
                            cy={moonCapCenterY - moonCapRadius * 0.3}
                            r={moonCapRadius * 0.42}
                            fill="#f43f5e"
                          />
                          <circle
                            cx={150 + moonCapRadius * 0.55}
                            cy={moonCapCenterY - moonCapRadius * 0.3}
                            r={moonCapRadius * 0.42}
                            fill="#f43f5e"
                          />
                          <circle
                            cx="150"
                            cy={moonCapCenterY - moonCapRadius * 0.65}
                            r={moonCapRadius * 0.45}
                            fill="#fb7185"
                          />
                          {/* Delicate Spines */}
                          <line
                            x1={150 - moonCapRadius - 1}
                            y1={moonCapCenterY}
                            x2={150 - moonCapRadius - 6}
                            y2={moonCapCenterY - 3}
                            stroke="#fed7aa"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1={150 + moonCapRadius + 1}
                            y1={moonCapCenterY}
                            x2={150 + moonCapRadius + 6}
                            y2={moonCapCenterY - 3}
                            stroke="#fed7aa"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* VARIETY 7: STAR ASTROPHYTUM */}
              {cactusId === 'star_astrophytum' && (
                <g>
                  {/* Star Geometry Body rooted into soil */}
                  <path
                    d={`M150 ${starTopY} L${150 + starWidth} ${starTopY + starHeight * 0.4} L${150 + starWidth * 0.55} ${SOIL_Y} L${150 - starWidth * 0.55} ${SOIL_Y} L${150 - starWidth} ${starTopY + starHeight * 0.4} Z`}
                    fill={`url(#cactusGrad-${cactusId})`}
                    stroke={colors.dark}
                    strokeWidth="3"
                  />
                  {/* Internal Star Ribs meeting at zenith */}
                  <line x1="150" y1={starTopY} x2="150" y2={SOIL_Y} stroke={colors.light} strokeWidth="2.5" />
                  <line
                    x1="150"
                    y1={starTopY}
                    x2={150 + starWidth}
                    y2={starTopY + starHeight * 0.4}
                    stroke={colors.dark}
                    strokeWidth="1.5"
                  />
                  <line
                    x1="150"
                    y1={starTopY}
                    x2={150 - starWidth}
                    y2={starTopY + starHeight * 0.4}
                    stroke={colors.dark}
                    strokeWidth="1.5"
                  />

                  {/* White Starlight Flecks */}
                  <circle cx="140" cy={starTopY + starHeight * 0.3} r="1.5" fill="#ffffff" />
                  <circle cx="160" cy={starTopY + starHeight * 0.3} r="1.5" fill="#ffffff" />
                  <circle cx="145" cy={starTopY + starHeight * 0.55} r="1.5" fill="#ffffff" />
                  <circle cx="156" cy={starTopY + starHeight * 0.6} r="1.5" fill="#ffffff" />
                  <circle cx="136" cy={starTopY + starHeight * 0.75} r="1.5" fill="#ffffff" />
                  <circle cx="164" cy={starTopY + starHeight * 0.75} r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* CUTE FACIAL EXPRESSIONS (Dynamic with Growth & Hydration) */}
              <g className="transition-all duration-500">
                {stage === 5 ? (
                  /* 100%: Blissful curved eyes, blushing cheeks, radiant joy */
                  <g>
                    <path
                      d={`M141 ${faceY} Q145 ${faceY - 5} 149 ${faceY}`}
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M151 ${faceY} Q155 ${faceY - 5} 159 ${faceY}`}
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M146 ${faceY + 5} Q150 ${faceY + 11} 154 ${faceY + 5} Z`}
                      fill="#e11d48"
                      stroke="#9f1239"
                      strokeWidth="1"
                    />
                    <ellipse cx="137" cy={faceY + 4} rx="4" ry="2.5" fill="#f43f5e" opacity="0.7" />
                    <ellipse cx="163" cy={faceY + 4} rx="4" ry="2.5" fill="#f43f5e" opacity="0.7" />
                  </g>
                ) : stage >= 3 ? (
                  /* Stage 3-4: Cheerful wide smile */
                  <g>
                    <circle cx="143" cy={faceY} r="2.5" fill="#0f172a" />
                    <circle cx="157" cy={faceY} r="2.5" fill="#0f172a" />
                    <circle cx="144" cy={faceY - 0.8} r="1" fill="#ffffff" />
                    <circle cx="158" cy={faceY - 0.8} r="1" fill="#ffffff" />
                    <path
                      d={`M146 ${faceY + 5} Q150 ${faceY + 9} 154 ${faceY + 5}`}
                      stroke="#0f172a"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <ellipse cx="138" cy={faceY + 4} rx="3" ry="2" fill="#fb7185" opacity="0.55" />
                    <ellipse cx="162" cy={faceY + 4} rx="3" ry="2" fill="#fb7185" opacity="0.55" />
                  </g>
                ) : (
                  /* Stage 2: Sweet gentle smile */
                  <g>
                    <circle cx="144" cy={faceY} r="2" fill="#0f172a" />
                    <circle cx="156" cy={faceY} r="2" fill="#0f172a" />
                    <circle cx="144.5" cy={faceY - 0.5} r="0.7" fill="#ffffff" />
                    <circle cx="156.5" cy={faceY - 0.5} r="0.7" fill="#ffffff" />
                    <path
                      d={`M147 ${faceY + 4} Q150 ${faceY + 7} 153 ${faceY + 4}`}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>

              {/* SWELLING FLOWER BUD (Stage 4: 70% to 95%) */}
              {isBudding && (
                <g
                  transform={`translate(150, ${flowerApexY}) scale(${0.5 + budProgress * 0.6})`}
                  className="transition-transform duration-500 ease-out"
                >
                  <ellipse cx="0" cy="-6" rx="5" ry="9" fill={colors.flower} stroke={colors.flowerAccent} strokeWidth="1.5" />
                  <ellipse cx="-4" cy="-5" rx="4" ry="7" fill={colors.flower} opacity="0.85" />
                  <ellipse cx="4" cy="-5" rx="4" ry="7" fill={colors.flower} opacity="0.85" />
                  {/* Sepal leaves embracing the bud */}
                  <path d="M-6 0 C-4 -6 0 -2 0 0 Z" fill="#15803d" />
                  <path d="M6 0 C4 -6 0 -2 0 0 Z" fill="#15803d" />
                </g>
              )}

              {/* MAGNIFICENT FULL FLOWER BLOOM (Stage 5: 100%) */}
              {isBlooming && (
                <g
                  transform={`translate(150, ${flowerApexY})`}
                  className="transition-transform duration-700 ease-out"
                >
                  {/* Radiating Petals with Gentle Ambient Breeze Rotation */}
                  <g className="animate-spin" style={{ animationDuration: '36s' }}>
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
                      <ellipse
                        key={i}
                        cx="0"
                        cy="-16"
                        rx="7"
                        ry="14"
                        fill={colors.flower}
                        stroke={colors.flowerAccent}
                        strokeWidth="1.2"
                        transform={`rotate(${angle})`}
                        opacity="0.96"
                      />
                    ))}
                  </g>
                  {/* Inner Floral Crown */}
                  <circle cx="0" cy="0" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="#eab308" />
                  <circle cx="0" cy="0" r="2.5" fill="#ca8a04" />
                </g>
              )}
            </g>
          )}
        </g>

        {/* ================= LAYER D: FRONT RIM LIP HIGHLIGHT ================= */}
        {/* Adds 3D depth showing the soil and plant sitting snugly INSIDE the pot opening */}
        <path
          d="M86 226 C86 235 214 235 214 226 C210 232 90 232 86 226 Z"
          fill={pot.accentColor || pot.rimColor}
          opacity="0.45"
        />
        {/* Pot gold trim line if gold_rim pattern */}
        {pot.patternType === 'gold_rim' && (
          <path d="M86 226 C86 235 214 235 214 226" stroke="#facc15" strokeWidth="3" fill="none" />
        )}
      </svg>
    </div>
  );
};
