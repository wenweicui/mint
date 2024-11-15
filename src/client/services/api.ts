import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import Constants from 'expo-constants';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class Api {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        const user = useAuthStore.getState().user;
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          const logout = useAuthStore.getState().logout;
          await logout();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message: (error.response.data as any)?.message || 'An error occurred',
        status: error.response.status,
        errors: (error.response.data as any)?.errors,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response from server',
        status: 0,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'Unknown error occurred',
        status: 0,
      };
    }
  }

  // Generic request method
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  public configure(config: { baseURL?: string; timeout?: number }): void {
    if (config.baseURL) {
      this.instance.defaults.baseURL = config.baseURL;
    }
    if (config.timeout) {
      this.instance.defaults.timeout = config.timeout;
    }
  }
}

// API endpoints interface
export interface Endpoints {
  auth: {
    login: '/auth/login';
    register: '/auth/register';
    logout: '/auth/logout';
  };
  plaid: {
    createLinkToken: '/plaid/create-link-token';
    exchangePublicToken: '/plaid/exchange-public-token';
    getAccounts: '/plaid/accounts';
  };
  transactions: {
    list: '/transactions';
    details: (id: string) => `/transactions/${typeof id}`;
    sync: '/transactions/sync';
  };
  user: {
    profile: '/user/profile';
    settings: '/user/settings';
  };
}

// API endpoints
export const endpoints: Endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  plaid: {
    createLinkToken: '/plaid/create-link-token',
    exchangePublicToken: '/plaid/exchange-public-token',
    getAccounts: '/plaid/accounts',
  },
  transactions: {
    list: '/transactions',
    details: (id: string) => `/transactions/${id}`,
    sync: '/transactions/sync',
  },
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
  },
};

// Create and export API instance
export const api = new Api();

// Example usage with types
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string[];
  merchantName?: string;
  pending: boolean;
}

export interface User {
  id: string;
  email: string;
  token: string;
  createdAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  currency: string;
  language: string;
}

// API hooks for common operations
export const useApi = () => {
  const fetchTransactions = async () => {
    return api.get<Transaction[]>(endpoints.transactions.list);
  };

  const createLinkToken = async () => {
    return api.post<{ link_token: string }>(endpoints.plaid.createLinkToken);
  };

  const exchangePublicToken = async (publicToken: string) => {
    return api.post(endpoints.plaid.exchangePublicToken, { public_token: publicToken });
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    return api.patch<User>(endpoints.user.settings, settings);
  };

  const syncTransactions = async () => {
    return api.post<Transaction[]>(endpoints.transactions.sync);
  };

  return {
    fetchTransactions,
    createLinkToken,
    exchangePublicToken,
    updateUserSettings,
    syncTransactions,
  };
};

// Environment configuration
export const configureApi = (config: { baseURL?: string; timeout?: number }) => {
  api.configure(config);
};