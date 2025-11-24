import { Router } from "express";
const router: Router = Router();

import * as authController from "../../../controllers/v1/auth/auth.controller";

router.post('/forgot-password-email', authController.sendLinkResetPassword);

router.post('/confirm-reset-password', authController.confirmEmailResetPassword);

export const authRoutes: Router = router;