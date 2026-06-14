# 📚 @pdf

## 📌 Overview
- **Trigger**: `@pdf`
- **Category**: For Students (Study, Writing & Office Productivity)
- **Purpose**: Extract text, parse complex layouts, merge multiple study documents, split chapters, or structure digital forms.
- **Best For**: Managing textbook PDFs, organizing scientific research papers, and handling digitizing workflows.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@pdf [describe the PDF layout, contents, or what you want to extract/automate]
```

---

## 💡 Key Capabilities & Features

- **Text & Data Extraction**: Parses scanned documents or multi-column layouts to extract precise raw text, tables, and numeric data without formatting loss.
- **Table-to-JSON/Markdown Converter**: Locates embedded PDF charts and converts them into pristine markdown tables or clean JSON data.
- **Splitting & Reorganization Plans**: Offers strategies and Python code commands (using PyPDF/PDFPlumber) to extract specific page ranges, split chapters, or merge notes.
- **Digital Form Optimization**: Structures digital PDF forms, drafts inputs, and helps formulate clear field coordinates and metadata structures.
- **Metadata Management**: Analyzes and outlines PDF metadata, author credits, publication sources, and referencing schemas.

---

## 🛠️ Real-world Examples

### Example 1: Extracting Chemistry Lab Tables
**Prompt:**
> `@pdf here is raw copied text from a PDF lab report containing an experimental table, but the columns are all jumbled up. Help me parse, align, and organize this into a neat markdown table.`

### Example 2: PDF Parsing Script Generation
**Prompt:**
> `@pdf I have a 500-page textbook PDF and I want to write a Python script using PyPDF2 that splits it into separate PDFs for each of the 12 chapters, based on a list of chapter page numbers. Let's write the script.`

---

## 📘 Best Practices
1. **Handle OCR Correctly**: If a PDF is a scanned image with no selectable text, use specialized optical character recognition (OCR) steps or tools before parsing the content.
2. **Review Multi-column Formats**: Pay extra attention to line breaks when copying from two-column academic papers, as sentences can sometimes merge incorrectly.
3. **Double-Check Numerical Tables**: Always manually verify that decimal points and column alignments in generated tables match the source document perfectly.
