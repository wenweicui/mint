import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
dotenv.config();

const serviceAccount = readFileSync(
  join(__dirname, '../../service-account.json'),
  'utf8'
);

interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  PLAID_ENV: string;
  ENCRYPTION_KEY: string;
}

export const {
  PORT = 3000,
  NODE_ENV = 'development',
  DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/postgres',
  FIREBASE_SERVICE_ACCOUNT = serviceAccount,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_ENV = 'sandbox',
  ENCRYPTION_KEY,
}: EnvironmentVariables = process.env as any; 