import { Router } from 'express';
import { userController } from '../../modules/user/user.controller';
import authenticateToken from '../../middlewares/auth/authenticateToken';
import { roleController } from '../../modules/role/role.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.changeUserRole);
router.delete('/:id', userController.deleteUser);
router.get('/role/getAll', roleController.getAllRoles);

export const userRoutes: Router = router;
