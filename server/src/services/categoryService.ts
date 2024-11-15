import { Transaction, PlaidAccount } from '../models';
import { Op, Sequelize } from 'sequelize';
import { ApiError } from '../utils/apiError';
import { ICategorySpending, TimeframeType } from '../types';

export class CategoryService {
  async getUserCategories(userId: string): Promise<string[]> {
    try {
      const transactions = await Transaction.findAll({
        attributes: ['category'],
        include: [{
          model: PlaidAccount,
          where: { userId },
          attributes: []
        }],
        group: ['category']
      });
      
      return transactions
        .map(t => t.category)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i);
    } catch (error: any) {
      throw new ApiError(`Failed to get categories: ${error.message}`, 500);
    }
  }

//   async getCategorySpending(
//     userId: string, 
//     timeframe: TimeframeType = 'month'
//   ): Promise<ICategorySpending[]> {
//     try {
//       const timeframeDate = new Date();
//       switch (timeframe) {
//         case 'week':
//           timeframeDate.setDate(timeframeDate.getDate() - 7);
//           break;
//         case 'month':
//           timeframeDate.setMonth(timeframeDate.getMonth() - 1);
//           break;
//         case 'year':
//           timeframeDate.setFullYear(timeframeDate.getFullYear() - 1);
//           break;
//       }

//       const spending = await Transaction.findAll({
//         attributes: [
//           'category',
//           [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
//           [Sequelize.fn('COUNT', Sequelize.col('id')), 'transactionCount'],
//           [Sequelize.fn('AVG', Sequelize.col('amount')), 'averageAmount']
//         ],
//         include: [{
//           model: PlaidAccount,
//           where: { userId },
//           attributes: []
//         }],
//         where: {
//           date: {
//             [Op.gte]: timeframeDate
//           }
//         },
//         group: ['category']
//       });

//       return spending.map(s => ({
//         category: s.category[0],
//         totalAmount: parseFloat(s.get('totalAmount')),
//         transactionCount: parseInt(s.get('transactionCount')),
//         averageAmount: parseFloat(s.get('averageAmount'))
//       }));
//     } catch (error) {
//       throw new ApiError(`Failed to get category spending: ${error.message}`, 500);
//     }
//   }
}

export default new CategoryService(); 