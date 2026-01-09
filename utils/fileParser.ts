
import { FileData } from '../types';

/**
 * Parses the uploaded file.
 * Supports .txt, .pdf, and .docx files.
 */
export async function parseFile(file: File): Promise<FileData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'txt') {
    try {
      const content = await file.text();
      return { name: file.name, content, type: 'text' };
    } catch (err) {
      throw new Error("Failed to read the text file content.");
    }
  }

  if (extension === 'pdf') {
    try {
      return await parsePdf(file);
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      throw new Error("Failed to extract text from PDF. Please ensure it's not password protected or try converting to .txt.");
    }
  }

  if (extension === 'docx') {
    try {
      return await parseDocx(file);
    } catch (err) {
      console.error("DOCX Parsing Error:", err);
      throw new Error("Failed to extract text from DOCX. Please ensure the file is not corrupted or try converting to .txt.");
    }
  }

  throw new Error(`The file format .${extension} is not supported. Please upload a .txt, .pdf, or .docx file.`);
}

/**
 * Extracts text from a PDF file using pdfjs-dist via CDN.
 */
async function parsePdf(file: File): Promise<FileData> {
  const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.10.38');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }

  if (!fullText.trim()) {
    throw new Error("The PDF appears to be empty or contains only images (no selectable text).");
  }

  return {
    name: file.name,
    content: fullText.trim(),
    type: 'pdf'
  };
}

/**
 * Extracts text from a DOCX file using mammoth via esm.sh.
 */
async function parseDocx(file: File): Promise<FileData> {
  const mammoth = await import('https://esm.sh/mammoth@1.8.0');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  if (!result.value.trim()) {
    throw new Error("The DOCX document appears to be empty.");
  }

  return {
    name: file.name,
    content: result.value.trim(),
    type: 'docx'
  };
}
