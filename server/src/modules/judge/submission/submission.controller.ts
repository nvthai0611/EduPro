import { Request, Response } from "express";
import { SubmissionService } from "./submission.service";

export class SubmissionController {
  static async create(req: any, res: Response) {
    const submission = await SubmissionService.create({
      ...req.body,
      userId: req.user._id, // từ auth middleware
    });
    res.status(201).json(submission);
  }

  static async getMySubmissions(req: any, res: Response) {
    const submissions = await SubmissionService.getByUser(
      req.user._id
    );
    res.json(submissions);
  }

  static async getById(req: Request, res: Response) {
    const submission = await SubmissionService.getById(req.params.id);
    res.json(submission);
  }
}
