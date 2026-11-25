import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface PageData {
  page: number;
  title: string;
  subtitle?: string;
  keywords?: string[];
  visual_frame?: string;
  raw_text: string;
  paragraphs: string[];
}

interface IndexedDocument {
  document_name: string;
  document_ref?: string;
  total_pages: number;
  pages: PageData[];
  suggestions?: string[];
  top_terms?: string[];
}

const STOP_WORDS = new Set([
  // English stop words & question words
  "a", "an", "the", "and", "or", "but", "if", "because", "as", "what",
  "which", "this", "that", "these", "those", "then", "just", "so", "than",
  "such", "both", "through", "about", "for", "is", "of", "while", "during",
  "to", "from", "in", "out", "on", "off", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "any", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "can", "will", "just",
  "don", "should", "now", "does", "did", "do", "are", "was", "were", "been",
  "has", "have", "had", "tell", "me", "show", "give", "explain", "describe",
  "please", "find", "get", "read",
  // Hindi / Hinglish question words & common particles
  "kya", "kaise", "kaisa", "kaun", "batao", "hai", "hain", "tha", "the",
  "thi", "hoga", "hogi", "bhi", "me", "mai", "se", "ko", "ka", "ki", "ke",
  "par", "pe", "karo", "karna", "ye", "yeh", "wo", "woh", "isko", "usko"
]);

