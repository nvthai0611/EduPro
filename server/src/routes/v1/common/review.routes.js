const reviewController = require('../../../controllers/v1/admin/review.controller')
const express = require("express");
const router = express.Router();

router.get('/', reviewController.getAllReviews)
router.get('/by-service', reviewController.getAllReviewServiceController)
module.exports = router