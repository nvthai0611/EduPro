import { Router } from 'express';
import { userController } from '../../modules/user/user.controller';
import authenticateToken from '../../middlewares/auth/authenticateToken';

const router = Router();

router.get('/user-profile/:id', authenticateToken, userController.getUserById);

export const userRoutes: Router = router;
