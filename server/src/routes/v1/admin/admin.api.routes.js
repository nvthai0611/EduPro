const express = require("express");
const router = express.Router();
const serviceRouter = require("./services/service.routes");
const categoryRouter = require("./services/category.routes");
const userRouter = require("./users/user.routes");
const staffServiceRouter = require("./staffs/staffService.routes");
// const staffRouter = require("./staffs/staff.routes");
const roomRouter = require("./room/room.routes");
const reviewRouter = require("./services/review.routes");
const couponRouter = require("./coupons/coupon.routes");
const doashboardRouter = require("./services/dashboard.routes");
const branchRouter = require("./branchs/branch.routes");
const serviceDashboardRouter = require("./services/serviceDashboard.routes")
const productRouter = require("./products/productService.routes")
const promotionRouter = require("./promotions/promotion.routes");
const customer_careRouter = require("./customer_care/customer_care.routes")
const settingRouter = require("./settings/setting.routes")
//api service
router.use("/service", serviceRouter);
router.use("/category", categoryRouter);
router.use("/user", userRouter);
router.use("/staff-service", staffServiceRouter);
// router.use("/staff", staffRouter);
router.use("/room", roomRouter);
router.use("/review", reviewRouter);
router.use("/coupon", couponRouter);
router.use("/review", reviewRouter);
router.use("/dashboard", doashboardRouter);
router.use("/branch", branchRouter);
router.use("/serviceDashboard", serviceDashboardRouter)
router.use("/product", productRouter);
router.use("/promotion", promotionRouter);
router.use("/customer-care", customer_careRouter);
router.use('/setting', settingRouter)
module.exports = router;
