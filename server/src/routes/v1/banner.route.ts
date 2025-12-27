import BannerController from "../../modules/banner/banner.controller";

import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";

import { Router } from "express";
const router: Router = Router();
router.get("/health", (req, res) => {
  res.send("Banner API is working");
});


// Public routes - No authentication required
router.get("/", BannerController.getBanner);
router.get("/:id", BannerController.getBannerById);
// (Add public routes here if needed)

export const bannerRoutes: Router = router;