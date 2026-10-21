import React from 'react';
import { HardDrive, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-sm">Priority-Aware SCAN Optimizer</span>
              <p className="text-[11px] text-slate-500 font-mono">Operating Systems Disk Scheduling Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#simulator" className="hover:text-cyan-400 transition-colors">Simulator</a>
            <a href="#visualization" className="hover:text-cyan-400 transition-colors">Visualization</a>
            <a href="#analytics" className="hover:text-cyan-400 transition-colors">Analytics</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>

        </div>

        

      </div>
    </footer>
  );
};
