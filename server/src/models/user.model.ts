const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.isGuest;
      },
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Email is not valid",
      },
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/474x/89/5d/d6/895dd68089c0e943bb0f30cd3d618ace.jpg",
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Optional field
          return /^((03|05|07|08|09)[0-9]{8})$/.test(value);
        },
        message:
          "Phone number must be 10 digits and is a valid Vietnam phone number",
      },
    },
    // Learning platform specific fields
    purchasedCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        purchasedAt: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        paymentId: {
          type: String,
          required: true,
        },
      },
    ],
    purchasedBundles: [
      {
        bundleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bundle",
          required: true,
        },
        purchasedAt: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        paymentId: {
          type: String,
          required: true,
        },
      },
    ],
    //cái này thêm vào để nếu người dùng không kích hoạt tài khoản sau 24h thì tự động xóa
    //Sử dụng thư viện node-cron để kiểm tra
    verifyExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
  },

  { collection: "Users", timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Learning platform methods
userSchema.methods.hasPurchasedCourse = function (courseId) {
  return this.purchasedCourses.some(
    (purchase) => purchase.courseId.toString() === courseId.toString()
  );
};

userSchema.methods.hasPurchasedBundle = function (bundleId) {
  return this.purchasedBundles.some(
    (purchase) => purchase.bundleId.toString() === bundleId.toString()
  );
};

userSchema.methods.addPurchasedCourse = function (courseId, price, paymentId) {
  this.purchasedCourses.push({
    courseId,
    purchasedAt: new Date(),
    price,
    paymentId,
  });
  return this.save();
};

userSchema.methods.addPurchasedBundle = function (bundleId, price, paymentId) {
  this.purchasedBundles.push({
    bundleId,
    purchasedAt: new Date(),
    price,
    paymentId,
  });
  return this.save();
};

userSchema.methods.getPurchasedCourseIds = function () {
  return this.purchasedCourses.map((purchase) => purchase.courseId.toString());
};

userSchema.methods.getPurchasedBundleIds = function () {
  return this.purchasedBundles.map((purchase) => purchase.bundleId.toString());
};
// Virtual for total courses purchased
userSchema.virtual("totalCoursesPurchased").get(function () {
  return this.purchasedCourses.length;
});

// Virtual for total bundles purchased
userSchema.virtual("totalBundlesPurchased").get(function () {
  return this.purchasedBundles.length;
});

const User = mongoose.model("User", userSchema);
export default User;
