import React, { useState } from 'react';
import type { SimulationComparison } from '../types';
import { ListOrdered, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

interface RequestAnalysisProps {
  comparison: SimulationComparison;
}

export const RequestAnalysis: React.FC<RequestAnalysisProps> = ({ comparison }) => {
  const [activeTab, setActiveTab] = useState<'PRIORITY' | 'STANDARD'>('PRIORITY');

  const { standardScan: std, priorityScan: prio } = comparison;
  const activeResult = activeTab === 'PRIORITY' ? prio : std;

  return (
    <section id="request-analysis" className="py-20 relative bg-[#053229] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-3">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>REQUEST LEVEL DIAGNOSTICS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Execution Sequence & Starvation Analysis
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Detailed breakdown of service order, seek penalties, wait times, and throttling interventions.
            </p>
          </div>

          {/* Algorithm Selector Switch */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('PRIORITY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'PRIORITY'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Priority-Aware SCAN + Burst
            </button>
            <button
              onClick={() => setActiveTab('STANDARD')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'STANDARD'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Standard SCAN
            </button>
          </div>
        </div>

        {/* Starvation Analysis Callout Card */}
        <div className="mb-8 rounded-2xl glass-panel-purple p-6 border border-purple-500/30">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Starvation Risk Diagnostic</h3>
                <p className="text-xs text-purple-300/80">Realtime workload latency evaluation</p>
              </div>
            </div>

            <span className="text-xs font-mono bg-purple-950/80 text-purple-300 px-3 py-1 rounded-full border border-purple-800/50">
              {activeResult.algorithmName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 font-medium">Max Waiting Request</p>
              <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{activeResult.maxWaitRequestId}</p>
              <p className="text-[11px] text-slate-400 mt-1">Highest individual delay</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 font-medium">Max Wait Latency</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">{activeResult.maxWaitTime} <span className="text-xs font-sans text-slate-400">ticks</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Cumulative seek distance elapsed</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 font-medium">Requests At Starvation Risk</p>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{activeResult.starvedRequestsCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Exceeding 1.5x average wait time</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 font-medium">Burst Throttle Interventions</p>
              <p className="text-2xl font-bold text-purple-400 font-mono mt-1">{activeResult.throttlingEvents}</p>
              <p className="text-[11px] text-slate-400 mt-1">Low-priority protections triggered</p>
            </div>
          </div>
        </div>

        {/* Detailed Execution Table */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-lg font-bold text-white">Execution Sequence Details</h3>
            <span className="text-xs font-mono text-slate-400">
              Sorted by Execution Order Index
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Cylinder</th>
                  <th className="py-3 px-4">Priority Level</th>
                  <th className="py-3 px-4">Wait Time</th>
                  <th className="py-3 px-4">Seek Delta</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {activeResult.requestDetails.map((detail, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{detail.serviceOrderIndex}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {detail.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-white">
                      Cyl {detail.cylinder}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${detail.priority === 'HIGH' ? 'badge-high' : detail.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                        }`}>
                        {detail.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {detail.waitTime} ticks
                    </td>

                    <td className="py-3.5 px-4 font-mono text-purple-300">
                      +{detail.seekDistance} cyl
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {detail.status === 'THROTTLED' ? (
                        <span className="inline-flex items-center gap-1 badge-throttled px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <Zap className="w-3 h-3 text-purple-300" />
                          <span>Throttled Service</span>
                        </span>
                      ) : detail.waitTime > activeResult.averageWaitTime * 1.5 ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>High Wait Delay</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Serviced Normal</span>
                        </span>
                      )}
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
