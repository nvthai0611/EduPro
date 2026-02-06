import { SubmissionRepository } from "./submission.repository";
import { ISubmission } from "./submission.model";

export class SubmissionService {
  static create(data: Partial<ISubmission>) {
    return SubmissionRepository.create(data);
  }

  static getById(id: string) {
    return SubmissionRepository.findById(id);
  }

  static getByUser(userId: string) {
    return SubmissionRepository.findByUser(userId);
  }

  static getByProblem(problemId: string) {
    return SubmissionRepository.findByProblem(problemId);
  }

  static getByUserAndProblem(userId: string, problemId: string) {
    return SubmissionRepository.findByUserAndProblem(userId, problemId);
  }
}
