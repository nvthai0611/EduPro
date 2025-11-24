const Booking = require("../../models/booking.model");
const Review = require("../../models/review.model");
const ServiceReview = require("../../models/serviceReview.model");
const ReviewsStaff = require("../../models/reviewStaff.model");
const Staff = require("../../models/staff.model");
const mongoose = require("mongoose");

const ratingService = {
  // tính rating thực tế của staff
  getStaffRating: async (staffId) => {
    try {
      const objectIdStaffId = typeof staffId === 'string' ? new mongoose.Types.ObjectId(staffId) : staffId;
      
      const result = await ReviewsStaff.aggregate([
        { $match: { staffId: objectIdStaffId, status: true } },
        { $group: { _id: null, avg: { $avg: "$rating" } } }
      ]);
      return result[0]?.avg || 0;
    } catch (error) {
      return 0;
    }
  },

  // Cập nhật Staff.rating dựa trên ReviewsStaffs
  updateStaffRating: async (staffId) => {
    try {
      const realRating = await ratingService.getStaffRating(staffId);
      
      // Cập nhật Staff.rating
      await Staff.findByIdAndUpdate(staffId, {
        rating: realRating
      });
      
      return realRating;
    } catch (error) {
      console.error('Lỗi cập nhật Staff.rating:', error);
      return 0;
    }
  },

  createRating: async (
    id,
    bookingId = null,
    rating,
    comment = "",
    selectedOptions = [],
    serviceRatings = [],
    staffRatings = []
  ) => {
    // ===== VALIDATE CHUNG ======================================================
    if (!id || !rating || !Array.isArray(selectedOptions)) {
      throw { status: 400, message: "Thiếu thông tin bắt buộc." };
    }
    const userId = id;

    // ===== 1. GHI REVIEW TỔNG THỂ / THEO BOOKING ==============================
    const review = await Review.findOneAndUpdate(
      { userId, bookingId: bookingId || null },
      {
        $set: { rating, comment, selectedOptions, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true }
    );

    // ===== 2. NẾU CÓ bookingId + serviceRatings  ==> GHI CHI TIẾT SERVICE =====
    let serviceResult = null;
    let staffResult = null;
    if (bookingId) {
      // (a) Kiểm tra booking tồn tại & lấy branchId
      const booking = await Booking.findById(bookingId).lean();
      if (!booking) throw { status: 404, message: "Không tìm thấy booking." };
      const branchId = booking.branchId;

      // (b) Lọc trùng serviceId
      const uniqueMap = new Map();
      for (const s of serviceRatings) {
        if (s?.serviceId) uniqueMap.set(s.serviceId.toString(), s);
      }
      const uniqueRatings = [...uniqueMap.values()];

      // (c) Chuẩn bị bulk upsert cho service reviews
      const serviceOps = uniqueRatings.map((s) => ({
        updateOne: {
          filter: {
            userId,
            bookingId,
            serviceId: s.serviceId,
          },
          update: {
            $set: { branchId, rating: s.rating, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      }));

      // (d) Thực thi bulk upsert cho service reviews
      const serviceBulk = await ServiceReview.bulkWrite(serviceOps, { ordered: false });

      // (e) Lấy bản ghi service reviews đã lưu
      const savedServiceReviews = await ServiceReview.find({
        userId,
        bookingId,
        serviceId: { $in: uniqueRatings.map((s) => s.serviceId) },
      });

      serviceResult = {
        inserted: serviceBulk.upsertedCount,
        modified: serviceBulk.modifiedCount,
        data: savedServiceReviews,
      };

      // ===== 3. XỬ LÝ STAFF RATINGS (NEW) =====================================
      if (staffRatings && staffRatings.length > 0) {
        // (a) Lọc trùng staff ratings
        const uniqueStaffMap = new Map();
        for (const sr of staffRatings) {
          if (sr?.staffId && sr?.serviceId) {
            const key = `${sr.staffId.toString()}_${sr.serviceId.toString()}`;
            uniqueStaffMap.set(key, sr);
          }
        }
        const uniqueStaffRatings = [...uniqueStaffMap.values()];

        // (b) Chuẩn bị bulk upsert cho staff reviews
        const staffOps = uniqueStaffRatings.map((sr) => ({
          updateOne: {
            filter: {
              userId,
              bookingId,
              serviceId: sr.serviceId,
              staffId: sr.staffId,
            },
            update: {
              $set: { branchId, rating: sr.rating, updatedAt: new Date() },
              $setOnInsert: { createdAt: new Date() },
            },
            upsert: true,
          },
        }));

        // (c) Thực thi bulk upsert cho staff reviews
        const staffBulk = await ReviewsStaff.bulkWrite(staffOps, { ordered: false });

        // (d) Lấy bản ghi staff reviews đã lưu
        const savedStaffReviews = await ReviewsStaff.find({
          userId,
          bookingId,
          staffId: { $in: uniqueStaffRatings.map((sr) => sr.staffId) },
          serviceId: { $in: uniqueStaffRatings.map((sr) => sr.serviceId) },
        });

        staffResult = {
          inserted: staffBulk.upsertedCount,
          modified: staffBulk.modifiedCount,
          data: savedStaffReviews,
        };

        // ===== 4. CẬP NHẬT STAFF.RATING (NEW) =====================================
        // Cập nhật rating cho tất cả staff được đánh giá
        const staffIdsToUpdate = [...new Set(uniqueStaffRatings.map(sr => sr.staffId))];
        
        for (const staffId of staffIdsToUpdate) {
          await ratingService.updateStaffRating(staffId);
        }
      }
    }

    // ===== 5. TRẢ KẾT QUẢ ======================================================
    return {
      message: "Đánh giá thành công",
      review,          // đánh giá tổng thể
      serviceResult,   // đánh giá dịch vụ chi tiết
      staffResult,     // đánh giá nhân viên chi tiết (NEW)
    };
  }
};

module.exports = ratingService;
