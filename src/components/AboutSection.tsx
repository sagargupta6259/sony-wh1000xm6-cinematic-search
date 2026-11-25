"use client";

import React from "react";
import { Headphones, Award, Sparkles, Globe, FileText } from "lucide-react";

export default function AboutSection({ onOpenPdfModal }: { onOpenPdfModal: () => void }) {
  return (
    <section
      id="about-section"
      className="relative w-full py-28 px-6 md:px-12 bg-[#050505] border-t border-white/[0.04]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <Award className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
              Sony Audio Heritage & Vision
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Forty-Five Years of Sonic Mastery
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
            From the pioneering TPS-L2 Walkman in 1979 to the revolutionary
            WH-1000XM6, Sony has consistently redefined how humanity experiences sound.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-7 rounded-3xl bg-[#0a0a0e]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#0050FF]/15 border border-[#0050FF]/30 flex items-center justify-center text-[#00D6FF] mb-5">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Uncompromising Acoustic Craft
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              Every driver diaphragm, damping port, and microphone mesh is
              engineered with micro-millimeter tolerance in Tokyo sound laboratories.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0a0a0e]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#0050FF]/15 border border-[#0050FF]/30 flex items-center justify-center text-[#00D6FF] mb-5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Edge-AI Signal Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              Dual QN3 custom silicon processes ambient waveforms in real time,
              marrying computational machine intelligence with pure analog warmth.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0a0a0e]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#0050FF]/15 border border-[#0050FF]/30 flex items-center justify-center text-[#00D6FF] mb-5">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Road to Zero Sustainability
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              100% plastic-free packaging sourced from bamboo, sugarcane fibers,
              and post-consumer recycled paper with zero environmental compromise.
            </p>
          </div>
        </div>

        {/* Technical PDF Documentation Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#0050FF]/10 to-[#00D6FF]/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-[#00D6FF]/10 border border-[#00D6FF]/30 text-[#00D6FF]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Official Engineering Whitepaper & Exploded Schematic
              </h4>
              <p className="text-xs text-white/60 font-light">
                Document Ref: SNY-XM6-EXPLODED-SPEC-2026 • 5 Pages with high-resolution exploded frames
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPdfModal}
            className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold tracking-wide transition-all shadow-lg flex-shrink-0"
          >
            Inspect Document PDF
          </button>
        </div>
      </div>
    </section>
  );
}
