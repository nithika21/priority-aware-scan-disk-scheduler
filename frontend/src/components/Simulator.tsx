import React, { useState } from 'react';
import type { SimulationParams, DiskRequest, Priority } from '../types';
import { PRESET_DATASETS } from '../utils/presetData';
import { validateSimulationInputs, type ValidationError } from '../utils/validation';
import { Sliders, Plus, Trash2, RotateCcw, Shuffle, Play, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';

interface SimulatorProps {
  params: SimulationParams;
  requests: DiskRequest[];
  onParamsChange: (newParams: SimulationParams) => void;
  onRequestChange: (newRequests: DiskRequest[]) => void;
  onRunSimulation: () => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  params,
  requests,
  onParamsChange,
  onRequestChange,
  onRunSimulation
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Input Handlers
  const handleParamChange = (field: keyof SimulationParams, value: any) => {
    const updated = { ...params, [field]: value };
    onParamsChange(updated);
    // Clear field errors
    setValidationErrors(prev => prev.filter(e => !e.field.startsWith(field)));
  };

  const handleRequestUpdate = (index: number, field: keyof DiskRequest, value: any) => {
    const updated = [...requests];
    updated[index] = { ...updated[index], [field]: value };
    onRequestChange(updated);
    setValidationErrors([]);
  };

  const handleAddRequest = () => {
    const nextId = `R${requests.length + 1}`;
    const nextCylinder = Math.min(params.diskSize - 1, Math.floor(Math.random() * (params.diskSize - 20)) + 10);
    const priorities: Priority[] = ['HIGH', 'MEDIUM', 'LOW'];
    const randomPrio = priorities[Math.floor(Math.random() * priorities.length)];

    onRequestChange([...requests, { id: nextId, cylinder: nextCylinder, priority: randomPrio }]);
    setValidationErrors([]);
  };

  const handleDeleteRequest = (index: number) => {
    const updated = requests.filter((_, i) => i !== index);
    // Re-index IDs cleanly (R1, R2...)
    const reindexed = updated.map((r, idx) => ({ ...r, id: `R${idx + 1}` }));
    onRequestChange(reindexed);
    setValidationErrors([]);
  };

  const handleRandomize = () => {
    const count = 7;
    const priorities: Priority[] = ['HIGH', 'HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'LOW', 'LOW'];
    const newReqs: DiskRequest[] = [];

    for (let i = 0; i < count; i++) {
      const cyl = Math.floor(Math.random() * (params.diskSize - 10)) + 5;
      const prio = priorities[Math.floor(Math.random() * priorities.length)];
      newReqs.push({ id: `R${i + 1}`, cylinder: cyl, priority: prio });
    }

    onRequestChange(newReqs);
    setValidationErrors([]);
  };

  const handleLoadPreset = (presetName: string) => {
    const found = PRESET_DATASETS.find(p => p.name === presetName);
    if (found) {
      onParamsChange(found.params);
      onRequestChange(found.requests);
      setValidationErrors([]);
    }
  };

  const handleRun = () => {
    const errors = validateSimulationInputs(params, requests);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    onRunSimulation();
  };

  return (
    <section id="simulator" className="py-20 relative bg-[#053229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERACTIVE CONTROLLER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Build Your Input Workflow
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Set simulation boundary constraints, initial head position, sweep direction, and priority requests.
            </p>
          </div>

          {/* Preset dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Load Preset:</span>
            <select
              onChange={(e) => handleLoadPreset(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {PRESET_DATASETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Grid: Parameters + Request Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: System Parameters Card */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-6 border border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h3 className="text-lg font-bold text-white tracking-wide">System Parameters</h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/50">
                  CONFIG
                </span>
              </div>

              {/* Disk Size */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Disk Size (Cylinders)</span>
                  <span className="text-slate-400 font-mono">0 to {params.diskSize - 1}</span>
                </label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={params.diskSize}
                  onChange={(e) => handleParamChange('diskSize', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Initial Head Position */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Initial Head Position</span>
                  <span className="text-cyan-400 font-mono">Current: {params.initialHead}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={params.diskSize - 1}
                  value={params.initialHead}
                  onChange={(e) => handleParamChange('initialHead', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Initial Direction Toggle */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-slate-300">
                  Initial SCAN Direction
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleParamChange('direction', 'right')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      params.direction === 'right'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>Right</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleParamChange('direction', 'left')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      params.direction === 'left'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Left</span>
                  </button>
                </div>
              </div>

              {/* Max High Burst Limit */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Max High-Priority Burst Limit</span>
                  <span className="text-purple-400 font-mono">Limit = {params.burstLimit}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={params.burstLimit}
                  onChange={(e) => handleParamChange('burstLimit', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 text-white font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-[11px] text-slate-400 italic">
                  Services max {params.burstLimit} consecutive HIGH priority requests before yielding to MEDIUM/LOW.
                </p>
              </div>
            </div>

            {/* Quick Helper hint */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Inputs validate in realtime. Head must be inside disk boundary.</span>
            </div>
          </div>

          {/* Right Column: Request Stream Table Card */}
          <div className="lg:col-span-8 rounded-2xl glass-panel p-6 border border-slate-800/80 flex flex-col justify-between">
            <div>
              {/* Table Header & Controls */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-4 mb-4 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">Request Stream</h3>
                  <p className="text-xs text-slate-400">Total Requests: {requests.length}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddRequest}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Randomize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadPreset('Standard OS Benchmark')}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Request Table */}
              <div className="overflow-x-auto max-h-[340px] overflow-y-auto pr-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Req ID</th>
                      <th className="py-2.5 px-3">Cylinder Position</th>
                      <th className="py-2.5 px-3">Priority Level</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {requests.map((req, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                          {req.id}
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="0"
                            max={params.diskSize - 1}
                            value={req.cylinder}
                            onChange={(e) => handleRequestUpdate(idx, 'cylinder', parseInt(e.target.value) || 0)}
                            className="bg-slate-950 text-white font-mono px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 w-32"
                          />
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="relative inline-flex items-center">
                          <select
                            value={req.priority}
                            onChange={(e) => handleRequestUpdate(idx, 'priority', e.target.value as Priority)}
                            className={`appearance-none font-semibold pl-3 pr-10 py-1.5 rounded-lg text-xs border focus:outline-none cursor-pointer ${
                              req.priority === 'HIGH'
                                ? 'badge-high'
                                : req.priority === 'MEDIUM'
                                ? 'badge-medium'
                                : 'badge-low'
                            }`}
                          >
                            <option value="HIGH" className="bg-slate-900 text-rose-400">HIGH Priority</option>
                            <option value="MEDIUM" className="bg-slate-900 text-amber-400">MEDIUM Priority</option>
                            <option value="LOW" className="bg-slate-900 text-emerald-400">LOW Priority</option>
                          </select>
                            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 w-4 h-4 text-current" />
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Validation Errors Box */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Validation Warnings:</span>
                </div>
                {validationErrors.map((err, i) => (
                  <p key={i} className="pl-6 font-mono">• {err.message}</p>
                ))}
              </div>
            )}

            {/* Primary Action Button Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
              <button
                type="button"
                onClick={handleRun}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl active:scale-95 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RUN SIMULATION NOW</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
