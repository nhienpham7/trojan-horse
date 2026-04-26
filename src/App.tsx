/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, MapPin, MousePointerClick } from "lucide-react";
import Gallery from "./components/Gallery.jsx";

const artists = [
  "Magnus", "Casey", "Rohen Jones", "Faye",
  "Jonah", "Winnie", "Timothy Zhang", "Isaac Ball"
];

const SplitText = ({
  text,
  delay = 0,
  animate = true,
  className = "",
}: {
  text: string;
  delay?: number;
  animate?: boolean;
  className?: string;
}) => (
  <span
    className={`inline-flex overflow-hidden align-baseline pt-[0.04em] pb-[0.14em] px-[0.12em] -mx-[0.12em] ${className}`}
    aria-label={text}
  >
    {text.split("").map((char, i) => (
      <motion.span
        key={`${char}-${i}`}
        initial="hidden"
        animate={animate ? "show" : "hidden"}
        variants={{
          hidden: { y: "110%", rotate: 10, opacity: 0, filter: "blur(10px)" },
          show: { y: 0, rotate: 0, opacity: 1, filter: "blur(0px)" },
        }}
        transition={{
          duration: 0.95,
          ease: [0.16, 1, 0.3, 1],
          delay: delay + i * 0.028,
        }}
        className="inline-block will-change-transform"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [preloaderExited, setPreloaderExited] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [horsePuzzleCacheKey] = useState(() => Date.now());
  const [galleryVisible, setGalleryVisible] = useState(false);
  const horseVideoRef = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredVideoRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const beginExperience = () => {
    if (showContent) return;
    setUserInteracted(true);
    const video = horseVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      video.volume = 1;
      const playPromise = video.play();
      if (playPromise) {
        playPromise
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {});
      }
    }
    setShowContent(true);
  };

  useEffect(() => {
    const video = horseVideoRef.current;
    if (!video) return;
    if (preloaderExited) return;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    video.volume = 1;
  }, [preloaderExited]);

  useEffect(() => {
    if (!preloaderExited) return;
    if (!userInteracted) return;
    if (hasTriggeredVideoRef.current) return;
    hasTriggeredVideoRef.current = true;
    const video = horseVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;

    const tryPlayWithSound = () => {
      const playPromise = video.play();
      if (!playPromise) return;
      playPromise.catch(() => {
        video.pause();
        video.currentTime = 0;
      });
    };

    requestAnimationFrame(tryPlayWithSound);
  }, [preloaderExited, userInteracted]);

  return (
    <div className="h-screen w-full bg-brand-cream text-brand-ink grainy overflow-hidden selection:bg-brand-accent selection:text-brand-cream font-sans p-4 md:p-8">
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence onExitComplete={() => setPreloaderExited(true)}>
          {!showContent && (
            <motion.div
              key="preloader"
              exit={{
                y: "-100%",
                transition: { duration: 1.6, ease: [0.77, 0, 0.175, 1] }
              }}
              drag="y"
              dragConstraints={{ top: -240, bottom: 0 }}
              dragElastic={0.08}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.y < -80) beginExperience();
              }}
              onWheel={beginExperience}
              onTouchStart={(e) => {
                touchStartYRef.current = e.touches[0]?.clientY ?? null;
              }}
              onTouchMove={(e) => {
                const startY = touchStartYRef.current;
                const currentY = e.touches[0]?.clientY;
                if (startY == null || currentY == null) return;
                if (startY - currentY > 60) beginExperience();
              }}
              className="fixed inset-0 z-50 bg-brand-ink flex flex-col items-center justify-center text-brand-cream select-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative w-32 h-32 mb-12"
              >
                <div className="absolute inset-0 border-2 border-brand-accent/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border border-brand-accent grid place-items-center rounded-full">
                  <svg viewBox="0 0 100 100" className="w-full h-full block" aria-hidden="true">
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="currentColor"
                      fontFamily="var(--font-serif)"
                      fontStyle="normal"
                      fontSize="28"
                    >
                      𝕋
                    </text>
                  </svg>
                </div>
              </motion.div>
              
              <div className="overflow-hidden">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="font-display text-4xl md:text-6xl tracking-tighter uppercase projector-flicker"
                >
                  <SplitText text="THE TROJAN HORSE" delay={0.25} />
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ delay: 0.75, duration: 0.75 }}
                className="h-[1px] bg-brand-accent mt-4" 
              />

              <motion.button
                type="button"
                onClick={beginExperience}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-brand-cream/70"
              >
                <span className="relative hint-click">
                  <MousePointerClick size={18} className="text-brand-cream/60" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.35em]">
                  <SplitText text="Click to Explore" delay={1.1} />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="w-full h-full max-w-7xl mx-auto border border-brand-ink/10 rounded-3xl p-6 md:p-12 flex flex-col relative overflow-hidden bg-brand-paper/20">
        {/* Decorative corner markers */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-brand-accent/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-brand-accent/40" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-brand-accent/40" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-brand-accent/40" />

        {/* Layout Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
          
          {/* Left Column: Info & Title */}
          <div className="lg:col-span-4 flex flex-col justify-between py-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={showContent ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-brand-accent text-brand-cream rounded-full">
                  <svg viewBox="0 0 100 100" className="w-full h-full block" aria-hidden="true">
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="currentColor"
                      fontFamily="var(--font-serif)"
                      fontStyle="normal"
                      fontSize="50"
                    >
                      𝕋
                    </text>
                  </svg>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] leading-tight text-brand-accent">
                  <div>
                    <SplitText text="Art Exhibition" animate={showContent} delay={0.25} />
                  </div>
                  <div>
                    <SplitText text="Chicago · 2026" animate={showContent} delay={0.38} />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl font-display uppercase tracking-tighter mb-8 flex flex-col gap-2 leading-[1] projector-flicker">
                <span className="block">
                  <SplitText text="The" animate={showContent} delay={0.32} />
                </span>
                <span
                  className="block text-stroke"
                  style={{ WebkitTextStrokeColor: "var(--color-brand-ink)" }}
                >
                  <SplitText text="Trojan" animate={showContent} delay={0.5} />
                </span>
                <span className="block">
                  <SplitText text="Horse" animate={showContent} delay={0.7} />
                </span>
              </h1>

              <div className="space-y-4 max-w-xs">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-accent shrink-0 mt-1" />
                  <p className="text-sm font-serif leading-relaxed italic opacity-80">
                    <SplitText text="3217 S Morgan St · Chicago, IL" animate={showContent} delay={0.95} />
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
              className="hidden lg:block space-y-4"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] font-semibold opacity-70 ink-underline">
                <SplitText text="Curated with Intention" animate={showContent} delay={1.6} />
              </p>
              <div className="w-full h-[1px] bg-brand-ink/10" />
              <p className="text-[10px] leading-relaxed font-semibold opacity-70 uppercase tracking-widest">
                <SplitText text="A group exhibition of emerging artists." animate={showContent} delay={1.8} />
              </p>
            </motion.div>
          </div>

          {/* Center Column: Video */}
          <div className="lg:col-span-5 lg:-ml-4 relative flex items-center justify-center py-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full max-h-[500px] group overflow-hidden rounded-2xl shadow-2xl shadow-brand-ink/10"
            >
               <video
                ref={horseVideoRef}
                playsInline
                preload="auto"
                key={horsePuzzleCacheKey}
                className="w-full h-full object-cover"
                onClick={() => {
                  const video = horseVideoRef.current;
                  if (!video) return;
                  if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = 1;
                    if (video.paused) void video.play();
                    return;
                  }
                  if (video.paused) void video.play();
                  else video.pause();
                }}
                onEnded={() => {
                  const video = horseVideoRef.current;
                  if (!video) return;
                  video.currentTime = 0;
                  video.pause();
                }}
              >
                <source src={`/horse-puzzle.mp4?v=${horsePuzzleCacheKey}`} type="video/mp4" />
              </video>
            </motion.div>
          </div>

          {/* Right Column: Artists & CTA */}
          <div className="lg:col-span-3 flex flex-col justify-between py-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={showContent ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-6"
            >
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-ink/70 ink-underline">
                  <SplitText text="Artist list" animate={showContent} delay={0.95} />
                </span>
              </div>
              
              <div className="space-y-2">
                {artists.map((artist, i) => (
                  <motion.div
                    key={artist}
                    initial={{ opacity: 0, x: -10, filter: "blur(8px)" }}
                    animate={
                      showContent
                        ? { opacity: 1, x: 0, filter: "blur(0px)" }
                        : { opacity: 0, x: -10, filter: "blur(8px)" }
                    }
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 1.05 + i * 0.08,
                    }}
                    whileHover={{ x: 10 }}
                    className="artist-row flex items-center gap-3 group cursor-default"
                  >
                    <span className="text-[10px] font-mono text-brand-accent/40 group-hover:text-brand-accent transition-colors">0{i+1}</span>
                    <span className="text-lg md:text-xl font-serif text-brand-ink/80 group-hover:text-brand-ink transition-colors">{artist}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-12"
            >
              <motion.button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setGalleryVisible(true)}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={
                  showContent ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }
                }
                transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                className="cta-button perspective-1000 w-full relative group overflow-hidden bg-brand-ink text-brand-cream py-6 rounded-2xl flex items-center justify-center gap-4 transition-all hover:shadow-xl hover:shadow-brand-accent/20"
              >
                <div className="absolute inset-0 z-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-[0.4em]">
                  <SplitText text="Enter Gallery" animate={showContent} delay={1.35} />
                </span>
                <ArrowUpRight className="relative z-10 group-hover:rotate-45 transition-transform duration-700" size={18} />
              </motion.button>
            </motion.div>
          </div>

        </div>
      </main>
      </div>
      <Gallery visible={galleryVisible} />
    </div>
  );
}
