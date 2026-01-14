import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { bannersService } from "../services/admin/bannersService";

export const bannerKeys = {
  all: ["banners"],
  list: (key) => [...bannerKeys.all, key],
  //   details: () => [...bannerKeys.all, 'detail'],
  //   detail: (id) => [...bannerKeys.details(), id],
  //   bySlug: (slug) => [...bannerKeys.all, 'slug', slug],
};

export const useBanners = (key = "homepage") => {
  return useQuery({
    queryKey: bannerKeys.list(key),
    queryFn: async () => {
      const response = await bannersService.getBanners(key);
      // console.log("Response from useBanners queryFn:", response );
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data) {
        return Array.isArray(response.data) ? response.data : [];
      } else if (response?.slides) {
        return Array.isArray(response.slides) ? response.slides : [];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminBanners = (key) => {
  return useQuery({
    queryKey: bannerKeys.list(key),
    queryFn: async () => {
      const response = await bannersService.getAdminBanners(key ? { key } : {});
      // console.log("admin queryFn response:", response);
      
      // Transform backend data to frontend format
      if (Array.isArray(response)) {
        return response.map(banner => ({
          ...banner,
          link: banner.linkUrl,
          isActive: banner.isActive
        }));
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data.map(banner => ({
          ...banner,
          link: banner.linkUrl,
          isActive: banner.isActive
        }));
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBanner = () => {
  // Placeholder for future create banner hook
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannersService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating banner: ${error.message}`);
    },
  });
};

export const useUpdateBanner = () => {
  // Placeholder for future update banner hook
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bannerData }) => {
      console.log('[useUpdateBanner] Mutation called with:', { id, bannerData })
      return bannersService.updateBanner(id, bannerData)
    },
    onSuccess: () => {
      // console.log('[useUpdateBanner] Success:', data)
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success('Banner đã được cập nhật!');
    },
    onError: (error) => {
      console.error('[useUpdateBanner] Error:', error)
      toast.error(`Lỗi cập nhật banner: ${error.message}`);
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bannersService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting banner: ${error.message}`);
    },
  });
};
