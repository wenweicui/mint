import { Investment, PlaidAccount } from '../models';
import { Op } from 'sequelize';
import { ApiError } from '../utils/apiError';

// Define interfaces
interface InvestmentData {
  type: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'other';
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  [key: string]: any; // For any additional properties
}

interface InvestmentPerformance {
  id: string;
  symbol: string;
  initialValue: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

class InvestmentService {
  async getUserInvestments(userId: number): Promise<Investment[]> {
    try {
      return await Investment.findAll({
        where: { userId },
        order: [['purchaseDate', 'DESC']]
      });
    } catch (error) {
      throw new ApiError(`Failed to get investments: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  async addInvestment(userId: string, investmentData: InvestmentData): Promise<Investment> {
    try {
      return await Investment.create({
        id: uuidv4(),
        userId,
        ...investmentData
      });
    } catch (error) {
      throw new ApiError(`Failed to add investment: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  async updateInvestment(id: number, userId: number, updates: Partial<InvestmentData>): Promise<Investment> {
    try {
      const investment = await Investment.findOne({
        where: { id, userId }
      });

      if (!investment) {
        throw new ApiError('Investment not found', 404);
      }

      return await investment.update(updates);
    } catch (error) {
      throw new ApiError(`Failed to update investment: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  async getInvestmentPerformance(userId: number): Promise<InvestmentPerformance[]> {
    try {
      const investments = await Investment.findAll({
        where: { userId }
      });

      return investments.map(investment => ({
        id: investment.id,
        symbol: investment.symbol,
        initialValue: investment.quantity * investment.purchasePrice,
        currentValue: investment.quantity * investment.currentPrice,
        gainLoss: (investment.quantity * investment.currentPrice) - 
                 (investment.quantity * investment.purchasePrice),
        gainLossPercentage: ((investment.currentPrice - investment.purchasePrice) / 
                            investment.purchasePrice) * 100
      }));
    } catch (error) {
      throw new ApiError(`Failed to calculate performance: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }
}

export default new InvestmentService(); 

function uuidv4(): string {
  throw new Error('Function not implemented.');
}
