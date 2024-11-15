// import { Request, Response } from 'express';
// import User from '../models/User';
// import { v4 as uuidv4 } from 'uuid';

// export const syncUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }

//     const { uid, email, email_verified, display_name, photo_url } = req.user;

//     const [user, created] = await User.findOrCreate({
//       where: { firebaseUid: uid },
//       defaults: {
//         id: uuidv4(),
//         email: email || '',
//         emailVerified: email_verified || false,
//         firebaseUid: uid || '',
//         // displayName: display_name,
//         // photoURL: photo_url,
//         // lastLoginAt: new Date()
//       }
//     });

//     if (!created) {
//       await user.update({
//         email,
//         emailVerified: email_verified,
//         // displayName: display_name,
//         // photoURL: photo_url,
//         // lastLoginAt: new Date()
//       });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error syncing user data' });
//   }
// };

// export const getProfile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }
    
//     const user = await User.findOne({
//       where: { firebaseUid: req.user.uid }
//     });

//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching user profile' });
//   }
// };

// export const updateProfile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }
    
//     const user = await User.findOne({
//       where: { firebaseUid: req.user.uid }
//     });

//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     const { displayName, photoURL } = req.body;
//     await user.update({
//       // displayName,
//       // photoURL
//     });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating user profile' });
//   }
// };
