import { Request, Response } from 'express';

// In-memory storage (replace this with your actual database implementation)
let transactions: Transaction[] = [];
let nextId = 1;

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: string;
  categoryId: number;
  date: Date;
}

const transactionController = {
  // Get all transactions
  getTransactions: async (req: Request, res: Response) => {
    try {
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  },

  // Get single transaction by ID
  getTransaction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const transaction = transactions.find(t => t.id === parseInt(id));
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  },

  // Create new transaction
  createTransaction: async (req: Request, res: Response) => {
    try {
      const { amount, description, type, categoryId, date } = req.body;
      const newTransaction: Transaction = {
        id: nextId++,
        amount,
        description,
        type,
        categoryId,
        date: new Date(date),
      };
      
      transactions.push(newTransaction);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  },

  // Update transaction
  updateTransaction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { amount, description, type, categoryId, date } = req.body;
      
      const index = transactions.findIndex(t => t.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      transactions[index] = {
        ...transactions[index],
        amount,
        description,
        type,
        categoryId,
        date: new Date(date),
      };
      
      res.json(transactions[index]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  },

  // Delete transaction
  deleteTransaction: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const index = transactions.findIndex(t => t.id === parseInt(id));
      
      if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      transactions.splice(index, 1);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  },
};

export default transactionController; 