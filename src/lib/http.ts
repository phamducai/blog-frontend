import axios, { AxiosResponse } from 'axios';
import { auth } from './auth';
import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
http.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Custom type guard
function isApiResponse(data: any): data is ApiResponse<any> {
  return data && typeof data === 'object' && 'success' in data;
}

// Add response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform the response data
    const transformedData = isApiResponse(response.data) 
      ? response.data 
      : {
          success: true,
          data: response.data,
        };
    
    // Return a new response with transformed data
    return {
      ...response,
      data: transformedData,
    };
  },
  (error) => {
    if (error.response?.status === 401) {
      auth.logout();
    }
    
    return Promise.reject({
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
    });
  }
);

// Helper function to handle API responses
export const handleResponse = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> => {
  try {
    const response = await promise;
    if (!response.data.success) {
      throw new Error(response.data.message || 'An error occurred');
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message || 'An error occurred');
  }
}; 