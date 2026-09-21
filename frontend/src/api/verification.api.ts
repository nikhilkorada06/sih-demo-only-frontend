import { apiClient } from './client';
import { VerificationRecord, VerificationResponse } from '../types/verification.types';

export const verificationApi = {
  // Get latest verification record for an application
  async getVerification(applicationId: string): Promise<{ applicationId: string; applicationStatus: string; verification: VerificationRecord } | null> {
    try {
      const { data } = await apiClient.get<{ applicationId: string; applicationStatus: string; verification: VerificationRecord }>(`/applications/${applicationId}/verification`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Admin/Officer: Get all verification attempts history for application
  async getVerificationsHistory(applicationId: string): Promise<VerificationRecord[]> {
    const { data } = await apiClient.get<{ verifications: VerificationRecord[] }>(`/applications/${applicationId}/verifications`);
    return data.verifications;
  },

  // Admin/Officer: Trigger cross-department verification
  async triggerVerification(applicationId: string): Promise<VerificationResponse> {
    const { data } = await apiClient.post<VerificationResponse>(`/applications/${applicationId}/verify`, {});
    return data;
  }
};
