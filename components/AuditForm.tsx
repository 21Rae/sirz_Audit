import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    if (!url.includes('.')) {
        setError('Please enter a valid domain (e.g., mystore.com)');
        return;
    }
    setError('');
    // Basic normalization
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
    }
    onSubmit(cleanUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white rounded-xl shadow-xl">
          <div className="pl-4 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            placeholder="enter-your-store.myshopify.com"
            className="w-full py-5 px-4 text-lg text-slate-700 bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mr-2 py-3 px-6 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-3 text-red-500 text-sm text-center font-medium animate-pulse">
          {error}
        </p>
      )}
      <p className="mt-4 text-center text-slate-400 text-sm">
        Powered by Gemini 2.5 • Checks SEO, UX, Performance & More
      </p>
    </div>
  );
};