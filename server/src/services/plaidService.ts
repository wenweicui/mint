import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products, Transaction } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '../config/environment';
import { PlaidAccount } from '../models';
import { ApiError } from '../utils/apiError';
import { IPlaidAccount } from '../types';

interface LinkTokenConfig {
  user: {
    client_user_id: string;
  };
  client_name: string;
  products: string[];
  country_codes: string[];
  language: string;
}

export class PlaidService {
  private plaidClient: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
      },
    });
    this.plaidClient = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string): Promise<string> {
    try {
      const configs: LinkTokenCreateRequest = {
        user: { client_user_id: userId },
        client_name: 'Your App Name',
        products: [Products.Transactions],
        country_codes: [CountryCode.Ca],
        language: 'en'
      };

      const response = await this.plaidClient.linkTokenCreate(configs);
      return response.data.link_token;
    } catch (error: any) {
      throw new ApiError(`Failed to create link token: ${error.message}`, 500);
    }
  }

  // Exchange public token for access token
  async exchangePublicToken(publicToken: string, userId: string): Promise<string> {
    try {
      const response = await this.plaidClient.itemPublicTokenExchange({
        public_token: publicToken
      });

      const { access_token, item_id } = response.data;
      
      // Get institution details
      const item = await this.plaidClient.itemGet({ access_token });
      if (!item.data.item.institution_id) {
        throw new ApiError('Institution ID not found', 500);
      }
      const institution = await this.plaidClient.institutionsGetById({
        institution_id: item.data.item.institution_id,
        country_codes: [CountryCode.Ca],
      });

      // Save to database
      // await PlaidAccount.create({
      //   userId,
      //   plaidItemId: item_id,
      //   accessToken: access_token,
      //   institutionId: item.data.item.institution_id,
      //   institutionName: institution.data.institution.name,
      //   status: 'active'
      // });

      return access_token;
    } catch (error: any) {
      throw new ApiError(`Failed to exchange public token: ${error.message}`, 500);
    }
  }

  // Sync transactions for a user
  async syncTransactions(plaidAccountId: string): Promise<Transaction[]> {
    try {
      const plaidAccount = await PlaidAccount.findByPk(plaidAccountId);
      if (!plaidAccount) {
        throw new ApiError('Plaid account not found', 404);
      }

      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];

      const response = await this.plaidClient.transactionsGet({
        access_token: plaidAccount.accessToken,
        start_date: startDate,
        end_date: endDate,
      });

      return response.data.transactions;
    } catch (error: any) {
      throw new ApiError(`Failed to sync transactions: ${error.message}`, 500);
    }
  }

  // Get all accounts for a user
  async getAccounts(userId: string): Promise<PlaidAccount[]> {
    try {
      return await PlaidAccount.findAll({
        where: { userId },
        attributes: { exclude: ['accessToken'] }
      });
    } catch (error: any) {
      throw new ApiError(`Failed to get accounts: ${error.message}`, 500);
    }
  }
} 