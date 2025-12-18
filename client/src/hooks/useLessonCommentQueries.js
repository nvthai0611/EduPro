import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonCommentService } from '../services/lessonCommentService';
import { toast } from 'react-toastify';

export const lessonCommentKeys = {
  byLesson: (lessonId) => ['lessonComments', 'lesson', lessonId],
  myComment: (lessonId) => ['lessonComments', 'lesson', lessonId, 'me'],
};

export const useMyLessonComment = (lessonId, options = {}) => {
  return useQuery({
    queryKey: lessonCommentKeys.myComment(lessonId),
    queryFn: async () => {
      const res = await lessonCommentService.getMyComment(lessonId);
      return res?.data || res;
    },
    enabled: !!lessonId,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateLessonComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, payload }) => {
      const res = await lessonCommentService.createComment(lessonId, payload);
      return res;
    },
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: lessonCommentKeys.byLesson(vars.lessonId) });
      qc.invalidateQueries({ queryKey: lessonCommentKeys.myComment(vars.lessonId) });
      toast.success('Gửi nhận xét thành công');
    },
    onError: (err) => {
      console.error('Error creating lesson comment', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể gửi nhận xét');
    }
  });
};

export const useUpdateLessonComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, payload }) => {
      const res = await lessonCommentService.updateComment(lessonId, payload);
      return res;
    },
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: lessonCommentKeys.byLesson(vars.lessonId) });
      qc.invalidateQueries({ queryKey: lessonCommentKeys.myComment(vars.lessonId) });
      toast.success('Cập nhật nhận xét thành công');
    },
    onError: (err) => {
      console.error('Error updating lesson comment', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể cập nhật nhận xét');
    }
  });
};

export const useCommentsForLesson = (lessonId, options = {}) => {
  return useQuery({
    queryKey: lessonCommentKeys.byLesson(lessonId),
    queryFn: async () => {
      const res = await lessonCommentService.getCommentsForLesson(lessonId);
      return res?.data || res;
    },
    enabled: !!lessonId,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useTeacherReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, payload }) => {
      const res = await lessonCommentService.teacherReply(commentId, payload);
      return res;
    },
    onSuccess: (data, vars) => {
      // Invalidate all lesson comments queries to refresh the list
      qc.invalidateQueries({ queryKey: ['lessonComments'] });
      toast.success('Phản hồi thành công');
    },
    onError: (err) => {
      console.error('Error replying to comment', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể phản hồi');
    }
  });
};

export const useDeleteLessonComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId }) => {
      const res = await lessonCommentService.deleteComment(lessonId);
      return res;
    },
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: lessonCommentKeys.byLesson(vars.lessonId) });
      qc.invalidateQueries({ queryKey: lessonCommentKeys.myComment(vars.lessonId) });
      toast.success('Xóa nhận xét thành công');
    },
    onError: (err) => {
      console.error('Error deleting lesson comment', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể xóa nhận xét');
    }
  });
};

export const useUpdateReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, replyIndex, payload }) => {
      const res = await lessonCommentService.updateReply(commentId, replyIndex, payload);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonComments'] });
      toast.success('Cập nhật phản hồi thành công');
    },
    onError: (err) => {
      console.error('Error updating reply', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể cập nhật phản hồi');
    }
  });
};

export const useDeleteReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, replyIndex }) => {
      const res = await lessonCommentService.deleteReply(commentId, replyIndex);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonComments'] });
      toast.success('Xóa phản hồi thành công');
    },
    onError: (err) => {
      console.error('Error deleting reply', err);
      toast.error(err?.response?.data?.message || err?.message || 'Không thể xóa phản hồi');
    }
  });
};
