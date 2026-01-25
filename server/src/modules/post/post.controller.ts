import { encryptData } from "../../utils/encryption";
import { PostService } from "./post.service";


class postController {
  // Controller methods here
  async getAllPosts(req: any, res: any): Promise<void> {
    try {
      console.log("📥 getAllPosts called");
      
      // Parse pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder || "desc";
      const select = req.query.select || null;

      // Build query filters
      const query: any = {};
      if (req.query.authorId) query.authorId = req.query.authorId;
      if (req.query.tags) query.tags = { $in: req.query.tags.split(",") };
      if (req.query.search) {
        query.$text = { $search: req.query.search };
      }

      const options = {
        page,
        limit,
        sortBy,
        sortOrder,
        select
      };

      // console.log("Query options:", options);
      
      const result = await PostService.getAllPosts(query, options);
      
      // console.log("Posts found:", result.posts.length);
      
      // Transform posts to include excerpt
      const transformedPosts = result.posts.map((post: any) => ({
        ...post,
        authorName: post.authorName || 'Anonymous',
        excerpt: post.content ? post.content.slice(0, 150).replace(/<\/?[^>]+(>|$)/g, "") + "..." : ""
      }));
      
      console.log("Transformed posts:", transformedPosts.length);
      res.setHeader("x-encrypted", "true");
      // Return paginated response with metadata
      res.status(200).json({ 
        success: true, 
        encryptedData: encryptData(transformedPosts),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1
        }
      });
    } catch (error) {
      console.error("❌ getAllPosts error:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
    
async getTrendingPosts(req: any, res: any): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const timeRange = parseInt(req.query.timeRange as string) || 30; // days
    
    const result = await PostService.getTrendingPosts(limit, timeRange);
    res.setHeader("x-encrypted", "true");
    res.status(200).json({
      success: true,
      encryptedData: encryptData(result)
    });
  } catch (error) {
    console.error("Error getting trending posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get trending posts",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

async getFeaturedPosts(req: any, res: any): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    
    const result = await PostService.getFeaturedPosts(limit);
    res.setHeader("x-encrypted", "true");
    res.status(200).json({
      success: true,
      encryptedData: encryptData(result)
    });
  } catch (error) {
    console.error("Error getting featured posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get featured posts",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
  async getPostById(req: any, res: any): Promise<void> {
    try {
      let post = await PostService.getPostById(req.params.id);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }
      
      // Check for user reactions if authenticated
      const userId = req.user?.id || req.user?.userId;
      if (userId) {
        const reactions = await PostService.findUserReactions(userId, post._id.toString());
        post = {
          ...post,
          isLiked: reactions.some(r => r.type === "LIKE"),
          isSaved: reactions.some(r => r.type === "SAVE"),
          userReactions: reactions
        };
      }

      res.setHeader("x-encrypted", "true");
      res.status(200).json({ success: true, encryptedData: encryptData(post) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  async getMine(req: any, res: any): Promise<void> {
    try {
      const userId = req.user.id || req.user.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const posts = await PostService.getPostsByUser(userId);
      res.setHeader("x-encrypted", "true");
      res.status(200).json({ success: true, encryptedData: encryptData(posts) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async getPostsByUser(req: any, res: any): Promise<void> {
    try {
      const posts = await PostService.getPostsByUser(req.params.userId);
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async getPostsBySlug(req: any, res: any): Promise<void> {
    try {
      let post = await PostService.getPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      } 

      // Check for user reactions if authenticated
      const userId = req.user?.id || req.user?.userId;
      if (userId) {
        const reactions = await PostService.findUserReactions(userId, post._id.toString());
        post = {
          ...post,
          isLiked: reactions.some(r => r.type === "LIKE"),
          isSaved: reactions.some(r => r.type === "SAVE"),
          userReactions: reactions
        };
      }
      res.setHeader("x-encrypted", "true");
      res.status(200).json({ success: true, encryptedData: encryptData(post) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  async createPost(req: any, res: any): Promise<void> {
    try {
      const postData = { ...req.body };
      
      // Get author ID and name from authenticated user
      if (req.user && req.user.id) {
        postData.authorId = req.user.id;
        postData.authorName = req.user.fullName || 'Anonymous';
      } else {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }
      
      // Handle uploaded cover image from Cloudinary
      if (req.file) {
        postData.coverImageUrl = req.file.path;
      }
      
      // Content already has Cloudinary URLs from editor uploads
      // No need to process contentImages
      
      const post = await PostService.createPost(postData);
      res.setHeader("x-encrypted", "true");
      res.status(201).json({ success: true, encryptedData: encryptData(post) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async updatePost(req: any, res: any): Promise<void> {
    try {
      // 1. Find post first to check ownership
      const existingPost = await PostService.getPostById(req.params.id);
      if (!existingPost) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }

      // 2. Authorization check
      const authId = existingPost.authorId?._id ? existingPost.authorId._id.toString() : existingPost.authorId.toString();
      const userId = req.user.userId?.toString() || req.user.id?.toString(); // Handle different user object structures

      console.log(`🔒 Update Auth Check: PostAuthor=${authId}, Requester=${userId}`);

      const isAuthor = authId === userId;
      
      if (!isAuthor) {
        console.warn(`⚠️ Authorization failed for user ${userId} on post ${req.params.id}. Post author is ${authId}`);
        res.status(403).json({ success: false, message: "Forbidden: You are not the author of this post" });
        return;
      }

      // 3. Prepare update data
      const updateData = { ...req.body };
      
      // Handle uploaded cover image from Cloudinary if new file uploaded
      if (req.file) {
        updateData.coverImageUrl = req.file.path;
      }

      // 4. Update post
      const post = await PostService.updatePost(req.params.id, updateData);
      res.setHeader("x-encrypted", "true");
      res.status(200).json({ success: true, encryptedData: encryptData(post) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  async deletePost(req: any, res: any): Promise<void> {
    try {
      // 1. Find post first to check ownership and get image URLs for cleanup
      const post = await PostService.getPostById(req.params.id);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }

      // 2. Authorization check
      const isAuthor = post.authorId.toString() === req.user.id.toString();
      
      if (!isAuthor) {
        console.warn(`⚠️ Authorization failed for user ${req.user.id} on post ${req.params.id}. Post author is ${post.authorId}`);
        res.status(403).json({ success: false, message: "Forbidden: You are not the author of this post" });
        return;
      }

      // 3. Extract image URLs for cleanup before deleting from DB
      const imageUrls: string[] = [];
      if (post.coverImageUrl) imageUrls.push(post.coverImageUrl);
      
      
      // Extract from content
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      while ((match = imgRegex.exec(post.content)) !== null) {
        const src = match[1];
        if (src.includes("res.cloudinary.com")) {
          imageUrls.push(src);
        }
      }

      // 4. Delete from DB
      await PostService.deletePost(req.params.id);

      // 5. Cleanup images on Cloudinary (Async, don't block response)
      if (imageUrls.length > 0) {
        const { deleteImagesFromCloudinary } = require("../../utils/cloudinaryUtils");
        deleteImagesFromCloudinary(imageUrls).catch(err => console.error("Cloudinary cleanup error:", err));
      }

      res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  
  async uploadImage(req: any, res: any): Promise<void> {
    try {
      console.log("📥 Upload image request received");
      console.log("User:", req.user);
      console.log("File:", req.file);
      
      if (!req.file) {
        console.log("❌ No file uploaded");
        res.status(400).json({ success: false, message: "No image file uploaded" });
        return;
      }
      
      console.log("✅ Image uploaded to Cloudinary:", req.file.path);
      
      // Return Cloudinary URL
      res.status(200).json({ 
        success: true, 
        url: req.file.path,
        message: "Image uploaded successfully" 
      });
    } catch (error) {
      console.error("❌ Upload image error:", error);
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }

  // Post reaction
  async createPostReaction(req: any, res: any): Promise<void> {
    try {
      const { id: postId } = req.params;
      const { type } = req.body;
      
      // Get author ID and name from authenticated user
      if (!req.user || !req.user.id) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const userId = req.user.id;
      
      const reaction = await PostService.createPostReaction({
        userId,
        postId,
        type
      });
      
      res.status(201).json({ success: true, data: reaction });
    } catch (error) {
      console.error("Error creating post reaction:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }

  async deletePostReaction(req: any, res: any): Promise<void> {
    try {
      const { id: postId, reactionId } = req.params;
      const { type } = req.query; // Allow passing type in query for easier "unlike"
      
      const userId = req.user?.id || req.user?.userId;

      let reaction;
      if (reactionId && reactionId !== "by-type") {
        reaction = await PostService.deletePostReaction(reactionId);
      } else if (userId && postId && type) {
        reaction = await PostService.deleteUserReaction(userId, postId, type as string);
      } else {
        res.status(400).json({ success: false, message: "Reaction ID or (Post ID + Type) is required" });
        return;
      }

      res.status(200).json({ success: true, data: reaction });
    } catch (error) {
      console.error("Error deleting post reaction:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
}
export default new postController();