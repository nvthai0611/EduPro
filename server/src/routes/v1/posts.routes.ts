
import { Router } from "express";

import { uploadSingle, uploadContentImage } from "../../middlewares/servers/uploadCloudinary";
import authenticateToken from "../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
import postController from "../../modules/post/post.controller";
import answerController from "../../modules/answer/answer.controller";
import commentController from "../../modules/comment/comment.controller";
const router: Router = Router();


router.get("/health", (req, res) => {
    res.send("Post API is working");
});

// Get all posts - Public route
router.get("/", postController.getAllPosts);
// Get current user's posts - Protected route
router.get("/me", authenticateToken, postController.getMine);
// Get post by ID - Public route
router.get("/id/:id", postController.getPostById);
// Get posts by Slug - Public route
router.get("/slug/:slug", postController.getPostsBySlug);
// Get posts by user ID - Public route
router.get("/user/:userId", postController.getPostsByUser);

// Create a new post - Protected route (login user)
router.post("/", authenticateToken, uploadSingle, postController.createPost);

// Update a post - Protected route (login user)
router.put("/id/:id", authenticateToken, uploadSingle, postController.updatePost);

// Delete a post - Protected route (login user)
router.delete("/id/:id", authenticateToken, postController.deletePost);

// Upload image - Protected route (login user)
// Upload image - Protected route (login user)
router.post("/upload-image", authenticateToken, uploadContentImage, postController.uploadImage);

// --- New Forum Routes ---

// Get answers for a post
router.get("/:id/answers", answerController.getAnswersByPostId);

// Create answer for a post
router.post("/:id/answers", authenticateToken, answerController.createAnswer);

// Create comment for a post
router.post("/:id/comments", authenticateToken, commentController.createPostComment);

export const postRoutes: Router = router;
