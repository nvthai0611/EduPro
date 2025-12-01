import { Router } from 'express';
import { userController } from '../../../modules/user/user.controller';
import authenticateToken from '../../../middlewares/auth/authenticateToken';
import { roleController } from '../../../modules/role/role.controller';

const router = Router();

router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.post('/addUser', authenticateToken, userController.addUser);
router.get('/role/getAll', authenticateToken, roleController.getAllRoles);
router.post("/purchase/course", userController.addPurchasedCourse);

export const userAdminRoutes: Router = router;
