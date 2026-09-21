import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../api/client';
import { mockUsers, mockDepartments, mockJobs, mockApplications, generateMLMockData } from './data';
import { RegisterPayload, LoginPayload } from '../types/auth.types';

// Set a global delay of 1.5 seconds to simulate network latency for the demo
const mock = new MockAdapter(apiClient, { delayResponse: 1500 });

// --- AUTHENTICATION ---
mock.onPost('/auth/register').reply((config) => {
  const payload: RegisterPayload = JSON.parse(config.data);
  const newUser = {
    id: `user_${Date.now()}`,
    name: payload.name,
    email: payload.email,
    role: 'citizen' as const,
    isVerified: true
  };
  mockUsers.push(newUser);
  return [200, { message: 'Registered successfully', token: 'fake-jwt-token-123', user: newUser }];
});

mock.onPost('/auth/login').reply((config) => {
  const payload: LoginPayload = JSON.parse(config.data);
  const user = mockUsers.find(u => u.email === payload.email) || mockUsers[0]; // fallback to first user
  return [200, { message: 'Logged in successfully', token: 'fake-jwt-token-123', user, userId: user.id, email: user.email }];
});

mock.onGet('/auth/me').reply(() => {
  return [200, { user: mockUsers[0] }];
});

// --- DEPARTMENTS ---
mock.onGet('/departments').reply(200, { departments: mockDepartments });
mock.onGet(/\/departments\/.+/).reply(200, { department: mockDepartments[0] });

// --- EMPLOYMENT JOBS & APPLICATIONS ---
mock.onGet('/employment/jobs').reply(200, { jobs: mockJobs });
mock.onPost('/employment/jobs').reply((config) => {
  const payload = JSON.parse(config.data);
  const newJob = {
    ...payload,
    jobId: `JOB-${Date.now()}`,
    department: 'dept_2',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    eligibility: {
      minAge: 18,
      maxAge: 40,
      minEducation: payload.qualification || 'Graduation'
    }
  };
  mockJobs.push(newJob);
  return [201, { job: newJob }];
});
mock.onGet(/\/employment\/jobs\/.+/).reply(200, { job: mockJobs[0] });

mock.onGet('/employment/applications').reply(200, { applications: mockApplications });
mock.onGet('/applications/all').reply(200, { applications: mockApplications });

// Simulate starting an application
mock.onPost('/employment/applications').reply((config) => {
  const { jobId } = JSON.parse(config.data);
  const newApp = {
    _id: `app_${Date.now()}`,
    applicationNumber: `APP-EMP-${Date.now()}`,
    jobId,
    employmentJobId: jobId,
    position: mockJobs[0].title,
    department: 'dept_2',
    status: 'submitted',
    externalSubmissionStatus: 'PENDING',
    createdAt: new Date().toISOString(),
    fetchedFields: []
  };
  mockApplications.push(newApp);
  return [200, { application: newApp }];
});

mock.onGet(/\/employment\/applications\/[^/]+$/).reply((config) => {
  const idMatch = config.url?.match(/\/employment\/applications\/([^/]+)/);
  const id = idMatch ? idMatch[1] : '';
  const app = mockApplications.find(a => a._id === id) || mockApplications[0];
  return [200, { application: app, job: mockJobs[0], documents: [] }];
});

// SIMULATE ML MODEL DATA FETCHING WITH EXTRA DELAY
mock.onPost(/\/employment\/applications\/[^/]+\/fetch-data/).reply(async () => {
  // Extra 2.5s delay to simulate "AI processing" for the demo (total 4s)
  await new Promise(resolve => setTimeout(resolve, 2500));
  return [200, generateMLMockData()];
});

// Save application form data
mock.onPatch(/\/employment\/applications\/[^/]+$/).reply((config) => {
  return [200, { message: 'Saved successfully' }];
});

// Submit application
mock.onPost(/\/employment\/applications\/[^/]+\/submit/).reply((config) => {
  return [200, { application: mockApplications[0], trackingId: `TRK-${Date.now()}` }];
});

// --- DOCUMENTS ---
mock.onGet(/\/applications\/[^/]+\/documents/).reply(200, { documents: [] });
mock.onPost(/\/applications\/[^/]+\/documents/).reply(200, { 
  document: { id: `doc_${Date.now()}`, name: 'Uploaded Document', status: 'VERIFIED' } 
});

// --- PROFILE ---
mock.onGet('/profile').reply(200, { profile: mockUsers[0], applicationCount: mockApplications.length });
mock.onGet('/profile/documents').reply(200, { documents: [] });

// --- NOTIFICATIONS ---
mock.onGet('/notifications').reply(200, { notifications: [], unreadCount: 0 });

// --- CATCH ALL UNHANDLED ---
mock.onAny().reply(200, {});

console.log('Mock Server Initialized! All API calls are now simulated locally.');
