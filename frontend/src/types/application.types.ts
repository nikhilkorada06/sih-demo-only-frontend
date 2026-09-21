export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  _id: string;
  citizenId: string;
  applicationNumber: string;
  jobId: string;
  department: string;
  position: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationPayload {
  jobId: string;
  department: string;
  position: string;
}

export interface UpdateApplicationPayload {
  department?: string;
  position?: string;
}
