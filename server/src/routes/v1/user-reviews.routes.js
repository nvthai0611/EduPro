const express = require("express");
const router = express.Router();
const {
  addReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
  getMyReviews,
} = require("../../controllers/v1/review.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// All routes require authentication
router.use(authenticateToken);

router.post("/", addReview);
router.get("/my", getMyReviews);
router.put("/:id", updateReview);
router.put("/:id/like", toggleReviewLike);
router.delete("/:id", deleteReview);

module.exports = router;
