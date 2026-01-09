
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Award, Target, Hash } from 'lucide-react';
import { OptimizationResult } from '../types';

interface ResultsDashboardProps {
  result: OptimizationResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const data = [
    { name: 'Original', score: result.initialScore, color: '#94a3b8' },
    { name: 'Optimized', score: result.optimizedScore, color: '#2563eb' },
  ];

  const improvement = result.optimizedScore - result.initialScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 w-full">
          <Award size={20} className="text-blue-600" />
          Match Comparison
        </h3>
        
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-3xl font-black text-blue-600">+{improvement}%</div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Optimization Lift</p>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            AI Analysis
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {result.analysis}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Hash size={20} className="text-blue-600" />
            Priority Keywords Added
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.suggestedKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
