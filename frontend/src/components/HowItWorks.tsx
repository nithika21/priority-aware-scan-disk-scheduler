import React from 'react';
import { Cpu, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 relative bg-slate-950/80 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>ALGORITHMIC EXECUTION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Under the Hood: Flowchart Architecture
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            How Priority-Aware SCAN evaluates request urgencies and enforces adaptive burst-throttling inside the elevator loop.
          </p>
        </div>

        {/* Visual Glassmorphic Flowchart Diagram */}
        <div className="rounded-2xl glass-panel p-8 border border-slate-800/80 mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
            
            {/* Step 1 */}
            <div className="rounded-xl bg-slate-900/90 p-4 border border-cyan-500/30 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">STEP 1</span>
              <h4 className="text-sm font-bold text-white">Input Request Stream</h4>
              <p className="text-[11px] text-slate-400">Cylinder & Priority (HIGH/MED/LOW)</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRight className="w-6 h-6 text-cyan-500" />
            </div>

            {/* Step 2 */}
            <div className="rounded-xl bg-slate-900/90 p-4 border border-indigo-500/30 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">STEP 2</span>
              <h4 className="text-sm font-bold text-white">SCAN Direction Sweep</h4>
              <p className="text-[11px] text-slate-400">Filter candidate cylinders along head trajectory</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRight className="w-6 h-6 text-indigo-500" />
            </div>

            {/* Step 3 */}
            <div className="rounded-xl bg-purple-950/60 p-4 border border-purple-500/40 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-purple-300 bg-purple-900 px-2 py-0.5 rounded">STEP 3</span>
              <h4 className="text-sm font-bold text-white">Burst-Throttling Check</h4>
              <p className="text-[11px] text-purple-300/80">Has High Burst Count ≥ Limit?</p>
            </div>

          </div>

          {/* Decision Branches */}
          <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Branch A: Burst Limit Exceeded */}
            <div className="rounded-xl bg-amber-500/10 p-5 border border-amber-500/30 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Zap className="w-4 h-4" />
                <span>BRANCH A: BURST LIMIT EXCEEDED (Burst ≥ Limit)</span>
              </div>
              <p className="text-xs text-slate-300">
                The scheduler triggers a <strong>THROTTLE EVENT</strong>. If an eligible lower-priority (MEDIUM/LOW) request exists in direction, service it immediately and reset the high-priority burst counter to 0.
              </p>
            </div>

            {/* Branch B: Normal Priority Selection */}
            <div className="rounded-xl bg-cyan-500/10 p-5 border border-cyan-500/30 text-left space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>BRANCH B: NORMAL PRIORITY SELECTION (Burst &lt; Limit)</span>
              </div>
              <p className="text-xs text-slate-300">
                Service the highest priority candidate along current sweep direction. If HIGH priority is selected, increment the high-priority burst counter.
              </p>
            </div>

          </div>

        </div>

        {/* 4 Feature Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="rounded-xl bg-slate-900/60 p-5 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">1. Priority Mapping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Requests are classified into HIGH, MEDIUM, and LOW priority tiers to prioritize urgent disk I/O requests.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 p-5 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">2. Elevator Sweep Preservation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains SCAN's directional disk movement to prevent chaotic head thrashing and excessive seek times.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 p-5 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">3. Bounded Starvation Control</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Burst limit forces periodic servicing of lower-priority requests so no request waits indefinitely.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 p-5 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">4. Empirical Measurement</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Metrics are calculated dynamically for both algorithms from identical input datasets without hardcoded values.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
