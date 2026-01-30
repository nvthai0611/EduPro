
import { Router } from "express";

import authenticateToken from "../../middlewares/auth/authenticateToken";
import optionalAuthenticate from "../../middlewares/auth/optionalAuthenticate";
import { authorizeRoles } from "../../middlewares/auth/authorizeRoles";
import postController from "../../modules/post/post.controller";
import { uploadContentImage, uploadSingle } from "../../middlewares/servers/uploadCloudinary";
import answerController from "../../modules/answer/answer.controller";
import commentController from "../../modules/comment/comment.controller";
const router: Router = Router();

router.get("/health", (req, res) => {
    res.send("Post API is working");
});

// Get all posts - Public route
router.get("/", optionalAuthenticate, postController.getAllPosts);
// Get post by ID - Public route
router.get("/id/:id", optionalAuthenticate, postController.getPostById);
// Get posts by Slug - Public route
router.get("/slug/:slug", optionalAuthenticate, postController.getPostsBySlug);
// Get posts by user ID - Public route
router.get("/user/:userId", postController.getPostsByUser);

// Get My Posts - Protected route (login user)
router.get("/me", authenticateToken, postController.getMine);

// Create a new post - Protected route (login user)
router.post("/", authenticateToken, uploadSingle, postController.createPost);

// Update a post - Protected route (author only)
router.put("/id/:id", authenticateToken, uploadSingle, postController.updatePost);

// Delete a post - Protected route (admin only)
router.delete("/id/:id", authenticateToken, authorizeRoles("admin"), postController.deletePost);

// Upload image - Protected route (login user)
router.post("/upload-image", authenticateToken, uploadContentImage, postController.uploadImage);

// Create post reaction - Protected route (login user)
router.post("/:id/reactions", authenticateToken, postController.createPostReaction);

// Delete post reaction - Protected route (login user)
router.delete("/:id/reactions/:reactionId", authenticateToken, postController.deletePostReaction);

// Track post view - Optional auth (works for both logged-in and anonymous users)
router.post("/:id/view", optionalAuthenticate, postController.trackPostView);

// router.get("/:id/answers", answerController.getAnswersByPostId);

// // Create answer for a post
// router.post("/:id/answers", authenticateToken, answerController.createAnswer);

// Create comment for a post
router.post("/:id/comments", authenticateToken, commentController.createPostComment);


// get trending posts
router.get("/trending", postController.getTrendingPosts);
router.get("/featured", postController.getFeaturedPosts);
export const postRoutes: Router = router;