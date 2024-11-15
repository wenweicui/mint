import Constants from 'expo-constants';

export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
  },
  staging: {
    baseURL: 'https://staging-api.yourapp.com/api',
    timeout: 30000,
  },
  production: {
    baseURL: 'https://api.yourapp.com/api',
    timeout: 30000,
  },
};

export const getApiConfig = () => {
  const environment = Constants.expoConfig?.extra?.environment || 'development';
  return API_CONFIG[environment as keyof typeof API_CONFIG];
}; 
