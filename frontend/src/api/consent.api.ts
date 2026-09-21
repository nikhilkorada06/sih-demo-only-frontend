import { apiClient } from './client';
import { Consent, CreateConsentPayload } from '../types/consent.types';

export const consentApi = {
  // Get all consent records belonging to citizen
  async getMyConsents(): Promise<Consent[]> {
    const { data } = await apiClient.get<{ consents: Consent[] }>('/consent');
    return data.consents;
  },

  // Get consent record for a specific application
  async getConsentByApplicationId(applicationId: string): Promise<Consent | null> {
    try {
      const { data } = await apiClient.get<{ consent: Consent }>(`/consent/${applicationId}`);
      return data.consent;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Grant DPDP 2023 compliant consent for an application
  async grantConsent(payload: CreateConsentPayload): Promise<Consent> {
    const { data } = await apiClient.post<{ message: string; consent: Consent }>('/consent', payload);
    return data.consent;
  },

  // Revoke previously granted consent
  async revokeConsent(applicationId: string): Promise<Consent> {
    const { data } = await apiClient.patch<{ message: string; consent: Consent }>(`/consent/${applicationId}/revoke`);
    return data.consent;
  }
};
