import { Router } from "express";
import categoryController from "../../modules/category/category.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.get("/slug/:slug", categoryController.getBySlug);

router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export const categoryRoutes: Router = router;
