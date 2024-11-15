import * as admin from 'firebase-admin';
import { User } from '../models';
import { ITransaction, IUser } from '../types';
import { logger } from '../utils/logger';

export class NotificationService {
  private async sendNotification(
    user: IUser,
    notification: {
      title: string;
      body: string;
      data: Record<string, string>;
    }
  ): Promise<void> {
    if (!user.fcmToken) return;

    try {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data
      });
    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  async sendTransactionAlert(
    userId: string, 
    transaction: ITransaction
  ): Promise<void> {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;

      await this.sendNotification(user, {
        title: 'New Transaction Detected',
        body: `${transaction.merchantName}: $${transaction.amount}`,
        data: {
          type: 'TRANSACTION',
          transactionId: transaction.id
        }
      });
    } catch (error) {
      logger.error('Failed to send transaction alert:', error);
    }
  }

  async sendBudgetAlert(
    userId: string, 
    category: string, 
    percentage: number
  ): Promise<void> {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;

      await this.sendNotification(user, {
        title: 'Budget Alert',
        body: `You've used ${percentage}% of your ${category} budget`,
        data: {
          type: 'BUDGET_ALERT',
          category
        }
      });
    } catch (error) {
      logger.error('Failed to send budget alert:', error);
    }
  }
}

export default new NotificationService(); 