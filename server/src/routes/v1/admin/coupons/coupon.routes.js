const express = require("express");
const router = express.Router();
const couponController = require("../../../../controllers/v1/admin/coupon.controller");

router.get("/", couponController.getAllCoupons);
router.get("/:id", couponController.getCoupon);
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
