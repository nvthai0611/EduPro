const express = require('express');
const router = express.Router();
const aboutController = require('../../../controllers/v1/common/about.controller');

// Lấy rating trung bình của tất cả review
router.get('/average-rating', aboutController.getAverageRating);

module.exports = router;
