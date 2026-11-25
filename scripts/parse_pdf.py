import sys
import json
import os
import re

def extract_pdf_data(pdf_path, original_filename=None):
    import pypdf
    
    if not os.path.exists(pdf_path):
        return {"error": f"File not found: {pdf_path}"}
        
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
    doc_display_name = original_filename if original_filename else os.path.basename(pdf_path)
    
    pages_data = []
    all_chunks = []
    word_freq = {}
    
    stop_words = {
        "the", "and", "a", "an", "in", "to", "of", "is", "for", "with", "on", "as",
        "by", "at", "from", "that", "this", "it", "are", "be", "was", "or", "which",
        "page", "document", "specification", "corporation", "ref", "all", "can",
        "has", "have", "not", "but", "also", "each", "into", "more", "than", "its"
    }

    for i, page in enumerate(reader.pages):
        page_num = i + 1
        raw_text = page.extract_text() or ""
        # Clean text
        clean_text = re.sub(r'[ \t]+', ' ', raw_text)
        clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()
        
        # Split into paragraphs
        raw_paragraphs = [p.strip() for p in clean_text.split('\n\n') if len(p.strip()) > 20]
        if not raw_paragraphs and clean_text:
            raw_paragraphs = [line.strip() for line in clean_text.split('\n') if len(line.strip()) > 20]
        if not raw_paragraphs and clean_text:
            raw_paragraphs = [clean_text]
            
        # Extract title from first line or paragraph
        first_line = clean_text.split('\n')[0].strip() if clean_text else f"Page {page_num}"
        title = first_line[:60] if len(first_line) > 5 else f"Page {page_num}"
        subtitle = f"Section {page_num} of {doc_display_name}"
        
        # Extract key words
        words = re.findall(r'\b[a-zA-Z0-9-]{3,}\b', clean_text.lower())
        keywords = []
        for w in words:
            if w not in stop_words and not w.isdigit():
                word_freq[w] = word_freq.get(w, 0) + 1
                if w not in keywords and len(keywords) < 15:
                    keywords.append(w)
                    
        # Chunks for RAG
        for p_idx, p in enumerate(raw_paragraphs):
            chunk_id = f"chunk-p{page_num}-{p_idx+1}"
            all_chunks.append({
                "id": chunk_id,
                "page": page_num,
                "section": f"Page {page_num} • {title}",
                "text": p
            })
            
        pages_data.append({
            "page": page_num,
            "title": title,
            "subtitle": subtitle,
            "keywords": keywords,
            "raw_text": clean_text,
            "paragraphs": raw_paragraphs
        })

    # Generate suggestions from top words
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    top_terms = [w[0] for w in sorted_words if len(w[0]) > 3][:8]
    
    suggestions = []
    if len(top_terms) >= 3:
        suggestions.append(f"Explain {top_terms[0]} in the document.")
        suggestions.append(f"What details are provided about {top_terms[1]}?")
        suggestions.append(f"How does {top_terms[2]} work?")
    if len(top_terms) >= 5:
        suggestions.append(f"Summarize key aspects of {top_terms[3]} and {top_terms[4]}.")
    suggestions.append("What are the key technical specifications?")

    return {
        "document_name": doc_display_name,
        "document_ref": f"DOC-{doc_display_name.upper().replace(' ', '_')[:12]}",
        "total_pages": total_pages,
        "total_chunks": len(all_chunks),
        "pages": pages_data,
        "chunks": all_chunks,
        "suggestions": suggestions,
        "top_terms": top_terms
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python parse_pdf.py <pdf_path> [original_filename]"}))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    orig_name = sys.argv[2] if len(sys.argv) > 2 else None
    result = extract_pdf_data(pdf_path, orig_name)
    print(json.dumps(result))
