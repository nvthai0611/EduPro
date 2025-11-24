const Coupon = require("../../models/coupon.model");
const Service = require("../../models/service.model");
const User = require("../../models/user.model");
const UserCoupon = require("../../models/user_coupon");
const CouponTransformer = require("../../transformers/coupon.transformers");

module.exports = {
  getAllCouponsByUserId: async (userId) => {
    if (!userId) {
      throw { status: 400, message: "Thiếu userId." };
    }
    const userCoupons = await UserCoupon.find({ userId })
      .populate("couponId")
      .sort({ createdAt: -1 });
    console.log("User Coupons:", userCoupons);
    return new CouponTransformer(userCoupons);
  },

  validateCouponCode: async (code, orderTotal, selectedServices, userId) => {
    console.log("Received coupon validation request:", {
      code,
      orderTotal,
      selectedServices,
      userId,
    });

    if (!code || !orderTotal || !userId) {
      throw {
        status: 400,
        message: "Thiếu thông tin mã giảm giá, tổng tiền hoặc userId.",
      };
    }

    const coupon = await Coupon.findOne({ code, isActive: true });
    console.log("Coupon found:", coupon);

    if (!coupon) {
      throw {
        status: 404,
        message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
      };
    }
    const now = new Date();

    if (coupon.startDate && now < new Date(coupon.startDate)) {
      throw {
        status: 400,
        message: "Mã giảm giá chưa bắt đầu được áp dụng.",
      };
    }

    if (coupon.endDate && now > new Date(coupon.endDate)) {
      throw {
        status: 400,
        message: "Mã giảm giá đã hết hạn.",
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: "Không tìm thấy người dùng." };
    }
    const userCoupon = await UserCoupon.findOne({
      userId,
      couponId: coupon._id,
    });
    if (userCoupon) {
      if (userCoupon.isUsed) {
        throw {
          status: 400,
          message: "Bạn đã sử dụng mã giảm giá này trước đó.",
        };
      }
    }
    if (coupon.minOrderTotal && orderTotal < coupon.minOrderTotal) {
      throw {
        status: 400,
        message: `Tổng tiền đơn hàng phải lớn hơn hoặc bằng ${coupon.minOrderTotal}.`,
      };
    }

    if (coupon.maxUses) {
      const usedCount = await UserCoupon.countDocuments({
        couponId: coupon._id,
        isUsed: true,
      });
      if (usedCount >= coupon.maxUses) {
        throw {
          status: 400,
          message: "Mã giảm giá đã hết lượt sử dụng.",
        };
      }
    }

    if (!coupon.applicableToAll && coupon.applicableServices?.length > 0) {
      const hasValidService = selectedServices.some((serviceId) =>
        coupon.applicableServices.includes(serviceId)
      );
      const services = await Service.find({
        _id: { $in: coupon.applicableServices },
      })
        .select("name")
        .lean();
      if (!hasValidService) {
        throw {
          status: 400,
          message: `Mã giảm giá chỉ áp dụng cho các dịch vụ như: ${services
            .map((s) => s.name)
            .join(", ")}.`,
        };
      }
    }
    console.log(selectedServices);
    // 👉 Bắt đầu tính giảm giá
    const discountableServices = coupon?.applicableServices?.filter((service) =>
      selectedServices.includes(service.toString())
    );

    const services = await Service.find({
      _id: { $in: discountableServices },
    }).sort({price: -1}).lean();
    console.log("Discountabl  e Services:", services);
    
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (services[0]?.basePrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = services[0]?.basePrice - coupon.discountValue;
    }

    if (discountAmount < 0) {
      discountAmount = 0; 
    }
    // // Cập nhật UserCoupon nếu cần
    if (userCoupon) {
      userCoupon.isUsed = true;
      userCoupon.usedAt = new Date();
      await userCoupon.save();
    } else {
      const newUserCoupon = new UserCoupon({
        userId,
        couponId: coupon._id,
        isUsed: true,
        usedAt: new Date(),
      });
      await newUserCoupon.save();
    }

    return {discountAmount, coupon};
  },
};
