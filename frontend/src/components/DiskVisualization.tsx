import React, { useState, useEffect } from 'react';
import type { AlgorithmResult, SimulationParams } from '../types';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap, Disc } from 'lucide-react';

interface DiskVisualizationProps {
  standardScan: AlgorithmResult;
  priorityScan: AlgorithmResult;
  params: SimulationParams;
}

export const DiskVisualization: React.FC<DiskVisualizationProps> = ({
  standardScan,
  priorityScan,
  params
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step

  const maxSteps = Math.max(standardScan.trace.length, priorityScan.trace.length);

  // Auto playback effect
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps, playbackSpeed]);

  const handleStepForward = () => {
    if (currentStep < maxSteps - 1) setCurrentStep(prev => prev + 1);
  };

  const handleStepBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <section id="visualization" className="py-20 relative bg-[#053229] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-purple-400 text-xs font-mono mb-3">
              <Disc className="w-3.5 h-3.5" />
              <span>DYNAMIC TRACE CANVAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Disk Head Movement Trace
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Side-by-side visualization comparing Standard SCAN vs Priority-Aware SCAN trajectory.
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Trace'}</span>
            </button>

            <div className="flex items-center gap-1 border-l border-r border-slate-800 px-2">
              <button
                onClick={handleStepBack}
                disabled={currentStep === 0}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Previous Step"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handleStepForward}
                disabled={currentStep >= maxSteps - 1}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Next Step"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetPlayback}
                className="p-2 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                title="Reset Playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-2 text-xs text-slate-400">
              <span>Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-slate-950 text-slate-200 text-xs font-mono px-2 py-1 rounded border border-slate-800"
              >
                <option value={1500}>0.5x</option>
                <option value={1000}>1.0x</option>
                <option value={500}>2.0x</option>
                <option value={250}>4.0x</option>
              </select>
            </div>

            <div className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400">
              Step {currentStep} / {maxSteps - 1}
            </div>
          </div>
        </div>

        {/* Dual Diagram Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Standard SCAN Trace */}
          <TraceCard
            result={standardScan}
            params={params}
            currentStepLimit={currentStep}
            cardTitle="Standard SCAN Algorithm"
            accentColor="#72B0AB"
          />

          {/* Card 2: Priority-Aware SCAN Trace */}
          <TraceCard
            result={priorityScan}
            params={params}
            currentStepLimit={currentStep}
            cardTitle="Priority-Aware SCAN + Burst-Throttling"
            accentColor="#CFB97E"
            isEnhanced
          />

        </div>

        {/* Bottom Legend */}
        <div className="mt-8 p-4 rounded-xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-slate-400">Legend:</span>
            <div className="flex items-center gap-2 text-rose-300">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <span className="w-3 h-3 rounded-md bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white px-1">
                ⚡
              </span>
              <span>Burst Throttle Event</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Cylinder Range: 0 — {params.diskSize - 1}</span>
            <span>Initial Head: {params.initialHead}</span>
          </div>
        </div>

      </div>
    </section>
  );
};

// Sub-component for individual SVG Trace Graph
interface TraceCardProps {
  result: AlgorithmResult;
  params: SimulationParams;
  currentStepLimit: number;
  cardTitle: string;
  accentColor: string;
  isEnhanced?: boolean;
}

