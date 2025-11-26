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

    async changeUserRole(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        
        try {
            await UserService.updateUser(id, req.body);

            res.status(200).json("Update role success");

        } catch (error) {
            res.status(500).json({ message: 'Error update role', error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        
        try {
            await UserService.deleteUser(id);

            res.status(200).json("Delete user success");

        } catch (error) {
            res.status(500).json({ message: 'Error elete user', error });
        }
    }
}

export const userController = new UserController();
