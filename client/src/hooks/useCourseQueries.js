import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/admin/courseService';
import adminSectionService from '../services/admin/sectionService';
import userSectionService from '../services/user/sectionService';
import adminLessonService from '../services/admin/lessonService';
import lessonService from '../services/lessonService';
import { articleService } from '../services/articleService';
import { toast } from 'react-toastify';

// Query keys
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (filters) => [...courseKeys.lists(), filters],
  details: () => [...courseKeys.all, 'detail'],
  detail: (id) => [...courseKeys.details(), id],
  bySlug: (slug) => [...courseKeys.all, 'slug', slug],
};

export const sectionKeys = {
  all: ['sections'],
  byCourse: (courseId) => [...sectionKeys.all, 'course', courseId],
  withLessons: (courseId) => [...sectionKeys.all, 'course', courseId, 'with-lessons'],
  detail: (id) => [...sectionKeys.all, 'detail', id],
};

export const lessonKeys = {
  all: ['lessons'],
  byCourse: (courseId) => [...lessonKeys.all, 'course', courseId],
  bySection: (sectionId) => [...lessonKeys.all, 'section', sectionId],
  detail: (id) => [...lessonKeys.all, 'detail', id],
};

export const articleKeys = {
  all: ['articles'],
  byCourse: (courseId) => [...articleKeys.all, 'course', courseId],
  bySection: (sectionId) => [...articleKeys.all, 'section', sectionId],
  detail: (id) => [...articleKeys.all, 'detail', id],
};

// Home page query keys for cross-component cache invalidation
export const homeKeys = {
  all: ['home'],
  stats: () => [...homeKeys.all, 'stats'],
  categories: () => [...homeKeys.all, 'categories'],
  testimonials: () => [...homeKeys.all, 'testimonials'],
};

/**
 * Hook to fetch courses list with filters
 */
export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: async () => {
      const response = await courseService.getCourses(filters);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2,
  });
};
export const useAdminCourses = (filters = {}) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: async () => {
      const response = await courseService.getAdminCourses(filters);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2,
  });
};
/**
 * Hook to fetch single course by ID
 */
export const useCourse = (id, options = {}) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => {
      const response = await courseService.getCourseById(id);
      return response?.data || response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to fetch course by slug
 */
export const useCourseBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: courseKeys.bySlug(slug),
    queryFn: async () => {
      const response = await courseService.getCourseBySlug(slug);
      return response?.data || response;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to create new course
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData) => {
      const response = await courseService.createCourse(courseData);
      return response?.data || response;
    },
    onSuccess: () => {
      // Invalidate courses list to refetch
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      // Invalidate home stats and categories as they might change
      queryClient.invalidateQueries({ queryKey: homeKeys.stats() });
      queryClient.invalidateQueries({ queryKey: homeKeys.categories() });
      toast.success('Tạo khóa học thành công!');
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast.error(error?.message || 'Tạo khóa học thất bại!');
    },
  });
};

/**
 * Hook to update course
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await courseService.updateCourse(id, data);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      // Optimistic update: Set cache data immediately
      queryClient.setQueryData(courseKeys.detail(variables.id), data);
      
      // Only invalidate lists if needed (not detail)
      queryClient.invalidateQueries({ 
        queryKey: courseKeys.lists(),
        refetchType: 'active' // Only refetch if currently being watched
      });
      
      toast.success('Cập nhật khóa học thành công!');
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast.error(error?.message || 'Cập nhật khóa học thất bại!');
    },
  });
};

/**
 * Hook to delete course
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await courseService.deleteCourse(id);
      return response?.data || response;
    },
    onSuccess: () => {
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Xóa khóa học thành công!');
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast.error(error?.message || 'Xóa khóa học thất bại!');
    },
  });
};

/**
 * Hook to submit course for review
 */
export const useSubmitCourseForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approvalMessage }) => {
      const response = await courseService.submitCourseForApproval(id, approvalMessage);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
      toast.success('Gửi duyệt khóa học thành công!');
    },
    onError: (error) => {
      console.error('Error submitting course:', error);
      toast.error(error?.message || 'Gửi duyệt khóa học thất bại!');
    },
  });
};

