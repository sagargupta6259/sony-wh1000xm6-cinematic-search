"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import Image from "next/image";

interface PdfInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

interface ModalPageItem {
  page: number;
  title: string;
  subtitle: string;
  image?: string;
  content: string;
  specs: string[];
}

const DEFAULT_PDF_PAGES: ModalPageItem[] = [
  {
    page: 1,
    title: "1. Executive Product Overview & Visual Identity",
    subtitle: "Flagship Aesthetic & Exploded Mechanical Foundation",
    image: "/sequence/frame_000.webp",
    content: `The Sony WH-1000XM6 represents the zenith of contemporary personal acoustic engineering, synthesizing custom 40mm carbon-composite diaphragms, dual QN3 neural noise-cancelling processors, and advanced biomimetic ergonomics. This engineering specification details the internal component assembly, exploded-view structural mechanics, and digital signal pathways of the flagship headset.

The accompanying multi-frame exploded-view visualization documents each sequential layer: from outer acoustic shells and gimbal rings down to the central neodymium voice coil, acoustic dampeners, and multi-microphone isolation baffles.`,
    specs: ["Document Ref: SNY-XM6-EXPLODED-SPEC-2026", "Revision: 4.2", "JEITA Hi-Res Certified"],
  },
  {
    page: 2,
    title: "2. Acoustic Transducer & 40mm Carbon Driver Assembly",
    subtitle: "Custom Carbon-Composite Diaphragm & Airflow Porting",
    image: "/sequence/frame_030.webp",
    content: `At the core of the WH-1000XM6 acoustic chamber is an all-new 40mm Carbon-Composite Dome Driver with soft polyurethane perimeter. Unlike standard synthetic diaphragms, the rigid carbon matrix eliminates modal break-up across the audible spectrum, achieving high mechanical stiffness with low moving mass.

• Frequency Response (Active Processing): 4 Hz – 40,000 Hz (JEITA Hi-Res certified).
• Voice Coil: High-purity Oxygen-Free Copper (OFC) with dual-flux N52 Neodymium motor structure.
• Acoustic Porting: Dual helical back-volume vents relieve backpressure for rapid transient decay and punchy sub-bass reproduction.`,
    specs: ["Driver: 40mm Carbon-Composite", "Impedance: 48 Ω / 16 Ω", "Bandwidth: 4Hz - 40kHz"],
  },
  {
    page: 3,
    title: "3. Dual QN3 HD Active Noise Cancelling Processors & 8-Mic Array",
    subtitle: "Sub-millisecond Anti-Phase Noise Neutralization",
    image: "/sequence/frame_060.webp",
    content: `Environmental noise attenuation in the WH-1000XM6 is orchestrated by Dual dedicated Sony QN3 HD Noise Cancelling Processors coupled with eight precision beamforming MEMS microphones (four situated in each ear cup). Operating at a continuous sampling frequency of 700kHz, the dual silicon engines generate inverted anti-phase cancellation waves within sub-0.4ms latency.

• Peak Noise Reduction: Up to -38.6 dB of active suppression across mid and low frequencies.
• Microphone Array: 8 beamforming microphones paired with an onboard bone-conduction sensor.
• Adaptive Atmospheric Optimization: Integrated barometric pressure sensors recalibrate ANC profiles during high-altitude commercial flights.`,
    specs: ["Processors: Dual Sony QN3 HD", "Microphones: 8 MEMS Beamforming", "Attenuation: -38.6 dB"],
  },
  {
    page: 4,
    title: "4. DSEE Ultimate 2.0 AI Audio Upscaling & LDAC Lossless Transmission",
    subtitle: "Neural Audio Restoration & 990kbps Hi-Res Streaming",
    image: "/sequence/frame_100.webp",
    content: `To overcome digital audio compression artifacts, the WH-1000XM6 incorporates DSEE Ultimate 2.0 (Digital Sound Enhancement Engine). Utilizing real-time Edge-AI neural models trained on over 10 million master studio recording stems, the algorithm dynamically identifies musical instrumentation and vocal timbre to reconstruct high-frequency harmonics lost during lossy streaming (such as Spotify 320kbps and AAC).

• Wireless Codec: Sony LDAC™ protocol transmitting up to 990 kbps at 96kHz / 32-bit resolution.
• 360 Reality Audio: Object-based spatial acoustic positioning with personalized HRTF ear geometry measurement.
• Lossless Wired USB Audio: USB-C digital audio input bypasses analog degradation, driving internal 32-bit DAC directly.`,
    specs: ["Upscaling: DSEE Ultimate 2.0 (Edge-AI)", "Codec: LDAC 990kbps 32-bit/96kHz", "Spatial: 360 Reality Audio"],
  },
  {
    page: 5,
    title: "5. Power Architecture, Fast Charging & Structural Ergonomics",
    subtitle: "42-Hour Endurance, 3-Minute Quick Charge & Stepless Comfort",
    image: "/sequence/frame_119.webp",
    content: `The WH-1000XM6 is engineered with an optimized high-energy lithium-ion battery system delivering up to 42 hours of continuous playback with ANC activated, and up to 55 hours with ANC switched off. With USB Power Delivery (USB-PD) fast charging, a 3-minute charge provides up to 5.0 hours of listening time.

• Headset Total Weight: 246 grams (8.67 oz).
• Bluetooth Specification: Bluetooth 5.4 with LE Audio, Auracast broadcasting, and simultaneous 3-device multipoint.
• Ergonomic Construction: Zero-pressure stepless friction slider, memory foam ear cushions sheathed in thermo-regulating vegan protein leather.`,
    specs: ["Battery: 42 hrs ANC / 55 hrs off", "Fast Charge: 3 min = 5.0 hrs", "Weight: 246g (8.67 oz)"],
  },
];

