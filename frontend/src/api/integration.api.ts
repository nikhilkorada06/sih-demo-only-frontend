import { apiClient } from './client';
import { Integration } from '../types/department.types';

export const integrationApi = {
  // Admin: Get all integrations
  async getIntegrations(): Promise<Integration[]> {
    const { data } = await apiClient.get<{ integrations: Integration[] }>('/integrations');
    return data.integrations;
  },

  // Admin: Get integration by ID
  async getIntegrationById(id: string): Promise<Integration> {
    const { data } = await apiClient.get<{ integration: Integration }>(`/integrations/${id}`);
    return data.integration;
  },
};
