// User related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  settings?: UserSettings;
  token?: string;
}

export interface UserSettings {
  notifications: boolean;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

// Transaction related types
export interface Transaction {
  id: string;
  plaidTransactionId: string;
  userId: string;
  accountId: string;
  amount: number;
  date: string;
  description: string;
  category: string[];
  merchantName?: string;
  pending: boolean;
  createdAt: string;
  updatedAt: string;
  type: 'expense' | 'income';
}

// Plaid related types
export interface PlaidAccount {
  id: string;
  userId: string;
  plaidAccountId: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  institutionName: string;
  balance: {
    available: number;
    current: number;
    limit?: number;
  };
}

// API related types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 