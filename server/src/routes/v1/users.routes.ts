import { Router } from 'express';
import { userController } from '../../modules/user/user.controller';

const router = Router();

router.get('/user-profile/:id', userController.getUserById);

export const userRoutes: Router = router;
