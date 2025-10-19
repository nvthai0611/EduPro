const express = require("express");
const router = express.Router();
const {
  purchaseCourse,
  purchaseBundle,
  getMyCourses,
  getMyBundles,
} = require("../../controllers/v1/purchase.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// All routes require authentication
router.use(authenticateToken);

router.post("/course/:id", purchaseCourse);
router.post("/bundle/:id", purchaseBundle);
router.get("/my-courses", getMyCourses);
router.get("/my-bundles", getMyBundles);

module.exports = router;