/**
 * Hook to review course (approve/reject)
 */
export const useReviewCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action, adminNote }) => {
      const response = await courseService.reviewCourse(id, action, adminNote);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
      
      const actionText = variables.action === 'approve' ? 'Phê duyệt' : 'Từ chối';
      toast.success(`${actionText} khóa học thành công!`);
    },
    onError: (error) => {
      console.error('Error reviewing course:', error);
      toast.error(error?.message || 'Thao tác thất bại!');
    },
  });
};

// ==================== SECTION HOOKS ====================

/**
 * Hook to fetch sections with lessons by course ID (for user learning page)
 */
export const useSectionsWithLessons = (courseId, options = {}) => {
  return useQuery({
    queryKey: sectionKeys.withLessons(courseId),
    queryFn: async () => {
      const response = await userSectionService.getSectionsWithLessons(courseId);
      return response?.data || response;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    select: (data) => Array.isArray(data) ? data : [], // Transform data in query
    ...options,
  });
};

/**
 * Hook to fetch sections with MINIMAL lesson data (for list view - lightweight)
 * Chỉ load title, type, duration - KHÔNG load content, assignments, etc.
 * KHÔNG có pagination - load tất cả (dùng cho CourseLearnDetail)
 */
export const useSectionsWithMinimalLessons = (courseId, options = {}) => {
  return useQuery({
    queryKey: [...sectionKeys.withLessons(courseId), 'minimal'],
    queryFn: async () => {
      const response = await userSectionService.getSectionsWithMinimalLessons(courseId);
      return response?.data || response;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 10, // 10 minutes - cache lâu hơn vì dữ liệu ít thay đổi
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    select: (data) => Array.isArray(data) ? data : [],
    ...options,
  });
};

/**
 * Hook to fetch sections with MINIMAL lesson data + PAGINATION
 * Dùng cho CourseDetail page với Load More button
 */
export const useSectionsWithMinimalLessonsPaginated = (courseId, page = 1, limit = 10, options = {}) => {
  return useQuery({
    queryKey: [...sectionKeys.withLessons(courseId), 'minimal', 'paginated', page, limit],
    queryFn: async () => {
      const response = await userSectionService.getSectionsWithMinimalLessonsPaginated(courseId, page, limit);
      return response?.data || response;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    ...options,
  });
};

/**
 * Hook to fetch sections with lessons by course ID (for admin course builder)
 */
export const useAdminSectionsWithLessons = (courseId, options = {}) => {
  return useQuery({
    queryKey: [...sectionKeys.withLessons(courseId), 'admin'],
    queryFn: async () => {
      const response = await adminSectionService.getSectionsWithLessons(courseId);
      return response?.data || response;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    select: (data) => Array.isArray(data) ? data : [], // Transform data in query
    ...options,
  });
};

/**
 * Hook to fetch sections by course ID (for admin)
 */
export const useSections = (courseId, options = {}) => {
  return useQuery({
    queryKey: sectionKeys.byCourse(courseId),
    queryFn: async () => {
      const response = await adminSectionService.getSectionsByCourseId(courseId);
      return response?.data || response;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Hook to fetch single section by ID
 */
export const useSection = (sectionId, options = {}) => {
  return useQuery({
    queryKey: sectionKeys.detail(sectionId),
    queryFn: async () => {
      const response = await adminSectionService.getSectionById(sectionId);
      return response?.data || response;
    },
    enabled: !!sectionId,
    ...options,
  });
};

/**
 * Hook to create new section
 */
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionData) => {
      const response = await adminSectionService.createSection(sectionData);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      // Invalidate sections for this course
      queryClient.invalidateQueries({ queryKey: sectionKeys.byCourse(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(variables.courseId) });
      toast.success('Thêm chương mới thành công!');
    },
    onError: (error) => {
      console.error('Error creating section:', error);
      toast.error(error?.message || 'Không thể thêm chương mới!');
    },
  });
};

/**
 * Hook to update section
 */
export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await adminSectionService.updateSection(id, data);
      return response?.data || response;
    },
    onSuccess: (data) => {
      // Get courseId from the response or cache
      const courseId = data?.courseId;
      
      // Only invalidate withLessons (includes section detail)
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: sectionKeys.withLessons(courseId),
          refetchType: 'active'
        });
      }
      toast.success('Cập nhật chương thành công!');
    },
    onError: (error) => {
      console.error('Error updating section:', error);
      toast.error(error?.message || 'Không thể cập nhật chương!');
    },
  });
};

