import settingController from "../../modules/setting/setting.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
import { Router } from "express";
const router: Router = Router();

router.get("/health", (req, res) => {
    res.send("Setting API is working");
});

// homepage banners - Public route (scoped by key)
router.get("/:key/slides", settingController.getBanners);

// Get full setting - Public route (scoped by key)
router.get("/:key", settingController.getSetting);

export const settingRoutes: Router = router;