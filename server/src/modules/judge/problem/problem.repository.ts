import { Types } from "mongoose";
import ProblemModel, { IProblem } from "./problem.model";

export class ProblemRepository {
  static create(data: Partial<IProblem>) {
    return ProblemModel.create(data);
  }

  static findById(id: string | Types.ObjectId) {
    return ProblemModel.findOne({ _id: id, isDeleted: false });
  }

  static findBySlug(slug: string) {
    return ProblemModel.findOne({ slug, isDeleted: false });
  }

  static findAll(filter: any = {}) {
    return ProblemModel.find({ isDeleted: false, ...filter })
      .sort({ createdAt: -1 });
  }

  static updateById(
    id: string | Types.ObjectId,
    data: Partial<IProblem>
  ) {
    return ProblemModel.findByIdAndUpdate(id, data, { new: true });
  }

  static softDelete(id: string | Types.ObjectId) {
    return ProblemModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}
