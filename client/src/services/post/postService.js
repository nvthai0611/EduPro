import { apiClient } from "../../utils/clientAxios";

export const postService = {
  // Get all posts with pagination
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.search) queryParams.append('search', params.search);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.authorId) queryParams.append('authorId', params.authorId);
      if (params.feed) queryParams.append('feed', params.feed);
      
      const url = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      // console.log("🌐 Fetching URL:", url);
      const response = await apiClient.get(url);
      
      // console.log("🌐 Raw Axios Response:", response);
      // console.log("🌐 Response.data:", response.data);
      
      // Check if response itself has success flag (interceptor already unwrapped)
      if (response.success) {
        const result = {
          posts: response.data || [],
          pagination: response.pagination || {}
        };
        // console.log("🌐 Returning (from response):", result);
        return result;
      }
      
      // Otherwise check response.data for nested structure
      if (response.data?.success) {
        const result = {
          posts: response.data.data || [],
          pagination: response.data.pagination || {}
        };
        // console.log("🌐 Returning (from response.data):", result);
        return result;
      }
      
      // console.log("🌐 Response doesn't have success flag, using fallback");
      return { posts: Array.isArray(response.data) ? response.data : [], pagination: {} };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  // Get trending posts
getTrending: async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.timeRange) queryParams.append('timeRange', params.timeRange);
    
    const url = `/posts/trending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    if (response.success) {
      // console.log("🌐(postService) Returning (from response):", response.data);
      return response.data;
    }
    
    if (response.data?.success) {
      // console.log("🌐(postService) Returning (from response.data):", response.data.data);
      return response.data.data;
    }
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
},

// Get featured posts
getFeatured: async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/posts/featured${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    if (response.success) {
      // console.log("🌐(postService) Returning (from response):", response.data);
      return response.data;
    }
    
    if (response.data?.success) {
      // console.log("🌐(postService) Returning (from response.data):", response.data.data);
      return response.data.data;
    }
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    throw error;
  }
},
  // Get post by ID
  getPostById: async (id) => {
    try {
      const response = await apiClient.get(`/posts/id/${id}`);
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  },

  // Get post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/posts/slug/${slug}`);
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  },

  // Get posts by user ID
  getPostsByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by user:', error);
      throw error;
    }
  },
  
  // Get current user's posts
  getMine: async () => {
    try {
      const response = await apiClient.get('/posts/me');
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching my posts:', error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (postId, postData) => {
    try {
      const response = await apiClient.put(`/posts/id/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      const response = await apiClient.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Upload image for post
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await apiClient.post('/posts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  // post reaction
  createPostReaction: async (postId, reactionData) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/reactions`, reactionData);
      
      return response.data;
    } catch (error) {
      console.error('Error creating post reaction:', error);
      throw error;
    }
  },
  deletePostReaction: async (postId, reactionId, type) => {
    try {
      const url = reactionId 
        ? `/posts/${postId}/reactions/${reactionId}`
        : `/posts/${postId}/reactions/by-type?type=${type}`;
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting post reaction:', error);
      throw error;
    }
  },
};
