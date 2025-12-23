import bannerController from "../../../modules/banner/banner.controller";

import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";

import { Router } from "express";

const router: Router = Router();

router.get("/health", (req, res) => {
  res.send("Banner API is working");
});

// Admin routes - Yêu cầu authentication + admin role
router.get("/", authenticateToken, authorizeRoles(["admin"]), bannerController.getAllBanners);
router.post("/", authenticateToken, authorizeRoles(["admin"]), bannerController.createBanner);
router.get("/:id", authenticateToken, authorizeRoles(["admin"]), bannerController.getBannerById);
router.put("/:id", authenticateToken, authorizeRoles(["admin"]), bannerController.updateBanner);
router.delete("/:id", authenticateToken, authorizeRoles(["admin"]), bannerController.deleteBanner);

export const bannerAdminRoutes: Router = router;