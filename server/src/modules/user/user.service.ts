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

  async findOrCreateUser(
    email: any,
    fullName: any,
    image: any
  ): Promise<IUser | null> {
    let user = await userRepository.findByEmail(email);

    if (!user) {
      await userRepository.create({
        fullName,
        email,
        image,
        status: true,
        role: "customer",
        isActive: true,
        confirmEmail: true,
        isGuest: false,
        purchasedCourses: [],
        purchasedBundles: [],
      });

      user = await userRepository.findByEmail(email);
    }

    if (!user.status || !user.isActive || !user.confirmEmail) return null;
    if (user.role !== "customer" && user.role !== "admin") return null;

    return user;
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return userRepository.delete(id);
  }
}

export default new UserService();