const TraceCard: React.FC<TraceCardProps> = ({
  result,
  params,
  currentStepLimit,
  cardTitle,
  accentColor,
  isEnhanced
}) => {
  const visibleTrace = result.trace.slice(0, currentStepLimit + 1);
  const activeStep = result.trace[Math.min(currentStepLimit, result.trace.length - 1)];

  // Dimensions for SVG
  const width = 550;
  const height = 280;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const totalCylinders = Math.max(1, params.diskSize - 1);

  // Map step index to X coordinate
  const getX = (stepIndex: number) => {
    const totalTraceSteps = Math.max(1, result.trace.length - 1);
    return paddingLeft + (stepIndex / totalTraceSteps) * chartWidth;
  };

  // Map cylinder position to Y coordinate (0 at bottom, maxCylinder at top)
  const getY = (cylinder: number) => {
    return paddingTop + chartHeight - (cylinder / totalCylinders) * chartHeight;
  };

  return (
    <div className={`rounded-2xl glass-panel p-6 border ${isEnhanced ? 'border-purple-500/30' : 'border-slate-800'} flex flex-col justify-between`}>
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">{cardTitle}</h3>
          <p className="text-xs text-slate-400 font-mono">
            Total Seek: <span className="text-cyan-400 font-bold">{result.totalHeadMovement} cyl</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEnhanced && result.throttlingEvents > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/40">
              <Zap className="w-3 h-3 text-purple-400 fill-current" />
              <span>{result.throttlingEvents} Throttled</span>
            </span>
          )}
          <span className="text-[11px] font-mono bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800">
            {result.serviceOrder.length} Requests
          </span>
        </div>
      </div>

      {/* SVG Canvas Trace Plot */}
      <div className="relative w-full h-[280px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines for Cylinder levels */}
          {[0, Math.floor(totalCylinders / 2), totalCylinders].map((cyl, i) => {
            const y = getY(cyl);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#355E58" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 4} fill="#BCDDDC" fontSize="10" fontFamily="Inter, sans-serif" textAnchor="end">
                  {cyl}
                </text>
              </g>
            );
          })}

          {/* Polyline Path for Head Trajectory */}
          {visibleTrace.length > 1 && (
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={visibleTrace.map((st, idx) => `${getX(idx)},${getY(st.cylinder)}`).join(' ')}
            />
          )}

          {/* Plot Trace Step Points */}
          {result.trace.map((st, idx) => {
            const isVisible = idx <= currentStepLimit;
            const cx = getX(idx);
            const cy = getY(st.cylinder);

            // Node colors based on request type/priority
            let fillColor = '#72B0AB';
            if (st.requestId === 'START') fillColor = '#BCDDDC';
            else if (st.requestId === 'BOUNDARY') fillColor = '#355E58';
            else if (st.priority === 'HIGH') fillColor = '#FDC1B4';
            else if (st.priority === 'MEDIUM') fillColor = '#CFB97E';
            else if (st.priority === 'LOW') fillColor = '#72B0AB';

            return (
              <g key={idx} className={isVisible ? 'opacity-100' : 'opacity-20'}>
                {/* Highlight active step node */}
                {idx === currentStepLimit && (
                  <circle cx={cx} cy={cy} r="12" fill={fillColor} fillOpacity="0.25" className="animate-ping" />
                )}

                {/* Throttle Ring */}
                {st.isThrottled && (
                  <g>
                    <circle cx={cx} cy={cy} r="10" fill="none" stroke="#B89D47" strokeWidth="2" strokeDasharray="2 2" />
                    <text x={cx} y={cy - 12} fill="#FFEDD1" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">
                      ⚡ THROTTLE
                    </text>
                  </g>
                )}

                {/* Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={st.requestId === 'START' ? 6 : st.isThrottled ? 7 : 5}
                  fill={fillColor}
                  stroke="#053229"
                  strokeWidth="1.5"
                />

                {/* Request ID Tag */}
                <text
                  x={cx}
                  y={cy + 16}
                  fill={idx === currentStepLimit ? '#FFEDD1' : '#BCDDDC'}
                  fontSize="9"
                  fontFamily="Inter, sans-serif"
                  fontWeight={idx === currentStepLimit ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {st.requestId}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Step Details Bar */}
      {activeStep && (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Step {activeStep.stepNumber}:</span>
            <span className="font-bold text-white">{activeStep.requestId}</span>
            {activeStep.priority && (
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                activeStep.priority === 'HIGH' ? 'badge-high' : activeStep.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
              }`}>
                {activeStep.priority}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Cylinder: <strong className="text-cyan-400">{activeStep.cylinder}</strong></span>
            <span className="text-slate-400">Seek: <strong className="text-purple-400">{activeStep.seekDistance}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
