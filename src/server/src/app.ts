import express, { Application } from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import { errorMiddleware } from './middleware/errorMiddleware';
import plaidRoutes from './routes/plaidRoutes';
import transactionRoutes from './routes/transactionRoutes';
// import userRoutes from './routes/userRoutes';
import firebaseAuthMiddleware from './middleware/authenticateToken';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));

// Protected routes
app.use('/api/plaid', firebaseAuthMiddleware, plaidRoutes);
app.use('/api/transactions', firebaseAuthMiddleware, transactionRoutes);
// app.use('/api/users', firebaseAuthMiddleware, userRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app; 