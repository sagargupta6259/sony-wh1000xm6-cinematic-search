import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface ParsedPdfOutput {
  document_name: string;
  document_ref: string;
  total_pages: number;
  total_chunks: number;
  pages: Array<{
    page: number;
    title: string;
    subtitle: string;
    keywords: string[];
    raw_text: string;
    paragraphs: string[];
  }>;
  chunks: Array<{
    id: string;
    page: number;
    section: string;
    text: string;
  }>;
  suggestions: string[];
  top_terms: string[];
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const fileName = file.name;
    const isPdf = fileName.toLowerCase().endsWith(".pdf");
    const isTxt = fileName.toLowerCase().endsWith(".txt") || fileName.toLowerCase().endsWith(".md");

    if (!isPdf && !isTxt) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a .pdf, .txt, or .md file." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "data", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadsDir, `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(tempFilePath, buffer);

    let parsedResult: ParsedPdfOutput | null = null;

    if (isPdf) {
      // Execute python parser with pypdf
      const scriptPath = path.join(process.cwd(), "scripts", "parse_pdf.py");
      try {
        const { stdout } = await execFileAsync("python3", [scriptPath, tempFilePath, fileName], {
          maxBuffer: 10 * 1024 * 1024,
        });
        parsedResult = JSON.parse(stdout) as ParsedPdfOutput;
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
          { error: `Failed to extract text from PDF: ${errMsg}` },
          { status: 500 }
        );
      }
    } else {
      // Handle plain text / markdown files
      const textContent = buffer.toString("utf-8");
      const paragraphs = textContent
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20);

      const chunks = paragraphs.map((p, idx) => ({
        id: `chunk-p1-${idx + 1}`,
        page: 1,
        section: `Section ${idx + 1}`,
        text: p,
      }));

      parsedResult = {
        document_name: fileName,
        document_ref: `DOC-${fileName.toUpperCase().slice(0, 12)}`,
        total_pages: 1,
        total_chunks: chunks.length,
        pages: [
          {
            page: 1,
            title: fileName,
            subtitle: "Uploaded Document Text",
            keywords: ["document", "uploaded", "content"],
            raw_text: textContent,
            paragraphs,
          },
        ],
        chunks,
        suggestions: [
          `Summarize the key information in ${fileName}.`,
          `What are the main topics discussed?`,
          `List the primary conclusions.`,
        ],
        top_terms: ["content", "data", "information"],
      };
    }

    if (!parsedResult || parsedResult.error) {
      return NextResponse.json({ error: parsedResult?.error || "Failed to parse document" }, { status: 400 });
    }

    // Save as active uploaded document
    const activeDocPath = path.join(process.cwd(), "src", "data", "active_uploaded_doc.json");
    fs.writeFileSync(activeDocPath, JSON.stringify(parsedResult, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      documentName: parsedResult.document_name,
      documentRef: parsedResult.document_ref,
      totalPages: parsedResult.total_pages,
      totalChunks: parsedResult.total_chunks,
      suggestions: parsedResult.suggestions,
      topTerms: parsedResult.top_terms,
      pages: parsedResult.pages,
      chunks: parsedResult.chunks,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error during upload.";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
