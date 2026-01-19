import  Answers, { IAnswer } from "./answer.model";
import Posts from "../post/models/post.model";
import AnswerVotes from "../vote/vote.model";
import mongoose, { Types } from "mongoose";

export class AnswerService {
  
  static async createAnswer(data: IAnswer) {
    // Validate Post exists
    const post = await Posts.findById(data.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const answer = await Answers.create(data);

    // Increment Post.answersCount
    await Posts.findByIdAndUpdate(data.postId, { $inc: { answersCount: 1 } });

    return answer;
  }

  static async getAnswersByPostId(postId: string, userId?: string) {
      // Sorting: Accepted -> Likes DESC -> CreatedAt ASC
      const answers = await Answers.find({ postId })
          .sort({ isAccepted: -1, likesCount: -1, createdAt: 1 })
          .lean();

      // If userId provided, we could check if user voted (optional optimization)
      // For now just return answers
      return answers;
  }

  static async acceptAnswer(answerId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const answer = await Answers.findById(answerId).session(session);
      if (!answer) throw new Error("Answer not found");

      const post = await Posts.findById(answer.postId).session(session);
      if (!post) throw new Error("Post not found");

      // Check permission: Only Post author can accept
      if (post.authorId.toString() !== userId) {
        throw new Error("Unauthorized: Only post author can accept an answer");
      }

      // 1. Unset old accepted answer (if any)
      if (post.acceptedAnswerId) {
        await Answers.findByIdAndUpdate(
          post.acceptedAnswerId,
          { isAccepted: false },
          { session }
        );
      }

      // 2. Set new accepted answer
      answer.isAccepted = true;
      await answer.save({ session });

      // 3. Update Post
      post.acceptedAnswerId = answer._id as Types.ObjectId;
      await post.save({ session });

      await session.commitTransaction();
      return answer;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async voteAnswer(answerId: string, userId: string, type: "up" | "down") {
    // Idempotency check with AnswerVotes
    const existingVote = await AnswerVotes.findOne({ answerId, userId });

    if (existingVote) {
      // If vote type is same, ignore (idempotent)
      if (existingVote.type === type) {
          return await Answers.findById(answerId);
      }

      // If vote type changed (up -> down or down -> up), update vote and adjust count
      // Logic: up -> down: -2 (remove up, add down?). 
      // Simplified: Just update the interaction.
      // Generic approach: 
      // 1. Remove old effect
      // 2. Add new effect
      
      // Let's keep it simple: StackOverflow just toggles or allows changing.
      // If up -> down: net change -1 (un-up) + -1 (down) = -2 not supported by simple counters usually unless strict.
      // current plan: simple "up" votes usually.
      
      // If we support Up and Down:
      // existing=up, new=down => likesCount - 2 (un-up, apply down) ??
      // Let's assume simple "Likes" (Upvote only) or Up/Down.
      // User requested "vote button".
      // Let's assume standard Up/Down logic.
      
      let change = 0;
      if (existingVote.type === 'up' && type === 'down') change = -2;
      if (existingVote.type === 'down' && type === 'up') change = 2;
      
      existingVote.type = type;
      await existingVote.save();
      
      const answer = await Answers.findByIdAndUpdate(
          answerId, 
          { $inc: { likesCount: change } }, 
          { new: true }
      );
      return answer;
    }

    // New Vote
    await AnswerVotes.create({ answerId, userId, type });
    const change = type === "up" ? 1 : -1;
    
    const answer = await Answers.findByIdAndUpdate(
        answerId,
        { $inc: { likesCount: change } },
        { new: true }
    );
    return answer;
  }
}
