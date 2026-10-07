import type { SimulationParams, DiskRequest } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSimulationInputs(
  params: SimulationParams,
  requests: DiskRequest[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Disk Size
  if (!params.diskSize || params.diskSize <= 0) {
    errors.push({ field: 'diskSize', message: 'Disk size must be a positive number greater than 0.' });
  }

  // Initial Head
  if (params.initialHead === undefined || params.initialHead === null || params.initialHead < 0) {
    errors.push({ field: 'initialHead', message: 'Initial head position cannot be negative.' });
  } else if (params.diskSize && params.initialHead >= params.diskSize) {
    errors.push({ field: 'initialHead', message: `Initial head position (${params.initialHead}) cannot exceed or equal disk size (${params.diskSize}).` });
  }

  // Burst Limit
  if (!params.burstLimit || params.burstLimit < 1) {
    errors.push({ field: 'burstLimit', message: 'Burst limit must be a positive integer (at least 1).' });
  }

  // Requests
  if (!requests || requests.length === 0) {
    errors.push({ field: 'requests', message: 'Please add at least one disk request to run the simulation.' });
  } else {
    requests.forEach((req, idx) => {
      if (!req.id || req.id.trim() === '') {
        errors.push({ field: `request_${idx}_id`, message: `Request #${idx + 1} is missing a valid ID.` });
      }
      if (req.cylinder === undefined || req.cylinder === null || isNaN(req.cylinder)) {
        errors.push({ field: `request_${idx}_cylinder`, message: `Request ${req.id} is missing a valid cylinder number.` });
      } else if (req.cylinder < 0) {
        errors.push({ field: `request_${idx}_cylinder`, message: `Request ${req.id} cylinder position (${req.cylinder}) cannot be negative.` });
      } else if (params.diskSize && req.cylinder >= params.diskSize) {
        errors.push({ field: `request_${idx}_cylinder`, message: `Request ${req.id} cylinder (${req.cylinder}) exceeds disk size boundary (${params.diskSize - 1}).` });
      }
    });
  }

  return errors;
}
