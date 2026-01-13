
import { Router } from "express";
import forumController from "../../modules/forum/forum.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
const router: Router = Router();

router.get("/health", (req, res) => {
    res.send("Forum API is working");
});

// Get all forums - Public route
router.get("/", forumController.getAllForums);
// Get forum by ID - Public route
router.get("/id/:id", forumController.getForumById);
// Get forums by Slug - Public route
router.get("/slug/:slug", forumController.getForumsBySlug);
// Get forums by user ID - Public route
router.get("/user/:userId", forumController.getForumsByUser);
// Get forum by slug - Public route
router.get("/slug/:slug", forumController.getForumsBySlug);
export const forumRoutes: Router = router;