import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: string;
  firebaseUid: string;
  email: string;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public firebaseUid!: string;
  public email!: string;
  public emailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    autoIncrement: true
  },
  firebaseUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      fields: ['firebaseUid']
    },
    {
      fields: ['email']
    }
  ]
});

export default User; 