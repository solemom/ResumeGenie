
import React, { useMemo } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { diffWords } from 'diff';
import { OptimizationResult, ResumeSection } from '../types';

interface ResumeComparerProps {
  result: OptimizationResult;
}

const DiffText: React.FC<{ oldText: string; newText: string; mode: 'original' | 'optimized' }> = ({ oldText, newText, mode }) => {
  const diffParts = useMemo(() => diffWords(oldText, newText), [oldText, newText]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {diffParts.map((part, index) => {
        if (mode === 'original') {
          // In original view, highlight what was REMOVED
          if (part.removed) {
            return (
              <span key={index} className="bg-red-100 text-red-800 line-through decoration-red-400 px-0.5 rounded">
                {part.value}
              </span>
            );
          }
          // Ignore parts that were added in this view
          if (part.added) return null;
          return <span key={index}>{part.value}</span>;
        } else {
          // In optimized view, highlight what was ADDED/IMPROVED
          if (part.added) {
            return (
              <span key={index} className="bg-green-100 text-green-900 font-semibold px-0.5 rounded border-b border-green-200">
                {part.value}
              </span>
            );
          }
          // Ignore parts that were removed in this view
          if (part.removed) return null;
          return <span key={index}>{part.value}</span>;
        }
      })}
    </div>
  );
};

const ComparisonRow: React.FC<{ section: ResumeSection }> = ({ section }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">{section.title}</h4>
        <div className="flex gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200"></span> REMOVED</span>
          <ArrowRight size={12} />
          <span className="text-blue-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-200"></span> IMPROVED</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 divide-x divide-slate-100">
        <div className="p-6 text-sm text-slate-500 italic">
          <DiffText oldText={section.original} newText={section.optimized} mode="original" />
        </div>
        <div className="p-6 text-sm text-slate-800 bg-blue-50/5">
          <DiffText oldText={section.original} newText={section.optimized} mode="optimized" />
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 tracking-widest flex items-center gap-1">
              <Info size={10} />
              Why this works
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {section.changes.map((change, i) => (
                <li key={i} className="flex items-start space-x-2 text-[11px] text-slate-600">
                  <span className="block mt-1 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeComparer: React.FC<ResumeComparerProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-slate-600 text-sm">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Info size={18} />
          </div>
          <p>
            We've highlighted <span className="font-bold text-green-700">additions</span> and <span className="font-bold text-red-700 line-through">removals</span> to show exactly how your resume was tailored for the role.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {result.sections.map((section, idx) => (
          <ComparisonRow key={idx} section={section} />
        ))}
      </div>
    </div>
  );
};

export default ResumeComparer;
