import { AnswerService } from "./answer.service";

class AnswerController {
  
  async createAnswer(req: any, res: any): Promise<void> {
    try {
      const { id: postId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;
      const userName = req.user.fullName || 'Anonymous';

      if (!content) {
        res.status(400).json({ success: false, message: "Content is required" });
        return;
      }

      const answer = await AnswerService.createAnswer({
        postId,
        authorId: userId,
        authorName: userName,
        content,
        likesCount: 0,
        isAccepted: false,
        commentsCount: 0
      } as any);

      res.status(201).json({ success: true, data: answer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAnswersByPostId(req: any, res: any): Promise<void> {
    try {
        const { id: postId } = req.params;
        const answers = await AnswerService.getAnswersByPostId(postId, req.user?.id);
        res.status(200).json({ success: true, data: answers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
  }

  async acceptAnswer(req: any, res: any): Promise<void> {
      try {
          const { id: answerId } = req.params;
          const userId = req.user.id;
          
          const answer = await AnswerService.acceptAnswer(answerId, userId);
          res.status(200).json({ success: true, data: answer });
      } catch (error) {
          res.status(500).json({ success: false, message: error.message });
      }
  }

  async voteAnswer(req: any, res: any): Promise<void> {
      try {
          const { id: answerId } = req.params;
          const { type } = req.body; // 'up' or 'down'
          const userId = req.user.id;

          if (!['up', 'down'].includes(type)) {
               res.status(400).json({ success: false, message: "Invalid vote type" });
               return;
          }

          const answer = await AnswerService.voteAnswer(answerId, userId, type);
          res.status(200).json({ success: true, data: answer });
      } catch (error) {
          res.status(500).json({ success: false, message: error.message });
      }
  }
}

export default new AnswerController();
