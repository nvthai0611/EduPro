import { useQuery } from "@tanstack/react-query";
import { forumService } from "../services/forum/forumService";

export const forumKeys = {
  all: ["forums"],
  list: () => [...forumKeys.all, "list"],
  details: () => [...forumKeys.all, "details"],
  detail: (id) => [...forumKeys.details(), id],
};
export const useGetAll = (options = {}) => {
  return useQuery({
    queryKey: forumKeys.list(),
    queryFn: async () => {
      const response = await forumService.getAll();
        // Handle different response formats
        if (Array.isArray(response)) {
          return response;
        } else if (response?.data) {
          return Array.isArray(response.data) ? response.data : [response.data];
        }
        return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
export const useGetAllForums = (options = {}) => {
  return useQuery({
    queryKey: forumKeys.list(),
    queryFn: async () => {
      const response = await forumService.getAllForums();
        // Handle different response formats
        if (Array.isArray(response)) {
          return response;
        } else if (response?.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// hooks getSlug
export const useForumBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: forumKeys.detail(slug),
    queryFn: async () => {
      const response = await forumService.getForumBySlug(slug);
        return response;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}