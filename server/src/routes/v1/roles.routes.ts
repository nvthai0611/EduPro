// src/routes/role.routes.ts

import { Router } from 'express';
import { roleController } from '../../modules/role/role.controller';
import authenticateToken from '../../middlewares/auth/authenticateToken';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Define the routes for the role resource
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export const roleRoutes: Router = router;
