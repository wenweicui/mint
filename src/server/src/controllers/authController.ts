// import { Request, Response, NextFunction } from 'express';
// import * as authService from '../services/authService';
// import { ApiError } from '../utils/apiError';

// interface RegisterRequestBody {
//   email: string;
//   password: string;
// }

// export const register = async (
//   req: Request<{}, {}, RegisterRequestBody>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const user = await authService.register(email, password);
//     res.status(201).json(user);
//   } catch (error) {
//     next(new ApiError((error as Error).message, 400));
//   }
// };

// export const login = async (
//   req: Request<{}, {}, RegisterRequestBody>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const token = await authService.login(email, password);
//     res.json({ token });
//   } catch (error) {
//     next(new ApiError((error as Error).message, 401));
//   }
// }; 