import { Sequelize } from 'sequelize';
import { DATABASE_URL, NODE_ENV } from './environment';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // For production
  ...(NODE_ENV === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Only if using Heroku
      }
    }
  })
});

const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export {
  sequelize,
  testConnection
}; 