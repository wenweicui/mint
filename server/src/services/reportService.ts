// import { Transaction, PlaidAccount } from '../models';
// import { Op, Sequelize } from 'sequelize';
// import { ApiError } from '../utils/apiError';
// import { IMonthlyReport, TimeframeType } from '../types';
// import CategoryService from './categoryService';

// export class ReportService {
//   async getMonthlyReport(
//     userId: string, 
//     year: number, 
//     month: number
//   ): Promise<IMonthlyReport> {
//     try {
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0);
//       const previousMonthStart = new Date(year, month - 2, 1);
//       const previousMonthEnd = new Date(year, month - 1, 0);

//       // Get current month's transactions
//       const currentMonthTransactions = await Transaction.findAll({
//         include: [{
//           model: PlaidAccount,
//           where: { userId },
//           attributes: []
//         }],
//         where: {
//           date: {
//             [Op.between]: [startDate, endDate]
//           }
//         }
//       });

//       // Get previous month's total for comparison
//       const previousMonthTotal = await Transaction.findAll({
//         attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
//         include: [{
//           model: PlaidAccount,
//           where: { userId },
//           attributes: []
//         }],
//         where: {
//           date: {
//             [Op.between]: [previousMonthStart, previousMonthEnd]
//           }
//         }
//       }).then(result => result[0].getDataValue('total') || 0);

//       const categoryService = new CategoryService();
//       const categoryBreakdown = await categoryService.getCategorySpending(userId, 'month');

//       const totalSpending = currentMonthTransactions.reduce(
//         (sum, t) => sum + t.amount, 
//         0
//       );

//       return {
//         totalSpending,
//         categoryBreakdown,
//         largestTransactions: currentMonthTransactions
//           .sort((a, b) => b.amount - a.amount)
//           .slice(0, 5),
//         comparisonToPreviousMonth: previousMonthTotal 
//           ? ((totalSpending - previousMonthTotal) / previousMonthTotal) * 100 
//           : 0
//       };
//     } catch (error) {
//       throw new ApiError(`Failed to generate monthly report: ${error.message}`, 500);
//     }
//   }

//   async getSpendingTrends(
//     userId: string, 
//     timeframe: TimeframeType = 'month'
//   ): Promise<{
//     trends: Array<{ date: string; amount: number }>;
//     average: number;
//   }> {
//     try {
//       const timeframeDate = new Date();
//       const grouping = timeframe === 'year' ? 'MONTH' : 'DAY';
      
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

//       const trends = await Transaction.findAll({
//         attributes: [
//           [Sequelize.fn('DATE_TRUNC', grouping, Sequelize.col('date')), 'date'],
//           [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount']
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
//         group: [Sequelize.fn('DATE_TRUNC', grouping, Sequelize.col('date'))],
//         order: [[Sequelize.fn('DATE_TRUNC', grouping, Sequelize.col('date')), 'ASC']]
//       });

//       const trendData = trends.map(t => ({
//         date: t.getDataValue('date'),
//         amount: parseFloat(t.getDataValue('amount'))
//       }));

//       const average = trendData.reduce((sum, t) => sum + t.amount, 0) / trendData.length;

//       return {
//         trends: trendData,
//         average
//       };
//     } catch (error) {
//       throw new ApiError(`Failed to get spending trends: ${error.message}`, 500);
//     }
//   }
// }

// export default new ReportService(); 