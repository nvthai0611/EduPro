import { Types } from "mongoose";
import SubmissionModel, { ISubmission } from "./submission.model";

export class SubmissionRepository {
  static create(data: Partial<ISubmission>) {
    return SubmissionModel.create(data);
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

  static updateResult(
    id: string | Types.ObjectId,
    status: string,
    results: any
  ) {
    return SubmissionModel.findByIdAndUpdate(
      id,
      { status, results },
      { new: true }
    );
  }
}
