import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    records: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        attendance: {
          type: Boolean,
          default: false,
        },
        homework: {
          type: Boolean,
          default: false,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],

    expireAt: {
      type: Date,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

  },
  {
    collection: "Attendances",
    timestamps: true,
  }
);

attendanceSchema.pre("save", function (next) {
  // chỉ set khi tạo mới
  if (this.isNew && !this.expireAt) {
    const end = new Date(this.createdAt || Date.now());
    end.setHours(23, 59, 59, 999);
    this.expireAt = end;
  }

  next();
});

export default mongoose.model("Attendance", attendanceSchema);
