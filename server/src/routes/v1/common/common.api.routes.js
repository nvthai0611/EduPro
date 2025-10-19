const express = require("express");
const router = express.Router();
const categoryRouter = require("./category.routes");
const serviceRouter = require("./service.routes");
const reviewRouter = require("./review.routes");
const productRouter = require("./product.routes");
const promotionRouter = require("./promotion.routes");
const staffRouter = require("./staff.routes");
const branchRouter = require("./branch.routes");
const aboutRouter = require("./about.routes");

router.use("/category", categoryRouter);
router.use("/service", serviceRouter);
router.use("/review", reviewRouter);
router.use("/product", productRouter);
router.use("/promotions", promotionRouter);
router.use("/staff", staffRouter);
router.use("/branch", branchRouter);
router.use("/about", aboutRouter);

module.exports = router;
