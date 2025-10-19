// BACKUP FILE - File booking routes cũ trước khi tách
// File này được tạo để backup, không sử dụng trong production

const express = require("express");
const router = express.Router();
const bookingController = require("../../../../controllers/v1/users/booking.controller");
const serviceController = require("../../../../controllers/v1/users/service.controller");
const branchController = require("../../../../controllers/v1/users/branch.controller");

// API Home page
//API: Chuyên mục dịch vụ
router.get("/categories", serviceController.getCategories);
router.get("/categories/:id", serviceController.getCategoryById);

// API: Chi nhánh
router.get("/branches", branchController.getAllBranches);
router.get("/branches/nearby", branchController.getNearbyBranches);

//API: Dịch vụ
router.get("/services", serviceController.getServices);
router.get("/services/:id", serviceController.getServiceById);

//API: Nhân viên
router.get("/aesthetican", serviceController.getAestheticians);

//API: Đặt lịch hẹn
router.get("/bookings/booked-time-slots", serviceController.getBookedTimeSlotsByAestheticians);

// API Auth Confirm
router.post("/bookings/request-otp", bookingController.requestOtp);
router.post("/bookings/verify-otp", bookingController.confirmBookingWithOtp);

// API Bookings
router.get("/bookings", bookingController.getAllBookings);
router.post("/bookings", bookingController.createBooking);
router.put("/bookings/:id", bookingController.updateBooking);
router.delete("/bookings/:id", bookingController.deleteBooking);

module.exports = router; 