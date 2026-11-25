"use client";

import React, { useState } from "react";
import { Palette, Check } from "lucide-react";

interface Colorway {
  id: string;
  name: string;
  tagline: string;
  hex: string;
  accent: string;
  borderHex: string;
  glow: string;
  material: string;
}

const COLORWAYS: Colorway[] = [
  {
    id: "obsidian-black",
    name: "Matte Obsidian Black",
    tagline: "Our signature flagship stealth finish with fingerprint-resistant soft-touch coating.",
    hex: "#101012",
    accent: "#00D6FF",
    borderHex: "#2a2a30",
    glow: "rgba(0, 214, 255, 0.2)",
    material: "Soft-Touch Polycarbonate & Anodized Matte Aluminum",
  },
  {
    id: "platinum-silver",
    name: "Platinum Silver",
    tagline: "Warm luminescent metallic silver accented with subtle sand-gold chamfers.",
    hex: "#C8C6C1",
    accent: "#E2DEC9",
    borderHex: "#99968f",
    glow: "rgba(226, 222, 201, 0.25)",
    material: "Micro-Bead Blasted Aluminum & Ivory Vegan Protein",
  },
  {
    id: "midnight-navy",
    name: "Midnight Deep Navy",
    tagline: "A deep nautical indigo that absorbs light under shadow and glows cobalt in sunlight.",
    hex: "#121A28",
    accent: "#3B82F6",
    borderHex: "#223350",
    glow: "rgba(59, 130, 246, 0.25)",
    material: "Deep Anodized Cobalt with Blue Accent Ring",
  },
  {
    id: "smoked-bronze",
    name: "Smoked Titanium Bronze",
    tagline: "Sophisticated warm smoked bronze engineered for contemporary corporate elegance.",
    hex: "#241E1A",
    accent: "#D97706",
    borderHex: "#453830",
    glow: "rgba(217, 119, 6, 0.2)",
    material: "PVD Coated Titanium & Hand-stitched Espresso Leather",
  },
];

export default function ColorwaysSection({ onSelectColor }: { onSelectColor?: (color: string) => void }) {
  const [selected, setSelected] = useState<Colorway>(COLORWAYS[0]);

  const handleSelect = (c: Colorway) => {
    setSelected(c);
    onSelectColor?.(c.name);
  };

  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <Palette className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
              The Colorway Studio
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Refined in Four Signature Finishes
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-light">
            Every tone is meticulously anodized and bonded with high-grade synthetic protein leather for tactile luxury that outlasts daily travel.
          </p>
        </div>

        {/* Studio Colorway Display */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/[0.08] relative overflow-hidden flex flex-col items-center">
          {/* Visual Swatch Disc */}
          <div className="relative mb-10 flex items-center justify-center">
            <div
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-full transition-all duration-700 relative flex items-center justify-center shadow-2xl"
              style={{
                backgroundColor: selected.hex,
                border: `2px solid ${selected.borderHex}`,
                boxShadow: `0 0 60px ${selected.glow}`,
              }}
            >
              {/* Inner metallic ring */}
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-dashed transition-all duration-500 flex items-center justify-center opacity-60"
                style={{ borderColor: selected.accent }}
              >
                <div className="text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                    WH-1000XM6
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Details */}
          <div className="text-center max-w-md mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {selected.name}
            </h3>
            <p className="text-xs sm:text-sm text-white/60 font-light mb-3">
              {selected.tagline}
            </p>
            <span className="text-[11px] font-mono text-white/40 uppercase">
              Material: {selected.material}
            </span>
          </div>

          {/* Palette selector buttons */}
          <div className="flex items-center space-x-4">
            {COLORWAYS.map((c) => {
              const isCurrent = selected.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 relative flex items-center justify-center border-2 ${
                    isCurrent
                      ? "scale-110 shadow-lg border-white"
                      : "opacity-75 hover:opacity-100 border-white/20 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.hex,
                  }}
                  title={c.name}
                >
                  {isCurrent && (
                    <Check
                      className="w-4 h-4 text-white drop-shadow"
                      style={{ color: c.id === "platinum-silver" ? "#000" : "#fff" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
