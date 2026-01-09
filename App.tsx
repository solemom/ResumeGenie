
import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, AlertCircle, Download, RefreshCw, BarChart3, ArrowRight, Mail, User as UserIcon, LogIn, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import JDInput from './components/JDInput';
import ResultsDashboard from './components/ResultsDashboard';
import ResumeComparer from './components/ResumeComparer';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { AppState, OptimizationResult, FileData, User, PlanType } from './types';
import { parseFile } from './utils/fileParser';
import { optimizeResume } from './services/geminiService';
import { exportToDocx } from './utils/docxExporter';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'how-it-works' | 'pricing' | 'auth' | 'dashboard'>('home');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<{show: boolean, plan: string}>({ show: false, plan: '' });
  
  // User & Auth State
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('rg_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('rg_user', JSON.stringify(userData));
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rg_user');
    setView('home');
  };

  const handleFileUpload = async (file: File) => {
    setState(AppState.PARSING);
    setError(null);
    try {
      const parsedData = await parseFile(file);
      setResumeFile(parsedData);
      setState(AppState.IDLE);
    } catch (err) {
      setError('Failed to parse file. Please try a different format or paste text directly.');
      setState(AppState.ERROR);
    }
  };

  const handlePlanSelect = (planName: PlanType) => {
    if (!user) {
      setView('auth');
      return;
    }

    // Logic for quota updates
    let newTotal = user.revisionsTotal;
    if (planName === 'Basic') newTotal = 5;
    if (planName === 'Advanced') newTotal = 20;

    const updatedUser: User = {
      ...user,
      plan: planName,
      revisionsUsed: 0, // Reset usage on purchase/top-up
      revisionsTotal: newTotal,
      paymentMethod: user.paymentMethod || { type: 'Mock', last4: '4242' }
    };

    setUser(updatedUser);
    localStorage.setItem('rg_user', JSON.stringify(updatedUser));
    setShowUpgradeModal({ show: true, plan: planName });
  };

  const handleOptimize = async () => {
    if (!resumeFile || !jobDescription || !user) return;

    // Check limits
    if (user.revisionsUsed >= user.revisionsTotal) {
      setView('pricing');
      return;
    }

    setState(AppState.OPTIMIZING);
    setError(null);
    try {
      const optimization = await optimizeResume(resumeFile.content, jobDescription);
      
      // Add metadata
      const finalResult: OptimizationResult = {
        ...optimization,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };

      setResult(finalResult);

      // Persist progress
      const updatedUser = {
        ...user,
        revisionsUsed: user.revisionsUsed + 1,
        history: [finalResult, ...user.history]
      };
      setUser(updatedUser);
      localStorage.setItem('rg_user', JSON.stringify(updatedUser));

      setState(AppState.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Optimization failed. Please check your API key and input.');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setResumeFile(null);
    setJobDescription('');
    setResult(null);
    setError(null);
  };

  const handleDownload = () => {
    if (result) {
      exportToDocx(result);
    }
  };

  const renderContent = () => {
    if (view === 'how-it-works') return <HowItWorks onBack={() => setView('home')} />;
    if (view === 'pricing') return <Pricing onSelect={handlePlanSelect} user={user} />;
    if (view === 'auth') return <AuthForm onAuthSuccess={handleAuthSuccess} onBack={() => setView('home')} />;
    if (view === 'dashboard') return <Dashboard user={user!} onLogout={handleLogout} onNavigate={setView} />;

    if (state === AppState.IDLE || state === AppState.PARSING || state === AppState.ERROR) {
      const isGuest = !user;
      const isQuotaExhausted = user && user.revisionsUsed >= user.revisionsTotal;
      
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Land your dream job with <span className="text-blue-600">AI precision</span>.
            </h1>
            <p className="text-lg text-slate-600">
              Upload your resume and the target job description. Our AI will craft the perfect version to beat the ATS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center space-x-2 text-blue-600 font-semibold mb-4">
                <FileText size={20} />
                <span>Step 1: Your Resume</span>
              </div>
              <div className="flex-grow flex flex-col">
                <FileUpload onUpload={handleFileUpload} currentFile={resumeFile} isParsing={state === AppState.PARSING} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center space-x-2 text-blue-600 font-semibold mb-4">
                <ChevronRight size={20} />
                <span>Step 2: Job Description</span>
              </div>
              <div className="flex-grow flex flex-col">
                <JDInput value={jobDescription} onChange={setJobDescription} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start space-x-3">
              <AlertCircle size={20} className="mt-0.5" />
              <div>
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm opacity-90">{error}</p>
                <p className="text-sm mt-1">
                  Need help? Contact us at <a href="mailto:contact@offerai.co" className="underline font-bold">contact@offerai.co</a>
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            {isGuest ? (
               <button
                 onClick={() => setView('auth')}
                 className="flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200/50 hover:scale-105 active:scale-95"
               >
                 <LogIn size={20} />
                 <span>Sign up to get started for free</span>
               </button>
            ) : isQuotaExhausted ? (
              <button
                onClick={() => setView('pricing')}
                className="flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-purple-200/50 hover:scale-105 active:scale-95"
              >
                <Star size={20} />
                <span>Upgrade your plan</span>
              </button>
            ) : (
              <button
                onClick={handleOptimize}
                disabled={!resumeFile || !jobDescription || state === AppState.PARSING}
                className={`
                  flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all
                  ${!resumeFile || !jobDescription || state === AppState.PARSING
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'}
                `}
              >
                <span>Optimize Resume</span>
                <ArrowRight size={20} />
              </button>
            )}

            {!isGuest && isQuotaExhausted && (
              <p className="text-sm text-slate-500 flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm animate-bounce">
                <ArrowUpRight size={14} className="text-blue-500" />
                Quota exhausted. Upgrade to unlock more revisions!
              </p>
            )}
          </div>
        </div>
      );
    }

    if (state === AppState.OPTIMIZING) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-pulse">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Optimizing Your Resume...</h2>
            <p className="text-slate-500">Comparing skills, rephrasing experiences, and calculating match scores.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        {result && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-4 z-10 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Analysis Complete!</h2>
                <p className="text-slate-600 text-sm">Review your improvements below and download the final DOCX.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white transition-colors"
                >
                  <RefreshCw size={18} />
                  <span>Start Over</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 shadow-md transition-all active:scale-95"
                >
                  <Download size={18} />
                  <span>Download DOCX</span>
                </button>
              </div>
            </div>

            <ResultsDashboard result={result} />
            <ResumeComparer result={result} />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Header onNavigate={setView} activeView={view} user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderContent()}
      </main>

      {/* Upgrade Success Modal */}
      {showUpgradeModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Purchase Successful!</h3>
              <p className="text-slate-600">Your account has been upgraded to the <span className="font-bold text-blue-600">{showUpgradeModal.plan}</span> plan. Your revision quota has been refilled.</p>
            </div>
            <button 
              onClick={() => {
                setShowUpgradeModal({ show: false, plan: '' });
                setView('home');
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Great, let's get back to it!
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ResumeGenie Pro. Powered by Gemini.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:contact@offerai.co" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Mail size={16} />
              contact@offerai.co
            </a>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
