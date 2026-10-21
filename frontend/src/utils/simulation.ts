import type { DiskRequest, SimulationParams, SimulationComparison, AlgorithmResult } from '../types';
import { runStandardScan } from '../algorithms/scan';
import { runPriorityAwareScan } from '../algorithms/priorityScan';

export async function runFullSimulation(
  params: SimulationParams,
  requests: DiskRequest[]
): Promise<SimulationComparison> {
  const [stdResult, prioResult] = await Promise.all([
    runStandardScan(requests, params),
    runPriorityAwareScan(requests, params)
  ]);

  // Differences (Priority - Standard)
  const headMovementDiff = prioResult.totalHeadMovement - stdResult.totalHeadMovement;
  const headMovementPercent = stdResult.totalHeadMovement > 0
    ? Math.round(((prioResult.totalHeadMovement - stdResult.totalHeadMovement) / stdResult.totalHeadMovement) * 1000) / 10
    : 0;

  const maxWaitDiff = prioResult.maxWaitTime - stdResult.maxWaitTime;
  const maxWaitPercent = stdResult.maxWaitTime > 0
    ? Math.round(((prioResult.maxWaitTime - stdResult.maxWaitTime) / stdResult.maxWaitTime) * 1000) / 10
    : 0;

  const avgWaitDiff = prioResult.averageWaitTime - stdResult.averageWaitTime;
  const avgWaitPercent = stdResult.averageWaitTime > 0
    ? Math.round(((prioResult.averageWaitTime - stdResult.averageWaitTime) / stdResult.averageWaitTime) * 1000) / 10
    : 0;

  // Determine overall metric winner
  let winner: 'STANDARD' | 'PRIORITY_AWARE' | 'TIED' = 'TIED';
  if (prioResult.maxWaitTime < stdResult.maxWaitTime || prioResult.starvationRiskScore < stdResult.starvationRiskScore) {
    winner = 'PRIORITY_AWARE';
  } else if (stdResult.totalHeadMovement < prioResult.totalHeadMovement && prioResult.maxWaitTime >= stdResult.maxWaitTime) {
    winner = 'STANDARD';
  }

  // Generate dynamic natural language insights
  const insights = generateDynamicInsights(stdResult, prioResult, params);

  return {
    standardScan: stdResult,
    priorityScan: prioResult,
    params,
    insights: {
      headline: insights.headline,
      details: insights.details,
      headMovementDiff,
      headMovementPercent,
      maxWaitDiff,
      maxWaitPercent,
      avgWaitDiff,
      avgWaitPercent,
      winner
    }
  };
}

function generateDynamicInsights(
  std: AlgorithmResult,
  prio: AlgorithmResult,
  params: SimulationParams
): { headline: string; details: string[] } {
  const details: string[] = [];

  // Headline logic
  let headline = '';
  if (prio.maxWaitTime < std.maxWaitTime) {
    const maxReduction = Math.abs(Math.round(((prio.maxWaitTime - std.maxWaitTime) / std.maxWaitTime) * 100));
    headline = `The Priority-Aware scheduler reduced maximum waiting time by ${maxReduction}% while servicing ${prio.prioritySatisfactionScore}% of high-priority requests with high urgency.`;
  } else if (prio.throttlingEvents > 0) {
    headline = `Burst-throttling prevented lower-priority starvation with ${prio.throttlingEvents} active throttle event(s) across ${params.burstLimit}-request burst limits.`;
  } else if (std.totalHeadMovement < prio.totalHeadMovement) {
    headline = `Standard SCAN maintained lower total seek distance (${std.totalHeadMovement} vs ${prio.totalHeadMovement} cylinders), demonstrating the classic elevator spatial trade-off.`;
  } else {
    headline = `Both algorithms achieved comparable execution profiles, with Priority SCAN ordering high-urgency requests first.`;
  }

  // Detailed points based on actual numbers
  if (prio.throttlingEvents > 0) {
    details.push(`Adaptive burst-throttling intervened ${prio.throttlingEvents} time(s) after ${params.burstLimit} consecutive HIGH priority requests to service waiting MEDIUM/LOW priority requests.`);
  } else {
    details.push(`No throttling events were triggered as consecutive HIGH priority requests did not exceed the burst limit threshold of ${params.burstLimit}.`);
  }

  if (prio.totalHeadMovement > std.totalHeadMovement) {
    const diff = prio.totalHeadMovement - std.totalHeadMovement;
    details.push(`Priority reordering introduced ${diff} additional cylinders of head movement (+${Math.abs(Math.round((diff / std.totalHeadMovement) * 100))}% seek overhead) to prioritize urgent tasks.`);
  } else if (prio.totalHeadMovement < std.totalHeadMovement) {
    const diff = std.totalHeadMovement - prio.totalHeadMovement;
    details.push(`Priority SCAN achieved ${diff} fewer cylinders of total head movement (${prio.totalHeadMovement} vs ${std.totalHeadMovement}) due to optimized service grouping.`);
  } else {
    details.push(`Both schedulers logged identical total head movement of ${std.totalHeadMovement} cylinders.`);
  }

  if (prio.starvationRiskScore < std.starvationRiskScore) {
    details.push(`Starvation risk dropped from ${std.starvationRiskScore}% in Standard SCAN down to ${prio.starvationRiskScore}% in Priority-Aware SCAN.`);
  } else if (std.starvationRiskScore === prio.starvationRiskScore) {
    details.push(`Starvation risk remained identical at ${std.starvationRiskScore}% across both execution profiles.`);
  } else {
    details.push(`Standard SCAN exhibited a lower starvation risk index (${std.starvationRiskScore}% vs ${prio.starvationRiskScore}%) for this specific cylinder distribution.`);
  }

  details.push(`High Priority Satisfaction Score achieved by Priority-Aware SCAN: ${prio.prioritySatisfactionScore}%.`);

  return { headline, details };
}
