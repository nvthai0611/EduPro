
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { bannersService } from '../services/admin/bannersService';

export const bannerKeys = {
  all: ['banners'],
  lists: () => [...bannerKeys.all, 'list'],
  list: (filters) => [...bannerKeys.lists(), filters],
//   details: () => [...bannerKeys.all, 'detail'],
//   detail: (id) => [...bannerKeys.details(), id],
//   bySlug: (slug) => [...bannerKeys.all, 'slug', slug],
};



export const useBanners = (filters = {}) => {
  // Placeholder for future banner-related hooks
   return useQuery({
      queryKey: bannerKeys.list(filters),
      queryFn: async () => {
        const response = await bannersService.getBanners(filters);
        
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

}

export const useAdminBanners = () => {
  // Placeholder for future admin banner-related hooks
}

export const useCreateBanner = () => {
  // Placeholder for future create banner hook
}

export const useUpdateBanner = () => {
    // Placeholder for future update banner hook
}

export const useDeleteBanner = () => {
    // Placeholder for future delete banner hook
}