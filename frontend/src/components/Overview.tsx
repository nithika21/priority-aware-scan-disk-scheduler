import React from 'react';
import { AlertTriangle, ShieldCheck, Zap, Cpu } from 'lucide-react';

export const Overview: React.FC = () => {
  const cards = [
    {
      title: 'Problem: Low-Priority Starvation',
      subtitle: 'Standard SCAN Vulnerability',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Traditional elevator algorithm sweeps cylinders directionally without regard to task criticality. Low-priority requests can be indefinitely delayed when heavy workloads cluster near one disk boundary.',
      metric: 'High Wait Spikes',
      metricValue: 'Up to 3.8x Avg'
    },
    {
      title: 'Solution: Priority-Aware Elevator',
      subtitle: 'Spatial + Urgency Balance',
      icon: ShieldCheck,
      iconColor: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      description: 'Integrates request priority tiers (HIGH, MEDIUM, LOW) into direction selection. High-priority requests are serviced upfront without incurring erratic head thrashing or full disk resets.',
      metric: 'Priority Satisfaction',
      metricValue: '90% - 100%'
    },
    {
      title: 'Control: Adaptive Burst-Throttling',
      subtitle: 'Bounded Consecutive Execution',
      icon: Zap,
      iconColor: 'text-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description: 'Enforces a strict upper bound on consecutive high-priority services. When the burst threshold is reached, the scheduler yields control to waiting lower-priority tasks, ensuring fairness.',
      metric: 'Starvation Index',
      metricValue: 'Near Zero'
    }
  ];

  return (
    <section id="overview" className="py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ALGORITHMIC ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Enhance Standard SCAN?
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Standard SCAN provides predictable disk head movement, but lacks priority awareness. 
            Here is how Priority-Aware SCAN with Burst-Throttling bridges performance and fairness.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl glass-panel p-6 border border-slate-800/80 hover:border-slate-700/90 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${card.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.subtitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{card.metric}</span>
                  <span className="text-sm font-bold text-white font-mono">{card.metricValue}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
