import { Transaction, PlaidAccount } from '../models';
import { Op, Sequelize } from 'sequelize';
import ApiError from '../utils/apiError';
import { ITransaction } from '../types';

interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  category?: string[];
  merchantName?: string;
}

export class TransactionService {
  async bulkCreateTransactions(
    transactions: any[], 
    plaidAccountId: string
  ): Promise<Transaction[]> {
    try {
      const formattedTransactions = transactions.map(transaction => ({
        id: transaction.transaction_id,
        plaidAccountId,
        plaidTransactionId: transaction.transaction_id,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.name,
        category: transaction.category,
        merchantName: transaction.merchant_name,
        pending: transaction.pending,
        rawData: JSON.stringify(transaction),
        detailedDataExpiry: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000))
      }));

      return await Transaction.bulkCreate(formattedTransactions, {
        updateOnDuplicate: [
          'amount', 
          'description', 
          'category', 
          'merchantName', 
          'pending',
          'rawData',
          'detailedDataExpiry'
        ]
      });
    } catch (error: any) {
      throw new ApiError(`Failed to bulk create transactions: ${error.message}`, 500);
    }
  }
  // ... rest of the methods
} 