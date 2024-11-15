import { User } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string;
        email: string;
        email_verified: boolean;
        display_name?: string;
        photo_url?: string;
      }
    }
  }
} 