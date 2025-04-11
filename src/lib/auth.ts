import { User } from '@/lib/dto/auth.dto';
import { LoginData, RegisterData } from '@/types';
import { AuthResponse, ApiResponse } from '@/types';
import { http, handleResponse } from '@/lib/http';

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }


  async login(data: LoginData): Promise<AuthResponse> {
    const response = await handleResponse<AuthResponse>(
      http.post<ApiResponse<AuthResponse>>('/auth/login', data)
    );
    if (response.token) {
      this.setToken(response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await handleResponse<AuthResponse>(
      http.post<ApiResponse<AuthResponse>>('/auth/register', data)
    );
    if (response.token) {
      this.setToken(response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }
}

export const auth = new AuthService(); 