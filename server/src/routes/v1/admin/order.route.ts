import { Router } from "express";
import orderController from "../../../modules/order/order.controller";

const router = Router();

router.get("/", orderController.getOrders);

export const orderAdminRoutes: Router = router;
