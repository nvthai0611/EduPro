const express = require("express");
const router = express.Router();
const {
  getBundles,
  getBundleDetail,
} = require("../../controllers/v1/bundlePublic.controller");

// Public routes - no authentication required
router.get("/", getBundles);
router.get("/:slug", getBundleDetail);

module.exports = router;
