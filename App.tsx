import React, { useState } from 'react';
import { AuditForm } from './components/AuditForm';
import { Dashboard } from './components/Dashboard';
import { AuditStatus, AuditResult } from './types';
import { runStoreAudit } from './services/gemini';
import { Zap, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AuditStatus>(AuditStatus.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async (url: string) => {
    setStatus(AuditStatus.ANALYZING);
    try {
      const auditData = await runStoreAudit(url);
      setResult(auditData);
      setStatus(AuditStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AuditStatus.ERROR);
      // In a real app, we'd show a toast or error message here
      alert("Failed to audit store. Please ensure the URL is correct and try again.");
      setStatus(AuditStatus.IDLE);
    }
  };

  const resetAudit = () => {
    setStatus(AuditStatus.IDLE);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Shopify<span className="text-emerald-600">Auditor</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
             <span className="hidden sm:inline-flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                Powered by Gemini 2.5
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {status === AuditStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Analyze your store's <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Hidden Potential
                </span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                Get an instant, AI-powered audit of your Shopify store. 
                We analyze SEO, UX, and Performance to help you convert more visitors.
              </p>
            </div>
            
            <div className="w-full">
              <AuditForm onSubmit={handleAudit} isLoading={false} />
            </div>

            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl opacity-70">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold text-slate-200">01</span>
                    <h3 className="font-bold text-slate-700">Enter URL</h3>
                    <p className="text-sm text-slate-500">Paste your Shopify store link</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold text-slate-200">02</span>
                    <h3 className="font-bold text-slate-700">AI Analysis</h3>
                    <p className="text-sm text-slate-500">Gemini scans structure & content</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold text-slate-200">03</span>
                    <h3 className="font-bold text-slate-700">Get Results</h3>
                    <p className="text-sm text-slate-500">Actionable insights to grow</p>
                </div>
            </div>
          </div>
        )}

        {status === AuditStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Zap className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Analyzing Store...</h2>
                <p className="text-slate-500">Gathering SEO metrics, checking UX patterns, and comparing competitors.</p>
            </div>
          </div>
        )}

        {status === AuditStatus.COMPLETE && result && (
          <Dashboard data={result} onReset={resetAudit} />
        )}

      </main>
    </div>
  );
};

export default App;