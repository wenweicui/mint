## Get Started

1. Install Node.js and npm
2. Install PostgreSQL
3. Install Sequelize CLI globally: `npm install -g sequelize-cli`
4. Install dependencies: `npm install`
5. Create a `.env` file based on `.env.example` and set the appropriate values.
6. Run `npx sequelize-cli db:migrate` to create the database schema.

# Running the Development Environment
1. Without Docker:
```
# Start Firebase emulators
npm run emulator

# In another terminal, start the development server
npm run dev

# Run tests
npm test
```


## Infrastructure Setup
1. Database: AWS RDS (PostgreSQL)

```
# Example RDS configuration
- Instance: db.t3.micro (for starting)
- Multi-AZ: No (initially)
- Storage: 20GB GP2 (can scale up)
- Backup: 7 days retention
- Monitoring: Enhanced monitoring enabled
```

2. Backend: AWS Elastic Beanstalk or ECS
```
version: '3.8'
services:
  api:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${RDS_CONNECTION_STRING}
      - FIREBASE_SERVICE_ACCOUNT=${FIREBASE_SERVICE_ACCOUNT}
      - PLAID_CLIENT_ID=${PLAID_CLIENT_ID}
      - PLAID_SECRET=${PLAID_SECRET}
    ports:
      - "80:3000"
```

3. Authentication: Firebase

## LLM Opportunities
1. Smart Transaction Categorization
2. Financial Insights Generator
3. Budget Recommendations
4. Savings Goals Advisor
