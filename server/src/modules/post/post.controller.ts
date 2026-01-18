import { PostService } from "./post.service";


class postController {
  // Controller methods here
  async getAllPosts(req: any, res: any): Promise<void> {
    try {
      console.log("📥 getAllPosts called");
      const query = req.query || {};
      const options = {
        select: req.query.select || null
      };
      console.log("Query options:", options);
      const posts = await PostService.getAllPosts(query, options);
      console.log("Posts found:", posts.length);
      
      // Use authorName from DB (already saved when creating)
      const transformedPosts = posts.map((post: any) => ({
        ...post,
        authorName: post.authorName || 'Anonymous'
      }));
      
      console.log("Transformed posts:", transformedPosts.length);
      res.status(200).json({ success: true, data: transformedPosts });
    } catch (error) {
      console.error("❌ getAllPosts error:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  async getPostById(req: any, res: any): Promise<void> {
    try {
      const post = await PostService.getPostById(req.params.id);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }
      res.status(200).json({ success: true, data: post   });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
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
      res.status(200).json({ success: true, data: posts });
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
      const post = await PostService.getPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      } 
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
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
      res.status(201).json({ success: true, data: post });
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

      const post = await PostService.updatePost(req.params.id, req.body);
      res.status(200).json({ success: true, data: post });
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
}
export default new postController();