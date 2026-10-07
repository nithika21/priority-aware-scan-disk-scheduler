import React from 'react';
import type { SimulationComparison } from '../types';
import { Award } from 'lucide-react';

interface ComparisonTableProps {
  comparison: SimulationComparison;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparison }) => {
  const { standardScan: std, priorityScan: prio } = comparison;

  const rows = [
    {
      metric: 'Total Head Movement (Cylinders)',
      stdVal: std.totalHeadMovement,
      prioVal: prio.totalHeadMovement,
      diff: `${prio.totalHeadMovement - std.totalHeadMovement > 0 ? '+' : ''}${prio.totalHeadMovement - std.totalHeadMovement} cyl`,
      winner: prio.totalHeadMovement <= std.totalHeadMovement ? 'Priority-Aware' : 'Standard SCAN',
      unit: 'cyl'
    },
    {
      metric: 'Average Waiting Time',
      stdVal: `${std.averageWaitTime} ticks`,
      prioVal: `${prio.averageWaitTime} ticks`,
      diff: `${Math.round((prio.averageWaitTime - std.averageWaitTime) * 10) / 10} ticks`,
      winner: prio.averageWaitTime <= std.averageWaitTime ? 'Priority-Aware' : 'Standard SCAN',
      unit: 'ticks'
    },
    {
      metric: 'Maximum Waiting Time',
      stdVal: `${std.maxWaitTime} ticks (${std.maxWaitRequestId})`,
      prioVal: `${prio.maxWaitTime} ticks (${prio.maxWaitRequestId})`,
      diff: `${prio.maxWaitTime - std.maxWaitTime} ticks`,
      winner: prio.maxWaitTime <= std.maxWaitTime ? 'Priority-Aware' : 'Standard SCAN',
      unit: 'ticks'
    },
    {
      metric: 'Average Seek Distance',
      stdVal: `${std.averageSeekDistance} cyl`,
      prioVal: `${prio.averageSeekDistance} cyl`,
      diff: `${Math.round((prio.averageSeekDistance - std.averageSeekDistance) * 10) / 10} cyl`,
      winner: prio.averageSeekDistance <= std.averageSeekDistance ? 'Priority-Aware' : 'Standard SCAN',
      unit: 'cyl'
    },
    {
      metric: 'Direction Changes (Reversals)',
      stdVal: std.directionChanges,
      prioVal: prio.directionChanges,
      diff: `${prio.directionChanges - std.directionChanges}`,
      winner: prio.directionChanges <= std.directionChanges ? 'Priority-Aware' : 'Standard SCAN',
      unit: 'count'
    },
    {
      metric: 'Starvation Risk Score',
      stdVal: `${std.starvationRiskScore}%`,
      prioVal: `${prio.starvationRiskScore}%`,
      diff: `${prio.starvationRiskScore - std.starvationRiskScore}%`,
      winner: prio.starvationRiskScore <= std.starvationRiskScore ? 'Priority-Aware' : 'Standard SCAN',
      unit: '%'
    },
    {
      metric: 'Priority Satisfaction Score',
      stdVal: `${std.prioritySatisfactionScore}%`,
      prioVal: `${prio.prioritySatisfactionScore}%`,
      diff: `${prio.prioritySatisfactionScore - std.prioritySatisfactionScore}%`,
      winner: prio.prioritySatisfactionScore >= std.prioritySatisfactionScore ? 'Priority-Aware' : 'Standard SCAN',
      unit: '%'
    }
  ];

  return (
    <section className="py-12 relative bg-[#053229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800/80">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                Side-by-Side Algorithmic Comparison
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quantitative metrics computed dynamically across identical request sequences.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono bg-cyan-950/60 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-800/50">
              EQUAL DATASET VERIFIED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Standard SCAN</th>
                  <th className="py-3 px-4 text-purple-300">Priority-Aware SCAN</th>
                  <th className="py-3 px-4">Difference</th>
                  <th className="py-3 px-4 text-right">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {row.metric}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {row.stdVal}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-purple-300 bg-purple-500/5">
                      {row.prioVal}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {row.diff}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        row.winner === 'Priority-Aware'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        <Award className="w-3 h-3 text-cyan-400" />
                        <span>{row.winner}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </section>
  );
};
