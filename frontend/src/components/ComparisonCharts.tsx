import React from 'react';
import type { SimulationComparison } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ComparisonChartsProps {
  comparison: SimulationComparison;
}

export const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ comparison }) => {
  const { standardScan: std, priorityScan: prio } = comparison;

  const chartConfigs = [
    {
      title: 'Total Head Movement (Cylinders)',
      subtitle: 'Lower is better for mechanical disk seek efficiency',
      data: [
        { name: 'Standard SCAN', value: std.totalHeadMovement, color: '#72B0AB' },
        { name: 'Priority SCAN', value: prio.totalHeadMovement, color: '#CFB97E' }
      ],
      unit: 'cyl'
    },
    {
      title: 'Average Waiting Time (Ticks)',
      subtitle: 'Average delay experienced per disk request',
      data: [
        { name: 'Standard SCAN', value: std.averageWaitTime, color: '#72B0AB' },
        { name: 'Priority SCAN', value: prio.averageWaitTime, color: '#CFB97E' }
      ],
      unit: 'ticks'
    },
    {
      title: 'Maximum Waiting Time (Ticks)',
      subtitle: 'Worst-case latency (starvation indicator)',
      data: [
        { name: 'Standard SCAN', value: std.maxWaitTime, color: '#72B0AB' },
        { name: 'Priority SCAN', value: prio.maxWaitTime, color: '#CFB97E' }
      ],
      unit: 'ticks'
    },
    {
      title: 'Average Seek Distance (Cylinders)',
      subtitle: 'Average jump between consecutive requests',
      data: [
        { name: 'Standard SCAN', value: std.averageSeekDistance, color: '#72B0AB' },
        { name: 'Priority SCAN', value: prio.averageSeekDistance, color: '#CFB97E' }
      ],
      unit: 'cyl'
    }
  ];

  return (
    <section className="py-12 relative bg-[#053229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white tracking-wide">
            Comparative Analytical Graphs
          </h3>
        </div>

        {/* 2x2 Grid of Dynamic Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {chartConfigs.map((cfg, idx) => (
            <div key={idx} className="rounded-2xl glass-panel p-6 border border-slate-800/80 flex flex-col justify-between">
              <div className="mb-4">
                <h4 className="text-base font-bold text-white tracking-wide">{cfg.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{cfg.subtitle}</p>
              </div>

              {/* Chart Canvas */}
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cfg.data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#355E58" />
                    <XAxis dataKey="name" stroke="#BCDDDC" fontSize={11} tickLine={false} />
                    <YAxis stroke="#BCDDDC" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B4038', borderColor: '#355E58', borderRadius: '12px', fontSize: '12px', color: '#FFEDD1' }}
                      formatter={(val: any) => [`${val} ${cfg.unit}`, 'Value']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                      {cfg.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
