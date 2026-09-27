export type UserRole = 'admin' | 'department_officer' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isVerified?: boolean;
  dateOfBirth?: string;
  phone?: string;
  registrationNumber?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  phone?: string;
  registrationNumber?: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  loginType?: 'citizen' | 'officer';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  userId?: string;
  email?: string;
  requiresVerification?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
