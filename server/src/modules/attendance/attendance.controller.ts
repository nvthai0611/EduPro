import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";

export class AttendanceController {
  // POST /attendance
  static async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      
      const { courseId, records } = req.body;

      if (!courseId || !records) {
        return res.status(400).json({
          success: false,
          message: "Thiếu dữ liệu bắt buộc",
        });
      }

      const attendance = await AttendanceService.createAttendance({
        courseId,
        records
      });

      return res.status(201).json({
        success: true,
        data: attendance,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /attendance?courseId=xxx
  static async getByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.query;

      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: "courseId is required",
        });
      }

      const data = await AttendanceService.getAttendancesByCourse(
        courseId as string
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /attendance/:id
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const attendance =
        await AttendanceService.getAttendanceDetail(id);

      return res.json({
        success: true,
        data: attendance,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PATCH /attendance/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { records } = req.body;

      const updated = await AttendanceService.updateAttendance(id, records);

      return res.json({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}