import express, { Router } from 'express';
import plaidController, { AuthenticatedRequest } from '../controllers/plaidController';

const router: Router = express.Router();

router.post('/create-link-token', (req, res, next) => plaidController.createLinkToken(req as AuthenticatedRequest, res, next));
router.post('/exchange-public-token', (req, res, next) => plaidController.exchangePublicToken(req as AuthenticatedRequest, res, next));

export default router; 