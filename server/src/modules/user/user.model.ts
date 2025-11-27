import mongoose, { Document, Schema, Types, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

export interface IPurchasedItem {
  courseId?: Types.ObjectId;
  bundleId?: Types.ObjectId;
  purchasedAt: Date;
  price: number;
  paymentId: string;
}

export interface IUser {
  fullName: string;
  email?: string;
  password?: string;
  image?: string;
  status?: boolean;
  role?: "customer" | "admin";
  phoneNumber?: string;
  purchasedCourses: IPurchasedItem[];
  purchasedBundles: IPurchasedItem[];
  verifyExpiresAt?: Date;
  confirmEmail?: boolean;
  isActive?: boolean;
  isGuest?: boolean;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPurchasedCourse(courseId: Types.ObjectId | string): boolean;
  hasPurchasedBundle(bundleId: Types.ObjectId | string): boolean;
  addPurchasedCourse(courseId: Types.ObjectId | string, price: number, paymentId: string): Promise<IUserDocument>;
  addPurchasedBundle(bundleId: Types.ObjectId | string, price: number, paymentId: string): Promise<IUserDocument>;
  getPurchasedCourseIds(): string[];
  getPurchasedBundleIds(): string[];
  totalCoursesPurchased?: number;
  totalBundlesPurchased?: number;
}

const purchasedCourseSchema = new Schema<IPurchasedItem>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    purchasedAt: { type: Date, required: true },
    price: { type: Number, required: true },
    paymentId: { type: String, required: true },
  },
  { _id: false }
);

const purchasedBundleSchema = new Schema<IPurchasedItem>(
  {
    bundleId: { type: Schema.Types.ObjectId, ref: "Bundle" },
    purchasedAt: { type: Date, required: true },
    price: { type: Number, required: true },
    paymentId: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: function (this: IUserDocument) {
        return !this.isGuest;
      },
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
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
        validator: function (value: string) {
          if (!value) return true; // optional
          return /^((03|05|07|08|09)[0-9]{8})$/.test(value);
        },
        message:
          "Phone number must be 10 digits and is a valid Vietnam phone number",
      },
    },
    purchasedCourses: [purchasedCourseSchema],
    purchasedBundles: [purchasedBundleSchema],
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

// Index googleId for uniqueness (sparse allows multiple docs without googleId)
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

// PRE-SAVE: Hash password if modified
userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// METHODS
userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasPurchasedCourse = function (
  this: IUserDocument,
  courseId: Types.ObjectId | string
) {
  return this.purchasedCourses.some(
    (purchase) =>
      purchase.courseId &&
      purchase.courseId.toString() === courseId.toString()
  );
};

userSchema.methods.hasPurchasedBundle = function (
  this: IUserDocument,
  bundleId: Types.ObjectId | string
) {
  return this.purchasedBundles.some(
    (purchase) =>
      purchase.bundleId &&
      purchase.bundleId.toString() === bundleId.toString()
  );
};

userSchema.methods.addPurchasedCourse = async function (
  this: IUserDocument,
  courseId: Types.ObjectId | string,
  price: number,
  paymentId: string
) {
  this.purchasedCourses.push({
    courseId: new mongoose.Types.ObjectId(courseId),
    purchasedAt: new Date(),
    price,
    paymentId,
  });
  return this.save();
};

userSchema.methods.addPurchasedBundle = async function (
  this: IUserDocument,
  bundleId: Types.ObjectId | string,
  price: number,
  paymentId: string
) {
  this.purchasedBundles.push({
    bundleId: new mongoose.Types.ObjectId(bundleId),
    purchasedAt: new Date(),
    price,
    paymentId,
  });
  return this.save();
};

userSchema.methods.getPurchasedCourseIds = function (this: IUserDocument) {
  return this.purchasedCourses.map((purchase) =>
    purchase.courseId ? purchase.courseId.toString() : ""
  );
};

userSchema.methods.getPurchasedBundleIds = function (this: IUserDocument) {
  return this.purchasedBundles.map((purchase) =>
    purchase.bundleId ? purchase.bundleId.toString() : ""
  );
};

// Virtuals
userSchema.virtual("totalCoursesPurchased").get(function (this: IUserDocument) {
  return this.purchasedCourses.length;
});

userSchema.virtual("totalBundlesPurchased").get(function (this: IUserDocument) {
  return this.purchasedBundles.length;
});

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema
);

export default User;