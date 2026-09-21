import { apiClient } from './client';

export interface AuditRecord {
  _id: string;
  actorId: string | null;
  actorRole?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  applicationId?: string;
  department?: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AuditQueryParams {
  action?: string;
  applicationId?: string;
  department?: string;
  actorId?: string;
  outcome?: string;
  page?: number;
  limit?: number;
}

export interface AuditResponse {
  logs: AuditRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const auditApi = {
  // Admin: Get paginated audit logs with filters
  async getLogs(params: AuditQueryParams = {}): Promise<AuditResponse> {
    const { data } = await apiClient.get<AuditResponse>('/audit', { params });
    return data;
  }
};
