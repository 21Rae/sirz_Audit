import React from 'react';
import { AuditResult } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Trophy, TrendingUp, Search } from 'lucide-react';

interface DashboardProps {
  data: AuditResult;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 break-all">{data.url}</h2>
          <p className="text-slate-500 mt-1">Audit completed just now</p>
        </div>
        <button 
          onClick={onReset}
          className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Run New Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Score Card */}
        <div className="col-span-1 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 w-full text-left">Health Score</h3>
            <ScoreGauge score={data.overallScore} />
            <p className="text-center text-slate-600 mt-4 text-sm leading-relaxed px-4">
              {data.summary}
            </p>
        </div>

        {/* Metrics Grid */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.metrics).map(([key, metric]) => (
            <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                  ${metric.status === 'good' ? 'bg-emerald-100 text-emerald-700' : 
                    metric.status === 'average' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'}`}>
                  {metric.status}
                </span>
                <span className="font-mono font-bold text-slate-900">{metric.score}/100</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{metric.name}</h4>
              <p className="text-sm text-slate-500">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Priority Actions
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recommendations.length > 0 ? (
              data.recommendations.map((rec, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border
                      ${rec.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                        rec.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-400 uppercase">{rec.category}</span>
                  </div>
                  <h5 className="font-semibold text-slate-800 mb-1">{rec.issue}</h5>
                  <p className="text-sm text-slate-600">{rec.fix}</p>
                </div>
              ))
            ) : (
               <div className="p-8 text-center text-slate-500">
                 No major issues found! Great job.
               </div>
            )}
          </div>
        </div>

        {/* Strengths & Competitors */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-500" />
                Key Strengths
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {data.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Market Context
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">Competitors or similar stores identified during research:</p>
              <div className="flex flex-wrap gap-2">
                {data.competitors.map((comp, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    
      {/* Sources Footer */}
      {data.sources && data.sources.length > 0 && (
         <div className="mt-8 border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> Research Sources
            </h4>
            <div className="flex flex-wrap gap-4">
                {data.sources.map((source, idx) => (
                    <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                        {source.title} <ExternalLink className="w-3 h-3" />
                    </a>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};