const express = require("express");
const router = express.Router();
const bookingController = require("../../../../controllers/v1/users/booking.controller");
const serviceController = require("../../../../controllers/v1/users/service.controller");
const branchController = require("../../../../controllers/v1/users/branch.controller");
const authMiddleware = require("../../../../middlewares/auth/v1/auth.middleware");

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục ( Hải )
 *     tags: [Categories và Services]
 *     responses:
 *       200:
 *         description: Danh sách các danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết một danh mục
 *     tags: [Categories và Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
// API Home page
//API: Chuyên mục dịch vụ
router.get("/categories", serviceController.getCategories);
router.get("/categories/:id", serviceController.getCategoryById);

/**
 * @swagger
 * tags:
 *   - name: Branches
 *     description: Quản lý chi nhánh ( Hải )
 *   - name: Categories và Services
 *     description: Quản lý danh mục dịch vụ và quản lý các dịch vụ trong danh mục ( Hải )
 *   - name: Bookings
 *     description: Quản lý đặt lịch hẹn
 */

/**
 * @swagger
 * /api/v1/branches:
 *   get:
 *     summary: Lấy danh sách tất cả chi nhánh ( Hải)
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Danh sách các chi nhánh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/v1/branches/nearby:
 *   get:
 *     summary: Lấy danh sách chi nhánh gần đây
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Danh sách chi nhánh gần đây
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// API: Chi nhánh
router.get("/branches", branchController.getAllBranches);
router.get("/branches/nearby", branchController.getNearbyBranches);

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Lấy danh sách tất cả dịch vụ ( Hải)
 *     tags: [Categories và Services]
 *     responses:
 *       200:
 *         description: Danh sách các dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     summary: Lấy chi tiết một dịch vụ
 *     tags: [Categories và Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của dịch vụ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy dịch vụ
 */

//API: Dịch vụ
router.get("/services", serviceController.getServices);
router.get("/services/:id", serviceController.getServiceById);

/**
 * @swagger
 * /api/v1/aesthetican:
 *   get:
 *     summary: Lấy danh sách nhân viên thẩm mỹ ( Hải )
 *     tags: [Categories và Services]
 *     responses:
 *       200:
 *         description: Danh sách nhân viên thẩm mỹ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

//API: Nhân viên
router.get("/aesthetican", serviceController.getAestheticians);

/**
 * @swagger
 * /api/v1/bookings/booked-time-slots:
 *   get:
 *     summary: Lấy danh sách thời gian đã đặt của nhân viên ( Hải)
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Danh sách thời gian đã đặt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

//API: Đặt lịch hẹn
router.get(
  "/bookings/booked-time-slots",
  serviceController.getBookedTimeSlotsByAestheticians
);
/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Tạo mới một lịch hẹn
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - branchId
 *               - services
 *               - bookingTime
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID của khách hàng
 *               branchId:
 *                 type: string
 *                 description: ID của chi nhánh
 *               services:
 *                 type: array
 *                 description: Danh sách dịch vụ đặt
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       description: ID dịch vụ
 *                     stylistId:
 *                       type: string
 *                       description: (Tuỳ chọn) ID stylist được chọn
 *               bookingTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu đặt lịch (ISO 8601 format)
 *               note:
 *                 type: string
 *                 description: (Tuỳ chọn) Ghi chú thêm của khách hàng
 *     responses:
 *       200:
 *         description: Đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Dữ liệu lịch hẹn vừa tạo
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc có lỗi xảy ra khi đặt lịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không thể đặt lịch vì stylist đã bận trong thời gian này"
 */

/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: API quản lý lịch hẹn

 * /api/v1/bookings:
 *   post:
 *     summary: Tạo mới một lịch hẹn
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - branchId
 *               - services
 *               - bookingTime
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID của khách hàng
 *               branchId:
 *                 type: string
 *                 description: ID của chi nhánh
 *               services:
 *                 type: array
 *                 description: Danh sách dịch vụ
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       description: ID dịch vụ
 *                     stylistId:
 *                       type: string
 *                       description: (Tuỳ chọn) ID stylist
 *               bookingTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu (ISO 8601)
 *               note:
 *                 type: string
 *                 description: (Tuỳ chọn) Ghi chú
 *     responses:
 *       200:
 *         description: Đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc stylist bận
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *
 *   get:
 *     summary: Lấy danh sách tất cả lịch hẹn
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object

 * /api/v1/bookings/{id}:
 *   put:
 *     summary: Cập nhật lịch hẹn
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                     stylistId:
 *                       type: string
 *               bookingTime:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ

 *   delete:
 *     summary: Xoá lịch hẹn
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy

 * /api/v1/bookings/request-otp:
 *   post:
 *     summary: Gửi yêu cầu mã OTP
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *     responses:
 *       200:
 *         description: Gửi OTP thành công
 *       400:
 *         description: Gửi OTP thất bại

 * /api/v1/bookings/verify-otp:
 *   post:
 *     summary: Xác minh OTP và tạo lịch hẹn
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác minh thành công
 *       400:
 *         description: Mã OTP không hợp lệ hoặc đã hết hạn
 */
// router booking

// API Bookings
router.get("/bookings" ,authMiddleware,bookingController.getAllBookings);
router.post("/bookings",authMiddleware ,bookingController.createBooking);
router.put("/bookings/:id", authMiddleware,bookingController.updateBooking);
router.delete("/bookings/:id", authMiddleware,bookingController.deleteBooking);

router.get("/bookings/booking-verify", bookingController.verifyToken);

module.exports = router;
