
import { Router } from "express";
import postController from "../../modules/post/post.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
const router: Router = Router();

router.get("/health", (req, res) => {
    res.send("Forum API is working");
});

// Get all forums - Public route
router.get("/", postController.getAllPosts);
// Get forum by ID - Public route
router.get("/id/:id", postController.getPostById);
// Get forums by Slug - Public route
router.get("/slug/:slug", postController.getPostsBySlug);
// Get forums by user ID - Public route
router.get("/user/:userId", postController.getPostsByUser);

// Create a new forum - Protected route (login user)
router.post("/", authenticateToken, postController.createPost);

// Update a forum - Protected route (admin only)
router.put("/id/:id", authenticateToken, authorizeRoles("admin"), postController.updatePost);

// Delete a forum - Protected route (admin only)
router.delete("/id/:id", authenticateToken, authorizeRoles("admin"), postController.deletePost);

// Upload image - Protected route (login user)
router.post("/upload-image", authenticateToken, postController.uploadImage);

export const forumRoutes: Router = router;