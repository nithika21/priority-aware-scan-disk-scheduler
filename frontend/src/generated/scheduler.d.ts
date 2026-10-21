import type { AlgorithmResult, DiskRequest, SimulationParams } from '../types';

interface DiskSchedulerModule {
  runStandardScan(requests: DiskRequest[], params: SimulationParams): AlgorithmResult;
  runPriorityAwareScan(requests: DiskRequest[], params: SimulationParams): AlgorithmResult;
}

export default function createDiskSchedulerModule(options?: {
  locateFile?: (path: string, prefix: string) => string;
}): Promise<DiskSchedulerModule>;
