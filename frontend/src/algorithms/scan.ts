import type { DiskRequest, SimulationParams, AlgorithmResult } from '../types';
import { loadScheduler } from './wasmScheduler';

export async function runStandardScan(
  requests: DiskRequest[],
  params: SimulationParams
): Promise<AlgorithmResult> {
  const scheduler = await loadScheduler();
  return scheduler.runStandardScan(requests, params);
}
