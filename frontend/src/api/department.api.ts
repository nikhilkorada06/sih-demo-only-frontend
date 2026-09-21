import { apiClient } from './client';
import { Department } from '../types/department.types';

export const departmentApi = {
  // Admin: Get all registered departments
  async getDepartments(): Promise<Department[]> {
    const { data } = await apiClient.get<{ departments: Department[] }>('/departments');
    return data.departments;
  },

  // Admin: Get department by ID
  async getDepartmentById(id: string): Promise<Department> {
    const { data } = await apiClient.get<{ department: Department }>(`/departments/${id}`);
    return data.department;
  },

  // Admin: Create new department
  async createDepartment(payload: Partial<Department> & { endpoints?: any[] }): Promise<Department> {
    const { data } = await apiClient.post<{ message: string; department: Department }>('/departments', payload);
    return data.department;
  },

  // Admin: Update department
  async updateDepartment(id: string, payload: Partial<Department>): Promise<Department> {
    const { data } = await apiClient.patch<{ message: string; department: Department }>(`/departments/${id}`, payload);
    return data.department;
  }
};
