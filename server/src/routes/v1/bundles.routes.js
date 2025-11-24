const express = require("express");
const router = express.Router();


// Public routes - no authentication required
// router.get("/", getBundles);
// router.get("/:slug", getBundleDetail);

// get all courses 
router.get("/:slug/courses", (req, res) => {
  res.send(`Courses in bundle: ${req.params.slug}`);
});


module.exports = router;
