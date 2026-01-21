import Comments, { IComment } from "./comment.model";
import Posts from "../post/models/post.model";
import Answers from "../answer/answer.model";

export class CommentService {
  
  static async createComment(data: IComment) {
    // 1. Validate Target and Update Counts
    let postToUpdate;
    
    if (data.targetType === "post") {
        const post = await Posts.findById(data.targetId);
        if (!post) throw new Error("Post not found");
        postToUpdate = post;
        
        // Inc Post.commentsCount
        await Posts.findByIdAndUpdate(data.targetId, { $inc: { commentsCount: 1 } });
    
    } else if (data.targetType === "answer") {
        const answer = await Answers.findById(data.targetId);
        if (!answer) throw new Error("Answer not found");
        
        // Inc Answer.commentsCount
        await Answers.findByIdAndUpdate(data.targetId, { $inc: { commentsCount: 1 } });
        
        // Also Inc Post.commentsCount (Denormalized total)
        await Posts.findByIdAndUpdate(answer.postId, { $inc: { commentsCount: 1 } });
    }

    // 2. Validate Nesting (Max 1 level)
    if (data.parentId) {
        const parentComment = await Comments.findById(data.parentId);
        if (!parentComment) throw new Error("Parent comment not found");
        
        // If parent already has a parentId, we cannot nest further (would be level 2)
        if (parentComment.parentId) {
            throw new Error("Maximum comment nesting level reached (1 level only)");
        }
    }

    // 3. Create Comment
    const comment = await Comments.create(data);
    return comment;
  }

  static async getComments(targetType: string, targetId: string) {
      // Lazy load approach: Fetch comments for this target.
      // We might want to populate authors.
      // If we want hierarchy, we can fetch all and reconstruct or just fetch logic.
      // Since it's 1-level, just fetching all sorted by createdAt is usually fine, 
      // check if frontend wants nested structure or flat with parentId.
      // Plan said: "Recursive or flat list". Let's return flat list sorted.
      
      const comments = await Comments.find({ targetType, targetId })
          .sort({ createdAt: 1 })
          .lean();
          
      return comments;
  }
}
