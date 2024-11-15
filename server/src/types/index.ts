export interface IUser {
  id: string;
  firebaseUid: string;
  email: string;
  preferences?: Record<string, any>;
  fcmToken?: string;
}

export interface IPlaidAccount {
  id: string;
  userId: string;
  plaidItemId: string;
  accessToken: string;
  institutionId: string;
  institutionName: string;
}

export interface ITransaction {
  id: string;
  plaidAccountId: string;
  plaidTransactionId: string;
  amount: number;
  date: Date;
  description: string;
  category: string[];
  merchantName?: string;
  pending: boolean;
  rawData?: string;
  detailedDataExpiry: Date;
}

export interface IInvestment {
  id: string;
  userId: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

export interface INotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface ICategorySpending {
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface IMonthlyReport {
  totalSpending: number;
  categoryBreakdown: ICategorySpending[];
  largestTransactions: ITransaction[];
  comparisonToPreviousMonth: number;
}

export type TimeframeType = 'day' | 'week' | 'month' | 'year'; 