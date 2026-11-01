// Utility to generate high-resolution (1080x1080) social media summary cards on HTML5 Canvas
export type ShareTheme = 'terracotta' | 'emerald' | 'oasis' | 'sunset';

export interface ShareCardOptions {
  theme: ShareTheme;
  title: string;
  subtitle: string;
  growthPercentage: number;
  stageName: string;
  intakeText: string;
  goalText: string;
  streakDays: number;
  badgeName?: string;
  badgeDescription?: string;
  dateText?: string;
  cactusSvgSelector?: string;
}

export interface GeneratedShareCard {
  dataUrl: string;
  blob: Blob;
}

interface ThemeConfig {
  bgGradient: [string, string, string];
  pedestalColor: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
}

const THEMES: Record<ShareTheme, ThemeConfig> = {
  terracotta: {
    bgGradient: ['#fff7ed', '#fef3c7', '#fed7aa'],
    pedestalColor: 'rgba(217, 119, 6, 0.15)',
    accentColor: '#ea580c',
    textColor: '#431407',
    subtextColor: '#78350f',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(249, 115, 22, 0.3)',
    badgeBg: '#ea580c',
    badgeText: '#ffffff',
  },
  emerald: {
    bgGradient: ['#061a12', '#0c2e21', '#05160e'],
    pedestalColor: 'rgba(34, 197, 94, 0.2)',
    accentColor: '#10b981',
    textColor: '#f0fdf4',
    subtextColor: '#86efac',
    cardBg: 'rgba(15, 42, 31, 0.85)',
    cardBorder: 'rgba(16, 185, 129, 0.35)',
    badgeBg: '#10b981',
    badgeText: '#061a12',
  },
  oasis: {
    bgGradient: ['#f0fdfa', '#cffafe', '#e0f2fe'],
    pedestalColor: 'rgba(14, 165, 233, 0.15)',
    accentColor: '#0284c7',
    textColor: '#082f49',
    subtextColor: '#0369a1',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(14, 165, 233, 0.3)',
    badgeBg: '#0284c7',
    badgeText: '#ffffff',
  },
  sunset: {
    bgGradient: ['#fff1f2', '#fce7f3', '#ffe4e6'],
    pedestalColor: 'rgba(244, 63, 94, 0.15)',
    accentColor: '#e11d48',
    textColor: '#4c0519',
    subtextColor: '#9f1239',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    badgeBg: '#e11d48',
    badgeText: '#ffffff',
  },
};

/**
 * Generates an exportable 1080x1080 PNG summary card
 */
