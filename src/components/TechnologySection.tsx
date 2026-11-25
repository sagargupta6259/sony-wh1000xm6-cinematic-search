"use client";

import React, { useState } from "react";
import {
  Cpu,
  Disc,
  Activity,
  Feather,
} from "lucide-react";

interface TechFeature {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  highlight: string;
}

const TECH_FEATURES: TechFeature[] = [
  {
    id: "drivers",
    category: "Acoustic Transducer",
    title: "40mm Carbon-Composite Dome Driver",
    subtitle: "High rigidity meets featherlight response",
    description:
      "Crafted with a rigid carbon-fiber reinforced diaphragm and soft polyurethane edge, the XM6 transducer eliminates modal break-up across the audible spectrum, delivering tight bass punch down to 4Hz and shimmering crystal highs up to 40,000Hz.",
    specs: [
      { label: "Frequency Range", value: "4 Hz – 40,000 Hz" },
      { label: "Impedance", value: "48 Ω (Active) / 16 Ω (Passive)" },
      { label: "Magnet Type", value: "Neodymium N52 Dual Flux" },
    ],
    highlight: "Studio-Grade Clarity",
  },
  {
    id: "processors",
    category: "Neural Signal Processing",
    title: "Dual QN3 HD Noise Cancelling Engines",
    subtitle: "Sub-millisecond ambient neutralization",
    description:
      "Two dedicated Sony QN3 custom silicon chips orchestrate eight precision beamforming microphones. Analyzing external noise at 700,000 samples per second, the processors compute inverted anti-phase signals before sound waves even strike the ear canal.",
    specs: [
      { label: "Microphone Array", value: "8 Precision MEMS" },
      { label: "Sampling Speed", value: "700 kHz Continuous" },
      { label: "Latency", value: "< 0.4 ms Anti-Phase" },
    ],
    highlight: "-38.6 dB Active Suppression",
  },
  {
    id: "upscaling",
    category: "Edge AI Audio Synthesis",
    title: "DSEE Ultimate 2.0 Neural Restoration",
    subtitle: "Lossless fidelity from any compressed stream",
    description:
      "Using Edge-AI trained on over 10 million master studio recordings, DSEE Ultimate dynamically recognizes musical genres, instruments, and vocal textures. It accurately reconstructs acoustic subtleties lost during high-frequency digital compression.",
    specs: [
      { label: "Neural Model", value: "Deep Audio WaveNet" },
      { label: "Resolution", value: "Up to 96kHz / 32-bit" },
      { label: "Format Support", value: "Spotify, Apple Music, YouTube" },
    ],
    highlight: "Studio Master Restoration",
  },
  {
    id: "ergonomics",
    category: "Structural Industrial Design",
    title: "Zero-Pressure Stepless Headband",
    subtitle: "Cloud-soft vegan leather and memory foam",
    description:
      "Redesigned ear cups distribute contact area evenly around the temporal bone. The stepless slider eliminates audible clicking during adjustment, while breathable thermo-regulating synthetic leather ensures fatigue-free listening for 12+ hour flights.",
    specs: [
      { label: "Headset Weight", value: "246 grams" },
      { label: "Slider Mechanism", value: "Stepless Silent Friction" },
      { label: "Cushion Material", value: "High-density Memory Protein" },
    ],
    highlight: "All-Day Flight Comfort",
  },
];

export default function TechnologySection() {
  const [activeTab, setActiveTab] = useState<string>("drivers");
  const current = TECH_FEATURES.find((t) => t.id === activeTab) || TECH_FEATURES[0];

  return (
    <section
      id="technology-section"
      className="relative w-full py-32 px-6 md:px-12 bg-[#050505] border-t border-white/[0.04]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
              Master-Class Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Engineering Every Sub-Millimeter
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
            From custom acoustic chambers and carbon composite diaphragms to dual
            neural DSP silicon, explore the breakthroughs that power the new
            industry standard.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-12 overflow-x-auto pb-2">
          {TECH_FEATURES.map((feat) => {
            const isActive = activeTab === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap border ${
                  isActive
                    ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                    : "bg-white/[0.03] text-white/60 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {feat.category}
              </button>
            );
          })}
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/[0.08] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0050FF]/15 border border-[#0050FF]/30">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#00D6FF]">
                  {current.highlight}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-base text-[#00D6FF] font-medium">
                {current.subtitle}
              </p>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                {current.description}
              </p>

              <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4">
                {current.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="text-[10px] uppercase font-mono text-white/40 mb-1">
                      {s.label}
                    </div>
                    <div className="text-sm font-semibold text-white/95">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-black/60 border border-white/[0.06] relative">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dashed border-[#00D6FF]/30 flex items-center justify-center relative animate-pulse-subtle">
                <div className="w-36 h-36 rounded-full border border-[#0050FF]/40 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0050FF]/30 to-[#00D6FF]/30 flex items-center justify-center backdrop-blur-md">
                    {current.id === "drivers" && (
                      <Disc className="w-12 h-12 text-[#00D6FF] animate-spin" style={{ animationDuration: "12s" }} />
                    )}
                    {current.id === "processors" && (
                      <Cpu className="w-12 h-12 text-[#00D6FF]" />
                    )}
                    {current.id === "upscaling" && (
                      <Activity className="w-12 h-12 text-[#00D6FF]" />
                    )}
                    {current.id === "ergonomics" && (
                      <Feather className="w-12 h-12 text-[#00D6FF]" />
                    )}
                  </div>
                </div>

                <div className="absolute top-2 right-4 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 border border-white/10 text-white/70">
                  CH-A1
                </div>
                <div className="absolute bottom-3 left-4 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 border border-white/10 text-[#00D6FF]">
                  PRECISION
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  Schematic Architecture • XM6-REV-4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
