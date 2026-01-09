
import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onUpload: (file: File) => void;
  currentFile: FileData | null;
  isParsing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, currentFile, isParsing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllowed = (fileName: string) => {
    const lower = fileName.toLowerCase();
    return lower.endsWith('.txt') || lower.endsWith('.pdf') || lower.endsWith('.docx');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isAllowed(file.name)) {
        onUpload(file);
      } else {
        alert("Only .txt, .pdf, and .docx files are allowed.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (isAllowed(file.name)) {
        onUpload(file);
      } else {
        alert("Only .txt, .pdf, and .docx files are allowed.");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept=".txt,.pdf,.docx"
        className="hidden"
      />
      
      <div
        onClick={() => !isParsing && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all flex-grow min-h-[160px]
          ${currentFile ? 'border-green-200 bg-green-50/50' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30'}
          ${isParsing ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {isParsing ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="text-sm font-medium text-slate-500">Extracting text from document...</span>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center space-y-2 text-green-600">
            <CheckCircle2 size={32} />
            <div className="text-center">
              <span className="text-sm font-bold block truncate max-w-[200px]">{currentFile.name}</span>
              <span className="text-xs opacity-75">Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Upload className="text-slate-400" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Click or drag to upload</p>
              <p className="text-xs text-blue-500 font-bold mt-1">PDF, DOCX or Plain Text (.txt)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
