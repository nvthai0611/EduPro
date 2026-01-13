import { ForumService } from "./forum.service";


class forumController {
  // Controller methods here
  async getAllForums(req: any, res: any): Promise<void> {
    try {
      const query = req.query || {};
      const options = {
        select: req.query.select || null,
      };
      const forums = await ForumService.getAllForums(query, options);
      res.status(200).json({ success: true, data: forums });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
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
      
      // Get author ID from authenticated user
      if (req.user && req.user.id) {
        forumData.authorId = req.user.id;
      } else {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }
      
      // Handle uploaded images from Cloudinary
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Cover image
        if (files.coverImage && files.coverImage[0]) {
          forumData.coverImageUrl = files.coverImage[0].path;
        }
        
        // Content images - replace blob URLs with Cloudinary URLs
        if (files.contentImages && files.contentImages.length > 0) {
          const contentImageUrls = files.contentImages.map((file: any) => file.path);
          forumData.contentImageUrls = contentImageUrls;
          
          // Replace blob URLs in content with actual Cloudinary URLs
          let content = forumData.content || "";
          const blobUrlPattern = /!\[([^\]]*)\]\((blob:[^\)]+)\)/g;
          let imageIndex = 0;
          
          content = content.replace(blobUrlPattern, (match: string, altText: string) => {
            if (imageIndex < contentImageUrls.length) {
              const cloudinaryUrl = contentImageUrls[imageIndex];
              imageIndex++;
              return `![${altText}](${cloudinaryUrl})`;
            }
            return match;
          });
          
          forumData.content = content;
        }
      }
      
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
}
export default new forumController();