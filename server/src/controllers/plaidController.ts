import { Request, Response, NextFunction } from 'express';
import { PlaidService} from '../services/plaidService';
import { ApiError } from '../utils/apiError';

// Extend Express Request to include our user type
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    email_verified: boolean;
    firebaseUid: string;
    [key: string]: any;
  };
}

const plaidService = new PlaidService();

export const createLinkToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user is available from the firebaseAuthMiddleware
    const linkToken = await plaidService.createLinkToken(req.user.firebaseUid);
    res.json({ linkToken });
  } catch (error) {
    next(new ApiError((error as Error).message, 400));
  }
};

export const exchangePublicToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { publicToken } = req.body;
    await plaidService.exchangePublicToken(
      publicToken,
      req.user.firebaseUid
    );
    res.json({ success: true });
  } catch (error) {
    next(new ApiError((error as Error).message, 400));
  }
};

export default { createLinkToken, exchangePublicToken }; 