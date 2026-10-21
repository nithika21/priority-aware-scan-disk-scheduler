import React, { useEffect, useState } from 'react';
import type { SimulationParams, DiskRequest, SimulationComparison } from './types';
import { DEFAULT_SIMULATION_PARAMS, DEFAULT_DISK_REQUESTS } from './utils/presetData';
import { runFullSimulation } from './utils/simulation';

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
  const [comparison, setComparison] = useState<SimulationComparison | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    runFullSimulation(DEFAULT_SIMULATION_PARAMS, DEFAULT_DISK_REQUESTS)
      .then(result => {
        if (active) setComparison(result);
      })
      .catch(error => {
        if (active) {
          setSimulationError(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRunSimulation = async () => {
    try {
      const newResult = await runFullSimulation(params, requests);
      setComparison(newResult);
      setSimulationError(null);

      // Smooth scroll to visualization section
      const visEl = document.getElementById('visualization');
      if (visEl) {
        visEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      setSimulationError(error instanceof Error ? error.message : String(error));
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

      {simulationError && (
        <p role="alert" className="mx-auto mt-4 max-w-7xl px-4 text-sm text-red-300">
          The C++ scheduler could not run: {simulationError}
        </p>
      )}
      {!comparison && !simulationError && (
        <p role="status" className="mx-auto mt-4 max-w-7xl px-4 text-sm text-slate-300">
          Loading the C++ scheduler...
        </p>
      )}

      {comparison && (
        <>
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
        </>
      )}
      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
