
import React, { useState, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult, AppStatus, HistoryItem } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - focusing on JPEG as requested
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setError("Please select a valid JPEG image file (.jpg or .jpeg).");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setStatus(AppStatus.LOADING);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setCurrentImage(base64);

      try {
        const analysis = await analyzeImage(base64, file.type);
        setResult(analysis);
        setStatus(AppStatus.SUCCESS);
        
        // Add to history
        const newHistoryItem: HistoryItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          imageUrl: base64,
          result: analysis
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to analyze image. Please check your connection and try again.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setStatus(AppStatus.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setCurrentImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileUpload({ target: fileInputRef.current } as any);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                Neural Image Forensics
              </span>
              <h2 className="text-5xl font-extrabold text-white tracking-tight">
                Identify AI Generated Content with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Precision</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Upload JPEG photos from your device to detect hidden digital artifacts, biological inconsistencies, and environmental anomalies.
              </p>
            </div>

            {/* Upload Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative group bg-slate-900 border-2 border-dashed transition-all cursor-pointer rounded-3xl p-12 flex flex-col items-center justify-center space-y-6 ${error ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                <svg className="w-10 h-10 text-slate-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Click or drag and drop JPEG image</p>
                <p className="text-slate-500 text-sm mt-1">Accepts standard .jpg and .jpeg files from your device</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg, image/jpg"
                className="hidden"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center justify-center space-x-2 animate-in slide-in-from-top-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Proof Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="text-left space-y-2">
                <h4 className="text-white font-bold">GAN Detection</h4>
                <p className="text-slate-500 text-sm">Deep analysis of frequency domain inconsistencies common in Generative Adversarial Networks.</p>
              </div>
              <div className="text-left space-y-2">
                <h4 className="text-white font-bold">Biological Audit</h4>
                <p className="text-slate-500 text-sm">Validates anatomical structural integrity including iris patterns and dermal texture.</p>
              </div>
              <div className="text-left space-y-2">
                <h4 className="text-white font-bold">Physics Validation</h4>
                <p className="text-slate-500 text-sm">Cross-references shadows, light source vectors, and refraction indices for authenticity.</p>
              </div>
            </div>
          </div>
        ) : status === AppStatus.LOADING ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              {currentImage && (
                <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-slate-700">
                  <img src={currentImage} className="w-full h-full object-cover opacity-50 grayscale" alt="Processing" />
                  <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
                </div>
              )}
              <div className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite] z-10"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Deconstructing Pixels</h3>
              <p className="text-slate-400 animate-pulse">Running advanced forensic heuristics...</p>
            </div>
            <style>{`
              @keyframes scan {
                0% { top: 0; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}</style>
          </div>
        ) : (
          <ResultDisplay 
            result={result!} 
            imageUrl={currentImage!} 
            onReset={reset}
          />
        )}

        {/* Recent History */}
        {history.length > 0 && status === AppStatus.IDLE && (
          <div className="mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Recent Inspections</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setCurrentImage(item.imageUrl);
                    setResult(item.result);
                    setStatus(AppStatus.SUCCESS);
                  }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-blue-500/50 transition-all"
                >
                  <img src={item.imageUrl} className="w-full h-40 object-cover" alt="History" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.result.verdict === 'Real' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {item.result.verdict}
                    </span>
                    <span className="text-white text-xs mt-2 font-mono">{item.result.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
