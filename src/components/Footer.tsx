"use client";

import React from "react";
import { Disc, Shield, Leaf, ArrowUp } from "lucide-react";

export default function Footer({ onOpenOrder, onOpenRAG }: { onOpenOrder: () => void; onOpenRAG: () => void }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#030303] border-t border-white/[0.06] text-white/50 text-xs py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/[0.06]">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[#00D6FF]">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Hi-Res Audio Wireless Certified
              </h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Capable of 96kHz / 32-bit lossless transmission over LDAC™ protocol and wired USB-C audio bus.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Sony Road to Zero Environmental Pledge
              </h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                100% plastic-free packaging made from bamboo, sugarcane fibers, and post-consumer recycled paper.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                2-Year Global Manufacturer Warranty
              </h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Includes worldwide servicing, complimentary ear-cushion replacement program, and battery optimization.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs font-light">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-[0.25em] text-white uppercase text-sm">
                SONY
              </span>
              <span className="text-white/20">|</span>
              <span className="font-semibold text-white/80">WH-1000XM6</span>
            </div>
            <p className="text-white/50 max-w-sm leading-relaxed">
              Designed in Tokyo, Japan. The culmination of forty-five years of
              pioneering personal audio acoustics, digital signal processing,
              and industrial craft.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onOpenRAG}
                className="text-xs font-mono text-[#00D6FF] hover:underline"
              >
                Access Audio Architect (RAG) →
              </button>
            </div>
          </div>

          <div>
            <div className="text-white font-medium mb-3 font-mono uppercase text-[11px] tracking-wider">
              Experience
            </div>
            <ul className="space-y-2 text-white/60">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("story-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Scrollytelling Reveal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("soundstage-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Soundstage Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("technology-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Acoustic Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("specs-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Full Specs Matrix
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-medium mb-3 font-mono uppercase text-[11px] tracking-wider">
              Sound Innovations
            </div>
            <ul className="space-y-2 text-white/60">
              <li>Dual QN3 HD Silicon</li>
              <li>40mm Carbon Driver</li>
              <li>360 Reality Audio</li>
              <li>DSEE Ultimate 2.0</li>
              <li>Multipoint Bluetooth 5.4</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-medium mb-3 font-mono uppercase text-[11px] tracking-wider">
              Direct Access
            </div>
            <div className="space-y-3">
              <button
                onClick={onOpenOrder}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs font-semibold text-center hover:brightness-110 transition-all"
              >
                Pre-order Now
              </button>
              <button
                onClick={scrollToTop}
                className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Return to Top</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <div>
            © {new Date().getFullYear()} Sony Corporation. All rights reserved.
            WH-1000XM6, LDAC, and DSEE Ultimate are trademarks of Sony Group
            Corporation.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of Use
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Accessibility
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
