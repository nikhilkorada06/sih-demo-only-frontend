import { User } from '../types/auth.types';
import { Department } from '../types/department.types';
import { EmploymentJob, EmploymentApplication } from '../types/employment.types';

// Intentionally public, frontend-only demonstration credentials.
export interface MockUser extends User { password: string }
export const demoUsers: MockUser[] = [
  { id: 'citizen-demo-001', name: 'Demo Citizen', email: 'citizen@mahasetu.com', password: 'Citizen@123', role: 'citizen', isVerified: true },
  { id: 'officer-employment-001', name: 'Employment Department Officer', email: 'employment.officer@mahasetu.com', password: 'Employment@123', role: 'department_officer', department: 'Employment Department', isVerified: true },
  { id: 'officer-education-001', name: 'Education Department Officer', email: 'education.officer@mahasetu.com', password: 'Education@123', role: 'department_officer', department: 'Education Department', isVerified: true },
  { id: 'admin-demo-001', name: 'MahaSetu System Administrator', email: 'admin@mahasetu.com', password: 'Admin@123', role: 'admin', isVerified: true }
];

const REGISTERED_USERS_KEY = 'mahasetu_mock_citizens';
function loadRegisteredCitizens(): MockUser[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((user): user is MockUser =>
      user && user.role === 'citizen' && typeof user.id === 'string' &&
      typeof user.name === 'string' && typeof user.email === 'string' && typeof user.password === 'string' &&
      !demoUsers.some(demo => demo.id === user.id || demo.email === user.email)
    ).map(({ department, ...user }) => user);
  } catch { return []; }
}
export const mockUsers: MockUser[] = [...demoUsers, ...loadRegisteredCitizens()];
export function persistRegisteredCitizens() {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(mockUsers.filter(user =>
    user.role === 'citizen' && !demoUsers.some(demo => demo.id === user.id)
  )));
}

export const mockDepartments: Department[] = [
  {
    _id: 'dept_1',
    name: 'Revenue Department',
    code: 'REV',
    active: true,
    dataCategories: ['Identity', 'Land'],
    serviceCount: 15
  },
  {
    _id: 'dept_2',
    name: 'Employment and Skill Development Department',
    code: 'EMP',
    active: true,
    dataCategories: ['Employment', 'Certificates'],
    serviceCount: 8,
    frontendUrl: 'http://localhost:5174'
  }
];

export const mockJobs: EmploymentJob[] = [
  {
    _id: 'job_1',
    jobId: 'JOB-2023-001',
    title: 'Senior Software Engineer (Government IT)',
    organization: 'Ministry of Electronics and IT',
    department: 'dept_2',
    location: 'New Delhi',
    district: 'New Delhi',
    employmentType: 'Full-time',
    category: 'IT Professional',
    qualification: 'B.Tech/M.Tech in Computer Science',
    experience: '5+ Years',
    salary: '₹12,00,000 - ₹15,00,000 PA',
    description: 'Looking for a senior software engineer to lead the development of the National Citizen Portal.',
    responsibilities: ['Develop scalable backend systems', 'Lead frontend architecture', 'Mentor junior developers'],
    eligibility: ['Must be an Indian Citizen', 'Minimum 5 years of relevant experience'],
    deadline: '2027-12-31T00:00:00.000Z',
    requiredDocuments: [
      { name: 'Resume', required: true },
      { name: 'B.Tech Degree Certificate', required: true }
    ]
  }
];

export const mockApplications: EmploymentApplication[] = [
  {
    _id: 'app_1',
    applicationNumber: 'APP-EMP-001',
    jobId: 'JOB-2023-001',
    employmentJobId: 'job_1',
    position: 'Senior Software Engineer (Government IT)',
    department: 'dept_2',
    status: 'under_review',
    externalSubmissionStatus: 'PENDING',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    fetchedFields: ['fullName', 'educationLevel']
  },
  {
    _id: 'app_2',
    applicationNumber: 'APP-EMP-002',
    jobId: 'JOB-2023-001',
    employmentJobId: 'job_1',
    position: 'Senior Software Engineer (Government IT)',
    department: 'dept_2',
    status: 'verified',
    externalSubmissionStatus: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    fetchedFields: ['fullName']
  },
  {
    _id: 'app_3',
    applicationNumber: 'APP-EMP-003',
    jobId: 'JOB-2023-001',
    employmentJobId: 'job_1',
    position: 'Senior Software Engineer (Government IT)',
    department: 'dept_2',
    status: 'submitted',
    externalSubmissionStatus: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    fetchedFields: []
  }
];

// Helper to simulate the ML Model data extraction
export const generateMLMockData = () => ({
  data: {
    fullName: 'Nikhil Korada',
    dateOfBirth: '2000-01-01',
    educationLevel: 'B.Tech Computer Science',
    experienceYears: '2'
  },
  fetchedFields: ['fullName', 'dateOfBirth', 'educationLevel', 'experienceYears'],
  sources: {
    fullName: 'Aadhar DB (99% confidence)',
    dateOfBirth: 'Aadhar DB (98% confidence)',
    educationLevel: 'University Grants Commission (95% confidence)'
  },
  matchedDepartments: [
    { department: 'Education Department', confidence: 0.95 },
    { department: 'Revenue Department', confidence: 0.82 }
  ]
});