/**
 * Hook to delete section
 */
export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId }) => {
      const response = await adminSectionService.deleteSection(id);
      return { ...response, courseId };
    },
    onSuccess: (data) => {
      const courseId = data?.courseId;
      
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: sectionKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      toast.success('Xóa chương thành công!');
    },
    onError: (error) => {
      console.error('Error deleting section:', error);
      toast.error(error?.message || 'Không thể xóa chương!');
    },
  });
};

/**
 * Hook to reorder sections
 */
export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, sectionIds }) => {
      const response = await adminSectionService.reorderSections(courseId, sectionIds);
      return { ...response, courseId };
    },
    onSuccess: (data) => {
      const { courseId } = data;
      
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: sectionKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      toast.success('Sắp xếp chương thành công!');
    },
    onError: (error) => {
      console.error('Error reordering sections:', error);
      toast.error(error?.message || 'Không thể sắp xếp chương!');
    },
  });
};

/**
 * Hook to add lesson to section
 */
export const useAddLessonToSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sectionId, lessonId, courseId }) => {
      const response = await adminSectionService.addLessonToSection(sectionId, lessonId);
      return { ...response, sectionId, courseId };
    },
    onSuccess: (data) => {
      const { sectionId, courseId } = data;
      
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
    },
    onError: (error) => {
      console.error('Error adding lesson to section:', error);
      toast.error(error?.message || 'Không thể thêm bài học vào chương!');
    },
  });
};

// ==================== LESSON HOOKS ====================

/**
 * Hook to fetch lessons by course ID
 */
export const useLessonsByCourse = (courseId, options = {}) => {
  return useQuery({
    queryKey: lessonKeys.byCourse(courseId),
    queryFn: async () => {
      const response = await lessonService.getLessonsByCourseId(courseId);
      return response?.data || response;
    },
    enabled: !!courseId,
    ...options,
  });
};

/**
 * Hook to fetch lessons by section ID
 */
export const useLessonsBySection = (sectionId, options = {}) => {
  return useQuery({
    queryKey: lessonKeys.bySection(sectionId),
    queryFn: async () => {
      const response = await lessonService.getLessonsBySectionId(sectionId);
      return response?.data || response;
    },
    enabled: !!sectionId,
    ...options,
  });
};

