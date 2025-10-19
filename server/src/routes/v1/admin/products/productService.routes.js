const express = require('express');
const router = express.Router();
const productServiceController = require('../../../../controllers/v1/admin/product.controller');
//const authMiddleware = require('../../../../middlewares/auth/v1/auth.middleware');
const uploadCloud = require("../../../../middlewares/servers/imageUpload");

router.get('/', productServiceController.getAllProducts);
router.patch('/:id/status', productServiceController.changeProductStatus);
router.post(
  "/",
  uploadCloud.array("images"),
  productServiceController.createProduct
);
router.put(
  "/:id",
  uploadCloud.array("images"),
  productServiceController.updateProduct
);


module.exports = router;