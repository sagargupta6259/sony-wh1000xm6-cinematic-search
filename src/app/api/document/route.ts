import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const activeDocPath = path.join(process.cwd(), "src", "data", "active_uploaded_doc.json");
    const defaultDocPath = path.join(process.cwd(), "src", "data", "indexed_pdf.json");

    if (fs.existsSync(activeDocPath)) {
      const activeData = JSON.parse(fs.readFileSync(activeDocPath, "utf-8"));
      return NextResponse.json({
        isCustom: true,
        documentName: activeData.document_name,
        documentRef: activeData.document_ref,
        totalPages: activeData.total_pages,
        totalChunks: activeData.total_chunks || (activeData.chunks ? activeData.chunks.length : activeData.pages.length),
        suggestions: activeData.suggestions || [],
        topTerms: activeData.top_terms || [],
        pages: activeData.pages || [],
      });
    }

    if (fs.existsSync(defaultDocPath)) {
      const defaultData = JSON.parse(fs.readFileSync(defaultDocPath, "utf-8"));
      return NextResponse.json({
        isCustom: false,
        documentName: defaultData.document_name,
        documentRef: defaultData.document_ref,
        totalPages: defaultData.total_pages,
        totalChunks: defaultData.pages.length,
        suggestions: [
          "Explain the noise cancelling technology.",
          "What components are inside the headphones?",
          "How does the microphone system work?",
          "Explain the headphone driver.",
          "What makes WH-1000XM6 special?",
        ],
        topTerms: ["driver", "noise cancelling", "qn3", "mems", "battery", "ldac"],
        pages: defaultData.pages || [],
      });
    }

    return NextResponse.json({ error: "No document found." }, { status: 404 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const activeDocPath = path.join(process.cwd(), "src", "data", "active_uploaded_doc.json");
    if (fs.existsSync(activeDocPath)) {
      fs.unlinkSync(activeDocPath);
    }
    return NextResponse.json({ success: true, message: "Reset to default document." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
