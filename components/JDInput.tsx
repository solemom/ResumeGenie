
import React from 'react';

interface JDInputProps {
  value: string;
  onChange: (val: string) => void;
}

const JDInput: React.FC<JDInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the target job description here..."
        className="w-full flex-grow min-h-[160px] p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
      />
      <div className="mt-2 text-right">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {value.length} characters
        </span>
      </div>
    </div>
  );
};

export default JDInput;