export async function POST(req: NextRequest) {
  try {
    const { query, forceDefault } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required." },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim().toLowerCase();

    // Check active uploaded document vs default
    const activeDocPath = path.join(process.cwd(), "src", "data", "active_uploaded_doc.json");
    const defaultDocPath = path.join(process.cwd(), "src", "data", "indexed_pdf.json");

    let docPath = defaultDocPath;
    if (!forceDefault && fs.existsSync(activeDocPath)) {
      docPath = activeDocPath;
    } else if (!fs.existsSync(defaultDocPath)) {
      return NextResponse.json(
        { error: "Document index not found." },
        { status: 500 }
      );
    }

    const doc: IndexedDocument = JSON.parse(fs.readFileSync(docPath, "utf-8"));

    // Meaningful query tokens excluding stop words
    const allTokens = cleanQuery
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    const contentTokens = allTokens.filter((w) => !STOP_WORDS.has(w));
    const effectiveTokens = contentTokens.length > 0 ? contentTokens : allTokens;

    // Helper: basic stem and synonym matching
    const matchesToken = (text: string, token: string): boolean => {
      if (text.includes(token)) return true;
      if (token.length > 3 && token.endsWith("s") && text.includes(token.slice(0, -1))) return true;
      if (token.length > 4 && token.endsWith("es") && text.includes(token.slice(0, -2))) return true;
      if (token.length > 5 && token.endsWith("ing") && text.includes(token.slice(0, -3))) return true;
      if (token.length > 4 && token.endsWith("ed") && text.includes(token.slice(0, -2))) return true;
      if (token === "headphones" && (text.includes("headset") || text.includes("headphone"))) return true;
      if (token === "spec" && text.includes("specification")) return true;
      if (token === "feature" && text.includes("architecture")) return true;
      return false;
    };

    interface ScoredPage {
      page: PageData;
      score: number;
      matchedKeywords: string[];
      relevantSentences: string[];
      bestParagraph: string;
    }

    const scoredPages: ScoredPage[] = doc.pages.map((p) => {
      let score = 0;
      const matchedKeywords: string[] = [];
      const textLower = p.raw_text.toLowerCase();

      // Check keyword direct matches
      if (p.keywords && Array.isArray(p.keywords)) {
        p.keywords.forEach((kw) => {
          const kwLower = kw.toLowerCase();
          if (cleanQuery.includes(kwLower)) {
            score += 30;
            matchedKeywords.push(kw);
          } else {
            const kwTokens = kwLower.split(/\s+/);
            kwTokens.forEach((kt) => {
              if (effectiveTokens.some((t) => matchesToken(t, kt) || matchesToken(kt, t))) {
                score += 15;
                matchedKeywords.push(kw);
              }
            });
          }
        });
      }

      // Check title match
      const titleLower = p.title.toLowerCase();
      effectiveTokens.forEach((token) => {
        if (matchesToken(titleLower, token)) {
          score += 25;
        }
      });

      // Split page into sentences for granular matching
      const sentences = p.raw_text
        .split(/(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15);

      const relevantSentences: string[] = [];

      sentences.forEach((sentence) => {
        const sLower = sentence.toLowerCase();
        let sentenceHits = 0;
        effectiveTokens.forEach((token) => {
          if (matchesToken(sLower, token)) {
            sentenceHits += 1;
            score += 10;
            if (!matchedKeywords.includes(token)) {
              matchedKeywords.push(token);
            }
          }
        });
        if (sentenceHits > 0) {
          relevantSentences.push(sentence);
        }
      });

      // Exact phrase match bonus
      if (effectiveTokens.length >= 2 && textLower.includes(effectiveTokens.join(" "))) {
        score += 40;
      }

      // Find the best paragraph on this page
      let bestParagraph = p.paragraphs?.[0] || p.raw_text.slice(0, 300);
      let bestParaScore = -1;
      (p.paragraphs || [p.raw_text]).forEach((para) => {
        const pLower = para.toLowerCase();
        let pScore = 0;
        effectiveTokens.forEach((t) => {
          if (matchesToken(pLower, t)) pScore += 1;
        });
        if (pScore > bestParaScore) {
          bestParaScore = pScore;
          bestParagraph = para;
        }
      });

      return {
        page: p,
        score,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        relevantSentences,
        bestParagraph,
      };
    });

    // Sort by relevance score
    const sorted = scoredPages
      .filter((sp) => sp.score > 0)
      .sort((a, b) => b.score - a.score);

    // If no match found at all
    if (sorted.length === 0 || sorted[0].score < 8) {
      const sampleTopics = doc.top_terms || doc.suggestions?.slice(0, 4) || [
        "specifications",
        "features",
        "engineering",
        "technology",
      ];

      return NextResponse.json({
        found: false,
        query,
        documentName: doc.document_name,
        message: `The uploaded document "${doc.document_name}" does not contain specific information directly addressing "${query}".`,
        suggestions: doc.suggestions && doc.suggestions.length > 0 ? doc.suggestions : [
          `Summarize key topics in ${doc.document_name}`,
          `What are the main technical highlights?`,
          `Explain the primary sections.`,
        ],
        availableTopics: sampleTopics,
      });
    }

    const top = sorted[0];
    const topSentences = top.relevantSentences.slice(0, 3);
    const excerpt = topSentences.length > 0 ? topSentences.join(" ") : top.bestParagraph;

    // Synthesize grounded response
    const answer = `Based on Page ${top.page.page} of "${doc.document_name}" [${top.page.title}]:\n\n${excerpt}`;

    return NextResponse.json({
      found: true,
      query,
      documentName: doc.document_name,
      documentRef: doc.document_ref || `DOC-${doc.document_name.toUpperCase().slice(0, 10)}`,
      sourcePage: top.page.page,
      totalPages: doc.total_pages,
      pageTitle: top.page.title,
      pageSubtitle: top.page.subtitle || `Page ${top.page.page} Architecture`,
      visualFrame: top.page.visual_frame || (top.page.page === 1 ? "/sequence/frame_000.jpg" : undefined),
      confidence: Math.min(99, Math.max(78, Math.round(75 + top.score * 0.4))),
      answer,
      relevantSentences: topSentences,
      rawSourceText: top.bestParagraph,
      highlightTerms: top.matchedKeywords.slice(0, 6),
      allMatchingPages: sorted.slice(0, 3).map((s) => ({
        page: s.page.page,
        title: s.page.title,
        score: s.score,
      })),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to process search query.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
