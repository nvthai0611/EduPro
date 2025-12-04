import { Router } from 'express';
import { userController } from '../../modules/user/user.controller';
import authenticateToken from '../../middlewares/auth/authenticateToken';

const router = Router();

router.get('/user-profile/:id', authenticateToken, userController.getUserById);
router.get('/user-profile/me', authenticateToken, userController.getUserById); // Route để lấy profile của user hiện tại

export const userRoutes: Router = router;
