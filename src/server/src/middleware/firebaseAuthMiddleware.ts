// import { Request, Response, NextFunction } from 'express';
// import admin from '../config/firebase';
// import { ApiError } from '../utils/apiError';
// import User from '../models/User';

// // Define interfaces for better type safety
// interface FirebaseDecodedToken {
//   uid: string;
//   email?: string;
//   email_verified?: boolean;
//   [key: string]: any;
// }

// interface AuthenticatedRequest extends Request {
//   user: typeof User['prototype'];
//   firebaseUser: FirebaseDecodedToken;
// }

// export const firebaseAuthMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith('Bearer ')) {
//       throw new ApiError('No token provided', 401);
//     }

//     const token = authHeader.split('Bearer ')[1];
//     const decodedToken = await admin.auth().verifyIdToken(token);
    
//     // Find or create user in our database
//     let user = await User.findOne({ 
//       where: { firebaseUid: decodedToken.uid } 
//     });

//     if (!user && decodedToken.email && decodedToken.email_verified) {
//       user = await User.create({
//         firebaseUid: decodedToken.uid,
//         email: decodedToken.email,
//         emailVerified: decodedToken.email_verified,
//       });
//     }

//     // Type assertion to add user properties to request
//     (req as AuthenticatedRequest).user = user;
//     (req as AuthenticatedRequest).firebaseUser = decodedToken;
    
//     next();
//   } catch (error) {
//     next(new ApiError((error as Error).message, 401));
//   }
// }; 