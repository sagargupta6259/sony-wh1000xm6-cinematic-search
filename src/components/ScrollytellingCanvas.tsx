"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronDown,
  Play,
  Pause,
  FileText,
  Sparkles,
  ShoppingBag,
  Zap,
} from "lucide-react";
import CinematicDocSearch from "./CinematicDocSearch";

interface ScrollytellingCanvasProps {
  onOpenOrder: () => void;
  onOpenRAG: () => void;
  onOpenPdfModal: (page?: number) => void;
}

const TOTAL_FRAMES = 120;

// Cosmic Multiverse Star Interface
interface CosmicStar {
  arm: number;
  radiusRatio: number;
  baseAngle: number;
  speed: number;
  size: number;
  brightness: number;
  colorRgb: string;
  pulseSpeed: number;
  pulsePhase: number;
}

// Stardust Motes floating around rings
interface StardustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  colorRgb: string;
}

export default function ScrollytellingCanvas({
  onOpenOrder,
  onOpenRAG,
  onOpenPdfModal,
}: ScrollytellingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCounterRef = useRef<HTMLSpanElement>(null);
  const frameProgressRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [multiverseSpeed, setMultiverseSpeed] = useState<number>(1.0);

  // Mouse parallax refs
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Target frame ref for smooth lerping
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Multiverse Particle System Refs (Optimized count for 60+ FPS)
  const starsRef = useRef<CosmicStar[]>([]);
  const subStarsRef = useRef<CosmicStar[]>([]);
  const stardustRef = useRef<StardustMote[]>([]);
  const timeRef = useRef<number>(0);

  // Initialize Cosmic Galaxy Multiverse Particles
  useEffect(() => {
    // 1. Primary Multiverse Galaxy Stars (140 particles - dense & silky smooth)
    const stars: CosmicStar[] = [];
    const numStars = 140;
    const numArms = 3;

    for (let i = 0; i < numStars; i++) {
      const arm = i % numArms;
      const rRatio = Math.pow(Math.random(), 1.6) * 0.95 + 0.05;
      const baseAngle = (arm * (Math.PI * 2)) / numArms + rRatio * 4.2 + (Math.random() - 0.5) * 0.6;
      const speed = (0.28 + (1 - rRatio) * 0.65) * (Math.random() * 0.4 + 0.8);
      const size = Math.random() < 0.12 ? 2.4 : Math.random() < 0.4 ? 1.6 : 1.0;
      const colorChoices = [
        "0, 214, 255",   // cyan
        "80, 140, 255",  // sony blue
        "255, 255, 255", // white
        "190, 150, 255", // soft purple
      ];
      const colorRgb = colorChoices[Math.floor(Math.random() * colorChoices.length)];

      stars.push({
        arm,
        radiusRatio: rRatio,
        baseAngle,
        speed,
        size,
        colorRgb,
        brightness: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 2.5 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;

    // 2. Secondary Sub-Orb Galaxy Stars (45 particles)
    const subStars: CosmicStar[] = [];
    const numSub = 45;
    for (let i = 0; i < numSub; i++) {
      const arm = i % 2;
      const rRatio = Math.pow(Math.random(), 1.4) * 0.92 + 0.08;
      const baseAngle = (arm * Math.PI) + rRatio * 3.8 + (Math.random() - 0.5) * 0.5;
      const speed = -(0.35 + (1 - rRatio) * 0.5) * (Math.random() * 0.3 + 0.85);
      const size = Math.random() < 0.15 ? 1.9 : 1.1;
      const colorRgb = Math.random() > 0.4 ? "0, 214, 255" : "210, 180, 255";

      subStars.push({
        arm,
        radiusRatio: rRatio,
        baseAngle,
        speed,
        size,
        brightness: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 3 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
        colorRgb,
      });
    }
    subStarsRef.current = subStars;

    // 3. Stardust Motes around floating rings (25 particles)
    const stardust: StardustMote[] = [];
      for (let i = 0; i < 25; i++) {
        stardust.push({
          x: (Math.random() - 0.5) * 380,
          y: (Math.random() - 0.5) * 380,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.4 + 0.6,
          alpha: Math.random() * 0.5 + 0.2,
          colorRgb: Math.random() > 0.4 ? "0, 214, 255" : "179, 136, 255",
        });
      }
      stardustRef.current = stardust;
    }, []);

  // Track Mouse Movement for Interactive Parallax Glare
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePosRef.current.targetX = nx * 14;
      mousePosRef.current.targetY = ny * 10;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 1. Progressive Image Preloading (Prioritizes Hero Frame 0 First)
  useEffect(() => {
    let isCancelled = false;
    const imgArray: HTMLImageElement[] = new Array(TOTAL_FRAMES);

        // Step A: Load hero frame 0 immediately so page is instant
        const heroImg = new Image();
        heroImg.src = "/sequence/frame_000.webp";
        heroImg.onload = () => {
          if (isCancelled) return;
          imgArray[0] = heroImg;
          setImages([...imgArray]);
          setIsLoaded(true);
          setLoadProgress(15);
        };
        heroImg.onerror = () => {
          heroImg.src = "/sequence/frame_000.jpg";
          heroImg.onload = () => {
            if (isCancelled) return;
            imgArray[0] = heroImg;
            setImages([...imgArray]);
            setIsLoaded(true);
          };
        };

            // Step B: Progressively batch-load remaining frames
            let loadedCount = 1;
            const batchSize = 15;
            let currentBatch = 1;

            const loadBatch = () => {
              if (isCancelled) return;
              const start = currentBatch;
              const end = Math.min(TOTAL_FRAMES, start + batchSize);

              for (let i = start; i < end; i++) {
                const img = new Image();
                const frameStr = String(i).padStart(3, "0");
                img.src = `/sequence/frame_${frameStr}.webp`;

                const onDone = () => {
                  if (isCancelled) return;
                  imgArray[i] = img;
                  loadedCount++;
                    // Only update React progress at round milestones
                    if (loadedCount % 24 === 0 || loadedCount === TOTAL_FRAMES) {
                      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                      setImages([...imgArray]);
                    }
                  };

              img.onload = onDone;
              img.onerror = () => {
                img.src = `/sequence/frame_${frameStr}.jpg`;
                img.onload = onDone;
              };
            }

            currentBatch = end;
            if (currentBatch < TOTAL_FRAMES) {
              setTimeout(loadBatch, 25);
            }
          };

          setTimeout(loadBatch, 60);

          return () => {
            isCancelled = true;
          };
        }, []);

  // 2. High-Performance Canvas Render Loop (Zero ShadowBlur, Ultra-smooth 60+ FPS)
  const renderCanvasWithMultiverse = useCallback(
    (frameIndex: number, time: number) => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const img = images[Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex))] || images[0];
      if (!img || !img.complete) return;

      // Cap DPR at 1.5 to prevent massive 6-megapixel fill-rate overhead on Retina
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

        if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        // Deep charcoal background fill #050505
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, width, height);

        // Mouse parallax smooth lerp
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;

        // Subtle breathing float
        const idleFloatY = Math.sin(time * 1.5) * 4 + my;
        const idleFloatX = Math.cos(time * 1.1) * 2.5 + mx;

        // Contain scaling
        const imgAspect = img.width / img.height;
        const screenAspect = width / height;

        let drawW: number;
        let drawH: number;

        if (screenAspect > imgAspect) {
          drawH = height * 0.88;
          drawW = drawH * imgAspect;
        } else {
          drawW = width * 0.94;
          drawH = drawW / imgAspect;
        }

        const drawX = (width - drawW) / 2 + idleFloatX;
        const drawY = (height - drawH) / 2 + idleFloatY;

        // Draw product base frame
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // ==============================================================
        // LIVE MULTIVERSE GALAXY ANIMATION ENGINE (CENTER SPHERE)
        // High-performance screen blending without shadowBlur
        // ==============================================================
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const mainOrbX = drawX + drawW * 0.488;
        const mainOrbY = drawY + drawH * 0.455;
        const mainOrbRadius = drawW * 0.108;

        const subOrbX = drawX + drawW * 0.582;
        const subOrbY = drawY + drawH * 0.562;
        const subOrbRadius = drawW * 0.058;

        // A. Main Multiverse Galactic Core Glow
        const corePulse = 1.0 + Math.sin(time * 2.5) * 0.15;
        const coreGrad = ctx.createRadialGradient(
          mainOrbX,
          mainOrbY,
          0,
          mainOrbX,
          mainOrbY,
          mainOrbRadius * 1.05
        );
        coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        coreGrad.addColorStop(0.15, "rgba(0, 214, 255, 0.8)");
        coreGrad.addColorStop(0.38, "rgba(0, 80, 255, 0.5)");
        coreGrad.addColorStop(0.7, "rgba(179, 136, 255, 0.2)");
        coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mainOrbX, mainOrbY, mainOrbRadius * corePulse, 0, Math.PI * 2);
        ctx.fill();

        // B. Render Swirling Primary Multiverse Stars (Optimized dual-arc rendering)
        const stars = starsRef.current;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const currentAngle = s.baseAngle + time * s.speed * multiverseSpeed * 0.7;
          const currentRadius = s.radiusRatio * mainOrbRadius;

          const px = mainOrbX + Math.cos(currentAngle) * currentRadius;
          const py = mainOrbY + Math.sin(currentAngle) * currentRadius * 0.78;

          const dx = px - mainOrbX;
          const dy = (py - mainOrbY) / 0.78;
          if (dx * dx + dy * dy < mainOrbRadius * mainOrbRadius) {
            const twinkle = 0.5 + 0.5 * Math.sin(time * s.pulseSpeed + s.pulsePhase);
            const alpha = s.brightness * twinkle;

            // Inner bright core
            ctx.fillStyle = `rgba(${s.colorRgb}, ${alpha})`;
            ctx.beginPath();
              ctx.arc(px, py, s.size * (0.8 + twinkle * 0.3), 0, Math.PI * 2);
              ctx.fill();

              // Soft outer halo for brightest stars (Zero shadowBlur overhead!)
              if (s.size > 1.7 && alpha > 0.55) {
                ctx.fillStyle = `rgba(${s.colorRgb}, ${alpha * 0.25})`;
                ctx.beginPath();
                ctx.arc(px, py, s.size * 2.2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // C. Render Secondary Sub-Orb Swirling Galaxy
          const subGrad = ctx.createRadialGradient(
            subOrbX,
            subOrbY,
            0,
            subOrbX,
            subOrbY,
            subOrbRadius
          );
          subGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
          subGrad.addColorStop(0.25, "rgba(179, 136, 255, 0.6)");
          subGrad.addColorStop(0.55, "rgba(0, 214, 255, 0.3)");
          subGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = subGrad;
          ctx.beginPath();
          ctx.arc(subOrbX, subOrbY, subOrbRadius * 0.9, 0, Math.PI * 2);
          ctx.fill();

          const subStars = subStarsRef.current;
          for (let i = 0; i < subStars.length; i++) {
            const s = subStars[i];
            const currentAngle = s.baseAngle + time * s.speed * multiverseSpeed * 0.85;
            const currentRadius = s.radiusRatio * subOrbRadius;

            const px = subOrbX + Math.cos(currentAngle) * currentRadius;
            const py = subOrbY + Math.sin(currentAngle) * currentRadius * 0.72;

            const dx = px - subOrbX;
            const dy = (py - subOrbY) / 0.72;
            if (dx * dx + dy * dy < subOrbRadius * subOrbRadius) {
              const twinkle = 0.5 + 0.5 * Math.sin(time * s.pulseSpeed + s.pulsePhase);
              ctx.fillStyle = `rgba(${s.colorRgb}, ${s.brightness * twinkle})`;
              ctx.beginPath();
              ctx.arc(px, py, s.size, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // D. Exploded State Quantum Energy Filaments (when scrolled > 15)
          if (frameIndex > 15) {
            const energyIntensity = Math.min(1.0, (frameIndex - 15) / 45);
            const numBeams = 6;
            ctx.lineWidth = 1.2;

            for (let b = 0; b < numBeams; b++) {
              const beamAngle = (b * Math.PI * 2) / numBeams + time * 0.25;
              const beamDist = mainOrbRadius * (1.2 + energyIntensity * 1.6);
              const endX = mainOrbX + Math.cos(beamAngle) * beamDist;
              const endY = mainOrbY + Math.sin(beamAngle) * (beamDist * 0.65);

              const beamGrad = ctx.createLinearGradient(mainOrbX, mainOrbY, endX, endY);
              beamGrad.addColorStop(0, `rgba(0, 214, 255, ${0.6 * energyIntensity})`);
              beamGrad.addColorStop(0.7, `rgba(0, 80, 255, ${0.3 * energyIntensity})`);
              beamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

              ctx.strokeStyle = beamGrad;
              ctx.beginPath();
              ctx.moveTo(mainOrbX, mainOrbY);
              const midX = (mainOrbX + endX) / 2 + Math.sin(time * 2.5 + b) * 10;
              const midY = (mainOrbY + endY) / 2 + Math.cos(time * 2.5 + b) * 6;
              ctx.quadraticCurveTo(midX, midY, endX, endY);
              ctx.stroke();
            }
          }

          // E. Floating Ring Stardust Particles
          const motes = stardustRef.current;
          for (let m = 0; m < motes.length; m++) {
            const mote = motes[m];
            mote.x += mote.vx;
            mote.y += mote.vy;
            if (Math.abs(mote.x) > 300) mote.vx *= -1;
            if (Math.abs(mote.y) > 240) mote.vy *= -1;

            const px = mainOrbX + mote.x;
            const py = mainOrbY + mote.y;

            const alpha = mote.alpha * (0.6 + 0.4 * Math.sin(time * 2 + m));
            ctx.fillStyle = `rgba(${mote.colorRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, mote.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore(); // Restore from screen composite mode

          // Seamless Edge Radial Blend into #050505
          const radialGlow = ctx.createRadialGradient(
            width / 2,
            height / 2,
            Math.min(drawW, drawH) * 0.45,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.75
          );
          radialGlow.addColorStop(0, "rgba(5, 5, 5, 0)");
          radialGlow.addColorStop(0.85, "rgba(5, 5, 5, 0.4)");
          radialGlow.addColorStop(1, "rgba(5, 5, 5, 1)");

          ctx.fillStyle = radialGlow;
          ctx.fillRect(0, 0, width, height);

          ctx.restore();
        },
        [images, multiverseSpeed]
  );

  // 3. Continuous 60FPS Animation Loop (Direct DOM Updates - NO React Re-renders!)
  useEffect(() => {
    let lastTime = performance.now();
    let prevFrameInt = -1;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) * 0.001);
      lastTime = now;
      timeRef.current += dt;

      // Mouse lerp
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.08;

      // Frame scrubbing lerp
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.16;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.round(currentFrameRef.current);

      // Direct DOM update (ZERO React state re-render overhead!)
      if (frameToDraw !== prevFrameInt) {
        prevFrameInt = frameToDraw;
        if (frameCounterRef.current) {
          frameCounterRef.current.textContent = String(frameToDraw).padStart(3, "0");
        }
        if (frameProgressRef.current) {
          frameProgressRef.current.style.width = `${(frameToDraw / (TOTAL_FRAMES - 1)) * 100}%`;
        }
      }

      // Render Base Sequence Frame + Animated Swirling Cosmic Multiverse
      renderCanvasWithMultiverse(frameToDraw, timeRef.current);

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderCanvasWithMultiverse]);

  // 4. Decoupled RAF Scroll Tracking (High-performance event listener)
  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingAuto) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (containerHeight || 1)));

      targetFrameRef.current = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
      );

      // Throttle React state update to animation frames
      if (!scrollRafRef.current) {
        scrollRafRef.current = requestAnimationFrame(() => {
          setScrollProgress(progress);
          scrollRafRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isPlayingAuto]);

  // Auto-play loop toggle
  useEffect(() => {
    if (!isPlayingAuto) return;
    const interval = setInterval(() => {
      targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
    }, 45);
    return () => clearInterval(interval);
  }, [isPlayingAuto]);

  // Clean, Non-Overlapping Story Beats Calculations
  const p = scrollProgress;

  // Beat 1: 0 to 0.13 (Clean Hero & Search Interface)
  const beat1Opacity = p <= 0.12 ? (p < 0.08 ? 1 : (0.12 - p) / 0.04) : 0;

  // Beat 2: 0.16 to 0.38 (Acoustic Transducer - Left aligned)
  const beat2Opacity =
    p > 0.15 && p < 0.38
      ? p < 0.21
        ? (p - 0.15) / 0.06
        : p > 0.33
          ? (0.38 - p) / 0.05
          : 1
      : 0;

  // Beat 3: 0.41 to 0.63 (Neural ANC Silicon - Right aligned)
  const beat3Opacity =
    p > 0.40 && p < 0.63
      ? p < 0.46
        ? (p - 0.40) / 0.06
        : p > 0.58
          ? (0.63 - p) / 0.05
          : 1
      : 0;

  // Beat 4: 0.66 to 0.84 (Edge AI & Codecs - Left aligned)
  const beat4Opacity =
    p > 0.65 && p < 0.84
      ? p < 0.70
        ? (p - 0.65) / 0.05
        : p > 0.80
          ? (0.84 - p) / 0.04
          : 1
      : 0;

  // Beat 5: 0.86 to 1.00 (Reassembly CTA - Centered)
  const beat5Opacity = p >= 0.86 ? Math.min(1, (p - 0.86) / 0.06) : 0;

  const getBeatName = () => {
    if (p < 0.15) return "Multiverse Core • AI Document Search";
    if (p < 0.4) return "Page 2 • Acoustic Transducers";
    if (p < 0.65) return "Page 3 • Dual QN3 Active Isolation";
    if (p < 0.85) return "Page 4 • DSEE Ultimate & LDAC";
    return "Page 5 • Reassembly & Architecture";
  };

  return (
    <div
      id="search-hero-section"
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#050505]"
    >
        {/* Sticky Screen Canvas Viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-[#050505] cursor-grab active:cursor-grabbing"
          />

          {/* Loading Indicator */}
          {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-50 transition-opacity duration-500">
                  <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-[#0050FF]/20 animate-ping" />
                    <div className="w-12 h-12 rounded-full border-2 border-t-[#00D6FF] border-r-transparent border-b-[#0050FF] border-l-transparent animate-spin" />
                  </div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/70">
                      Initializing Exploded Architecture...
                    </span>
                    <span className="text-[11px] font-mono text-[#00D6FF] mt-2">
                      {loadProgress}%
                    </span>
                </div>
        )}

                {/* ============================================================== */}
                {/* BEAT 1: HERO & MAIN AI DOCUMENT SEARCH INTERFACE               */}
                {/* ============================================================== */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 transition-all duration-300 pointer-events-none z-10 pt-16 sm:pt-10"
                  style={{
                    opacity: beat1Opacity,
                    transform: `translateY(${p * 40}px)`,
                    visibility: beat1Opacity > 0.01 ? "visible" : "hidden",
                  }}
                >
                  <div className="pointer-events-auto w-full">
                    <CinematicDocSearch
                      onOpenPdfModal={onOpenPdfModal}
                      onFocusSearch={() => { }}
                    />
                  </div>

                  <div className="mt-8 flex flex-col items-center space-y-1.5 text-white/40 animate-bounce pointer-events-auto">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-medium">
                      Scroll to Explore Exploded View
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#00D6FF]" />
                  </div>
                </div>

                {/* ============================================================== */}
                {/* BEAT 2: ENGINEERING REVEAL (15 - 38% scroll) - Left Side Card  */}
                {/* ============================================================== */}
                <div
                  className="absolute inset-0 flex items-center justify-start px-6 sm:px-14 lg:px-20 transition-all duration-300 pointer-events-none z-10"
                  style={{
                    opacity: beat2Opacity,
                    transform: `translateX(${(1 - beat2Opacity) * -25}px)`,
                    visibility: beat2Opacity > 0.01 ? "visible" : "hidden",
                  }}
                >
                  <div className="max-w-md p-6 sm:p-8 rounded-3xl glass-panel bg-[#0a0a0e]/80 border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0050FF]/15 border border-[#0050FF]/30 mb-4">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00D6FF]">
                        PDF Source: Page 2 • Acoustic Transducer
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
                      Precision-engineered for silence.
                    </h2>

                    <div className="space-y-2.5 text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6">
                      <p>
                        Custom 40mm carbon-composite drivers, sealed acoustic chambers,
                        and dual helical airflow venting deliver studio-grade clarity.
                      </p>
                      <p className="text-white/50">
                        Every component is tuned for transient balance, power, and
                        comfort—hour after hour.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 pointer-events-auto">
                      <button
                        onClick={() => onOpenPdfModal(2)}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs text-white font-mono flex items-center space-x-2 transition-colors shadow-md"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#00D6FF]" />
                        <span>Inspect Page 2 Specs</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* BEAT 3: NOISE CANCELLING & MICS (40 - 63% scroll) - Right Card */}
                {/* ============================================================== */}
                <div
                  className="absolute inset-0 flex items-center justify-end px-6 sm:px-14 lg:px-20 transition-all duration-300 pointer-events-none z-10"
                  style={{
                    opacity: beat3Opacity,
                    transform: `translateX(${(1 - beat3Opacity) * 25}px)`,
                    visibility: beat3Opacity > 0.01 ? "visible" : "hidden",
                  }}
                >
                  <div className="max-w-md p-6 sm:p-8 rounded-3xl glass-panel bg-[#0a0a0e]/80 border border-white/10 shadow-2xl backdrop-blur-xl text-right">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0050FF]/15 border border-[#0050FF]/30 mb-4 ml-auto">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00D6FF]">
                        PDF Source: Page 3 • Neural ANC Silicon
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                      Adaptive noise cancelling, redefined.
                    </h2>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6 inline-block text-right">
                      <li className="flex items-center justify-end space-x-2">
                        <span>Multi-microphone array listens in every direction.</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]" />
                      </li>
                      <li className="flex items-center justify-end space-x-2">
                        <span>Real-time noise analysis adjusts to your environment.</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]" />
                      </li>
                      <li className="flex items-center justify-end space-x-2 text-white/90">
                        <span>Your music stays pure—planes, trains, and crowds fade away.</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0050FF]" />
                      </li>
                    </ul>

                    <div className="flex items-center justify-end space-x-3 pointer-events-auto">
                      <button
                        onClick={() => onOpenPdfModal(3)}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs text-white font-mono flex items-center space-x-2 transition-colors shadow-md"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#00D6FF]" />
                        <span>Inspect Page 3 Specs</span>
                      </button>

                      <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                        <span className="text-white/50 mr-1">ANC:</span>
                        <span className="text-[#00D6FF] font-bold">-38.6 dB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* BEAT 4: SOUND & UPSCALING (65 - 84% scroll) - Left Side Card   */}
                {/* ============================================================== */}
                <div
                  className="absolute inset-0 flex items-center justify-start px-6 sm:px-14 lg:px-20 transition-all duration-300 pointer-events-none z-10"
                  style={{
                    opacity: beat4Opacity,
                    transform: `translateX(${(1 - beat4Opacity) * -25}px)`,
                    visibility: beat4Opacity > 0.01 ? "visible" : "hidden",
                  }}
                >
                  <div className="max-w-md p-6 sm:p-8 rounded-3xl glass-panel bg-[#0a0a0e]/80 border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0050FF]/15 border border-[#0050FF]/30 mb-4">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00D6FF]">
                        PDF Source: Page 4 • DSEE Ultimate Edge-AI
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
                      Hear what was lost.
                    </h2>

                      <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6">
                        Edge-AI restoration algorithmically reconstructs high-frequency
                        harmonics lost in lossy compression, bringing compressed files
                        closer to the studio master.
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
                        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                          <div className="text-[#00D6FF] font-bold text-sm">990 kbps</div>
                          <div className="text-[10px] text-white/50 mt-0.5">LDAC™ Hi-Res</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                          <div className="text-white font-bold text-sm">32-bit / 96kHz</div>
                          <div className="text-[10px] text-white/50 mt-0.5">Acoustic Spec</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pointer-events-auto">
                        <button
                          onClick={() => onOpenPdfModal(4)}
                          className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs text-white font-mono flex items-center space-x-2 transition-colors shadow-md"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#00D6FF]" />
                          <span>Inspect Page 4 Specs</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* BEAT 5: REASSEMBLY & CTA (86 - 100% scroll) - Center Overlay   */}
                  {/* ============================================================== */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-300 pointer-events-none z-10"
                    style={{
                      opacity: beat5Opacity,
                      transform: `scale(${0.96 + beat5Opacity * 0.04})`,
                      visibility: beat5Opacity > 0.01 ? "visible" : "hidden",
                    }}
                  >
                        <div className="text-center max-w-xl mx-auto p-6 sm:p-10 rounded-3xl glass-panel bg-[#0a0a0e]/85 border border-white/10 shadow-2xl backdrop-blur-2xl">
                          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#00D6FF] block mb-2">
                            The Flagship Reassembled
                          </span>

                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
                          Sound made tangible.
                        </h2>

                        <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6 max-w-md mx-auto">
                          42 hours of battery life with ANC active. Ultra-soft vegan leather.
                          Stepless slider design. Pure acoustic silence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto">
                          <button
                            onClick={onOpenOrder}
                            className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs sm:text-sm font-semibold tracking-wide hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#0050FF]/40"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Pre-order WH-1000XM6 • $449</span>
                          </button>

                            <button
                              onClick={() => onOpenPdfModal(5)}
                              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white text-xs sm:text-sm font-medium tracking-wide transition-all flex items-center justify-center space-x-1.5"
                            >
                              <FileText className="w-4 h-4 text-[#00D6FF]" />
                              <span>Page 5 Architecture</span>
                            </button>
                          </div>
                        </div>
                    </div>

                    {/* ============================================================== */}
                    {/* BOTTOM STATUS BAR (Minimal Apple / Sony Technical Pill)        */}
                    {/* ============================================================== */}
                        <div className="absolute bottom-6 left-0 right-0 px-6 sm:px-12 flex items-center justify-between pointer-events-none z-20">
                          <div className="hidden sm:flex items-center space-x-3 pointer-events-auto">
                            <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] animate-pulse" />
                              <span className="text-[11px] font-mono text-white/70">
                                {getBeatName()}
                              </span>
                            </div>
                          </div>

                            <div className="ml-auto flex items-center space-x-3 pointer-events-auto px-4 py-2 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-lg">
                              {/* Multiverse Galaxy Velocity Controller */}
                              <button
                                onClick={() =>
                                  setMultiverseSpeed((s) => (s === 1.0 ? 2.2 : s === 2.2 ? 0.4 : 1.0))
                                }
                                className="flex items-center space-x-1 text-[11px] font-mono text-[#00D6FF] hover:underline px-2 py-0.5 rounded bg-[#00D6FF]/10 border border-[#00D6FF]/30"
                                title="Toggle Multiverse Galaxy Rotation Velocity"
                              >
                                <Zap className="w-3 h-3" />
                                <span>
                                  Galaxy: {multiverseSpeed === 1.0 ? "1x" : multiverseSpeed === 2.2 ? "2.2x Boost" : "0.4x Ethereal"}
                                </span>
                              </button>

                              <div className="h-4 w-[1px] bg-white/10" />

                              {/* Play/Pause Sequence Animation */}
                              <button
                                onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                                className="p-1 text-white/70 hover:text-white transition-colors"
                                title={isPlayingAuto ? "Pause Exploded Animation" : "Play Exploded Animation"}
                              >
                                {isPlayingAuto ? (
                                  <Pause className="w-3.5 h-3.5 text-[#00D6FF]" />
                                ) : (
                                  <Play className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-white/40">FRAME</span>
                                  <span ref={frameCounterRef} className="text-[11px] font-mono text-[#00D6FF] w-7">
                                    000
                                  </span>
                                  <span className="text-[10px] font-mono text-white/30">/ 120</span>
                              </div>

                              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden relative">
                                <div
                                  ref={frameProgressRef}
                                  className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF]"
                                  style={{ width: "0%" }}
                                />
                              </div>

                              <button
                                onClick={onOpenRAG}
                                className="text-[11px] font-medium text-white/60 hover:text-[#00D6FF] flex items-center space-x-1"
                              >
                                <Sparkles className="w-3 h-3 text-[#00D6FF]" />
                                <span>RAG Engine</span>
                              </button>

                              <button
                                onClick={() => onOpenPdfModal()}
                                className="text-[11px] font-medium text-[#00D6FF] hover:underline flex items-center space-x-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Source PDF</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
}
