import User from './User';
import PlaidAccount from './PlaidAccount';
import Transaction from './Transaction';
import Investment from './Investment';
import Account from './Account';

// Define relationships
User.hasMany(PlaidAccount);
PlaidAccount.belongsTo(User);

User.hasMany(Account);
Account.belongsTo(User);

PlaidAccount.hasMany(Account);
Account.belongsTo(PlaidAccount);

PlaidAccount.hasMany(Transaction);
Transaction.belongsTo(PlaidAccount);

Account.hasMany(Transaction);
Transaction.belongsTo(Account);

User.hasMany(Investment);
Investment.belongsTo(User);

PlaidAccount.hasMany(Investment);
Investment.belongsTo(PlaidAccount);

// Optional: Define through relationships if needed
// User.hasMany(Transaction, { through: PlaidAccount });
// Transaction.belongsTo(User, { through: PlaidAccount });

export {
  User,
  PlaidAccount,
  Transaction,
  Investment,
  Account
};
