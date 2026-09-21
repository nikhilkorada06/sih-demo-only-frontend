export type VerificationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface VerificationRecord {
  id: string;
  status: VerificationStatus;
  matched: boolean;
  confidence: number;
  sourceDepartment?: string;
  verifiedAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface VerificationResponse {
  message: string;
  applicationId: string;
  applicationStatus: string;
  verification: VerificationRecord;
}

export interface DepartmentCheckItem {
  departmentCode: string;
  departmentName: string;
  category: string;
  status: 'verified' | 'pending' | 'failed' | 'unavailable';
  confidence: number;
  recordsChecked: string[];
}
