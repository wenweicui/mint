import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface InvestmentAttributes {
  id: string;
  userId: string;
  plaidAccountId?: string;
  type: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'other';
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  notes?: string;
  lastPriceUpdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class Investment extends Model<InvestmentAttributes> implements InvestmentAttributes {
  public id!: string;
  public userId!: string;
  public plaidAccountId!: string;
  public type!: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'other';
  public symbol!: string;
  public quantity!: number;
  public purchasePrice!: number;
  public currentPrice!: number;
  public purchaseDate!: Date;
  public notes!: string;
  public lastPriceUpdate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Investment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  plaidAccountId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'PlaidAccounts',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('stock', 'bond', 'mutual_fund', 'etf', 'crypto', 'other'),
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(16, 8),
    allowNull: false
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  lastPriceUpdate: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  tableName: 'investments',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['symbol']
    },
    {
      fields: ['type']
    }
  ]
});

export default Investment; 