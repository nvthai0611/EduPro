const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getRevenueStats,
  getUserStats,
} = require("../../controllers/v1/admin/dashboard.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");
const { authorizeRoles } = require("../../middlewares/auth/authorizeRoles");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(["admin"]));

router.get("/", getDashboardStats);
router.get("/revenue", getRevenueStats);
router.get("/users", getUserStats);

module.exports = router;
