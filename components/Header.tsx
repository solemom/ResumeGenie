
import React from 'react';
import { Sparkles, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (view: 'home' | 'how-it-works' | 'pricing' | 'auth' | 'dashboard') => void;
  activeView: string;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeView, user }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Resume<span className="text-blue-600">Genie</span> Pro
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onNavigate('home')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'home' ? 'text-blue-600 font-bold' : ''}`}
          >
            Optimizer
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'how-it-works' ? 'text-blue-600 font-bold' : ''}`}
          >
            How it works
          </button>
          <button 
            onClick={() => onNavigate('pricing')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'pricing' ? 'text-blue-600 font-bold' : ''}`}
          >
            Pricing
          </button>
          
          {user ? (
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors ${activeView === 'dashboard' ? 'bg-slate-50 border-blue-500' : ''}`}
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon size={14} className="text-blue-600" />
              </div>
              <span className="text-slate-700">{user.email.split('@')[0]}</span>
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
