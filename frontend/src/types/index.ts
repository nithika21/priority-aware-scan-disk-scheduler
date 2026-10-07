export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Direction = 'left' | 'right';

export interface DiskRequest {
  id: string;
  cylinder: number;
  priority: Priority;
}

export interface SimulationParams {
  diskSize: number; // e.g. 200 (cylinders 0 to 199)
  initialHead: number; // e.g. 50
  direction: Direction;
  burstLimit: number; // e.g. 3
}

export interface ServiceStep {
  stepNumber: number;
  requestId: string; // Request ID or 'START' or 'BOUNDARY'
  cylinder: number;
  priority?: Priority;
  direction: Direction;
  seekDistance: number;
  cumulativeHeadMovement: number;
  isThrottled?: boolean;
  isBoundaryReversal?: boolean;
  waitTime: number;
}

export interface RequestExecutionDetail {
  id: string;
  cylinder: number;
  priority: Priority;
  serviceOrderIndex: number;
  waitTime: number;
  seekDistance: number;
  status: 'SERVICED' | 'THROTTLED' | 'HIGH_WAIT';
}

export interface AlgorithmResult {
  algorithmName: string;
  serviceOrder: string[];
  trace: ServiceStep[];
  totalHeadMovement: number;
  averageWaitTime: number;
  maxWaitTime: number;
  maxWaitRequestId: string;
  averageSeekDistance: number;
  directionChanges: number;
  throttlingEvents: number;
  prioritySatisfactionScore: number; // % of High priority serviced quickly
  starvationRiskScore: number; // Percentage scale
  starvedRequestsCount: number;
  requestDetails: RequestExecutionDetail[];
}

export interface SimulationComparison {
  standardScan: AlgorithmResult;
  priorityScan: AlgorithmResult;
  params: SimulationParams;
  insights: {
    headline: string;
    details: string[];
    headMovementDiff: number;
    headMovementPercent: number;
    maxWaitDiff: number;
    maxWaitPercent: number;
    avgWaitDiff: number;
    avgWaitPercent: number;
    winner: 'STANDARD' | 'PRIORITY_AWARE' | 'TIED';
  };
}
