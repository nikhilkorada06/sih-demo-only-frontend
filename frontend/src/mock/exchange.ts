import { User } from '../types/auth.types';
import { AuditRecord } from '../api/audit.api';

export type ExchangeDepartment = 'Employment Department' | 'Education Department';
export interface DataRequest {
  id: string;
  sourceDepartment: ExchangeDepartment;
  targetDepartment: ExchangeDepartment;
  citizenId: string;
  citizenName: string;
  requestedData: string;
  reason: string;
  status: 'pending' | 'rejected' | 'data_shared';
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  sharedData: Record<string, string | number> | null;
  events: AuditRecord[];
}

// Fictional records used only by this browser-based approval demonstration.
export const exchangeProfiles = {
  'Education Department': {
    citizenId: 'CIT-EDU-001', name: 'Sakshi Verma', dateOfBirth: '2004-08-17',
    highestQualification: 'B.Tech', institution: 'NIT Agartala', course: 'Electrical Engineering',
    graduationYear: 2028, enrollmentStatus: 'Active Student'
  },
  'Employment Department': {
    citizenId: 'CIT-EMP-001', name: 'Nikhil Sharma', employmentStatus: 'Employed',
    employer: 'TechNova Solutions', designation: 'Software Developer', employmentType: 'Full Time', joiningYear: 2025
  }
};
export const requestOptions = {
  'Education Department': ['Educational Qualification', 'Academic Institution', 'Graduation Details', 'Complete Education Profile'],
  'Employment Department': ['Employment Status', 'Current Employment', 'Job Details', 'Complete Employment Profile']
};
export const EXCHANGE_KEY = 'mahasetu_department_requests_v1';
export const EXCHANGE_EVENT = 'mahasetu-department-requests-changed';
export function isExchangeDepartment(value: unknown): value is ExchangeDepartment {
  return value === 'Employment Department' || value === 'Education Department';
}
export const otherDepartment = (department: ExchangeDepartment): ExchangeDepartment =>
  department === 'Employment Department' ? 'Education Department' : 'Employment Department';

export function readRequests(): DataRequest[] {
  const value: unknown = JSON.parse(localStorage.getItem(EXCHANGE_KEY) || '[]');
  if (!Array.isArray(value) || !value.every(request => request && typeof request.id === 'string' &&
    isExchangeDepartment(request.sourceDepartment) && isExchangeDepartment(request.targetDepartment) &&
    ['pending', 'rejected', 'data_shared'].includes(request.status) && Array.isArray(request.events))) {
    throw new Error('Saved demo requests could not be read. Please restore valid demo storage.');
  }
  return value;
}
function saveRequests(requests: DataRequest[]) {
  localStorage.setItem(EXCHANGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(EXCHANGE_EVENT));
}
function officerDepartment(user: User): ExchangeDepartment {
  if (user.role !== 'department_officer' || !isExchangeDepartment(user.department)) {
    throw new Error('Only a department officer can perform this action.');
  }
  return user.department;
}
function event(user: User, request: DataRequest, action: string): AuditRecord {
  return {
    _id: crypto.randomUUID(), actorId: user.id, actorRole: user.role,
    action, resource: 'department_data_request', resourceId: request.id,
    department: user.department, outcome: 'SUCCESS', timestamp: new Date().toISOString(),
    metadata: { actorName: user.name, actorEmail: user.email }
  };
}
export function createRequest(user: User, requestedData: string, reason: string): DataRequest {
  const sourceDepartment = officerDepartment(user);
  const targetDepartment = otherDepartment(sourceDepartment);
  if (!requestOptions[targetDepartment].includes(requestedData) || !reason.trim() || reason.trim().length > 500) {
    throw new Error('Select a data category and enter a reason of up to 500 characters.');
  }
  const requests = readRequests();
  const prefix = targetDepartment === 'Education Department' ? 'REQ-EDU-' : 'REQ-EMP-';
  const next = Math.max(0, ...requests.filter(r => r.id.startsWith(prefix)).map(r => Number(r.id.slice(prefix.length)) || 0)) + 1;
  const profile = exchangeProfiles[targetDepartment];
  const request: DataRequest = {
    id: `${prefix}${String(next).padStart(3, '0')}`, sourceDepartment, targetDepartment,
    citizenId: profile.citizenId, citizenName: profile.name, requestedData, reason: reason.trim(),
    status: 'pending', createdAt: new Date().toISOString(), approvedAt: null, approvedBy: null, sharedData: null, events: []
  };
  request.events.push(event(user, request, `${sourceDepartment} requested ${targetDepartment} data`));
  saveRequests([...requests, request]);
  return request;
}
export function reviewRequest(user: User, id: string, approve: boolean): DataRequest {
  const department = officerDepartment(user);
  const requests = readRequests();
  const request = requests.find(item => item.id === id);
  if (!request || request.targetDepartment !== department) throw new Error('Only the receiving department can review this request.');
  if (request.status !== 'pending') throw new Error('This request has already been reviewed.');
  if (approve) {
    request.status = 'data_shared';
    request.approvedAt = new Date().toISOString();
    request.approvedBy = `${user.name} (${user.email})`;
    request.sharedData = { ...exchangeProfiles[department] };
    request.events.push(event(user, request, `${department} officer approved request`));
    request.events.push(event(user, request, `${department} data shared with ${request.sourceDepartment}`));
  } else {
    request.status = 'rejected';
    request.events.push(event(user, request, `${department} officer rejected request`));
  }
  saveRequests(requests);
  return request;
}
