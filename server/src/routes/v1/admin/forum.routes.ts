

import { Router } from "express";
import forumController from "../../../modules/forum/forum.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import { uploadContentImage, uploadSingle } from "../../../middlewares/servers/uploadCloudinary";
const router: Router = Router();

// Upload single content image for editor
router.post(
    "/upload-image",
    authenticateToken,
    authorizeRoles("admin"),
    uploadContentImage,
    forumController.uploadImage
);

// Create a new forum - Protected route (only cover image now)
router.get("/", forumController.getAllForums);
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    uploadSingle,
    forumController.createForum
);
// Update a forum by ID - Protected route
router.put(
    "/:id", 
    authenticateToken,
    authorizeRoles("admin"),
    forumController.updateForum
);
router.delete(
    "/:id", 
    authenticateToken,
    authorizeRoles("admin"),
    forumController.deleteForum
);
export const adminForumRoutes: Router = router;