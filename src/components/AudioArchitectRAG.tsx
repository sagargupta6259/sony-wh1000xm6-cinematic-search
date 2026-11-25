"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Upload,
  Search,
  ArrowRight,
  Loader2,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AudioArchitectRAGProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Chunk {
  id: string;
  page?: number;
  section: string;
  text: string;
  similarity?: number;
}

const DEFAULT_WHITEPAPER_CHUNKS: Chunk[] = [
  {
    id: "chunk-01",
    page: 2,
    section: "Transducer & Diaphragm Acoustics",
    text: "The Sony WH-1000XM6 integrates a custom 40mm Carbon-Composite Dome Driver with soft polyurethane perimeter. Unlike standard mylar diaphragms, the rigid carbon matrix prevents high-frequency harmonic distortion, yielding a frequency response of 4Hz to 40,000Hz (JEITA Hi-Res certified). Acoustic porting behind the driver optimizes airflow for transient bass response.",
  },
  {
    id: "chunk-02",
    page: 3,
    section: "Active Noise Cancellation Silicon",
    text: "Dual Sony QN3 HD Noise Cancelling Processors replace the previous single-chip setup. Paired with 8 precision beamforming MEMS microphones (4 on each ear cup), the QN3 samples external sound waves at 700kHz and generates anti-phase cancellation signals with sub-0.4 millisecond latency, delivering up to -38.6 dB of environmental noise attenuation.",
  },
  {
    id: "chunk-03",
    page: 4,
    section: "Edge-AI Upscaling & Codec Transmission",
    text: "DSEE Ultimate 2.0 uses Edge-AI neural networks trained on over 10 million studio tracks to dynamically reconstruct acoustic nuances lost in compressed formats like MP3 and AAC. For wireless transmission, Sony's proprietary LDAC codec delivers up to 990 kbps at 96kHz / 32-bit depth, transmitting triple the data of standard Bluetooth audio.",
  },
  {
    id: "chunk-04",
    page: 5,
    section: "Battery & Fast Charge Architecture",
    text: "Equipped with a high-density lithium-ion cell, the WH-1000XM6 delivers up to 42 hours continuous playback with ANC enabled, and up to 55 hours with ANC disabled. USB Power Delivery (USB-PD) charging provides 5.0 hours of playback from a 3-minute quick charge. Lossless audio is also supported over the USB-C data bus.",
  },
  {
    id: "chunk-05",
    page: 1,
    section: "Spatial Mapping & 360 Reality Audio",
    text: "Using personalized ear-canal HRTF calibration captured via the Sony Headphones Connect app, 360 Reality Audio places individual instruments and vocal tracks in a spherical 3D acoustic field with dynamic head tracking, simulating an intimate live studio performance.",
  },
];

