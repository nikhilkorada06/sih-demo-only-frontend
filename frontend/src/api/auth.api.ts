import { apiClient } from './client';
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  User
} from '../types/auth.types';

export const authApi = {
  // Create the account and establish its authenticated session
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return data;
  },

  // Verified accounts receive a JWT directly after password validation
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  // Get current authenticated user profile
  async getMe(): Promise<{ user: User }> {
    const { data } = await apiClient.get<{ user: User }>('/auth/me');
    return data;
  }
};
