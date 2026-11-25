"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";
import SoundstageDemo from "@/components/SoundstageDemo";
import TechnologySection from "@/components/TechnologySection";
import ColorwaysSection from "@/components/ColorwaysSection";
import SpecsMatrix from "@/components/SpecsMatrix";
import AboutSection from "@/components/AboutSection";
import AudioArchitectRAG from "@/components/AudioArchitectRAG";
import PdfInspectorModal from "@/components/PdfInspectorModal";
import OrderModal from "@/components/OrderModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isRAGOpen, setIsRAGOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfModalInitialPage, setPdfModalInitialPage] = useState(1);
  const [selectedColorway, setSelectedColorway] = useState("Matte Obsidian Black");

  const handleOpenPdfModal = (page = 1) => {
    setPdfModalInitialPage(page);
    setIsPdfModalOpen(true);
  };

  const handleStartExploring = () => {
    const el = document.getElementById("search-hero-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative w-full min-h-screen bg-[#050505] text-[#f0f0f2] selection:bg-[#0050ff] selection:text-white">
      {/* Apple-style translucent product navigation */}
      <Navbar
        onStartExploring={handleStartExploring}
        onOpenPdfModal={() => handleOpenPdfModal(1)}
      />

      {/* Main Cinematic Headphone Exploded-View Canvas & AI Document Search Hero */}
      <ScrollytellingCanvas
        onOpenOrder={() => setIsOrderOpen(true)}
        onOpenRAG={() => setIsRAGOpen(true)}
        onOpenPdfModal={handleOpenPdfModal}
      />

      {/* Deep Acoustic & Neural Architecture Engineering Showcase */}
      <TechnologySection />

      {/* Interactive Web Audio Soundstage Simulator */}
      <SoundstageDemo />

      {/* 360 Colorway Studio */}
      <ColorwaysSection
        onSelectColor={(color) => setSelectedColorway(color)}
      />

      {/* Technical Specifications Matrix vs XM5 */}
      <SpecsMatrix />

      {/* About Section */}
      <AboutSection onOpenPdfModal={() => handleOpenPdfModal(1)} />

      {/* Editorial Corporate Footer */}
      <Footer
        onOpenOrder={() => setIsOrderOpen(true)}
        onOpenRAG={() => setIsRAGOpen(true)}
      />

      {/* Source PDF Inspector Modal */}
      <PdfInspectorModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialPage={pdfModalInitialPage}
      />

      {/* Sony Audio Architect • RAG Pipeline Inspector Modal */}
      <AudioArchitectRAG
        isOpen={isRAGOpen}
        onClose={() => setIsRAGOpen(false)}
      />

      {/* Pre-order / Buy Modal */}
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedColorway={selectedColorway}
      />
    </main>
  );
}
