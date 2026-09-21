import { UploadedDocument } from './document.types';
export interface JobDocument { name: string; required: boolean }
export interface EmploymentJob { _id: string; jobId: string; title: string; organization: string; department: string; location: string; district: string; employmentType: string; category: string; qualification: string; experience: string; salary: string; description: string; responsibilities: string[]; eligibility: string[]; deadline: string; requiredDocuments: JobDocument[] }
export interface EmploymentFormData { personal: Record<string,string>; education: Record<string,string>; employment: Record<string,string>; category: Record<string,string> }
export interface EmploymentApplication { _id: string; applicationNumber: string; jobId: string; employmentJobId: EmploymentJob|string; position: string; department: string; status: string; externalSubmissionStatus: string; submittedAt?: string; createdAt: string; formData?: EmploymentFormData; fetchedFields: string[] }
export interface EmploymentApplicationDetail { application: EmploymentApplication; job: EmploymentJob; documents: UploadedDocument[]; consent?: { status: string } }
