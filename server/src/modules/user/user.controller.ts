import { Request, Response } from 'express';
import UserService from './user.service';
import mongoose from 'mongoose';
import OrderService from '../order/order.service';
import User, { IUserDocument } from './user.model';
import userRepository from './user.repository';

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        // Ưu tiên dùng id từ params, nếu không có hoặc là "me"/"undefined" thì lấy từ token
        let id = req.params.id;
        
        // Nếu id là undefined, "undefined", hoặc "me", lấy userId từ token (đã được decode trong authenticateToken)
        if (!id || id === "undefined" || id === "me") {
            // Ưu tiên dùng req.user.userId hoặc req.user.id từ authenticateToken middleware
            if (req.user) {
                const user = req.user as any;
                id = user.userId?.toString() || user.id?.toString();
            }
            
            // Nếu vẫn không có, fallback: decode token trực tiếp để lấy userId từ header
            if (!id) {
                try {
                    const { decodeToken } = require("../../utils/jwt");
                    // Lấy token từ cookie hoặc Authorization header
                    let token = req.cookies?.render_id;
                    if (!token && req.headers.authorization) {
                        const authHeader = req.headers.authorization;
                        if (authHeader.startsWith("Bearer ")) {
                            token = authHeader.substring(7).trim();
                        } else {
                            token = authHeader.trim();
                        }
                    }
                    
                    if (token) {
                        const decoded: any = await decodeToken(token);
                        if (decoded && decoded.userId) {
                            id = decoded.userId.toString();
                        }
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
            
            if (!id) {
                return res.status(400).json({ 
                    success: false,
                    message: 'User ID is required' 
                });
            }
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID format' 
            });
        }
        
        try {
            const user = await UserService.getUserById(id);
            if (user) {
                return res.status(200).json({
                    success: true,
                    data: user
                });
            } else {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }
        } catch (error) {
            console.error("GetUserById Error:", error);
            return res.status(500).json({ 
                success: false,
                message: 'Error fetching user', 
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await UserService.updateUser(id, req.body);

            return res.status(200).json("Cập nhật thành công");

        } catch (error) {
            return res.status(500).json({ message: 'Cập nhật thất bại', error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await UserService.deleteUser(id);

            return res.status(200).json("Delete user success");

        } catch (error) {
            return res.status(500).json({ message: 'Error delete user', error });
        }
    }

    async addUser(req: Request, res: Response): Promise<Response> {
        try {
            const existEmail = await UserService.getUserByEmail(req.body.email);

            if (existEmail) {
                return res.status(500).json("Email đã tồn tại");
            } else {
                await UserService.register(req.body);

                return res.status(200).json("Thêm người dùng thành công");
            }

        } catch (error) {
            return res.status(500).json({ message: 'Thêm người dùng thất bại', error });
        }
    }

    async addPurchasedCourse(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, courseId, price, orderId } = req.body;
            if (!userId || !courseId || !price || !orderId) {
                return res.status(400).json({
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
                return res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
            }

            // Check user
            const user = await User.findById(userId) as IUserDocument | null;
            if (!user)
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });

            const order = await OrderService.getOrderById(orderId);
            if (!order)
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                });

            // Add new purchased course
            await user.addPurchasedCourse(courseId, price, orderId);

            return res.status(200).json({
                success: true,
                message: "Course added to purchasedCourses",
                purchasedCourses: user.purchasedCourses,
            });

        } catch (error) {
            return res.status(500).json({ message: 'Thêm khóa học đã thanh toán thất bại', error });
        }
    }

    async revokePaidCourse(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, courseId } = req.params;

            if (!userId || !courseId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Check user
            const user = await User.findById(userId) as IUserDocument | null;

            if (!user)
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });

            // Revoke paid course
            await userRepository.revokePaidCourse(userId, courseId);
            return res.status(200).json({
                success: true,
                message: "Revoke paid course successfully",
                purchasedCourses: user.purchasedCourses,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Thu hồi khóa học đã thanh toán thất bại', error });
        }
    }
}

export const userController = new UserController();
