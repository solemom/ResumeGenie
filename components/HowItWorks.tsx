
import React from 'react';
import { Search, PenTool, BarChart, Download, ArrowLeft, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const steps = [
    {
      icon: <Search className="text-blue-600" size={24} />,
      title: "Contextual Analysis",
      description: "Our AI scans the job description to identify core competencies, technical requirements, and soft skills sought by the employer."
    },
    {
      icon: <BrainCircuit className="text-purple-600" size={24} />,
      title: "Gap Discovery",
      description: "We compare your current resume against those requirements to find missing keywords and experiences that might trigger an ATS rejection."
    },
    {
      icon: <PenTool className="text-orange-600" size={24} />,
      title: "Intelligent Rewriting",
      description: "Using the STAR (Situation, Task, Action, Result) method, we rephrase your achievements to be more impact-oriented and ATS-friendly."
    },
    {
      icon: <BarChart className="text-green-600" size={24} />,
      title: "Scoring & Validation",
      description: "We provide a 'Match Score' comparison, showing you exactly how much your relevance has improved after the AI optimization."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Optimizer
          </button>
          <h1 className="text-3xl font-bold text-slate-900">How ResumeGenie Pro Works</h1>
          <p className="text-slate-600 mt-2">The science behind our AI-driven resume transformation.</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center px-3 py-1 bg-blue-500/30 rounded-full text-xs font-bold tracking-widest uppercase">
            The Gemini Advantage
          </div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl">
            More than just a keyword stuffer. It's a professional career coach.
          </h2>
          <p className="text-blue-100 max-w-xl text-lg leading-relaxed">
            Our platform uses Google's most advanced Gemini models to understand the *semantics* of your career. It doesn't just copy words; it understands how your previous roles translate to the new job's requirements.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <ShieldCheck size={20} className="text-blue-200" />
              <span className="text-sm font-medium">ATS Optimization</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Zap size={20} className="text-blue-200" />
              <span className="text-sm font-medium">STAR Methodology</span>
            </div>
          </div>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center space-y-6 py-8">
        <h2 className="text-2xl font-bold text-slate-800">Ready to boost your hireability?</h2>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          Start Optimizing Now
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
