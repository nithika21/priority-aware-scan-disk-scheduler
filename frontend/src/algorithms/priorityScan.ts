import type { DiskRequest, SimulationParams, AlgorithmResult, ServiceStep, RequestExecutionDetail, Priority } from '../types';

const PRIORITY_SCORE: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export function runPriorityAwareScan(
  requests: DiskRequest[],
  params: SimulationParams
): AlgorithmResult {
  const { diskSize, initialHead, direction: initialDir, burstLimit } = params;
  const maxCylinder = Math.max(0, diskSize - 1);

  if (requests.length === 0) {
    return {
      algorithmName: 'Priority-Aware SCAN',
      serviceOrder: [],
      trace: [{
        stepNumber: 0,
        requestId: 'START',
        cylinder: initialHead,
        direction: initialDir,
        seekDistance: 0,
        cumulativeHeadMovement: 0,
        waitTime: 0
      }],
      totalHeadMovement: 0,
      averageWaitTime: 0,
      maxWaitTime: 0,
      maxWaitRequestId: 'None',
      averageSeekDistance: 0,
      directionChanges: 0,
      throttlingEvents: 0,
      prioritySatisfactionScore: 100,
      starvationRiskScore: 0,
      starvedRequestsCount: 0,
      requestDetails: []
    };
  }

  const pending = [...requests];
  const trace: ServiceStep[] = [];
  const serviceOrder: string[] = [];
  const requestDetails: RequestExecutionDetail[] = [];

  let currentHead = initialHead;
  let currentDir = initialDir;
  let totalMovement = 0;
  let directionChanges = 0;
  let highBurstCount = 0;
  let throttlingEvents = 0;
  let stepIndex = 0;

  // Initial step
  trace.push({
    stepNumber: stepIndex++,
    requestId: 'START',
    cylinder: currentHead,
    direction: currentDir,
    seekDistance: 0,
    cumulativeHeadMovement: 0,
    waitTime: 0
  });

  while (pending.length > 0) {
    // Candidates in current direction
    let candidatesInDir = pending.filter(req => {
      return currentDir === 'right' ? req.cylinder >= currentHead : req.cylinder <= currentHead;
    });

    // If no candidates in current direction, turn around to reverse boundary or next direction
    if (candidatesInDir.length === 0) {
      const boundary = currentDir === 'right' ? maxCylinder : 0;
      if (currentHead !== boundary && pending.length > 0) {
        const boundarySeek = Math.abs(boundary - currentHead);
        totalMovement += boundarySeek;
        currentHead = boundary;

        trace.push({
          stepNumber: stepIndex++,
          requestId: 'BOUNDARY',
          cylinder: boundary,
          direction: currentDir,
          seekDistance: boundarySeek,
          cumulativeHeadMovement: totalMovement,
          isBoundaryReversal: true,
          waitTime: totalMovement
        });
      }

      currentDir = currentDir === 'right' ? 'left' : 'right';
      directionChanges++;

      // Re-evaluate candidates in new direction
      candidatesInDir = pending.filter(req => {
        return currentDir === 'right' ? req.cylinder >= currentHead : req.cylinder <= currentHead;
      });
    }

    if (candidatesInDir.length === 0) {
      // Safety fallback: if no candidates in either direction (should not happen if pending > 0), pick closest overall
      candidatesInDir = [...pending];
    }

    // Decision Logic with Burst Throttling
    let chosenReq: DiskRequest | null = null;
    let isThrottledStep = false;

    const lowerPriorityCandidates = candidatesInDir.filter(r => r.priority === 'MEDIUM' || r.priority === 'LOW');

    if (highBurstCount >= burstLimit && lowerPriorityCandidates.length > 0) {
      // Burst limit reached and lower priority request is available!
      // THROTTLE: service the closest lower priority request in current direction
      isThrottledStep = true;
      throttlingEvents++;

      // Sort lower priority candidates by distance from current head
      lowerPriorityCandidates.sort((a, b) => {
        const distA = Math.abs(a.cylinder - currentHead);
        const distB = Math.abs(b.cylinder - currentHead);
        // If distances equal, prefer higher priority (MEDIUM over LOW)
        if (distA === distB) {
          return PRIORITY_SCORE[b.priority] - PRIORITY_SCORE[a.priority];
        }
        return distA - distB;
      });

      chosenReq = lowerPriorityCandidates[0];
      highBurstCount = 0; // Reset burst counter
    } else {
      // Normal Priority Selection: Pick highest priority candidate in current direction
      // If multiple, pick closest in distance
      candidatesInDir.sort((a, b) => {
        const prioA = PRIORITY_SCORE[a.priority];
        const prioB = PRIORITY_SCORE[b.priority];
        if (prioA !== prioB) return prioB - prioA; // Highest priority first

        // Same priority: closest cylinder in current direction
        const distA = Math.abs(a.cylinder - currentHead);
        const distB = Math.abs(b.cylinder - currentHead);
        return distA - distB;
      });

      chosenReq = candidatesInDir[0];

      if (chosenReq.priority === 'HIGH') {
        highBurstCount++;
      } else {
        highBurstCount = 0;
      }
    }

    if (chosenReq) {
      const seek = Math.abs(chosenReq.cylinder - currentHead);
      totalMovement += seek;
      currentHead = chosenReq.cylinder;

      trace.push({
        stepNumber: stepIndex++,
        requestId: chosenReq.id,
        cylinder: chosenReq.cylinder,
        priority: chosenReq.priority,
        direction: currentDir,
        seekDistance: seek,
        cumulativeHeadMovement: totalMovement,
        isThrottled: isThrottledStep,
        waitTime: totalMovement
      });

      serviceOrder.push(chosenReq.id);
      requestDetails.push({
        id: chosenReq.id,
        cylinder: chosenReq.cylinder,
        priority: chosenReq.priority,
        serviceOrderIndex: serviceOrder.length,
        waitTime: totalMovement,
        seekDistance: seek,
        status: isThrottledStep ? 'THROTTLED' : 'SERVICED'
      });

      // Remove chosen request from pending
      const removeIdx = pending.findIndex(r => r.id === chosenReq!.id);
      if (removeIdx !== -1) pending.splice(removeIdx, 1);
    }
  }

  // Calculate detailed metrics
  const avgWaitTime = requestDetails.length > 0
    ? requestDetails.reduce((sum, d) => sum + d.waitTime, 0) / requestDetails.length
    : 0;

  let maxWait = 0;
  let maxWaitReqId = 'N/A';
  requestDetails.forEach(d => {
    if (d.waitTime >= maxWait) {
      maxWait = d.waitTime;
      maxWaitReqId = d.id;
    }
  });

  const avgSeek = requestDetails.length > 0
    ? requestDetails.reduce((sum, d) => sum + d.seekDistance, 0) / requestDetails.length
    : 0;

  // Starvation Analysis: Requests with wait time > avgWaitTime * 1.5
  const starvedCount = requestDetails.filter(d => d.waitTime > (avgWaitTime * 1.5)).length;
  const starvationRisk = Math.round((starvedCount / requests.length) * 100);

  // High priority satisfaction: % of HIGH priority requests serviced in top half of execution order
  const highReqs = requestDetails.filter(d => d.priority === 'HIGH');
  const satisfiedHigh = highReqs.filter(d => d.serviceOrderIndex <= Math.ceil(requests.length * 0.6)).length;
  const prioritySatisfaction = highReqs.length > 0 ? Math.round((satisfiedHigh / highReqs.length) * 100) : 100;

  return {
    algorithmName: 'Priority-Aware SCAN + Burst-Throttling',
    serviceOrder,
    trace,
    totalHeadMovement: totalMovement,
    averageWaitTime: Math.round(avgWaitTime * 10) / 10,
    maxWaitTime: maxWait,
    maxWaitRequestId: maxWaitReqId,
    averageSeekDistance: Math.round(avgSeek * 10) / 10,
    directionChanges,
    throttlingEvents,
    prioritySatisfactionScore: prioritySatisfaction,
    starvationRiskScore: starvationRisk,
    starvedRequestsCount: starvedCount,
    requestDetails
  };
}
