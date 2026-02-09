
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultDisplayProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, imageUrl, onReset }) => {
  const chartData = [
    { name: result.verdict, value: result.confidence },
    { name: 'Uncertainty', value: 100 - result.confidence },
  ];

  const colors = {
    'Real': { main: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', badge: 'AUTHENTIC' },
    'AI-Generated': { main: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', badge: 'SYNTHETIC' },
    'Inconclusive': { main: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500', badge: 'INCONCLUSIVE' }
  };

  const currentTheme = colors[result.verdict] || colors['Inconclusive'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Verdict Banner */}
      <div className={`w-full py-4 px-6 rounded-2xl border ${currentTheme.bg} ${currentTheme.border} flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${currentTheme.main === '#22c55e' ? 'bg-green-500' : currentTheme.main === '#ef4444' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}></div>
          <h2 className="text-lg font-bold tracking-tight text-white uppercase">
            Forensic Analysis Complete
          </h2>
        </div>
        <span className="text-xs mono text-slate-500 uppercase tracking-tighter">Report ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Image Preview with Forensic Overlay */}
        <div className="relative group rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl sticky top-24">
          <img src={imageUrl} alt="Analyzed" className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 group-hover:scale-105" />
          
          {/* Diagnostic Overlay Stamp */}
          <div className="absolute top-6 right-6 pointer-events-none">
             <div className={`px-6 py-2 border-4 ${currentTheme.text} ${currentTheme.main === '#22c55e' ? 'border-green-500/40' : currentTheme.main === '#ef4444' ? 'border-red-500/40' : 'border-yellow-500/40'} rounded-lg rotate-12 bg-slate-900/40 backdrop-blur-sm shadow-xl`}>
                <span className="text-3xl font-black uppercase tracking-tighter italic opacity-80">{currentTheme.badge}</span>
             </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-slate-900/95 backdrop-blur-md p-4 flex justify-between items-center border-t border-slate-700">
            <div className="flex flex-col">
              <span className="text-[10px] mono uppercase tracking-widest text-slate-500">Source Verification</span>
              <span className="text-xs text-slate-300 font-medium">JPEG Bitstream Analyzed</span>
            </div>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Scan New Image</span>
            </button>
          </div>
        </div>

        {/* Data Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Primary Verdict</h2>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-5xl font-black ${currentTheme.text} tracking-tighter`}>
                    {result.verdict === 'AI-Generated' ? 'Synthetic' : result.verdict}
                  </p>
                </div>
                <p className="mt-2 text-slate-400 text-sm font-medium">
                  Result based on {result.confidence}% probability score.
                </p>
              </div>
              <div className="h-28 w-28 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={48}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill={currentTheme.main} />
                      <Cell fill="#1e293b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-xs font-bold text-white">{result.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1 tracking-wider">Lighting Vector</span>
                  <span className="text-sm font-semibold text-white truncate block">{result.metadata?.lightingConsistency || 'Undetermined'}</span>
               </div>
               <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1 tracking-wider">Dermal Texture</span>
                  <span className="text-sm font-semibold text-white truncate block">{result.metadata?.textureQuality || 'Standard'}</span>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                 <div className="h-1 w-6 bg-blue-500 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Diagnostic Details</h3>
              </div>
              <ul className="space-y-3">
                {result.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm bg-slate-800/20 p-3 rounded-xl border border-slate-800/40">
                    <svg className={`w-5 h-5 shrink-0 ${result.verdict === 'Real' ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Technical Summary
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-blue-400 text-xs leading-relaxed mono">
                {result.technicalAnalysis}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Detected Anomaly Tags</h4>
            <div className="flex flex-wrap gap-2">
              {result.metadata?.artifactsDetected.map((artifact, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 uppercase tracking-tight">
                  {artifact}
                </span>
              ))}
              {(!result.metadata?.artifactsDetected || result.metadata.artifactsDetected.length === 0) && (
                <span className="text-slate-600 italic text-xs">Clear scan: No significant artifacts detected.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
