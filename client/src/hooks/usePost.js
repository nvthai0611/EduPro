import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post/postService";

export const postKeys = {
  all: ["posts"],
  list: () => [...postKeys.all, "list"],
  details: () => [...postKeys.all, "details"],
  detail: (id) => [...postKeys.details(), id],
  byUser: (userId) => [...postKeys.all, "user", userId],
  me: () => [...postKeys.all, "me"],
};

// Get current user's posts
export const useMyPosts = (options = {}) => {
  return useQuery({
    queryKey: postKeys.me(),
    queryFn: async () => {
      const response = await postService.getMine();
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

// Get all posts
export const useGetAllPosts = (options = {}) => {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: async () => {
      const response = await postService.getAll();
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

// Get post by ID
export const usePostById = (id, options = {}) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const response = await postService.getPostById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get post by slug
export const usePostBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async () => {
      const response = await postService.getPostBySlug(slug);
      return response;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get posts by user ID
export const usePostsByUser = (userId, options = {}) => {
  return useQuery({
    queryKey: postKeys.byUser(userId),
    queryFn: async () => {
      const response = await postService.getPostsByUser(userId);
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData) => postService.createPost(postData),
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, postData }) => postService.updatePost(postId, postData),
    onSuccess: (data, variables) => {
      // Invalidate specific post and list
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => postService.deletePost(postId),
    onSuccess: () => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

// Upload image mutation
export const useUploadPostImage = () => {
  return useMutation({
    mutationFn: (imageFile) => postService.uploadImage(imageFile),
  });
};
