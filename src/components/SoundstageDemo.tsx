"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Radio,
  Waves,
  ShieldAlert,
  Disc,
} from "lucide-react";

type SoundMode = "anc" | "ambient" | "spatial";

export default function SoundstageDemo() {
  const [activeMode, setActiveMode] = useState<SoundMode>("anc");
  const [isPlaying, setIsPlaying] = useState(false);
  const [decibels, setDecibels] = useState(24.5);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Intersection observer to only run animation when visible on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Frequency visualizer loop (runs ONLY when visible!)
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      phase += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Base line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const numWaves = 3;
      let amplitude = isPlaying ? 35 : 8;
      let frequency = 0.02;

      if (activeMode === "anc") {
        amplitude = isPlaying ? 12 : 5;
      } else if (activeMode === "ambient") {
        amplitude = isPlaying ? 40 : 10;
        frequency = 0.035;
      } else if (activeMode === "spatial") {
        amplitude = isPlaying ? 50 : 12;
        frequency = 0.025;
      }

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        if (activeMode === "anc") {
          grad.addColorStop(0, "rgba(0, 80, 255, 0.2)");
          grad.addColorStop(0.5, "rgba(0, 214, 255, 0.7)");
          grad.addColorStop(1, "rgba(0, 80, 255, 0.2)");
        } else if (activeMode === "ambient") {
          grad.addColorStop(0, "rgba(255, 255, 255, 0.2)");
          grad.addColorStop(0.5, "rgba(0, 214, 255, 0.8)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.2)");
        } else {
          grad.addColorStop(0, "rgba(147, 51, 234, 0.4)");
          grad.addColorStop(0.5, "rgba(0, 214, 255, 0.9)");
          grad.addColorStop(1, "rgba(59, 130, 246, 0.4)");
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = i === 1 ? 2.5 : 1.5;

        for (let x = 0; x < w; x += 3) {
          const mod = Math.sin(x * 0.005 + phase * 0.5);
          const y =
            h / 2 +
            Math.sin(x * frequency + phase + i * 1.5) *
            amplitude *
            (1 + 0.3 * mod) *
            Math.sin((x / w) * Math.PI);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
}, [isPlaying, activeMode, isVisible]);

// Decibel simulation (runs only when visible)
useEffect(() => {
  if (!isVisible) return;

  let target = 22.0;
  if (activeMode === "anc") target = 18.2;
  if (activeMode === "ambient") target = 58.4;
  if (activeMode === "spatial") target = 32.8;

  const interval = setInterval(() => {
    setDecibels(() => {
      const jitter = (Math.random() - 0.5) * 1.2;
      return Number((target + jitter).toFixed(1));
    });
  }, 400);

  return () => clearInterval(interval);
  }, [activeMode, isVisible]);

// Audio synthesis trigger
const toggleAudio = () => {
  if (isPlaying) {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.error(e);
    }
    setIsPlaying(false);
  } else {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = activeMode === "anc" ? "lowpass" : "bandpass";
      filter.frequency.setValueAtTime(
        activeMode === "anc" ? 220 : 1200,
        ctx.currentTime
      );

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(activeMode === "spatial" ? 432 : 110, ctx.currentTime);
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillatorRef.current = osc;

      setIsPlaying(true);
    } catch (err) {
      console.warn("Audio Context init note:", err);
      setIsPlaying(true);
    }
  }
};

const handleModeChange = (mode: SoundMode) => {
  setActiveMode(mode);
  if (audioCtxRef.current && isPlaying) {
    try {
      if (oscillatorRef.current) {
        const freq = mode === "spatial" ? 432 : mode === "ambient" ? 220 : 110;
        oscillatorRef.current.frequency.setTargetAtTime(
          freq,
          audioCtxRef.current.currentTime,
          0.1
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
};

return (
  <section
    ref={sectionRef}
    id="soundstage-section"
    className="relative w-full py-32 px-6 md:px-12 bg-[#050505] border-t border-white/[0.04]"
  >
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
          <Radio className="w-3.5 h-3.5 text-[#00D6FF]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
            Interactive Acoustic Simulator
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Experience the Soundstage
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-light">
          Test the WH-1000XM6 real-time processing modes. Toggle between
          whisper-quiet active noise cancellation, natural ambient
          transparency, and 360 Reality Audio spatial mapping.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0050FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D6FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
          <button
            onClick={() => handleModeChange("anc")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 border ${activeMode === "anc"
                ? "bg-[#0050FF]/15 border-[#00D6FF]/50 shadow-[0_0_30px_rgba(0,80,255,0.25)]"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <ShieldAlert
                className={`w-5 h-5 ${activeMode === "anc" ? "text-[#00D6FF]" : "text-white/40"
                  }`}
              />
              {activeMode === "anc" && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#00D6FF]/20 text-[#00D6FF]">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Active Noise Cancelling
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Anti-noise cancellation algorithms neutralize jet engines, city
              traffic, and background speech.
            </p>
          </button>

          <button
            onClick={() => handleModeChange("ambient")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 border ${activeMode === "ambient"
                ? "bg-[#0050FF]/15 border-[#00D6FF]/50 shadow-[0_0_30px_rgba(0,80,255,0.25)]"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Waves
                className={`w-5 h-5 ${activeMode === "ambient" ? "text-[#00D6FF]" : "text-white/40"
                  }`}
              />
              {activeMode === "ambient" && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#00D6FF]/20 text-[#00D6FF]">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Ambient Sound Mode
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              20-level adjustable passthrough lets voices and announcements
              filter naturally without removing the headset.
            </p>
          </button>

          <button
            onClick={() => handleModeChange("spatial")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 border ${activeMode === "spatial"
                ? "bg-[#0050FF]/15 border-[#00D6FF]/50 shadow-[0_0_30px_rgba(0,80,255,0.25)]"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Disc
                className={`w-5 h-5 ${activeMode === "spatial" ? "text-[#00D6FF]" : "text-white/40"
                  }`}
              />
              {activeMode === "spatial" && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#00D6FF]/20 text-[#00D6FF]">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              360 Reality Audio
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Object-based binaural spatial audio maps vocalists and
              instruments in a full 360° spherical sphere around your head.
            </p>
          </button>
        </div>

        <div className="relative rounded-2xl bg-black/60 border border-white/[0.06] p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAudio}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs font-semibold flex items-center space-x-2 shadow-lg hover:brightness-110 transition-all"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Mute Audio Simulation</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>Start Audio Audition</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-white/40 font-mono">
                {isPlaying ? "SYNTHESIZING SOUNDSTAGE" : "PRESS TO AUDITION"}
              </span>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-white/40">NOISE FLOOR:</span>
                <span className="text-[#00D6FF] font-bold">{decibels} dB</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/40">CODEC:</span>
                <span className="text-white/80 font-bold">LDAC Lossless</span>
              </div>
            </div>
          </div>

          <div className="w-full h-36 relative">
            <canvas
              ref={canvasRef}
              width={1000}
              height={144}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-white/50 font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {activeMode === "anc"
                  ? "Inverted Wave Cancellation Active • QN3 High-Speed DSP"
                  : activeMode === "ambient"
                    ? "Omnidirectional Mics 20-Band Pass Active"
                    : "HRTF Head-Tracking & Object Spatial Matrix Enabled"}
              </span>
            </div>
            <div className="text-white/40">96kHz / 32-bit DAC Conversion</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