interface RawPageData {
  page: number;
  title?: string;
  subtitle?: string;
  raw_text: string;
}

export default function PdfInspectorModal({
  isOpen,
  onClose,
  initialPage = 1,
}: PdfInspectorModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [docName, setDocName] = useState<string>("Sony_WH-1000XM6_Exploded_View_Architecture.pdf");
  const [pages, setPages] = useState<ModalPageItem[]>(DEFAULT_PDF_PAGES);
  const [isCustomDoc, setIsCustomDoc] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Load pages from active document
  useEffect(() => {
    if (isOpen) {
      fetch("/api/document")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.documentName) {
            setDocName(data.documentName);
            setIsCustomDoc(!!data.isCustom);
            if (data.isCustom && data.pages && data.pages.length > 0) {
              const mapped: ModalPageItem[] = data.pages.map((p: RawPageData) => ({
                page: p.page,
                title: p.title || `Page ${p.page}`,
                subtitle: p.subtitle || `Section ${p.page} of ${data.documentName}`,
                image: undefined,
                content: p.raw_text,
                specs: [`Page: ${p.page} of ${data.totalPages}`, `Document: ${data.documentName}`],
              }));
              setPages(mapped);
            } else {
              setPages(DEFAULT_PDF_PAGES);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pageData = pages.find((p) => p.page === currentPage) || pages[0] || DEFAULT_PDF_PAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col bg-[#09090d]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#09090d]/95 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#0050FF]/20 border border-[#0050FF]/40 flex items-center justify-center text-[#00D6FF]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-sm sm:max-w-md">
                  {docName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white/70 border border-white/10">
                  Page {currentPage} of {pages.length}
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                {isCustomDoc ? "User Uploaded Active Knowledge Base" : "Official Sony Specification Source"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isCustomDoc && (
              <a
                href="/Sony_WH-1000XM6_Exploded_View_Architecture.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#00D6FF]" />
                <span>Download PDF</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Visual Asset if available */}
          {pageData.image && (
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-black/60 aspect-video max-h-80 w-full flex items-center justify-center">
              <Image
                src={pageData.image}
                alt={pageData.title}
                width={1280}
                height={720}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-3 left-4 px-3 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] font-mono text-white/80 backdrop-blur-md">
                Exploded View Frame Asset • Page {pageData.page}
              </div>
            </div>
          )}

          {/* Page Details & Typography */}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00D6FF]">
              {pageData.subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 mb-3">
              {pageData.title}
            </h2>
            <div className="text-sm text-white/80 leading-relaxed font-light whitespace-pre-line bg-white/[0.02] p-5 rounded-2xl border border-white/[0.06] max-h-96 overflow-y-auto font-mono">
              {pageData.content}
            </div>
          </div>

          {/* Spec Badges */}
          <div className="flex flex-wrap gap-2">
            {pageData.specs.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Page Pagination Controls */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-20 text-xs font-medium text-white flex items-center space-x-1.5 transition-colors border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-xs sm:max-w-md py-1">
              {pages.slice(0, 15).map((p) => (
                <button
                  key={p.page}
                  onClick={() => setCurrentPage(p.page)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                    currentPage === p.page
                      ? "bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white font-bold"
                      : "bg-white/[0.03] text-white/50 hover:text-white"
                  }`}
                >
                  {p.page}
                </button>
              ))}
              {pages.length > 15 && (
                <span className="text-xs font-mono text-white/40">+{pages.length - 15}</span>
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
              disabled={currentPage === pages.length}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-20 text-xs font-medium text-white flex items-center space-x-1.5 transition-colors border border-white/10"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
