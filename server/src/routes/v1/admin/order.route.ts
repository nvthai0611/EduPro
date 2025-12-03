import { Router } from "express";
import orderController from "../../../modules/order/order.controller";
import authenticateToken from "../../../middlewares/auth/authenticateToken";

const router = Router();

router.get("/", authenticateToken, orderController.getOrders);

router.delete("/:id", authenticateToken, orderController.deleteOrder);

export const orderAdminRoutes: Router = router;
