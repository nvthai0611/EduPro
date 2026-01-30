import { encryptData } from "../../utils/encryption";
import { CommentService } from "./comment.service";

class CommentController {

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
          res.setHeader("x-encrypted", "true");
          res.status(200).json({ success: true, encryptedData: encryptData(comments) });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
  }
}

export default new CommentController();
