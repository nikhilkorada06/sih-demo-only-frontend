import { apiClient } from './client';
import {
  Application,
  CreateApplicationPayload,
  UpdateApplicationPayload,
  ApplicationStatus
} from '../types/application.types';

export const applicationsApi = {
  // Get all applications belonging to citizen
  async getMyApplications(): Promise<Application[]> {
    const { data } = await apiClient.get<{ applications: Application[] }>('/applications');
    return data.applications;
  },

  // Get specific application by ID
  async getApplicationById(id: string): Promise<Application> {
    const { data } = await apiClient.get<{ application: Application }>(`/applications/${id}`);
    return data.application;
  },

  // Get application status summary
  async getApplicationStatus(id: string): Promise<{ applicationNumber: string; status: ApplicationStatus; updatedAt: string }> {
    const { data } = await apiClient.get<{ applicationNumber: string; status: ApplicationStatus; updatedAt: string }>(`/applications/${id}/status`);
    return data;
  },

  // Create new citizen application
  async createApplication(payload: CreateApplicationPayload): Promise<Application> {
    const { data } = await apiClient.post<{ message: string; application: Application }>('/applications', payload);
    return data.application;
  },

  // Update application (only if submitted status)
  async updateApplication(id: string, payload: UpdateApplicationPayload): Promise<Application> {
    const { data } = await apiClient.patch<{ message: string; application: Application }>(`/applications/${id}`, payload);
    return data.application;
  },

  // Withdraw submitted application
  async withdrawApplication(id: string): Promise<Application> {
    const { data } = await apiClient.delete<{ message: string; application: Application }>(`/applications/${id}`);
    return data.application;
  },

  // Admin/Officer: Get all applications across platform
  async getAllApplications(): Promise<Application[]> {
    const { data } = await apiClient.get<{ applications: Application[] }>('/applications/all');
    return data.applications;
  },

  // Admin/Officer: Update application status directly
  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const { data } = await apiClient.patch<{ message: string; application: Application }>(`/applications/${id}/status`, { status });
    return data.application;
  }
};
