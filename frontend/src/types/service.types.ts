export type ServiceCategory =
  | 'Certificates'
  | 'Education'
  | 'Employment'
  | 'Revenue & Land'
  | 'Agriculture'
  | 'Social Welfare'
  | 'Public Health'
  | 'Transport'
  | 'Housing';

export interface CitizenService {
  id: string;
  name: string;
  nameMr: string;
  departmentCode: string;
  departmentName: string;
  category: ServiceCategory;
  description: string;
  descriptionMr: string;
  eligibility: string[];
  requiredDocuments: string[];
  processingDays: number;
  fee: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  requiresCrossVerification?: boolean;
  verificationCategories?: string[];
  jobId?: string; // used for creating application
  position?: string;
}
