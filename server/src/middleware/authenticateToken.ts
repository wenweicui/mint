import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import { ApiError } from '../utils/apiError';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    email_verified: boolean;
    firebaseUid: string;
    // Add other user properties you might need
  };
}

const firebaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    (req as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || '',
      email_verified: decodedToken.email_verified || false,
    };
    
    next();
  } catch (error) {
    next(new ApiError('Invalid or expired token', 401));
  }
}; 

export default firebaseAuth;