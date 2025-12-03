import { Request, Response } from 'express';
import UserService from './user.service';
import mongoose from 'mongoose';
import OrderService from '../order/order.service';
import User, { IUserDocument } from './user.model';
import userRepository from './user.repository';

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const user = await UserService.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            await UserService.updateUser(id, req.body);

            res.status(200).json("Cập nhật thành công");

        } catch (error) {
            res.status(500).json({ message: 'Cập nhật thất bại', error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            await UserService.deleteUser(id);

            res.status(200).json("Delete user success");

        } catch (error) {
            res.status(500).json({ message: 'Error delete user', error });
        }
    }

    async addUser(req: Request, res: Response): Promise<void> {
        try {
            const existEmail = await UserService.getUserByEmail(req.body.email);

            if (existEmail) {
                res.status(500).json("Email đã tồn tại");
            } else {
                await UserService.register(req.body);

                res.status(200).json("Thêm người dùng thành công");
            }

        } catch (error) {
            res.status(500).json({ message: 'Thêm người dùng thất bại', error });
        }
    }

    async addPurchasedCourse(req: Request, res: Response): Promise<void> {
        try {
            const { userId, courseId, price, orderId } = req.body;
            if (!userId || !courseId || !price || !orderId) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Validate ObjectId
            if (
                !mongoose.Types.ObjectId.isValid(userId) ||
                !mongoose.Types.ObjectId.isValid(courseId) ||
                !mongoose.Types.ObjectId.isValid(orderId)
            ) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
            }

            // Check user
            const user = await User.findById(userId) as IUserDocument | null;
            if (!user)
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });

            const order = await OrderService.getOrderById(orderId);
            if (!order)
                res.status(404).json({
                    success: false,
                    message: "Order not found",
                });

            // Add new purchased course
            await user.addPurchasedCourse(courseId, price, orderId);

            res.status(200).json({
                success: true,
                message: "Course added to purchasedCourses",
                purchasedCourses: user.purchasedCourses,
            });

        } catch (error) {
            res.status(500).json({ message: 'Thêm khóa học đã thanh toán thất bại', error });
        }
    }

    async revokePaidCourse(req: Request, res: Response): Promise<void> {
        try {
            const { userId, courseId } = req.params;

            if (!userId || !courseId) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Check user
            const user = await User.findById(userId) as IUserDocument | null;

            if (!user)
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });

            // Revoke paid course
            await userRepository.revokePaidCourse(userId, courseId);
            res.status(200).json({
                success: true,
                message: "Revoke paid course successfully",
                purchasedCourses: user.purchasedCourses,
            });
        } catch (error) {
            res.status(500).json({ message: 'Thu hồi khóa học đã thanh toán thất bại', error });
        }
    }
}

export const userController = new UserController();
