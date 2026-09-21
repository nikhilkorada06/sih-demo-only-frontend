export type ConsentDataCategory = 'education' | 'employment';
export type ConsentStatus = 'active' | 'revoked' | 'expired';

export interface Consent {
  _id: string;
  citizenId: string;
  applicationId: string;
  dataCategories: ConsentDataCategory[];
  status: ConsentStatus;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsentPayload {
  applicationId: string;
  dataCategories: ConsentDataCategory[];
  expiresAt?: string;
  purpose?: string;
  dataSource?: string;
}
