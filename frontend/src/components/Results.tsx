import React from 'react';
import type { SimulationComparison } from '../types';
import { Activity, Gauge, ShieldAlert, Zap, TrendingDown, TrendingUp, Award, Layers } from 'lucide-react';

interface ResultsProps {
  comparison: SimulationComparison;
}

export const Results: React.FC<ResultsProps> = ({ comparison }) => {
  const { standardScan: std, priorityScan: prio, insights } = comparison;

  const statCards = [
    {
      title: 'Total Head Movement',
      unit: 'Cylinders',
      stdVal: std.totalHeadMovement,
      prioVal: prio.totalHeadMovement,
      diff: insights.headMovementDiff,
      percent: insights.headMovementPercent,
      icon: Gauge,
      color: 'text-cyan-400',
      isImprovement: insights.headMovementDiff <= 0
    },
    {
      title: 'Average Waiting Time',
      unit: 'Seek Ticks',
      stdVal: std.averageWaitTime,
      prioVal: prio.averageWaitTime,
      diff: insights.avgWaitDiff,
      percent: insights.avgWaitPercent,
      icon: Activity,
      color: 'text-indigo-400',
      isImprovement: insights.avgWaitDiff <= 0
    },
    {
      title: 'Maximum Waiting Time',
      unit: 'Seek Ticks',
      stdVal: std.maxWaitTime,
      prioVal: prio.maxWaitTime,
      diff: insights.maxWaitDiff,
      percent: insights.maxWaitPercent,
      icon: ShieldAlert,
      color: 'text-purple-400',
      isImprovement: insights.maxWaitDiff <= 0
    },
    {
      title: 'Starvation Risk Score',
      unit: 'Percentage',
      stdVal: `${std.starvationRiskScore}%`,
      prioVal: `${prio.starvationRiskScore}%`,
      diff: prio.starvationRiskScore - std.starvationRiskScore,
      percent: prio.starvationRiskScore - std.starvationRiskScore,
      icon: Zap,
      color: 'text-amber-400',
      isImprovement: prio.starvationRiskScore <= std.starvationRiskScore
    }
  ];

  return (
    <section id="analytics" className="py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>BENCHMARK RESULTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Performance Analytics Overview
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Empirical runtime performance metrics comparing standard elevator scan against priority burst-throttling.
          </p>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel p-6 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-400 font-medium">{card.title}</span>
                    <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white font-mono">{card.prioVal}</span>
                      <span className="text-xs text-slate-400 font-mono">{card.unit}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Standard SCAN: <span className="font-mono text-slate-300">{card.stdVal}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Net Delta</span>
                  <div className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    card.isImprovement ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {card.isImprovement ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    <span>{card.percent > 0 ? `+${card.percent}%` : `${card.percent}%`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Secondary Highlights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl glass-panel p-4 border border-purple-500/30 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{prio.throttlingEvents}</p>
              <p className="text-xs text-slate-400">Burst-Throttling Interventions</p>
            </div>
          </div>

          <div className="rounded-xl glass-panel p-4 border border-cyan-500/30 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{prio.prioritySatisfactionScore}%</p>
              <p className="text-xs text-slate-400">High-Priority Satisfaction Score</p>
            </div>
          </div>

          <div className="rounded-xl glass-panel p-4 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{prio.directionChanges}</p>
              <p className="text-xs text-slate-400">Elevator Sweep Direction Reversals</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
