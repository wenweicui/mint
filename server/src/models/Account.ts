import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { encrypt, decrypt } from '../utils/encryption';

interface AccountAttributes {
  id: string;
  userId: string;
  plaidAccountId: string;
  plaidItemId: string;
  name: string;
  officialName: string | null;
  mask: string;
  type: 'depository' | 'investment' | 'loan' | 'credit' | 'other';
  subtype: string | null;
  persistentAccountId: string | null;
  holderCategory: 'personal' | 'business' | null;
  balanceAvailable: string | null;
  balanceCurrent: string;
  balanceLimit: string | null;
  isoCurrencyCode: string;
  unofficialCurrencyCode: string | null;
  institutionId: string;
  institutionName: string;
  isActive: boolean;
  lastSync: Date;
}

class Account extends Model<AccountAttributes> implements AccountAttributes {
  public id!: string;
  public userId!: string;
  public plaidAccountId!: string;
  public plaidItemId!: string;
  public name!: string;
  public officialName!: string | null;
  public mask!: string;
  public type!: 'depository' | 'investment' | 'loan' | 'credit' | 'other';
  public subtype!: string | null;
  public persistentAccountId!: string | null;
  public holderCategory!: 'personal' | 'business' | null;
  public balanceAvailable!: string | null;
  public balanceCurrent!: string;
  public balanceLimit!: string | null;
  public isoCurrencyCode!: string;
  public unofficialCurrencyCode!: string | null;
  public institutionId!: string;
  public institutionName!: string;
  public isActive!: boolean;
  public lastSync!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getBalanceAvailable(): number | null {
    return this.balanceAvailable ? parseFloat(decrypt(this.balanceAvailable)) : null;
  }

  public getBalanceCurrent(): number {
    return parseFloat(decrypt(this.balanceCurrent));
  }

  public getBalanceLimit(): number | null {
    return this.balanceLimit ? parseFloat(decrypt(this.balanceLimit)) : null;
  }
}

Account.init({
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
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  plaidItemId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  officialName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mask: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('depository', 'investment', 'loan', 'credit', 'other'),
    allowNull: false
  },
  subtype: {
    type: DataTypes.STRING,
    allowNull: true
  },
  persistentAccountId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  holderCategory: {
    type: DataTypes.ENUM('personal', 'business'),
    allowNull: true
  },
  balanceAvailable: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true,
    get() {
      const value = this.getDataValue('balanceAvailable');
      if (value === null) return null;
      return parseFloat(decrypt(value.toString()));
    },
    set(value: number | null) {
      if (value === null) {
        this.setDataValue('balanceAvailable', null);
      } else {
        this.setDataValue('balanceAvailable', encrypt(value.toString()));
      }
    }
  },
  balanceCurrent: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: false,
    get() {
      const value = this.getDataValue('balanceCurrent');
      if (value === null) return null;
      return parseFloat(decrypt(value.toString()));
    },
    set(value: number) {
      this.setDataValue('balanceCurrent', encrypt(value.toString()));
    }
  },
  balanceLimit: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true,
    get() {
      const value = this.getDataValue('balanceLimit');
      if (value === null) return null;
      return parseFloat(decrypt(value.toString()));
    },
    set(value: number | null) {
      if (value === null) {
        this.setDataValue('balanceLimit', null);
      } else {
        this.setDataValue('balanceLimit', encrypt(value.toString()));
      }
    }
  },
  isoCurrencyCode: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  unofficialCurrencyCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  institutionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  institutionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastSync: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'accounts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['plaidAccountId']
    },
    {
      fields: ['plaidItemId']
    },
    {
      fields: ['userId', 'isActive']
    }
  ]
});

export default Account;