"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, FileText } from "lucide-react";

interface NavbarProps {
  onStartExploring: () => void;
  onOpenPdfModal: () => void;
}

export default function Navbar({ onStartExploring, onOpenPdfModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-2xl shadow-black/80"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Left: SONY | WH-1000XM6 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2.5 text-left group"
          >
            <span className="text-[12px] uppercase font-bold tracking-[0.25em] text-white/50 group-hover:text-white transition-colors">
              SONY
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[14px] font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
              WH-1000XM6
            </span>
          </button>
        </div>

        {/* Center: Overview • Technology • Explore • About */}
        <nav className="hidden md:flex items-center space-x-9 text-[13px] font-medium tracking-tight">
          <button
            onClick={() => scrollToSection("search-hero-section")}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection("technology-section")}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            Technology
          </button>
          <button
            onClick={() => {
              scrollToSection("search-hero-section");
              onStartExploring();
            }}
            className="text-white/60 hover:text-white transition-colors duration-200 flex items-center space-x-1.5"
          >
            <span>Explore</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] animate-pulse"></span>
          </button>
          <button
            onClick={() => scrollToSection("about-section")}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            About
          </button>
        </nav>

        {/* Right: Minimal blue-gradient button: "Start Exploring" */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenPdfModal}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span>Source PDF</span>
          </button>

          <button
            onClick={() => {
              scrollToSection("search-hero-section");
              onStartExploring();
            }}
            className="relative group p-[1px] rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,214,255,0.35)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0050FF] via-[#00D6FF] to-[#0050FF] rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative px-4 py-1.5 rounded-full bg-[#08080c] transition-colors group-hover:bg-[#08080c]/80 flex items-center space-x-2">
              <span className="text-[12px] font-semibold tracking-wide text-white">
                Start Exploring
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00D6FF] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={() => {
              scrollToSection("search-hero-section");
              onStartExploring();
            }}
            className="text-[11px] font-medium px-3 py-1 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white"
          >
            Explore
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white/70 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mt-3 mx-4 p-5 rounded-2xl flex flex-col space-y-4 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-200 bg-[#09090d]/95 backdrop-blur-2xl">
          <button
            onClick={() => scrollToSection("search-hero-section")}
            className="text-left text-sm font-medium text-white/80 hover:text-white py-1"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection("technology-section")}
            className="text-left text-sm font-medium text-white/80 hover:text-white py-1"
          >
            Technology & Architecture
          </button>
          <button
            onClick={() => {
              scrollToSection("search-hero-section");
              onStartExploring();
            }}
            className="text-left text-sm font-medium text-[#00D6FF] py-1 flex items-center justify-between"
          >
            <span>Explore AI Document Search</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#00D6FF]/20 text-[#00D6FF]">
              Active
            </span>
          </button>
          <button
            onClick={() => scrollToSection("about-section")}
            className="text-left text-sm font-medium text-white/80 hover:text-white py-1"
          >
            About WH-1000XM6
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPdfModal();
            }}
            className="text-left text-sm font-medium text-white/80 py-1 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-[#00D6FF]" />
            <span>Inspect Architecture PDF</span>
          </button>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartExploring();
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs font-semibold text-center"
            >
              Start Exploring Document
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
