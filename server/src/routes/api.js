const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("check");
});
// // Auth routes
// const authRouter = require("./v1/auth/auth.routes");
// const userRouter = require("./v1/auth/user.routes");
// checkout
// // Public routes
// const coursesRouter = require("./v1/courses.routes");
// const bundlesRouter = require("./v1/bundles.routes");
// const learningPathsRouter = require("./v1/learning-paths.routes");
// const reviewsRouter = require("./v1/reviews.routes");

// // User routes (authenticated)
// const purchaseRouter = require("./v1/purchase.routes");
// const lessonsRouter = require("./v1/lessons.routes");
// const progressRouter = require("./v1/progress.routes");
// const commentsRouter = require("./v1/comments.routes");
// const userReviewsRouter = require("./v1/user-reviews.routes");

// // Admin routes
// const adminCoursesRouter = require("./v1/admin/courses.routes");
// const adminBundlesRouter = require("./v1/admin/bundles.routes");
// const adminLearningPathsRouter = require("./v1/admin/learning-paths.routes");
// const adminDashboardRouter = require("./v1/admin/dashboard.routes");

// // Payment routes
// const paymentRouter = require("./v1/payment/payment.routes");
// const payosRouter = require("./v1/payos.routes");

// // Public API routes
// router.use("/courses", coursesRouter);
// router.use("/bundles", bundlesRouter);
// router.use("/learning-paths", learningPathsRouter);
// router.use("/reviews", reviewsRouter);

// // Authentication routes
// router.use("/auth", authRouter);
// router.use("/users", userRouter);

// // User routes (require authentication)
// router.use("/purchase", purchaseRouter);
// router.use("/lessons", lessonsRouter);
// router.use("/progress", progressRouter);
// router.use("/comments", commentsRouter);
// router.use("/user-reviews", userReviewsRouter);

// // Admin routes (require authentication + admin role)
// router.use("/admin/courses", adminCoursesRouter);
// router.use("/admin/bundles", adminBundlesRouter);
// router.use("/admin/learning-paths", adminLearningPathsRouter);
// router.use("/admin/dashboard", adminDashboardRouter);

// // Payment routes
// router.use("/zalo", paymentRouter);
// router.use("/payos", payosRouter);

module.exports = router;
