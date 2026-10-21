import type {
  AlgorithmResult,
  DiskRequest,
  SimulationParams
} from '../types';
import createDiskSchedulerModule from '../generated/scheduler.js';

interface SchedulerModule {
  runStandardScan: (
    requests: DiskRequest[],
    params: SimulationParams
  ) => AlgorithmResult;
  runPriorityAwareScan: (
    requests: DiskRequest[],
    params: SimulationParams
  ) => AlgorithmResult;
}

let schedulerModule: Promise<SchedulerModule> | undefined;

export function loadScheduler(): Promise<SchedulerModule> {
  if (!schedulerModule) {
    const pendingModule = createDiskSchedulerModule({
      locateFile: path => path.endsWith('.wasm')
        ? `${import.meta.env.BASE_URL}scheduler.wasm`
        : path
    });
    schedulerModule = pendingModule.catch(error => {
      schedulerModule = undefined;
      throw error;
    });
  }
  return schedulerModule;
}
