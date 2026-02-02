import { ProblemRepository } from "./problem.repository";
import { IProblem } from "./problem.model";

export class ProblemService {
  static async create(data: Partial<IProblem>) {
    return ProblemRepository.create(data);
  }

  static getAllPublished() {
    return ProblemRepository.findAll({ isPublished: true });
  }

  static getBySlug(slug: string) {
    return ProblemRepository.findBySlug(slug);
  }

  static getById(id: string) {
    return ProblemRepository.findById(id);
  }

  static update(id: string, data: Partial<IProblem>) {
    return ProblemRepository.updateById(id, data);
  }

  static delete(id: string) {
    return ProblemRepository.softDelete(id);
  }
}
