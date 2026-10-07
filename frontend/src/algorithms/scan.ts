import type { DiskRequest, SimulationParams, AlgorithmResult, ServiceStep, RequestExecutionDetail } from '../types';

export function runStandardScan(
  requests: DiskRequest[],
  params: SimulationParams
): AlgorithmResult {
  const { diskSize, initialHead, direction: initialDir } = params;
  const maxCylinder = Math.max(0, diskSize - 1);

  if (requests.length === 0) {
    return {
      algorithmName: 'Standard SCAN',
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

  // Clone requests
  const pending = [...requests];
  const trace: ServiceStep[] = [];
  const serviceOrder: string[] = [];
  const requestDetails: RequestExecutionDetail[] = [];

  let currentHead = initialHead;
  let currentDir = initialDir;
  let totalMovement = 0;
  let directionChanges = 0;
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

  // Group pending by cylinder direction
  // Standard SCAN moves all the way to boundary in current direction if there are pending requests, then reverses
  while (pending.length > 0) {
    // Filter requests in current direction
    const inDirection = pending.filter(req => {
      return currentDir === 'right' ? req.cylinder >= currentHead : req.cylinder <= currentHead;
    });

    if (inDirection.length > 0) {
      // Sort requests in direction order
      inDirection.sort((a, b) => {
        if (currentDir === 'right') return a.cylinder - b.cylinder;
        return b.cylinder - a.cylinder;
      });

      for (const req of inDirection) {
        const seek = Math.abs(req.cylinder - currentHead);
        totalMovement += seek;
        currentHead = req.cylinder;

        trace.push({
          stepNumber: stepIndex++,
          requestId: req.id,
          cylinder: req.cylinder,
          priority: req.priority,
          direction: currentDir,
          seekDistance: seek,
          cumulativeHeadMovement: totalMovement,
          waitTime: totalMovement
        });

        serviceOrder.push(req.id);
        requestDetails.push({
          id: req.id,
          cylinder: req.cylinder,
          priority: req.priority,
          serviceOrderIndex: serviceOrder.length,
          waitTime: totalMovement,
          seekDistance: seek,
          status: 'SERVICED'
        });

        // Remove from pending
        const idx = pending.findIndex(r => r.id === req.id);
        if (idx !== -1) pending.splice(idx, 1);
      }
    }

    // If there are still pending requests in the opposite direction, reach boundary and reverse
    if (pending.length > 0) {
      const boundary = currentDir === 'right' ? maxCylinder : 0;
      if (currentHead !== boundary) {
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

      // Reverse direction
      currentDir = currentDir === 'right' ? 'left' : 'right';
      directionChanges++;
    }
  }

  // Calculate metrics
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

  // Starvation analysis: Requests with wait time > 2 * avgWaitTime or serviced in bottom 25%
  const starvedCount = requestDetails.filter(d => d.waitTime > (avgWaitTime * 1.5) || d.serviceOrderIndex > requests.length * 0.7).length;
  const starvationRisk = Math.round((starvedCount / requests.length) * 100);

  // High priority satisfaction
  const highReqs = requestDetails.filter(d => d.priority === 'HIGH');
  const satisfiedHigh = highReqs.filter(d => d.serviceOrderIndex <= Math.ceil(requests.length / 2)).length;
  const prioritySatisfaction = highReqs.length > 0 ? Math.round((satisfiedHigh / highReqs.length) * 100) : 100;

  return {
    algorithmName: 'Standard SCAN',
    serviceOrder,
    trace,
    totalHeadMovement: totalMovement,
    averageWaitTime: Math.round(avgWaitTime * 10) / 10,
    maxWaitTime: maxWait,
    maxWaitRequestId: maxWaitReqId,
    averageSeekDistance: Math.round(avgSeek * 10) / 10,
    directionChanges,
    throttlingEvents: 0,
    prioritySatisfactionScore: prioritySatisfaction,
    starvationRiskScore: starvationRisk,
    starvedRequestsCount: starvedCount,
    requestDetails
  };
}
