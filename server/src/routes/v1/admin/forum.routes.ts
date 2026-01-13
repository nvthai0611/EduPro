

import { Router } from "express";
import forumController from "../../../modules/forum/forum.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";
import { authorizeRoles } from "../../../middlewares/auth/authorizeRoles";
import { uploadForumImages } from "../../../middlewares/servers/uploadCloudinary";
const router: Router = Router();
// Create a new forum - Protected route
router.get("/", forumController.getAllForums);
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    uploadForumImages,
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