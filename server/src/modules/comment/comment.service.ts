import Comments, { IComment } from "./comment.model";
import Posts from "../post/models/post.model";
import Answers from "../answer/answer.model";
import notificationService from "../notification/notification.service";
import { NotificationType } from "../notification/notification.model";

export class CommentService {
  
  static async createComment(data: IComment) {
    // 1. Validate Target and Update Counts
    let postToUpdate;
    let postAuthorId;
    
    if (data.targetType === "post") {
        const post = await Posts.findById(data.targetId);
        if (!post) throw new Error("Post not found");
        postToUpdate = post;
        postAuthorId = post.authorId;
        
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

    // 4. Send Notification (Non-blocking)
    // Handle two cases:
    // - Comment on Post -> Notify post author
    // - Reply to Comment -> Notify parent comment owner
    this.sendCommentNotification(comment, postAuthorId).catch((error) => {
      console.error('[CommentService] Notification failed:', error.message);
    });

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

  /**
   * Send notification for comment creation (Non-blocking)
   * 
   * Business rules:
   * - If parentId exists: Reply to comment -> Notify parent comment owner
   * - If no parentId and targetType is post: Comment on post -> Notify post author
   * - Skip if user comments on their own content
   * 
   * Production-safe:
   * - Failures do NOT rollback comment creation
   * - Errors are logged only
   * 
   * @param comment - Created comment
   * @param postAuthorId - Optional post author ID for post comments
   */
  private static async sendCommentNotification(
    comment: IComment,
    postAuthorId?: any
  ): Promise<void> {
    try {
      // Case 1: Reply to comment (parentId exists)
      if (comment.parentId) {
        const parentComment = await Comments.findById(comment.parentId);
        
        if (parentComment) {
          await notificationService.createNotification({
            recipientId: parentComment.authorId,
            actorId: comment.authorId,
            type: NotificationType.COMMENT_REPLY,
            commentId: comment.parentId,
            postId: comment.targetType === 'post' ? comment.targetId : undefined,
            actorName: comment.authorName,
          });
        }
      } 
      // Case 2: Comment on post (no parentId, targetType is post)
      else if (comment.targetType === 'post' && postAuthorId) {
        await notificationService.createNotification({
          recipientId: postAuthorId,
          actorId: comment.authorId,
          type: NotificationType.POST_COMMENT,
          postId: comment.targetId,
          commentId: comment._id,
          actorName: comment.authorName,
        });
      }
    } catch (error: any) {
      // Log error but don't throw - notification failure should not affect comment creation
      console.error('[CommentService] Failed to send notification:', {
        error: error.message,
        commentId: comment._id,
        authorId: comment.authorId,
      });
    }
  }
}