import type { DiskRequest, SimulationParams, AlgorithmResult } from '../types';
import { loadScheduler } from './wasmScheduler';

export async function runPriorityAwareScan(
  requests: DiskRequest[],
  params: SimulationParams
): Promise<AlgorithmResult> {
  const scheduler = await loadScheduler();
  return scheduler.runPriorityAwareScan(requests, params);
}