export const useLesson = (lessonId, options = {}) => {
  return useQuery({
    queryKey: lessonKeys.detail(lessonId),
    queryFn: async () => {
      try {
        const response = await lessonService.getLessonById(lessonId);
        return response?.data || response;
      } catch (error) {
        // If lesson not found (404), return null instead of throwing
        if (error?.response?.status === 404) {
          console.warn(`Lesson  not found, returning null`);
          return null;
        }
        throw error; // Re-throw other errors
      }
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 15, 
    gcTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    retry: (failureCount, error) => {
      // Don't retry 404 errors
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

/**
 * Hook to create new lesson
 */
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonData) => {
      const response = await adminLessonService.createLesson(lessonData);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      const { courseId, sectionId } = variables;
      
      // Invalidate relevant queries
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.bySection(sectionId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      }
      
      toast.success('Thêm bài học mới thành công!');
    },
    onError: (error) => {
      console.error('Error creating lesson:', error);
      toast.error(error?.message || 'Không thể thêm bài học!');
    },
  });
};

/**
 * Hook to update lesson
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await adminLessonService.updateLesson(id, data);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      const courseId = data?.courseId;
      const sectionId = data?.sectionId;
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: lessonKeys.detail(variables.id) });
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.bySection(sectionId) });
      }
      
      toast.success('Cập nhật bài học thành công!');
    },
    onError: (error) => {
      console.error('Error updating lesson:', error);
      toast.error(error?.message || 'Không thể cập nhật bài học!');
    },
  });
};

/**
 * Hook to delete lesson
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId, sectionId }) => {
      const response = await adminLessonService.deleteLesson(id);
      return { ...response, courseId, sectionId };
    },
    onSuccess: (data) => {
      const { courseId, sectionId } = data;
      
      // Invalidate relevant queries
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.bySection(sectionId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      }
      
      toast.success('Xóa bài học thành công!');
    },
    onError: (error) => {
      console.error('Error deleting lesson:', error);
      toast.error(error?.message || 'Không thể xóa bài học!');
    },
  });
};

/**
 * Hook to reorder lessons within a section
 */
export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sectionId, lessonIds, courseId }) => {
      const response = await adminLessonService.reorderLessons(sectionId, lessonIds);
      return { ...response, sectionId, courseId };
    },
    onSuccess: (data) => {
      const { sectionId, courseId } = data;
      
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.bySection(sectionId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      }
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      toast.success('Sắp xếp bài học thành công!');
    },
    onError: (error) => {
      console.error('Error reordering lessons:', error);
      toast.error(error?.message || 'Không thể sắp xếp bài học!');
    },
  });
};

// ==================== ARTICLE HOOKS ====================

/**
 * Hook to fetch articles by section ID
 */
export const useArticlesBySection = (sectionId, options = {}) => {
  return useQuery({
    queryKey: articleKeys.bySection(sectionId),
    queryFn: async () => {
      const response = await articleService.getArticlesBySection(sectionId);
      return response?.data || response;
    },
    enabled: !!sectionId,
    ...options,
  });
};

/**
 * Hook to fetch single article by ID (public content for learners)
 */
export const useArticle = (articleId, options = {}) => {
  return useQuery({
    queryKey: articleKeys.detail(articleId),
    queryFn: async () => {
      // Dùng getArticleContent (public endpoint) thay vì getArticleById (admin only)
      const response = await articleService.getArticleContent(articleId);
      return response?.data || response;
    },
    enabled: !!articleId,
    staleTime: 1000 * 60 * 15, // 15 minutes - article content ít thay đổi
    gcTime: 1000 * 60 * 30, // 30 minutes cache - giữ lâu hơn cho smooth navigation
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Không refetch khi component mount lại
    retry: (failureCount, error) => {
      // Don't retry 404 errors - content doesn't exist
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

/**
 * Hook to create new article
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleData) => {
      const response = await articleService.createArticle(articleData);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      const { courseId, sectionId } = variables;
      
      // Invalidate relevant queries
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.bySection(sectionId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      }
      
      toast.success('Thêm bài viết mới thành công!');
    },
    onError: (error) => {
      console.error('Error creating article:', error);
      toast.error(error?.message || 'Không thể thêm bài viết!');
    },
  });
};

/**
 * Hook to update article
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await articleService.updateArticle(id, data);
      return response?.data || response;
    },
    onSuccess: (data, variables) => {
      const courseId = data?.courseId;
      const sectionId = data?.sectionId;
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) });
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.bySection(sectionId) });
      }
      
      toast.success('Cập nhật bài viết thành công!');
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      toast.error(error?.message || 'Không thể cập nhật bài viết!');
    },
  });
};

/**
 * Hook to delete article
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId, sectionId }) => {
      const response = await articleService.deleteArticle(id);
      return { ...response, courseId, sectionId };
    },
    onSuccess: (data) => {
      const { courseId, sectionId } = data;
      
      // Invalidate relevant queries
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.byCourse(courseId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.withLessons(courseId) });
      }
      if (sectionId) {
        queryClient.invalidateQueries({ queryKey: articleKeys.bySection(sectionId) });
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(sectionId) });
      }
      
      toast.success('Xóa bài viết thành công!');
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      toast.error(error?.message || 'Không thể xóa bài viết!');
    },
  });
};
