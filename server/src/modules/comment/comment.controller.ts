import { CommentService } from "./comment.service";

class CommentController {
  
  async createComment(req: any, res: any): Promise<void> {
    try {
      const { targetType, targetId } = req.params; // or derived from route structure
      // Wait, standard route might be /posts/:id/comments, so targetType is implied
      
      // Let's rely on arguments passed from route-specific handlers if needed, 
      // or we can expect body to contain content and route to define target.
      
      // We'll use a flexible approach:
      // If route is /posts/:id/comments -> targetType='post', targetId=:id
      // If route is /answers/:id/comments -> targetType='answer', targetId=:id
      
      const routeTargetType = req.baseUrl.includes('posts') ? 'post' : 'answer';
      // Careful: req.baseUrl might vary. 
      // Better: pass targetType via route middleware or explicit method calls.
      
      // Let's assume specific methods for now to be safe.
      throw new Error("Use specific methods createPostComment or createAnswerComment");
    } catch (error) {
        // ...
    }
  }

  async createPostComment(req: any, res: any): Promise<void> {
       try {
           const { id: targetId } = req.params;
           const { content, parentId } = req.body; // parentId optional
           const userId = req.user.id;
           const userName = req.user.fullName || 'Anonymous';
           
           if (!content) {
               res.status(400).json({ success: false, message: "Content is required" });
               return;
           }

           const comment = await CommentService.createComment({
               targetType: 'post',
               targetId: targetId as any,
               authorId: userId,
               authorName: userName,
               content,
               parentId: parentId || null,
               likesCount: 0
           } as any);

           res.status(201).json({ success: true, data: comment });
       } catch (error) {
           res.status(500).json({ success: false, message: error.message });
       }
  }

  async createAnswerComment(req: any, res: any): Promise<void> {
       try {
           const { id: targetId } = req.params;
           const { content, parentId } = req.body;
           const userId = req.user.id;
           const userName = req.user.fullName || 'Anonymous';

           if (!content) {
               res.status(400).json({ success: false, message: "Content is required" });
               return;
           }

           const comment = await CommentService.createComment({
               targetType: 'answer',
               targetId: targetId as any,
               authorId: userId,
               authorName: userName,
               content,
               parentId: parentId || null,
               likesCount: 0
           } as any);

           res.status(201).json({ success: true, data: comment });
       } catch (error) {
           res.status(500).json({ success: false, message: error.message });
       }
  }

  async getComments(req: any, res: any): Promise<void> {
      try {
          console.log("📥 getComments query:", req.query); // Debug log
          const { targetType, targetId } = req.query;
          
          if (!targetType || !targetId) {
              console.log("❌ Missing params:", { targetType, targetId });
              res.status(400).json({ 
                  success: false, 
                  message: "targetType and targetId are required",
                  received: req.query
              });
              return;
          }

          const comments = await CommentService.getComments(targetType, targetId);
          res.status(200).json({ success: true, data: comments });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
  }
}

export default new CommentController();
