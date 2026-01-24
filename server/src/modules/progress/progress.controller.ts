import { Request, Response } from "express";
import { Types } from "mongoose";
import progressService from "./progress.service";

interface AuthRequest extends Request {
  user: {
    _id: string;
  };
}

class ProgressController {
  async getProgress(req: AuthRequest, res: Response) {
    const userId = new Types.ObjectId((req.user as any).id);
    const courseId = new Types.ObjectId(req.params.courseId);

    const progress = await progressService.getProgress(
      userId,
      courseId
    );

    res.json(progress);
  }

  async completeLesson(req: AuthRequest, res: Response) {
    const userId = new Types.ObjectId((req.user as any).id);
    const { courseId, lessonId } = req.params;

    const progress = await progressService.completeLesson(
      userId,
      new Types.ObjectId(courseId),
      lessonId
    );

    res.json(progress);
  }

  async uncompleteLesson(req: AuthRequest, res: Response) {
    const userId = new Types.ObjectId((req.user as any).id);
    const { courseId, lessonId } = req.params;

    const progress = await progressService.uncompleteLesson(
      userId,
      new Types.ObjectId(courseId),
      lessonId
    );

    res.json(progress);
  }
}

export default new ProgressController();
