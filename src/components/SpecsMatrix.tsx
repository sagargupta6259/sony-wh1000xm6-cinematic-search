"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface SpecItem {
  category: string;
  specs: {
    feature: string;
    xm6: string;
    xm5: string;
    highlight?: boolean;
  }[];
}

const SPEC_DATA: SpecItem[] = [
  {
    category: "Acoustic Engineering",
    specs: [
      {
        feature: "Transducer Driver Unit",
        xm6: "40mm Carbon-Fiber Composite Dome",
        xm5: "30mm Carbon-Fiber Reinforced",
        highlight: true,
      },
      {
        feature: "Frequency Response (Active)",
        xm6: "4 Hz – 40,000 Hz (JEITA)",
        xm5: "4 Hz – 40,000 Hz",
      },
      {
        feature: "Audio Upscaling Engine",
        xm6: "DSEE Ultimate 2.0 (Edge-AI Real-time)",
        xm5: "DSEE Extreme",
        highlight: true,
      },
      {
        feature: "Spatial Audio Support",
        xm6: "360 Reality Audio + Dynamic Head Tracking",
        xm5: "360 Reality Audio (Basic)",
      },
    ],
  },
  {
    category: "Noise Cancellation & Mic Array",
    specs: [
      {
        feature: "Noise Cancelling Processor",
        xm6: "Dual Sony QN3 + Neural V2 Hub",
        xm5: "Integrated V1 + HD QN1",
        highlight: true,
      },
      {
        feature: "Microphone Array",
        xm6: "8 Beamforming MEMS + Bone Conduction Sensor",
        xm5: "8 Microphones",
        highlight: true,
      },
      {
        feature: "Wind Noise Reduction",
        xm6: "Aerodynamic Micro-Mesh Mesh Cavity",
        xm5: "Wind Noise Reduction Structure",
      },
      {
        feature: "Ambient Sound Mode",
        xm6: "20-Step Voice Optimization Passthrough",
        xm5: "20-Step Passthrough",
      },
    ],
  },
  {
    category: "Battery & Power Architecture",
    specs: [
      {
        feature: "Battery Life (ANC On)",
        xm6: "Up to 42 Hours Continuous",
        xm5: "Up to 30 Hours Continuous",
        highlight: true,
      },
      {
        feature: "Battery Life (ANC Off)",
        xm6: "Up to 55 Hours Continuous",
        xm5: "Up to 40 Hours Continuous",
      },
      {
        feature: "Ultra-Fast Charge",
        xm6: "3 min charge = 5.0 hours playback (USB-PD)",
        xm5: "3 min charge = 3.0 hours playback",
        highlight: true,
      },
      {
        feature: "Charging Port",
        xm6: "USB-C (Fast Charging + Digital Lossless Audio In)",
        xm5: "USB-C (Charging only)",
      },
    ],
  },
  {
    category: "Connectivity & Codecs",
    specs: [
      {
        feature: "Bluetooth Version",
        xm6: "Bluetooth 5.4 + LE Audio / Auracast Ready",
        xm5: "Bluetooth 5.2",
        highlight: true,
      },
      {
        feature: "Supported Audio Codecs",
        xm6: "LDAC (990kbps), LC3, AAC, SBC",
        xm5: "LDAC, AAC, SBC",
      },
      {
        feature: "Multipoint Connection",
        xm6: "Simultaneous 3-Device Seamless Auto-Switch",
        xm5: "2-Device Auto-Switch",
      },
      {
        feature: "Headset Weight",
        xm6: "246 g (8.67 oz)",
        xm5: "250 g (8.82 oz)",
      },
    ],
  },
];

export default function SpecsMatrix() {
  return (
    <section
      id="specs-section"
      className="relative w-full py-32 px-6 md:px-12 bg-[#050505] border-t border-white/[0.04]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
              Technical Specifications
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Generational Leap in Performance
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-light">
            Compare the all-new WH-1000XM6 against its predecessor across acoustic, processor, battery, and connectivity dimensions.
          </p>
        </div>

        <div className="space-y-10">
          {SPEC_DATA.map((group, gIdx) => (
            <div
              key={gIdx}
              className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]"
            >
              <div className="bg-white/[0.03] px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
                  {group.category}
                </h3>
                <div className="hidden sm:flex items-center space-x-16 text-xs font-mono text-white/50">
                  <span className="text-[#00D6FF] font-bold">WH-1000XM6 (New)</span>
                  <span className="w-28 text-right">WH-1000XM5</span>
                </div>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {group.specs.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className={`px-6 py-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center transition-colors hover:bg-white/[0.02] ${
                      row.highlight ? "bg-[#0050FF]/[0.03]" : ""
                    }`}
                  >
                    <div className="sm:col-span-5 text-sm font-medium text-white/80">
                      {row.feature}
                    </div>

                    <div className="sm:col-span-4 text-sm font-semibold text-white flex items-center space-x-2">
                      <span className="text-[#00D6FF] sm:hidden text-xs uppercase font-mono">
                        XM6:{" "}
                      </span>
                      <span>{row.xm6}</span>
                      {row.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] flex-shrink-0" />
                      )}
                    </div>

                    <div className="sm:col-span-3 text-xs sm:text-sm font-light text-white/40 sm:text-right">
                      <span className="text-white/30 sm:hidden uppercase font-mono">
                        XM5:{" "}
                      </span>
                      <span>{row.xm5}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
