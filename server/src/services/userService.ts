import { User } from '../models';
import ApiError from '../utils/apiError';
import { IUser } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  async findOrCreateUser(firebaseUid: string, email: string): Promise<IUser> {
    try {
      const [user] = await User.findOrCreate({
        where: { firebaseUid },
        defaults: { email, emailVerified: false, id: uuidv4(), firebaseUid }
      });
      return user;
    } catch (error: any) {
      throw new ApiError(`Failed to find or create user: ${error.message}`, 500);
    }
  }

  // async updateUserPreferences(
  //   userId: string, 
  //   preferences: Record<string, any>
  // ): Promise<IUser> {
  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) {
  //       throw new ApiError('User not found', 404);
  //     }
  //     return await user.update({ preferences });
  //   } catch (error) {
  //     throw new ApiError(`Failed to update preferences: ${error.message}`, 500);
  //   }
  // }
}

export default new UserService(); 
