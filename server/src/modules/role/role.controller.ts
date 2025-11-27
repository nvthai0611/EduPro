// src/controllers/role.controller.ts

import { Request, Response } from 'express';
import { roleService } from './role.service';

class RoleController {
    async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await roleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching roles', error });
        }
    }

    async getRoleById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const role = await roleService.getRoleById(id);
            if (role) {
                res.status(200).json(role);
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching role', error });
        }
    }

    async createRole(req: Request, res: Response): Promise<void> {
        const roleData = req.body;
        try {
            const newRole = await roleService.createRole(roleData);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ message: 'Error creating role', error });
        }
    }

    async updateRole(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const roleData = req.body;
        try {
            const updatedRole = await roleService.updateRole(id, roleData);
            if (updatedRole) {
                res.status(200).json(updatedRole);
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating role', error });
        }
    }

    async deleteRole(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const deletedRole = await roleService.deleteRole(id);
            if (deletedRole) {
                res.status(200).json({ message: 'Role deleted successfully' });
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting role', error });
        }
    }
}

export const roleController = new RoleController();
