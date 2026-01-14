import { ForumService } from "./forum.service";


class forumController {
  // Controller methods here
  async getAllForums(req: any, res: any): Promise<void> {
    try {
      console.log("📥 getAllForums called");
      const query = req.query || {};
      const options = {
        select: req.query.select || null
      };
      console.log("Query options:", options);
      const forums = await ForumService.getAllForums(query, options);
      console.log("Forums found:", forums.length);
      
      // Use authorName from DB (already saved when creating)
      const transformedForums = forums.map((forum: any) => ({
        ...forum,
        authorName: forum.authorName || 'Anonymous'
      }));
      
      console.log("Transformed forums:", transformedForums.length);
      res.status(200).json({ success: true, data: transformedForums });
    } catch (error) {
      console.error("❌ getAllForums error:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  async getForumById(req: any, res: any): Promise<void> {
    try {
      const forum = await ForumService.getForumById(req.params.id);
      if (!forum) {
        res.status(404).json({ success: false, message: "Forum not found" });
        return;
      }
      res.status(200).json({ success: true, data: forum });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async getForumsByUser(req: any, res: any): Promise<void> {
    try {
      const forums = await ForumService.getForumsByUser(req.params.userId);
      res.status(200).json({ success: true, data: forums });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async getForumsBySlug(req: any, res: any): Promise<void> {
    try {
      const forum = await ForumService.getForumBySlug(req.params.slug);
      if (!forum) {
        res.status(404).json({ success: false, message: "Forum not found" });
        return;
      } 
      res.status(200).json({ success: true, data: forum });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async createForum(req: any, res: any): Promise<void> {
    try {
      const forumData = { ...req.body };
      
      // Get author ID and name from authenticated user
      if (req.user && req.user.id) {
        forumData.authorId = req.user.id;
        forumData.authorName = req.user.fullName || 'Anonymous';
      } else {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }
      
      // Handle uploaded cover image from Cloudinary
      if (req.file) {
        forumData.coverImageUrl = req.file.path;
      }
      
      // Content already has Cloudinary URLs from editor uploads
      // No need to process contentImages
      
      const forum = await ForumService.createForum(forumData);
      res.status(201).json({ success: true, data: forum });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async updateForum(req: any, res: any): Promise<void> {
    try {
      const forum = await ForumService.updateForum(req.params.id, req.body);
      if (!forum) {
        res.status(404).json({ success: false, message: "Forum not found" });
        return;
      }
      res.status(200).json({ success: true, data: forum });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  async deleteForum(req: any, res: any): Promise<void> {
    try {
      const forum = await ForumService.deleteForum(req.params.id);
      if (!forum) {
        res.status(404).json({ success: false, message: "Forum not found" });
        return;
      }
      res.status(200).json({ success: true, data: forum });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
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
export default new forumController();