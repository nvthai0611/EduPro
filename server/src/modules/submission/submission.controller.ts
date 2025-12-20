import SubmissionService from "./submission.service";

export const createComment = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user?.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung nhận xét không được để trống" });
    }

    const created = await SubmissionService.createStudentComment({ lessonId, studentId, content });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    const status = error?.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user?.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung nhận xét không được để trống" });
    }

    const updated = await SubmissionService.updateStudentComment({ lessonId, studentId, content });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    const status = error?.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getMyComment = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user?.id;
    const comments = await SubmissionService.getCommentsForLesson(lessonId);
    // Find user's comment
    const mine = (comments || []).find((c: any) => String(c.studentId?._id || c.studentId) === String(studentId));
    res.status(200).json({ success: true, data: mine || null });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getComments = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const comments = await SubmissionService.getCommentsForLesson(lessonId);
    res.status(200).json({ success: true, data: comments });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const teacherReply = async (req: any, res: any) => {
  try {
    const { commentId } = req.params;
    const teacherId = req.user?.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung reply không được để trống" });
    }

    const updated = await SubmissionService.addTeacherReplyToComment({ commentId, teacherId, content });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req: any, res: any) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user?.id;

    const deleted = await SubmissionService.deleteStudentComment({ lessonId, studentId });
    res.status(200).json({ success: true, data: deleted });
  } catch (error: any) {
    const status = error?.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const updateReply = async (req: any, res: any) => {
  try {
    const { commentId, replyIndex } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung reply không được để trống" });
    }

    const updated = await SubmissionService.updateTeacherReply({ 
      commentId, 
      replyIndex: parseInt(replyIndex), 
      content 
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    const status = error?.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const deleteReply = async (req: any, res: any) => {
  try {
    const { commentId, replyIndex } = req.params;

    const updated = await SubmissionService.deleteTeacherReply({ 
      commentId, 
      replyIndex: parseInt(replyIndex) 
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    const status = error?.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};
