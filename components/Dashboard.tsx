
import React from 'react';
import { 
  LogOut, 
  History, 
  CreditCard, 
  Settings, 
  Download, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { User, OptimizationResult } from '../types';
import { exportToDocx } from '../utils/docxExporter';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'how-it-works' | 'pricing' | 'auth' | 'dashboard') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const quotaPercent = (user.revisionsUsed / user.revisionsTotal) * 100;
  const isDanger = quotaPercent > 80;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownloadFromHistory = (result: OptimizationResult) => {
    exportToDocx(result);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Dashboard</h1>
          <p className="text-slate-500">Manage your account, view history and upgrade your plan.</p>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{user.email.split('@')[0]}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500 uppercase tracking-widest text-[10px]">Current Plan</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">{user.plan}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-semibold">Usage Quota</span>
                <span className="text-slate-500">{user.revisionsUsed} / {user.revisionsTotal}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${isDanger ? 'bg-orange-500' : 'bg-blue-600'}`} 
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                You have {user.revisionsTotal - user.revisionsUsed} revisions remaining.
              </p>
            </div>

            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              Renew or Upgrade Plan
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* History / Activity */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              Revision History
            </h3>
            <span className="text-xs text-slate-400 font-medium">{user.history.length} total items</span>
          </div>

          <div className="flex-grow">
            {user.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                  <Briefcase size={24} />
                </div>
                <h4 className="font-semibold text-slate-900">No revisions yet</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Your tailored resumes will appear here once you optimize them.
                </p>
                <button 
                  onClick={() => onNavigate('home')}
                  className="mt-6 text-blue-600 font-bold text-sm hover:underline"
                >
                  Start your first revision
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {user.history.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">Revised Resume #{item.id}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-black">+{item.optimizedScore - item.initialScore}%</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar size={12} />
                            {formatDate(item.date)}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400">{item.optimizedScore}/100 Match Score</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadFromHistory(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Download DOCX"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            Payment Method
          </h3>
          
          {user.paymentMethod ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-400 italic">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">•••• •••• •••• {user.paymentMethod.last4}</p>
                  <p className="text-xs text-slate-500">Exp: 12/28</p>
                </div>
              </div>
              <button className="text-xs text-blue-600 font-bold hover:underline">Edit</button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-3">
              <p className="text-sm text-slate-500">No payment method on file</p>
              <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                Add Card
              </button>
            </div>
          )}
        </div>

        {/* Account Security */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            Account Security
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">Two-Factor Auth</p>
                <p className="text-xs text-slate-400">Keep your account secure</p>
              </div>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">Update Password</p>
                <p className="text-xs text-slate-400">Last changed 3 months ago</p>
              </div>
              <button className="text-xs text-blue-600 font-bold hover:underline">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
