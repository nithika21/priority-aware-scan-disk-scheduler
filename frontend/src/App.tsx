import React, { useState } from 'react';
import type { SimulationParams, DiskRequest, SimulationComparison } from './types';
import { DEFAULT_SIMULATION_PARAMS, DEFAULT_DISK_REQUESTS } from './utils/presetData';
import { runFullSimulation } from './utils/simulation';
import confetti from 'canvas-confetti';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Simulator } from './components/Simulator';
import { DiskVisualization } from './components/DiskVisualization';
import { Results } from './components/Results';
import { ComparisonTable } from './components/ComparisonTable';
import { ComparisonCharts } from './components/ComparisonCharts';
import { RequestAnalysis } from './components/RequestAnalysis';
import { HowItWorks } from './components/HowItWorks';
import { DynamicInsights } from './components/DynamicInsights';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_SIMULATION_PARAMS);
  const [requests, setRequests] = useState<DiskRequest[]>(DEFAULT_DISK_REQUESTS);

  // Initial Simulation Run
  const [comparison, setComparison] = useState<SimulationComparison>(() => {
    return runFullSimulation(DEFAULT_SIMULATION_PARAMS, DEFAULT_DISK_REQUESTS);
  });

  const handleRunSimulation = () => {
    const newResult = runFullSimulation(params, requests);
    setComparison(newResult);

    // Fire subtle celebration confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#72B0AB', '#CFB97E', '#BCDDDC']
      });
    } catch (e) {
      // Ignore if canvas-confetti unavailable
    }

    // Smooth scroll to visualization section
    const visEl = document.getElementById('visualization');
    if (visEl) {
      visEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartSimulationClick = () => {
    const simulatorEl = document.getElementById('simulator');
    if (simulatorEl) {
      simulatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#053229] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Sticky Navigation */}
      <Navbar onRunClick={handleRunSimulation} />

      {/* Hero Section */}
      <Hero onStartClick={handleStartSimulationClick} />

      {/* Project Overview */}
      <Overview />

      {/* Simulator Section */}
      <Simulator
        params={params}
        requests={requests}
        onParamsChange={setParams}
        onRequestChange={setRequests}
        onRunSimulation={handleRunSimulation}
      />

      {/* Disk Head Visualization */}
      <DiskVisualization
        standardScan={comparison.standardScan}
        priorityScan={comparison.priorityScan}
        params={comparison.params}
      />

      {/* Performance Analytics KPI Stats */}
      <Results comparison={comparison} />

      {/* Comparison Table */}
      <ComparisonTable comparison={comparison} />

      {/* Comparison Charts */}
      <ComparisonCharts comparison={comparison} />

      {/* Request Analysis & Timeline */}
      <RequestAnalysis comparison={comparison} />

      {/* Dynamic Insights Summary */}
      <DynamicInsights comparison={comparison} />

      {/* How It Works Flowchart */}
      <HowItWorks />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
