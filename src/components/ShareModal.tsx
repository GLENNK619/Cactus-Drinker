import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Flame,
  Droplet,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { CactusSvg } from './CactusSvg';
import { CACTUS_VARIETIES } from '../data/cacti';
import { POT_DESIGNS } from '../data/pots';
import {
  generateShareCard,
  ShareTheme,
  GeneratedShareCard,
} from '../utils/shareImageGenerator';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/audio';

export interface ShareModalProps {
  cactusId: string;
  growthPercentage: number;
  potId: string;
  customTitle?: string;
  customSubtitle?: string;
  badgeName?: string;
  badgeDescription?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  cactusId,
  growthPercentage,
  potId,
  customTitle,
  customSubtitle,
  badgeName,
  badgeDescription,
  onClose,
}) => {
  const { profile, todayRecord, setToast } = useApp();
  const [selectedTheme, setSelectedTheme] = useState<ShareTheme>('terracotta');
  const [generatedCard, setGeneratedCard] = useState<GeneratedShareCard | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedType, setCopiedType] = useState<'image' | 'text' | null>(null);

  const activeCactus =
    CACTUS_VARIETIES.find((c) => c.id === cactusId) || CACTUS_VARIETIES[0];
  const activePot = POT_DESIGNS.find((p) => p.id === potId) || POT_DESIGNS[0];

  const isOz = profile.unit === 'oz';
  const displayIntake = isOz
    ? `${(todayRecord.totalIntake * 0.033814).toFixed(1)} oz`
    : `${todayRecord.totalIntake} ml`;
  const displayGoal = isOz
    ? `${(profile.dailyGoal * 0.033814).toFixed(0)} oz`
    : `${profile.dailyGoal} ml`;

  // Default Title & Subtitle
  const defaultTitle =
    growthPercentage >= 100
      ? '100% Fully Blooming Cactus! 🌸'
      : growthPercentage >= 75
      ? 'Budding Desert Companion 🌿'
      : growthPercentage >= 45
      ? 'Branching & Flourishing 🌱'
      : growthPercentage >= 20
      ? 'Growing Strong Every Sip 🌵'
      : 'Sprouting from the Desert Soil 🌱';

  const title = customTitle || defaultTitle;
  const subtitle =
    customSubtitle || `${activeCactus.name} in ${activePot.name}`;

  // Stage name
  const stageName =
    growthPercentage >= 100
      ? 'Stage 5: Blooming'
      : growthPercentage >= 75
      ? 'Stage 4: Budding'
      : growthPercentage >= 45
      ? 'Stage 3: Branching'
      : growthPercentage >= 20
      ? 'Stage 2: Growing'
      : 'Stage 1: Sprouting';

  // Social Share Text
  const shareText = badgeName
    ? `🏆 I just unlocked the "${badgeName}" badge on Cactus Hydration Tracker! Hydrated ${displayIntake} today with a ${profile.currentStreak}-day streak! 🌵💧`
    : `🌵 My ${activeCactus.name} is ${growthPercentage}% grown today (${stageName})! Tracked ${displayIntake} / ${displayGoal} with a ${profile.currentStreak}-day hydration streak! 💧✨`;

  const shareUrl = window.location.href;

  // Generate Card on Mount & Theme Change
  useEffect(() => {
    let isCancelled = false;
    setIsGenerating(true);

    const timer = setTimeout(async () => {
      try {
        const card = await generateShareCard({
          theme: selectedTheme,
          title,
          subtitle,
          growthPercentage,
          stageName,
          intakeText: displayIntake,
          goalText: displayGoal,
          streakDays: profile.currentStreak,
          badgeName,
          badgeDescription,
          cactusSvgSelector: '#hidden-share-cactus-svg svg',
        });
        if (!isCancelled) {
          setGeneratedCard(card);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Error generating share card:', err);
        if (!isCancelled) setIsGenerating(false);
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    selectedTheme,
    cactusId,
    growthPercentage,
    potId,
    title,
    subtitle,
    badgeName,
    displayIntake,
    displayGoal,
    profile.currentStreak,
  ]);

  // Handle Download Image
  const handleDownload = () => {
    if (!generatedCard) return;
    soundEffects.playWaterDrop();
    const link = document.createElement('a');
    link.download = `cactus-growth-${Date.now()}.png`;
    link.href = generatedCard.dataUrl;
    link.click();
    setToast({
      id: String(Date.now()),
      title: 'Summary Image Downloaded!',
      body: 'Card saved as PNG. Ready to post anywhere! 🌿',
      timestamp: Date.now(),
    });
  };

  // Handle Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!generatedCard) return;
    try {
      soundEffects.playSoftClick();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': generatedCard.blob }),
        ]);
        setCopiedType('image');
        setTimeout(() => setCopiedType(null), 3000);
        setToast({
          id: String(Date.now()),
          title: 'Card Copied to Clipboard!',
          body: 'Paste directly into Instagram, Twitter, Discord, or chats! 📋',
          timestamp: Date.now(),
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  // Handle Copy Text
  const handleCopyText = async () => {
    try {
      soundEffects.playSoftClick();
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 3000);
      setToast({
        id: String(Date.now()),
        title: 'Share Text Copied!',
        body: 'Share caption ready to paste on social media 💬',
        timestamp: Date.now(),
      });
    } catch {
      // Fallback
    }
  };

  // Handle Native Device Share (Web Share API)
  const handleNativeShare = async () => {
    if (!generatedCard) return;
    soundEffects.playSoftClick();
    try {
      const file = new File([generatedCard.blob], 'cactus-growth.png', {
        type: 'image/png',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Cactus Hydration Milestone',
          text: shareText,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'My Cactus Hydration Milestone',
          text: shareText,
          url: shareUrl,
        });
      } else {
        handleCopyImage();
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        handleCopyImage();
      }
    }
  };

  // Platform Links
  const socialPlatforms = [
    {
      name: 'X (Twitter)',
      bg: 'bg-black hover:bg-stone-800 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`,
    },
    {
      name: 'Facebook',
      bg: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      bg: 'bg-sky-700 hover:bg-sky-800 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: 'Reddit',
      bg: 'bg-orange-600 hover:bg-orange-700 text-white',
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Telegram',
      bg: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Hidden Source SVG element for Canvas serialization */}
      <div id="hidden-share-cactus-svg" className="absolute -left-[9999px] top-0 pointer-events-none">
        <CactusSvg
          cactusId={cactusId}
          growthPercentage={growthPercentage}
          potId={potId}
          size={300}
        />
      </div>

      <div className="relative w-full max-w-xl bg-white dark:bg-[#131e18] border border-stone-200/90 dark:border-[#1e352a] rounded-3xl shadow-2xl p-5 sm:p-6 text-stone-800 dark:text-emerald-50 transition-colors my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1e352a] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Share Cactus Growth Card
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Generate high-res summary card for social media & stories
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Card Style Theme Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2 text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Select Card Style
              </span>
              <span className="text-[11px] font-medium text-stone-400">1080 × 1080 Square</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'terracotta', label: 'Terracotta Sunrise', preview: 'from-amber-100 to-orange-200' },
                  { id: 'emerald', label: 'Desert Emerald', preview: 'from-emerald-950 to-teal-900 text-white' },
                  { id: 'oasis', label: 'Oasis Breeze', preview: 'from-cyan-100 to-sky-200' },
                  { id: 'sunset', label: 'Sunset Bloom', preview: 'from-rose-100 to-pink-200' },
                ] as const
              ).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setSelectedTheme(th.id);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex flex-col gap-1.5 ${
                    selectedTheme === th.id
                      ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 dark:border-[#1e352a] hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className={`w-full h-5 rounded-lg bg-gradient-to-r ${th.preview} shadow-inner`} />
                  <span className="truncate text-[11px]">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="relative rounded-2xl bg-stone-100 dark:bg-[#0d1410] border border-stone-200/80 dark:border-[#1e352a] p-3 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
            {isGenerating || !generatedCard ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
                <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold animate-pulse">
                  Rendering botanical summary card...
                </span>
              </div>
            ) : (
              <div className="relative group max-w-[320px] w-full aspect-square rounded-2xl shadow-lg overflow-hidden border border-stone-200/50 dark:border-white/10">
                <img
                  src={generatedCard.dataUrl}
                  alt="Cactus Growth Summary Card"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>1080p HD</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Native Share, Download, Copy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Native Device Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isGenerating || !generatedCard}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Device</span>
              </button>
            )}

            {/* Download PNG */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || !generatedCard}
              className="py-2.5 px-3 rounded-xl bg-stone-900 dark:bg-[#1a2e23] hover:bg-stone-800 dark:hover:bg-[#223d2f] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-transparent dark:border-[#2a4537]"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </button>

            {/* Copy Image */}
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating || !generatedCard}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#14231b] hover:bg-stone-50 dark:hover:bg-[#1c3227] text-stone-800 dark:text-emerald-100 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-stone-300/80 dark:border-[#233f30]"
            >
              {copiedType === 'image' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied Image!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Social Media Platform Buttons */}
          <div className="pt-2 border-t border-stone-100 dark:border-[#1e352a]">
            <div className="flex items-center justify-between text-xs font-bold mb-2 text-stone-600 dark:text-stone-300">
              <span>Share Directly to Social Platforms</span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                {copiedType === 'text' ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEffects.playSoftClick()}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${platform.bg}`}
                >
                  <span>{platform.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 dark:text-stone-500 text-center mt-2.5">
              💡 Platform opens with your achievement caption. Attach your downloaded card image to share visual growth!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
