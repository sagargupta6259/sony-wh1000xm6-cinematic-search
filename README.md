# Sony WH-1000XM6 • Cinematic AI Document Search & Scrollytelling Experience

An Apple/Sony-grade, Awwwards-inspired luxury product landing page and intelligent document search experience for the **Sony WH-1000XM6 Flagship Wireless Noise-Cancelling Headphones**.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, **HTML5 Canvas**, and **PyPDF / Vector RAG Intelligence**.

---

## 🌟 Key Features

### 1. 🎧 120-Frame Scroll-Linked Exploded-View Architecture
- Seamless **120-frame image sequence playback** driven directly by scroll position.
- Precision breakdown: fully assembled flagship headset → disassembled floating acoustic & silicon components → reassembled product.
- Blended seamlessly into a dark studio void (`#050505`) with edge-feathering vignette.

### 2. 🌌 Live 60+ FPS Cosmic Multiverse Galaxy Engine
- Real-time continuous particle simulation rendering a multi-arm swirling galaxy inside the central acoustic ring.
- Keplerian differential rotation, dual-core singularity glow, orbital stardust motes, and quantum energy filaments.
- Zero `shadowBlur` GPU-optimized pipeline with direct DOM synchronization (running at silky-smooth 60+ FPS).

### 3. 🔍 Intelligent Document Search & Real-Time RAG
- **True Document Grounding**: Deep search across the official **Sony WH-1000XM6 Exploded Architecture Whitepaper (5 Pages)**.
- **Dynamic PDF Upload & Drag-and-Drop**: Users can upload any custom technical `.pdf` or text file directly from the hero search bar.
- **Python PyPDF Extraction**: Server-side page-by-page text parsing, semantic chunking, and keyword indexing.
- **Multi-lingual / Hinglish Support**: Accurately parses queries in English, Hindi, and technical terms.
- **Exact Citations**: Displays answers with grounded confidence scores, highlighted key terms, exact page numbers, and expandable raw excerpts.

### 4. 🔬 Sony Audio Architect • Vector RAG Pipeline Console
- Interactive modal visualizer displaying all 6 steps of the Retrieval-Augmented Generation pipeline:
  1. **Read PDF** (raw stream)
  2. **Load** (buffer in memory)
  3. **Clean** (PyPDF normalization)
  4. **Chunks** (semantic blocks)
  5. **Embedding** (vector indexing)
  6. **Vector DB** (search ready)

### 5. 📑 Interactive PDF Page Inspector
- Page-by-page high-resolution technical document viewer with exploded component render thumbnails and spec badges.

### 6. 🎛️ Interactive Web Audio Soundstage Simulator
- Synthesizer demonstrating:
  - **Active Noise Cancellation (-38.6 dB)**
  - **Ambient Sound Mode (58 dB)**
  - **360 Reality Audio (Spatial 3D field)**
- Real-time HTML5 Canvas wave oscilloscope visualizer with viewport-based `IntersectionObserver`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS (Apple luxury dark theme `#050505`)
- **Animation**: Framer Motion, HTML5 Canvas 2D Engine
- **Document Engine**: Python 3 `pypdf`, Node.js REST API
- **Icons**: Lucide React
- **Audio**: Web Audio API (real-time sine synthesizer & filter chains)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (v20+ recommended)
- **Python 3**: with `pypdf` installed (`pip3 install pypdf`)

### Installation

```bash
# Clone the repository
git clone https://github.com/sagargupta6259/sony-wh1000xm6-cinematic-search.git
cd sony-wh1000xm6-cinematic-search

# Install npm dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 📂 Project Architecture

```
├── public/
│   ├── sequence/          # 120-frame WebP exploding headphone sequence
│   └── Sony_WH-1000XM6_Exploded_View_Architecture.pdf
├── scripts/
│   └── parse_pdf.py       # High-performance PyPDF document parser
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── document/  # Active document metadata & reset API
│   │   │   ├── search/    # Grounded RAG search API
│   │   │   └── upload/    # Multipart PDF upload & PyPDF parser
│   │   ├── layout.tsx
│   │   └── page.tsx       # Main scrollytelling entry point
│   ├── components/
│   │   ├── CinematicDocSearch.tsx   # Hero search bar & PDF uploader
│   │   ├── ScrollytellingCanvas.tsx # 120-frame canvas & multiverse engine
│   │   ├── AudioArchitectRAG.tsx    # 6-step RAG visualizer modal
│   │   ├── PdfInspectorModal.tsx    # Multi-page PDF document viewer
│   │   ├── SoundstageDemo.tsx       # Web Audio API acoustic simulator
│   │   ├── TechnologySection.tsx    # Deep engineering breakdown
│   │   ├── SpecsMatrix.tsx          # XM6 vs XM5 technical comparison
│   │   ├── ColorwaysSection.tsx     # Colorways preview
│   │   ├── Navbar.tsx               # Apple-style glassmorphic header
│   │   └── Footer.tsx               # Editorial corporate footer
│   └── data/
│       └── indexed_pdf.json         # Pre-indexed whitepaper dataset
```

---

## 📄 License

MIT License. Designed and developed with inspiration from Sony Acoustic Engineering and Apple's iconic design language.
