import { Request, Response } from "express";
import { ProblemService } from "./problem.service";
import { encryptData } from "../../../utils/encryption";

export class ProblemController {
  static async create(req: Request, res: Response) {
    try {
      const problem = await ProblemService.create(req.body);
      res.status(201).json(problem);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const problems = await ProblemService.getAllPublished();
    res.setHeader("x-encrypted", "true");
    res.status(200).json({ success: true, encryptedData: encryptData(problems) });
  }

  static async getBySlug(req: Request, res: Response) {
    const problem = await ProblemService.getBySlug(req.params.slug);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.setHeader("x-encrypted", "true");
    res.status(200).json({ success: true, encryptedData: encryptData(problem) });
  }

  static async update(req: Request, res: Response) {
    const problem = await ProblemService.update(
      req.params.id,
      req.body
    );
    res.json(problem);
  }

  static async delete(req: Request, res: Response) {
    await ProblemService.delete(req.params.id);
    res.json({ message: "Deleted successfully" });
  }
}
