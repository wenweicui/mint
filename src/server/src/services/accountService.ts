import { Account } from '../models';
import { createAuditLog } from './auditService';

export class AccountService {
  static async createAccount(userId: string, accountData: any) {
    const account = new Account({
      userId,
      ...accountData
    });
    
    await account.save();
    await createAuditLog({
      userId,
      action: 'CREATE_ACCOUNT',
      resourceId: account.id,
      details: { accountName: account.name }
    });
    
    return account;
  }

  static async getAccounts(userId: string) {
    return Account.findAll({ 
      where: { 
        userId, 
        isActive: true 
      }
    });
  }

  static async updateAccount(accountId: string, userId: string, updates: any) {
    const account = await Account.update(
      { id: accountId, userId },
      updates
    );

    if (!account) {
      throw new Error('Account not found');
    }

    await createAuditLog({
      userId,
      action: 'UPDATE_ACCOUNT',
      resourceId: accountId,
      details: { updates }
    });

    return account;
  }
} 