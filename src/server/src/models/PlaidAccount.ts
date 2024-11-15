import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { encrypt, decrypt } from '../utils/encryption';

interface PlaidAccountAttributes {
  id: string;
  userId: string;
  plaidItemId: string;
  accessToken: string;
  institutionId: string;
  institutionName: string;
  status: 'active' | 'error' | 'pending' | 'disconnected';
  error?: string | null;
  lastSuccessfulUpdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class PlaidAccount extends Model<PlaidAccountAttributes> implements PlaidAccountAttributes {
  public id!: string;
  public userId!: string;
  public plaidItemId!: string;
  public accessToken!: string;
  public institutionId!: string;
  public institutionName!: string;
  public status!: 'active' | 'error' | 'pending' | 'disconnected';
  public error?: string | null;
  public lastSuccessfulUpdate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlaidAccount.init({
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
  plaidItemId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('accessToken');
      return decrypt(value);
    },
    set(value: string) {
      this.setDataValue('accessToken', encrypt(value));
    }
  },
  institutionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  institutionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'error', 'pending', 'disconnected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastSuccessfulUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'plaid_accounts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['plaidItemId'],
      unique: true
    },
    {
      fields: ['status']
    }
  ]
});

export default PlaidAccount; 