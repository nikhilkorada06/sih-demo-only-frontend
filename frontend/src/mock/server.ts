import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../api/client';
import { mockUsers, mockDepartments, mockJobs, mockApplications, generateMLMockData, persistRegisteredCitizens, MockUser } from './data';
import { RegisterPayload, LoginPayload } from '../types/auth.types';

// Set a global delay of 1.5 seconds to simulate network latency for the demo
const mock = new MockAdapter(apiClient, { delayResponse: 1500 });

// --- FRONTEND-ONLY DEMO AUTHENTICATION ---
const publicUser = ({ password, ...user }: MockUser) => user;
const tokenFor = (user: MockUser) => `mock-user:${user.id}`;
const authenticatedUser = (authorization: unknown) =>
  mockUsers.find(user => authorization === `Bearer ${tokenFor(user)}`);

mock.onPost('/auth/register').reply((config) => {
  const payload: RegisterPayload = JSON.parse(config.data);
  const email = payload.email?.trim().toLowerCase();
  if (!payload.name?.trim() || !email || !payload.password || payload.password.length < 8) {
    return [400, { message: 'Name, email and a password of at least 8 characters are required.' }];
  }
  if (mockUsers.some(user => user.email === email)) {
    return [409, { message: 'Email is already registered.' }];
  }
  const newUser: MockUser = {
    id: `citizen-${crypto.randomUUID()}`,
    name: payload.name.trim(), email, password: payload.password,
    role: 'citizen', isVerified: true,
    phone: payload.phone, dateOfBirth: payload.dateOfBirth,
    registrationNumber: payload.registrationNumber
  };
  mockUsers.push(newUser);
  persistRegisteredCitizens();
  return [200, { message: 'Registered successfully', token: tokenFor(newUser), user: publicUser(newUser) }];
});

mock.onPost('/auth/login').reply((config) => {
  const payload: LoginPayload = JSON.parse(config.data);
  const user = mockUsers.find(user => user.email === payload.email?.trim().toLowerCase() && user.password === payload.password);
  if (!user || (payload.loginType === 'citizen' && user.role !== 'citizen') ||
      (payload.loginType === 'officer' && user.role === 'citizen')) {
    return [401, { message: 'Invalid email or password.' }];
  }
  return [200, { message: 'Logged in successfully', token: tokenFor(user), user: publicUser(user), userId: user.id, email: user.email }];
});

mock.onGet('/auth/me').reply((config) => {
  const user = authenticatedUser(config.headers?.Authorization);
  return user ? [200, { user: publicUser(user) }] : [401, { message: 'Please sign in again.' }];
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
mock.onGet('/applications').reply(200, { applications: mockApplications });
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
mock.onGet('/profile').reply((config) => {
  const user = authenticatedUser(config.headers?.Authorization);
  return user ? [200, { profile: publicUser(user), applicationCount: mockApplications.length }] : [401, { message: 'Please sign in again.' }];
});
mock.onGet('/profile/documents').reply(200, { documents: [] });

// --- NOTIFICATIONS ---
mock.onGet('/notifications').reply(200, { notifications: [], unreadCount: 0 });

// --- CATCH ALL UNHANDLED ---
mock.onAny().reply(200, {});

console.log('Mock Server Initialized! All API calls are now simulated locally.');
