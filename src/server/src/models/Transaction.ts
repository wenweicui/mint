import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface TransactionAttributes {
  id: string;
  plaidAccountId: string;
  plaidTransactionId: string;
  amount: number;
  date: Date;
  description: string;
  category: string[];
  merchantName?: string;
  pending: boolean;
  rawData?: any;
  detailedDataExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
  public id!: string;
  public plaidAccountId!: string;
  public plaidTransactionId!: string;
  public amount!: number;
  public date!: Date;
  public description!: string;
  public category!: string[];
  public merchantName!: string;
  public pending!: boolean;
  public rawData?: any;
  public detailedDataExpiry?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  plaidAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'PlaidAccounts',
      key: 'id'
    }
  },
  plaidTransactionId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  merchantName: {
    type: DataTypes.STRING
  },
  pending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rawData: {
    type: DataTypes.JSON,
    allowNull: true
  },
  detailedDataExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['plaidTransactionId']
    },
    {
      fields: ['date']
    },
    {
      fields: ['detailedDataExpiry']
    }
  ]
});

export default Transaction; 