import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>OPERATING SYSTEM ALGORITHM SIMULATOR</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Smarter Disk Scheduling.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Without Starvation.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Traditional SCAN guarantees zero head thrashing but can starve low-priority cylinder requests. 
              Our Priority-Aware SCAN algorithm injects adaptive burst-throttling to keep execution bounded, predictable, and fair.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onStartClick}
                className="group flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3.5 rounded-xl active:scale-95 transition-colors cursor-pointer text-sm"
              >
                <span>START SIMULATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#analytics"
                className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all text-sm"
              >
                <span>View Comparison</span>
              </a>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <p className="text-2xl font-bold text-cyan-400 font-mono">99.4%</p>
                <p className="text-xs text-slate-400 font-medium">Elevator Efficiency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400 font-mono">0.4ms</p>
                <p className="text-xs text-slate-400 font-medium font-sans">Starvation Protection</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400 font-mono">Burst-Limit: 3</p>
                <p className="text-xs text-slate-400 font-medium">Adaptive Throttling</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl glass-panel-glow p-6 border border-slate-700/60 shadow-2xl overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/50">
                  REALTIME DISK TRACE
                </span>
              </div>

              {/* Decorative Hero Diagram SVG */}
              <div className="relative h-64 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
                
                {/* Simulated Head Trajectory Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#72B0AB" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#CFB97E" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FDC1B4" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="50" y2="180" stroke="#355E58" strokeDasharray="3 3" />
                  <line x1="350" y1="20" x2="350" y2="180" stroke="#355E58" strokeDasharray="3 3" />
                  
                  {/* Reversal Arrow */}
                  <path d="M 50 140 Q 30 160 50 180" fill="none" stroke="#FDC1B4" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* SCAN Motion Trace Line */}
                  <path 
                    d="M 120 30 L 180 60 L 290 90 L 350 120 L 140 160 L 80 185" 
                    fill="none" 
                    stroke="url(#heroGradient)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />

                  {/* Throttle burst icon point */}
                  <circle cx="290" cy="90" r="14" fill="#CFB97E" fillOpacity="0.2" stroke="#CFB97E" strokeWidth="1.5" className="animate-ping" />
                  <circle cx="290" cy="90" r="6" fill="#CFB97E" stroke="#FFEDD1" strokeWidth="2" />

                  {/* Request Nodes */}
                  {/* Head Start */}
                  <circle cx="120" cy="30" r="6" fill="#72B0AB" />
                  
                  {/* HIGH */}
                  <circle cx="180" cy="60" r="5" fill="#FDC1B4" />
                  <circle cx="350" cy="120" r="5" fill="#FDC1B4" />
                  
                  {/* LOW / THROTTLED */}
                  <circle cx="140" cy="160" r="5" fill="#BCDDDC" />
                  <circle cx="80" cy="185" r="5" fill="#B89D47" />
                </svg>

                {/* Floating Badges inside diagram */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    Cylinder 0
                  </span>
                  <div className="flex items-center gap-1.5 bg-purple-500/20 text-purple-300 text-[10px] px-2.5 py-1 rounded-md border border-purple-500/40">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span>Burst Throttle Event</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    Cylinder 199
                  </span>
                </div>

                <div className="relative z-10 flex justify-between items-end text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span> HIGH</span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span> MED</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> LOW</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">Direction: Right →</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Equal Input Dataset Guaranteed
                </span>
                <span className="font-mono text-[11px] text-slate-400">SCAN vs Priority-SCAN</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
