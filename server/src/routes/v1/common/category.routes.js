const express = require('express');
const router = express.Router();
const categoryController = require('../../../controllers/v1/admin/category.controller');
const serviceController = require('../../../controllers/v1/admin/service.controller');

router.get('/', categoryController.getAllCategories);
router.get("/services/category-with-review/:categoryId", serviceController.getServicesByCategoryWithReview);
router.get("/services/category/:categoryId", serviceController.getServicesByCategory);
router.get("/:id", categoryController.getCategory);

module.exports = router;