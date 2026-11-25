"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Loader2,
  Upload,
} from "lucide-react";

interface SearchResult {
  found: boolean;
  query: string;
  documentName?: string;
  documentRef?: string;
  confidence?: number;
  sourcePage?: number;
  totalPages?: number;
  pageTitle?: string;
  pageSubtitle?: string;
  visualFrame?: string;
  answer?: string;
  relevantSentences?: string[];
  rawSourceText?: string;
  highlightTerms?: string[];
  message?: string;
  suggestions?: string[];
  availableTopics?: string[];
}

interface ActiveDocumentInfo {
  isCustom: boolean;
  documentName: string;
  documentRef: string;
  totalPages: number;
  totalChunks: number;
  suggestions: string[];
  topTerms: string[];
}

interface CinematicDocSearchProps {
  onOpenPdfModal: (page?: number) => void;
  onFocusSearch?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  "Explain the noise cancelling technology.",
  "What components are inside the headphones?",
  "How does the microphone system work?",
  "Explain the headphone driver.",
  "What makes WH-1000XM6 special?",
];

export default function CinematicDocSearch({
  onOpenPdfModal,
  onFocusSearch,
}: CinematicDocSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isExpandedSource, setIsExpandedSource] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [activeDoc, setActiveDoc] = useState<ActiveDocumentInfo>({
    isCustom: false,
    documentName: "Sony_WH-1000XM6_Exploded_View_Architecture.pdf",
    documentRef: "SNY-XM6-EXPLODED-SPEC-2026",
    totalPages: 5,
    totalChunks: 5,
    suggestions: DEFAULT_SUGGESTIONS,
    topTerms: ["driver", "noise cancelling", "qn3", "battery", "ldac"],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch active document info on load
  const fetchActiveDoc = async () => {
    try {
      const res = await fetch("/api/document");
      if (res.ok) {
        const data = await res.json();
        setActiveDoc(data);
      }
    } catch (e) {
      console.error("Failed to load active document info:", e);
    }
  };

  useEffect(() => {
    fetchActiveDoc();
  }, []);

  // Handle PDF file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const isTxt = file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md");

    if (!isPdf && !isTxt) {
      alert("Please upload a .pdf, .txt, or .md document.");
      return;
    }

    setIsUploading(true);
    setUploadStatus(`Reading & parsing "${file.name}" with PyPDF...`);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || "Failed to upload and parse PDF.");
        return;
      }

      setUploadStatus(`Successfully extracted ${data.totalPages} pages & ${data.totalChunks} chunks!`);
      setActiveDoc({
        isCustom: true,
        documentName: data.documentName,
        documentRef: data.documentRef,
        totalPages: data.totalPages,
        totalChunks: data.totalChunks,
        suggestions: data.suggestions && data.suggestions.length > 0 ? data.suggestions : DEFAULT_SUGGESTIONS,
        topTerms: data.topTerms || [],
      });

      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus("");
      }, 1500);
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error reading PDF: ${errMsg}`);
      setIsUploading(false);
      setUploadStatus("");
    }
  };

  // Reset to default Sony XM6 PDF
  const handleResetToDefaultDoc = async () => {
    setIsUploading(true);
    setUploadStatus("Resetting to Sony WH-1000XM6 Architectural Whitepaper...");
    try {
      await fetch("/api/document", { method: "DELETE" });
      await fetchActiveDoc();
      setResult(null);
      setQuery("");
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsUploading(false);
      setUploadStatus("");
    }
  };

  // Execute query search against active document
  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setResult(null);
    setIsExpandedSource(false);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm }),
      });

      const data: SearchResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResult({
        found: false,
        query: searchTerm,
        message: "An error occurred while querying the document index. Please try again.",
        suggestions: activeDoc.suggestions || DEFAULT_SUGGESTIONS,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setIsExpandedSource(false);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-20"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        accept=".pdf,.txt,.md"
        className="hidden"
      />

      {/* Hero Header Typography */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-md shadow-lg shadow-black/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80">
            SONY WH-1000XM6 | INTELLIGENT DOCUMENT SEARCH
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 drop-shadow-2xl">
          Explore Every Detail.
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-white/65 font-light leading-relaxed">
          Discover the technology, engineering and innovation behind Sony
          WH-1000XM6 or upload any PDF document to search its full text in real time.
        </p>
      </div>

      {/* ACTIVE DOCUMENT CONTEXT BAR */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <FileText className="w-4 h-4 text-[#00D6FF] flex-shrink-0" />
          <span className="text-xs text-white/50 font-mono flex-shrink-0">
            Active Doc:
          </span>
          <span
            className="text-xs font-semibold text-white/90 truncate max-w-[220px] sm:max-w-xs cursor-pointer hover:text-[#00D6FF] transition-colors"
            onClick={() => onOpenPdfModal(1)}
            title="Click to inspect document in PDF viewer"
          >
            {activeDoc.documentName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 flex-shrink-0">
            {activeDoc.totalPages} {activeDoc.totalPages === 1 ? "page" : "pages"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {activeDoc.isCustom && (
            <button
              onClick={handleResetToDefaultDoc}
              disabled={isUploading}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/60 hover:text-white transition-all flex items-center space-x-1"
              title="Reset back to Sony WH-1000XM6 Exploded Architecture PDF"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to XM6 Spec</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#0050FF]/30 to-[#00D6FF]/30 hover:from-[#0050FF]/50 hover:to-[#00D6FF]/50 border border-[#00D6FF]/40 text-xs font-medium text-white transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-[#00D6FF]" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* UPLOAD STATUS OVERLAY / BANNER */}
      {isUploading && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#0050FF]/15 border border-[#00D6FF]/30 flex items-center justify-center space-x-3 text-xs sm:text-sm text-[#00D6FF] font-mono backdrop-blur-xl animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-[#00D6FF]" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* DRAG-AND-DROP VISUAL HINT */}
      {isDragging && (
        <div className="mb-4 p-6 rounded-3xl border-2 border-dashed border-[#00D6FF] bg-[#0050FF]/20 backdrop-blur-2xl text-center text-sm font-mono text-[#00D6FF] animate-pulse">
          Drop your PDF file here to extract and index all pages immediately!
        </div>
      )}

      {/* Main Search Bar */}
      <div className="relative mb-6">
        <form
          onSubmit={handleSubmit}
          className={`relative rounded-full transition-all duration-300 p-[1px] ${
            isFocused
              ? "bg-gradient-to-r from-[#0050FF] via-[#00D6FF] to-[#0050FF] shadow-[0_0_40px_rgba(0,214,255,0.35)]"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <div className="relative flex items-center rounded-full bg-[#0a0a0e]/85 backdrop-blur-2xl px-5 py-3.5 sm:py-4 border border-white/[0.08]">
            <Search
              className={`w-5 h-5 mr-3 transition-colors ${
                isFocused ? "text-[#00D6FF]" : "text-white/40"
              }`}
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                onFocusSearch?.();
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={`Ask anything about ${activeDoc.documentName.replace('.pdf', '')}...`}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 focus:outline-none font-normal tracking-wide"
            />

            {isLoading ? (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0050FF]/20 text-[#00D6FF] text-xs font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Searching PDF...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!query.trim()}
                className="ml-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-xs sm:text-sm font-semibold tracking-wide disabled:opacity-30 hover:brightness-110 transition-all flex items-center space-x-1.5 shadow-md flex-shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Suggested Search Queries */}
      {!result && !isLoading && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 mr-1">
            Suggested:
          </span>
          {activeDoc.suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(item)}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#00D6FF]/40 text-xs text-white/70 hover:text-white transition-all duration-200 backdrop-blur-md"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Search Result Panel */}
      {result && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] bg-[#0f0f12]/85 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0050FF]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Query & Confidence */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0050FF]/20 border border-[#0050FF]/40 flex items-center justify-center text-[#00D6FF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Query Result
                  </span>
                  <div className="text-sm font-semibold text-white">
                    &ldquo;{result.query}&rdquo;
                  </div>
                </div>
              </div>

              {result.found && result.confidence && (
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Grounded Match: {result.confidence}%</span>
                  </span>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Search Again"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Found Result Content */}
            {result.found ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#00D6FF]">
                      AI-Synthesized Answer from Document
                    </h3>
                    <span className="text-[11px] font-mono text-white/50">
                      Source: {result.documentName}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-white/90 leading-relaxed font-light whitespace-pre-line">
                    {result.answer}
                  </p>
                </div>

                {result.highlightTerms && result.highlightTerms.length > 0 && (
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block mb-2">
                      Key Technical Terms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.highlightTerms.map((term, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-[#0050FF]/15 border border-[#0050FF]/30 text-xs font-mono text-[#00D6FF]"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Reference Card */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D6FF]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#0050FF]/30 text-[#00D6FF] text-[10px] font-mono font-bold">
                          PAGE {result.sourcePage} OF {result.totalPages || 5}
                        </span>
                        <span className="text-xs font-medium text-white">
                          {result.pageTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 font-mono mt-0.5">
                        {result.pageSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenPdfModal(result.sourcePage)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-white font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Inspect in PDF</span>
                      <ExternalLink className="w-3 h-3 text-[#00D6FF]" />
                    </button>

                    <button
                      onClick={() => setIsExpandedSource(!isExpandedSource)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span>Raw Source</span>
                      {isExpandedSource ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Raw Text Excerpt */}
                {isExpandedSource && result.rawSourceText && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-white/70 leading-relaxed max-h-48 overflow-y-auto animate-in fade-in duration-200">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-sans font-bold">
                      Raw Extracted Text:
                    </div>
                    {result.rawSourceText}
                  </div>
                )}
              </div>
            ) : (
              /* Not Found State */
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-amber-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Information Not Found in Current Document
                    </h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.availableTopics && result.availableTopics.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block mb-2">
                      Key Topics in this Document:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.availableTopics.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(topic)}
                          className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-xs text-white/80 hover:text-white transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
