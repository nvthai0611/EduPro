const express = require("express");
const router = express.Router();
const promotionController = require("../../../../controllers/v1/admin/promotion.controller");

router.get("/", promotionController.getAllPromotions);
router.get("/:id", promotionController.getPromotion);
router.post("/", promotionController.createPromotion);
router.put("/:id", promotionController.updatePromotion);
router.patch("/:id/status", promotionController.setPromotionActiveStatus);

module.exports = router;
