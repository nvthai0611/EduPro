const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isInstructor: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Comments", timestamps: true }
);

// Indexes
commentSchema.index({ lessonId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for replies count
commentSchema.virtual("repliesCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
  count: true,
});

// Method to like/unlike comment
commentSchema.methods.toggleLike = function () {
  this.likes += 1;
  return this.save();
};

// Method to check if user liked this comment
commentSchema.methods.isLikedBy = function (userId) {
  // This would need a separate UserCommentLikes model for proper implementation
  return false;
};

// Static method to get comments for a lesson with replies
commentSchema.statics.getLessonComments = function (lessonId, page = 1, limit = 20) {
  return this.find({ lessonId, parentComment: null })
    .populate("userId", "fullName image")
    .populate({
      path: "repliesCount",
      populate: {
        path: "userId",
        select: "fullName image",
      },
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get replies for a comment
commentSchema.statics.getCommentReplies = function (commentId, page = 1, limit = 10) {
  return this.find({ parentComment: commentId })
    .populate("userId", "fullName image")
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
