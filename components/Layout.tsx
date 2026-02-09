
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V22" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22a8 8 0 110-16 8 8 0 010 16z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              VeriSight<span className="text-blue-500">Forensics</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Analyzer</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Methodology</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">API</a>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-700">
              Enterprise
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VeriSight Forensics. Powered by Gemini 3 Neural Vision.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
