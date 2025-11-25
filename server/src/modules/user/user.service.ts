import User from "./user.model";

import userRepository from "./user.repository";
import { IUser } from "./user.model";

class UserService {
  async register(data: Partial<IUser>): Promise<IUser> {
    return userRepository.create(data);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return userRepository.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return userRepository.findAll();
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return userRepository.update(id, data);
  }

  async findOrCreateUser(email: any, providerId: any, fullName: any, image: any): Promise<IUser | null> {
    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = {
        fullName,
        email,
        googleId: providerId,
        image: image,
        status: true,
        isActive: true,
        confirmEmail: true,
        isGuest: false,
        purchasedCourses: [],
        purchasedBundles: [],
      }

      await userRepository.create(user);
    } else if (user.isGuest) {
      // user.set({
      //   fullName,
      //   provider: providerId,
      //   image: image,
      //   isGuest: false,
      //   status: true,
      //   isActive: true,
      //   confirmEmail: true,
      // });
      // await user.save();
    }

    if (!user.status || !user.isActive || !user.confirmEmail) return null;
    if (user.role !== "customer" && user.role !== "admin") return null;

    return user;
  }
}

export default new UserService();
