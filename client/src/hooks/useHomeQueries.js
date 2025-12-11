import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home/homeService';

// Query keys for home data
export const homeKeys = {
  all: ['home'],
  stats: () => [...homeKeys.all, 'stats'],
  categories: () => [...homeKeys.all, 'categories'],
  testimonials: () => [...homeKeys.all, 'testimonials'],
};

/**
 * Hook to fetch home page statistics (courses, students, hours, certificates)
 */
export const useHomeStats = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.stats(),
    queryFn: async () => {
      const data = await homeService.getHomeStats();
      
      // Transform data to match UI format
      return [
        { 
          label: 'Khóa học', 
          value: `${Math.floor(data.totalCourses / 10) * 10}+`, 
          icon: 'BookOpen',
          actualValue: data.totalCourses
        },
        { 
          label: 'Học viên', 
          value: `${Math.floor(data.totalStudents / 1000)}K+`, 
          icon: 'Users',
          actualValue: data.totalStudents
        },
        { 
          label: 'Giờ học', 
          value: `${Math.floor(data.totalHours / 100) * 100}+`, 
          icon: 'Clock',
          actualValue: data.totalHours
        },
        { 
          label: 'Chứng chỉ', 
          value: `${Math.floor(data.totalCertificates / 1000)}K+`, 
          icon: 'Award',
          actualValue: data.totalCertificates
        },
      ];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - stats don't change frequently
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

/**
 * Hook to fetch categories with course counts for home page
 */
export const useHomeCategories = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.categories(),
    queryFn: async () => {
      const data = await homeService.getCategoriesWithCounts();
      
      // Ensure each category has proper icon mapping
      return data.map(category => ({
        ...category,
        // Map icon names to actual icon components will be done in component
        iconName: category.icon
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes cache
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

/**
 * Hook to fetch testimonials for home page
 */
export const useHomeTestimonials = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.testimonials(),
    queryFn: homeService.getTestimonials,
    staleTime: 1000 * 60 * 15, // 15 minutes - testimonials don't change often
    gcTime: 1000 * 60 * 60, // 1 hour cache
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

/**
 * Combined hook to fetch all home page data at once
 * Useful for initial page load optimization
 */
export const useHomeData = (options = {}) => {
  const stats = useHomeStats(options);
  const categories = useHomeCategories(options);
  const testimonials = useHomeTestimonials(options);

  return {
    stats,
    categories,
    testimonials,
    isLoading: stats.isLoading || categories.isLoading || testimonials.isLoading,
    isError: stats.isError || categories.isError || testimonials.isError,
    error: stats.error || categories.error || testimonials.error,
  };
};