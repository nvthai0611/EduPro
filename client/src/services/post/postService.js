import { apiClient } from "../../utils/clientAxios";

export const postService = {
  // Get all posts
  getAll: async () => {
    try {
      const response = await apiClient.get('/posts');
      // Handle nested response structure { success, data }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
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
