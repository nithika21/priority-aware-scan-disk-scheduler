import React from 'react';
import type { SimulationComparison } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DynamicInsightsProps {
  comparison: SimulationComparison;
}

export const DynamicInsights: React.FC<DynamicInsightsProps> = ({ comparison }) => {
  const { insights } = comparison;

  return (
    <section className="py-12 relative bg-[#053229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl glass-panel-glow p-8 border border-cyan-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Dynamic Algorithmic Insight
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automatically synthesized from current simulation benchmark execution
                </p>
              </div>
            </div>

            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-1.5 rounded-full border border-cyan-800/50">
              REALTIME DYNAMIC EVALUATION
            </span>
          </div>

          {/* Main Headline text */}
          <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 mb-6">
            <p className="text-base sm:text-lg font-bold text-cyan-300 leading-relaxed">
              "{insights.headline}"
            </p>
          </div>

          {/* Key Takeaways list */}
          <div className="space-y-3 text-left">
            {insights.details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
