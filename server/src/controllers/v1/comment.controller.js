const Comment = require("../../models/comment.model");
const Lesson = require("../../models/lesson.model");
const { responseSuccess, responseError } = require("../../utils/response");

// POST /comments - Add comment
const addComment = async (req, res) => {
  try {
    const { lessonId, content, parentComment } = req.body;
    const userId = req.user.id;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json(responseError("Không tìm thấy bài học"));
    }

    // Check if parent comment exists (for replies)
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json(responseError("Không tìm thấy bình luận gốc"));
      }
    }

    // Create comment
    const comment = new Comment({
      userId,
      lessonId,
      content: content.trim(),
      parentComment: parentComment || null,
      isInstructor: req.user.role === "admin",
    });

    await comment.save();

    // Populate user info
    await comment.populate("userId", "fullName image");

    res.json(
      responseSuccess({
        comment,
        message: "Đã thêm bình luận thành công",
      })
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json(responseError("Lỗi khi thêm bình luận"));
  }
};

// GET /comments/:lessonId - Get comments for a lesson
const getLessonComments = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json(responseError("Không tìm thấy bài học"));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get main comments (not replies)
    const comments = await Comment.find({ lessonId, parentComment: null })
      .populate("userId", "fullName image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Comment.countDocuments({ lessonId, parentComment: null });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("userId", "fullName image")
          .sort({ createdAt: 1 })
          .limit(5)
          .lean();

        return {
          ...comment,
          replies,
          repliesCount: await Comment.countDocuments({ parentComment: comment._id }),
        };
      })
    );

    res.json(
      responseSuccess({
        comments: commentsWithReplies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting lesson comments:", error);
    res.status(500).json(responseError("Lỗi khi lấy bình luận"));
  }
};

// GET /comments/:id/replies - Get replies for a comment
const getCommentReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const replies = await Comment.find({ parentComment: id })
      .populate("userId", "fullName image")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Comment.countDocuments({ parentComment: id });

    res.json(
      responseSuccess({
        replies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    );
  } catch (error) {
    console.error("Error getting comment replies:", error);
    res.status(500).json(responseError("Lỗi khi lấy phản hồi"));
  }
};

// PUT /comments/:id/like - Like/unlike comment
const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json(responseError("Không tìm thấy bình luận"));
    }

    // Increment likes (in a real app, you'd track who liked what)
    await comment.toggleLike();

    res.json(
      responseSuccess({
        commentId: comment._id,
        likes: comment.likes,
        message: "Đã thích bình luận",
      })
    );
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json(responseError("Lỗi khi thích bình luận"));
  }
};

// PUT /comments/:id - Update comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json(responseError("Không tìm thấy bình luận"));
    }

    // Check if user owns this comment or is admin
    if (comment.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json(responseError("Bạn không có quyền chỉnh sửa bình luận này"));
    }

    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();

    res.json(
      responseSuccess({
        comment,
        message: "Đã cập nhật bình luận",
      })
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json(responseError("Lỗi khi cập nhật bình luận"));
  }
};

// DELETE /comments/:id - Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json(responseError("Không tìm thấy bình luận"));
    }

    // Check if user owns this comment or is admin
    if (comment.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json(responseError("Bạn không có quyền xóa bình luận này"));
    }

    // Delete comment and all its replies
    await Comment.deleteMany({
      $or: [{ _id: id }, { parentComment: id }],
    });

    res.json(responseSuccess({ message: "Đã xóa bình luận" }));
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json(responseError("Lỗi khi xóa bình luận"));
  }
};

module.exports = {
  addComment,
  getLessonComments,
  getCommentReplies,
  toggleCommentLike,
  updateComment,
  deleteComment,
};