export async function generateShareCard(options: ShareCardOptions): Promise<GeneratedShareCard> {
  const canvas = document.createElement('canvas');
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const theme = THEMES[options.theme] || THEMES.terracotta;

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(0.5, theme.bgGradient[1]);
  bgGrad.addColorStop(1, theme.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Decorative Terrarium Arch & Geometric Sunburst lines
  ctx.save();
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.12;

  // Outer framing rectangle with rounded corners
  ctx.beginPath();
  ctx.roundRect(40, 40, size - 80, size - 80, 48);
  ctx.stroke();

  // Decorative botanical rays
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
    ctx.beginPath();
    ctx.moveTo(540, 460);
    ctx.lineTo(540 + Math.cos(angle) * 440, 460 + Math.sin(angle) * 440);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Header: App Brand & Date
  ctx.save();
  ctx.fillStyle = theme.accentColor;
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'center';
  ctx.fillText('🌵 CACTUS HYDRATION TRACKER', 540, 110);

  const dateStr =
    options.dateText ||
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  ctx.fillStyle = theme.subtextColor;
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(dateStr.toUpperCase(), 540, 142);
  ctx.restore();

  // 4. Milestone / Title Banner Ribbon
  ctx.save();
  const ribbonText = options.badgeName ? `🏆 ${options.badgeName.toUpperCase()}` : '🌟 DAILY HYDRATION MILESTONE';
  ctx.font = '800 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const ribbonWidth = ctx.measureText(ribbonText).width + 36;
  ctx.fillStyle = theme.badgeBg;
  ctx.beginPath();
  ctx.roundRect(540 - ribbonWidth / 2, 168, ribbonWidth, 36, 18);
  ctx.fill();

  ctx.fillStyle = theme.badgeText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ribbonText, 540, 186);

  // Main Headline
  ctx.fillStyle = theme.textColor;
  ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(options.title, 540, 246);

  // Subtitle (species or milestone details)
  ctx.fillStyle = theme.subtextColor;
  ctx.font = 'italic 500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(options.subtitle, 540, 282);
  ctx.restore();

  // 5. Terrarium Pedestal Plate (Behind Cactus)
  ctx.save();
  const pedestalGrad = ctx.createRadialGradient(540, 600, 20, 540, 600, 260);
  pedestalGrad.addColorStop(0, theme.pedestalColor);
  pedestalGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = pedestalGrad;
  ctx.beginPath();
  ctx.ellipse(540, 600, 280, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Draw the Cactus SVG onto the Canvas
  await drawCactusSvgToCanvas(ctx, options.cactusSvgSelector || '#share-source-svg svg');

  // 7. Stat Cards Grid (Bottom section)
  const cardY = 740;
  const cardHeight = 160;
  const cardSpacing = 24;
  const cardWidth = (size - 80 - cardSpacing * 2) / 3; // 3 cards

  const stats = [
    {
      icon: '💧',
      label: 'HYDRATION',
      value: options.intakeText,
      subvalue: `Goal: ${options.goalText}`,
    },
    {
      icon: '🌱',
      label: 'GROWTH',
      value: `${options.growthPercentage}%`,
      subvalue: options.stageName.replace(/Stage \d:\s*/, ''),
    },
    {
      icon: '🔥',
      label: 'STREAK',
      value: `${options.streakDays} Days`,
      subvalue: options.streakDays > 0 ? 'Consecutive streak' : 'Started today',
    },
  ];

  stats.forEach((stat, idx) => {
    const cardX = 40 + idx * (cardWidth + cardSpacing);
    ctx.save();
    // Card background
    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 28);
    ctx.fill();
    ctx.stroke();

    // Card Content
    ctx.textAlign = 'center';
    // Icon
    ctx.font = '32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(stat.icon, cardX + cardWidth / 2, cardY + 44);

    // Label
    ctx.fillStyle = theme.subtextColor;
    ctx.font = '800 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(stat.label, cardX + cardWidth / 2, cardY + 70);

    // Main Value
    ctx.fillStyle = theme.textColor;
    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(stat.value, cardX + cardWidth / 2, cardY + 108);

    // Subvalue
    ctx.fillStyle = theme.subtextColor;
    ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const trimmedSub = stat.subvalue.length > 20 ? `${stat.subvalue.slice(0, 18)}...` : stat.subvalue;
    ctx.fillText(trimmedSub, cardX + cardWidth / 2, cardY + 136);

    ctx.restore();
  });

  // 8. Footer Motivational Tagline
  ctx.save();
  ctx.fillStyle = theme.textColor;
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Hydrate your body, watch your desert sanctuary flourish ✨', 540, 955);

  ctx.fillStyle = theme.subtextColor;
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('#CactusHydrationTracker • Healthy Habits Every Day', 540, 990);
  ctx.restore();

  // 9. Convert to Blob and DataURL
  const dataUrl = canvas.toDataURL('image/png', 0.95);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create image blob'));
      },
      'image/png',
      0.95
    );
  });

  return { dataUrl, blob };
}

/**
 * Helper to render an SVG element from DOM onto Canvas
 */
async function drawCactusSvgToCanvas(ctx: CanvasRenderingContext2D, selector: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const svgElement = document.querySelector(selector) as SVGSVGElement | null;
      if (!svgElement) {
        // Fallback drawing if SVG not found
        drawFallbackCactus(ctx);
        return resolve();
      }

      // Clone SVG and set required XML attributes for standalone rasterization
      const clone = svgElement.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', '440');
      clone.setAttribute('height', '460');

      const svgString = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        // Center cactus at (540, 500)
        const targetW = 440;
        const targetH = 460;
        ctx.drawImage(img, 540 - targetW / 2, 500 - targetH / 2, targetW, targetH);
        URL.revokeObjectURL(url);
        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        drawFallbackCactus(ctx);
        resolve();
      };

      img.src = url;
    } catch {
      drawFallbackCactus(ctx);
      resolve();
    }
  });
}

function drawFallbackCactus(ctx: CanvasRenderingContext2D) {
  // Simple elegant botanical plant icon fallback in case rasterization encounters DOM security issues
  ctx.save();
  ctx.translate(540, 500);

  // Pot
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(-60, 60);
  ctx.lineTo(60, 60);
  ctx.lineTo(45, 130);
  ctx.lineTo(-45, 130);
  ctx.closePath();
  ctx.fill();

  // Pot rim
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.roundRect(-70, 50, 140, 20, 8);
  ctx.fill();

  // Cactus Body
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.roundRect(-30, -80, 60, 140, 30);
  ctx.fill();

  // Spines
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-35, -30);
  ctx.lineTo(-45, -30);
  ctx.moveTo(35, -30);
  ctx.lineTo(45, -30);
  ctx.stroke();

  // Flower
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(0, -90, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
