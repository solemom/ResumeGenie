
import React from 'react';
import { Check, Zap, Rocket, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User, PlanType } from '../types';

interface PricingProps {
  onSelect: (plan: PlanType) => void;
  user: User | null;
}

const Pricing: React.FC<PricingProps> = ({ onSelect, user }) => {
  const plans: Array<{
    name: PlanType;
    price: string;
    revisions: number;
    description: string;
    features: string[];
    icon: React.ReactNode;
    buttonText: string;
    highlight: boolean;
    tag?: string;
  }> = [
    {
      name: "Free",
      price: "0",
      revisions: 1,
      description: "Perfect for a quick polish before applying.",
      features: [
        "1 revision per account",
        "AI-powered skills analysis",
        "Visual diff highlighting",
        "DOCX export support",
        "Standard processing speed"
      ],
      icon: <Zap className="text-slate-400" size={24} />,
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Basic",
      price: "6",
      revisions: 5,
      description: "Best for active job hunters applying to multiple roles.",
      features: [
        "5 revisions per account",
        "Enhanced AI reasoning",
        "Priority ATS keyword matching",
        "STAR method optimization",
        "Email support",
        "DOCX export support"
      ],
      icon: <Rocket className="text-blue-600" size={24} />,
      buttonText: "Select Basic",
      highlight: true,
      tag: "Most Popular"
    },
    {
      name: "Advanced",
      price: "18",
      revisions: 20,
      description: "The ultimate kit for career changers and executives.",
      features: [
        "20 revisions per account",
        "Premium AI model access",
        "Comprehensive career gap analysis",
        "Priority processing speed",
        "24/7 dedicated support",
        "Unlimited revision history",
        "DOCX export support"
      ],
      icon: <Star className="text-purple-600" size={24} />,
      buttonText: "Go Advanced",
      highlight: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Choose the plan that fits your job search intensity. Scale up as you narrow down your dream roles.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 px-4">
        {plans.map((plan, index) => {
          const isCurrent = user?.plan === plan.name;
          
          // Gray out logic: 
          // 1. If it's the Free plan and user has already upgraded to a paid plan.
          // 2. If it's the Free plan and user has used their quota.
          const isFreeDisabled = plan.name === 'Free' && user && (user.plan !== 'Free' || user.revisionsUsed >= user.revisionsTotal);
          
          // Specifically disable the button if it's the current plan AND it's the Free plan (can't 'renew' free)
          // OR if the card is globally disabled via isFreeDisabled
          const isButtonDisabled = (isCurrent && plan.name === 'Free') || (isFreeDisabled && !isCurrent);

          return (
            <div 
              key={index}
              className={`
                relative bg-white rounded-3xl border p-8 flex flex-col space-y-6 transition-all hover:shadow-xl
                ${plan.highlight ? 'border-blue-500 shadow-blue-100/50 shadow-lg scale-105 z-10' : 'border-slate-100 shadow-sm'}
                ${isFreeDisabled && !isCurrent ? 'opacity-50 grayscale pointer-events-none' : ''}
              `}
            >
              {!isCurrent && plan.tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-20">
                  {plan.tag}
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {plan.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-500">$</span>
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-50 font-medium text-slate-500 ml-1">USD</span>
              </div>

              <div className="space-y-4 flex-grow">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">What's included:</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => !isButtonDisabled && onSelect(plan.name)}
                disabled={isButtonDisabled}
                className={`
                  w-full py-4 rounded-xl font-bold transition-all
                  ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                  ${isCurrent 
                    ? 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50' 
                    : plan.highlight 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}
                `}
              >
                {isCurrent && plan.name !== 'Free' ? `Renew ${plan.name}` : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start text-blue-400 font-bold text-sm uppercase tracking-widest">
            <ShieldCheck size={18} />
            Safe & Secure
          </div>
          <h2 className="text-3xl font-bold">100% Satisfaction Guarantee</h2>
          <p className="text-slate-400 max-w-md">
            Not happy with your revised resume? Contact our support team at <a href="mailto:contact@offerai.co" className="text-blue-400 hover:underline font-bold">contact@offerai.co</a> within 24 hours for a manual review or full refund.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex -space-x-3 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold">
              +1k
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500">Trusted by 10,000+ job seekers</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
