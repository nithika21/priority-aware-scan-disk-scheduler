import type { DiskRequest, SimulationParams } from '../types';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  diskSize: 200,
  initialHead: 50,
  direction: 'right',
  burstLimit: 3
};

export const DEFAULT_DISK_REQUESTS: DiskRequest[] = [
  { id: 'R1', cylinder: 82, priority: 'HIGH' },
  { id: 'R2', cylinder: 170, priority: 'HIGH' },
  { id: 'R3', cylinder: 43, priority: 'MEDIUM' },
  { id: 'R4', cylinder: 140, priority: 'HIGH' },
  { id: 'R5', cylinder: 24, priority: 'LOW' },
  { id: 'R6', cylinder: 16, priority: 'MEDIUM' },
  { id: 'R7', cylinder: 190, priority: 'HIGH' }
];

export const PRESET_DATASETS: { name: string; description: string; params: SimulationParams; requests: DiskRequest[] }[] = [
  {
    name: 'Standard OS Benchmark',
    description: 'Default dataset from project specification with mixed priorities and clustered cylinders.',
    params: DEFAULT_SIMULATION_PARAMS,
    requests: DEFAULT_DISK_REQUESTS
  },
  {
    name: 'High Burst Starvation Scenario',
    description: 'Multiple consecutive HIGH priority requests to trigger burst-throttling and protect LOW priority jobs.',
    params: { diskSize: 200, initialHead: 30, direction: 'right', burstLimit: 2 },
    requests: [
      { id: 'R1', cylinder: 45, priority: 'HIGH' },
      { id: 'R2', cylinder: 60, priority: 'HIGH' },
      { id: 'R3', cylinder: 75, priority: 'HIGH' },
      { id: 'R4', cylinder: 90, priority: 'HIGH' },
      { id: 'R5', cylinder: 40, priority: 'LOW' },
      { id: 'R6', cylinder: 110, priority: 'MEDIUM' },
      { id: 'R7', cylinder: 180, priority: 'HIGH' }
    ]
  },
  {
    name: 'Boundary Extreme Case',
    description: 'Requests placed at cylinder 0, cylinder 199, and initial head near boundaries.',
    params: { diskSize: 200, initialHead: 195, direction: 'right', burstLimit: 3 },
    requests: [
      { id: 'R1', cylinder: 0, priority: 'LOW' },
      { id: 'R2', cylinder: 199, priority: 'HIGH' },
      { id: 'R3', cylinder: 150, priority: 'MEDIUM' },
      { id: 'R4', cylinder: 10, priority: 'HIGH' },
      { id: 'R5', cylinder: 180, priority: 'LOW' }
    ]
  }
];
