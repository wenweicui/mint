import express, { Router } from 'express';
import transactionController from '../controllers/transactionController';

const router: Router = express.Router();

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router; 