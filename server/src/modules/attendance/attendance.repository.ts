import Attendance from "./attendance.model";
import { Types } from "mongoose";

export interface AttendanceRecord {
  studentId: string;
  attendance: boolean;
  homework: boolean;
  note?: string;
}

export class AttendanceRepository {
  static create(data: any) {
    return Attendance.create(data);
  }

  static findByCourse(courseId: string) {
    return Attendance.find({
      courseId: new Types.ObjectId(courseId),
    })
      .sort({ createdAt: -1 })
      .populate("records.studentId", "fullName email")
      .populate("courseId", "title");
  }

  static findOne(filter: any) {
    return Attendance.findOne(filter);
  }

  static findById(id: string) {
    return Attendance.findById(id)
      .populate("records.studentId", "fullName email")
      .populate("courseId", "title");
  }

  static updateRecords(id: string, records: AttendanceRecord[]) {
    return Attendance.findByIdAndUpdate(
      id,
      { records },
      { new: true }
    );
  }
}