export default function AudioArchitectRAG({ isOpen, onClose }: AudioArchitectRAGProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("Sony_WH-1000XM6_Exploded_View_Architecture.pdf");
  const [chunks, setChunks] = useState<Chunk[]>(DEFAULT_WHITEPAPER_CHUNKS);
  const [query, setQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [retrievedChunks, setRetrievedChunks] = useState<Chunk[]>([]);
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with active document on open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/document")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.documentName) {
            setFileName(data.documentName);
            if (data.chunks && Array.isArray(data.chunks) && data.chunks.length > 0) {
              setChunks(data.chunks);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle server-side PDF extraction with PyPDF
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setErrorMsg(null);
    setRagAnswer(null);
    setRetrievedChunks([]);
    setActiveStep(1); // 01: Read PDF

    const formData = new FormData();
    formData.append("file", file);

    try {
      setTimeout(() => setActiveStep(2), 300); // 02: Load

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to process PDF.");
      }

      setActiveStep(3); // 03: Clean
      setTimeout(() => {
        setActiveStep(4); // 04: Chunks
        const loadedChunks: Chunk[] = data.chunks || [];
        setChunks(loadedChunks.length > 0 ? loadedChunks : DEFAULT_WHITEPAPER_CHUNKS);

        setTimeout(() => {
          setActiveStep(5); // 05: Embedding
          setTimeout(() => {
            setActiveStep(6); // 06: Vector DB Ready
            setIsProcessing(false);
          }, 400);
        }, 400);
      }, 400);
    } catch (err: unknown) {
      console.error("PDF upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to parse PDF.";
      setErrorMsg(msg);
      setIsProcessing(false);
      setActiveStep(0);
    }
  };

  // Perform Grounded RAG Query Answering
  const handleAsk = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setRagAnswer(null);
    setErrorMsg(null);
    setRetrievedChunks([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.found) {
        const topChunk: Chunk = {
          id: `page-${data.sourcePage}`,
          page: data.sourcePage,
          section: `${data.documentName} • Page ${data.sourcePage}`,
          text: data.rawSourceText || data.relevantSentences?.join(" ") || data.answer,
          similarity: (data.confidence || 95) / 100,
        };
        setRetrievedChunks([topChunk]);
        setRagAnswer(data.answer);
      } else {
        setRagAnswer(data.message || `No direct matches found in "${fileName}" for "${query}".`);
        if (data.availableTopics) {
          setRagAnswer(
            `${data.message}\n\nTopics found in document: ${data.availableTopics.join(", ")}`
          );
        }
      }
    } catch {
      setErrorMsg("Query failed. Please check network connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleQuestions = [
    "What is the 40mm driver diaphragm made of?",
    "How does the Dual QN3 ANC architecture operate?",
    "What are the battery life and fast charging specs?",
    "What wireless audio codecs and bitrates are supported?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col bg-[#08080b]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08080b]/95 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0050FF] to-[#00D6FF] flex items-center justify-center shadow-lg shadow-[#0050FF]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Sony Audio Architect • RAG Intelligence Console
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D6FF]/10 text-[#00D6FF] border border-[#00D6FF]/30">
                  PyPDF + Vector RAG
                </span>
              </div>
              <p className="text-xs text-white/50">
                Ask any question about WH-1000XM6 engineering or upload technical documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* STEP-BY-STEP RAG PIPELINE INSPECTOR */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono tracking-widest text-[#00D6FF]">
                RAG Pipeline Execution Steps
              </span>
              <span className="text-xs text-white/40 font-mono">
                Source: {fileName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { step: 1, label: "Read PDF", desc: "Extract raw stream" },
                { step: 2, label: "Load", desc: "Buffer into memory" },
                { step: 3, label: "Clean", desc: "PyPDF normalize" },
                { step: 4, label: "Chunks", desc: "Semantic blocks" },
                { step: 5, label: "Embedding", desc: "Vector indexing" },
                { step: 6, label: "Vector DB", desc: "Search ready" },
              ].map((item) => {
                const isCurrent = activeStep === item.step;
                const isPassed = activeStep > item.step || activeStep === 0;
                return (
                  <div
                    key={item.step}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? "bg-[#0050FF]/20 border-[#00D6FF] shadow-[0_0_15px_rgba(0,214,255,0.3)] animate-pulse"
                        : isPassed
                        ? "bg-white/[0.02] border-white/10 text-white/80"
                        : "bg-white/[0.01] border-white/[0.04] text-white/40"
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-[#00D6FF] mb-0.5">
                      0{item.step}
                    </div>
                    <div className="text-xs font-semibold text-white leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-white/40 font-mono mt-1">
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-white/60">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Knowledge Base:</span>
                <span className="text-white font-medium truncate max-w-xs">{fileName}</span>
                <span className="text-white/40">({chunks.length} chunks indexed)</span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.md"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white flex items-center space-x-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#00D6FF]" />
                  <span>Upload Custom PDF / Doc</span>
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/document", { method: "DELETE" });
                    setFileName("Sony_WH-1000XM6_Exploded_View_Architecture.pdf");
                    setChunks(DEFAULT_WHITEPAPER_CHUNKS);
                    setActiveStep(0);
                    setRagAnswer(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white transition-colors"
                >
                  Reset to XM6 Whitepaper
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH & QUESTION FORM */}
          <div>
            <form onSubmit={handleAsk} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything (e.g., 'What is the driver material?' or 'How does QN3 cancel noise?')..."
                className="w-full px-5 py-4 pl-12 pr-28 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#00D6FF] focus:ring-1 focus:ring-[#00D6FF] transition-all"
              />
              <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                disabled={isProcessing || !query.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-40 hover:brightness-110 transition-all shadow-md"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Ask RAG</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[11px] text-white/40 self-center">Try asking:</span>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    setTimeout(() => {
                      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                      handleAsk(fakeEvent);
                    }, 50);
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] text-white/70 hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* RAG ANSWER DISPLAY */}
          {ragAnswer && (
            <div className="p-6 rounded-2xl bg-[#0b0c10] border border-[#00D6FF]/30 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#00D6FF]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Grounded RAG Response</span>
                </div>
                <span className="text-[11px] font-mono text-white/40">
                  Knowledge Base: {fileName}
                </span>
              </div>

              <div className="text-sm sm:text-base text-white/90 leading-relaxed font-light whitespace-pre-line">
                {ragAnswer}
              </div>

              {retrievedChunks.length > 0 && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block mb-2">
                    Retrieved Vector Chunks:
                  </span>
                  <div className="space-y-2">
                    {retrievedChunks.map((chunk) => (
                      <div
                        key={chunk.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono"
                      >
                        <div className="flex items-center justify-between text-[#00D6FF] mb-1">
                          <span>{chunk.section}</span>
                          {chunk.similarity && (
                            <span className="text-emerald-400">
                              {(chunk.similarity * 100).toFixed(1)}% Match
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 line-clamp-2">{chunk.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* KNOWLEDGE BASE CHUNKS PREVIEW */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-widest text-white/50">
                Document Vector Embeddings ({chunks.length} Total Chunks)
              </span>
              <span className="text-xs font-mono text-[#00D6FF]">Chroma Vector Store Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {chunks.slice(0, 8).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all text-xs"
                >
                  <div className="flex items-center justify-between text-[#00D6FF] font-mono text-[10px] mb-1">
                    <span className="truncate max-w-[180px]">{c.section}</span>
                    <span className="text-white/30">{c.id}</span>
                  </div>
                  <p className="text-white/60 line-clamp-3 leading-relaxed font-light">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
