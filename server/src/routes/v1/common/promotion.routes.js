const express = require('express');
const promotionController = require('../../../controllers/v1/common/promotion.controller');
const router = express.Router();
router.get('/', promotionController.getAllPromotions);
module.exports = router;