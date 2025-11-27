import { Request, Response } from 'express';
import UserService from './user.service';

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
}

export const userController = new UserController();
