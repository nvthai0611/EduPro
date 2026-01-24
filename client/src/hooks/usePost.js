import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post/postService";

export const postKeys = {
  all: ["posts"],
  list: (params) => [...postKeys.all, "list", params],
  details: () => [...postKeys.all, "details"],
  detail: (id) => [...postKeys.details(), id],
  byUser: (userId) => [...postKeys.all, "user", userId],
  me: () => [...postKeys.all, "me"],
  trending: (params) => [...postKeys.all, "trending", params],
  featured: (params) => [...postKeys.all, "featured", params],
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

// Get all posts with pagination
export const useGetAllPosts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: async () => {
      // console.log("🔥 Fetching posts with params:", params);
      const response = await postService.getAll(params);
      // console.log("🔥 postService.getAll response:", response);
      
      // Validate response structure
      if (!response || !response.posts) {
        console.error("❌ Invalid response structure:", response);
        return { posts: [], pagination: {} };
      }
      
      // Return both posts and pagination metadata
      const result = {
        posts: response.posts || [],
        pagination: response.pagination || {}
      };
      // console.log("🔥 useGetAllPosts returning:", result);
      return result;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Replace keepPreviousData
    ...options,
  });
};
// Get trending posts (cached for 10 minutes)
export const useTrendingPosts = (params = { limit: 4, timeRange: 30 }, options = {}) => {
  return useQuery({
    queryKey: postKeys.trending(params),
    queryFn: async () => {
      const response = await postService.getTrending(params);
      return Array.isArray(response) ? response : [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    ...options,
  });
};

// Get featured posts (cached for 15 minutes)
export const useFeaturedPosts = (params = { limit: 4 }, options = {}) => {
  return useQuery({
    queryKey: postKeys.featured(params),
    queryFn: async () => {
      const response = await postService.getFeatured(params);
      return Array.isArray(response) ? response : [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
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

// Post reaction mutation
export const useCreatePostReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, reactionData }) => postService.createPostReaction(postId, reactionData),
    onSuccess: (data, variables) => {
      // Invalidate specific post and list
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

export const useDeletePostReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, reactionId, type }) => postService.deletePostReaction(postId, reactionId, type),
    onSuccess: (data, variables) => {
      // Invalidate specific post and list
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

