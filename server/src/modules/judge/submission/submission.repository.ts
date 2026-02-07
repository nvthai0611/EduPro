import { Types } from "mongoose";
import SubmissionModel, { ISubmission } from "./submission.model";

export class SubmissionRepository {
  static create(data: Partial<ISubmission>) {
    return SubmissionModel.findOneAndUpdate(
      {
        userId: data.userId,
        problemId: data.problemId,
      },
      {
        $set: data,
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  static findById(id: string | Types.ObjectId) {
    return SubmissionModel.findById(id)
      .populate("problemId")
      .populate("userId");
  }

  static findByUser(userId: string | Types.ObjectId) {
    return SubmissionModel.find({ userId })
      .sort({ createdAt: -1 });
  }

  static findByProblem(problemId: string | Types.ObjectId) {
    return SubmissionModel.find({ problemId })
      .sort({ createdAt: -1 });
  }

  static findByUserAndProblem(
    userId: string | Types.ObjectId,
    problemId: string | Types.ObjectId
  ) {
    return SubmissionModel.findOne({ userId, problemId })
      .populate("problemId")
      .populate("userId");
  }
}
