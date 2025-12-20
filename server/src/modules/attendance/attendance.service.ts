import { AttendanceRepository, AttendanceRecord } from "./attendance.repository";

interface CreateAttendanceDTO {
  courseId: string;
  records: AttendanceRecord[];
}

export class AttendanceService {
  static async createAttendance(data: CreateAttendanceDTO) {
    const existed =
      await AttendanceRepository.findByCourseAndDate(
        data.courseId,
      );

    if (existed) {
      throw new Error("Buổi điểm danh này đã tồn tại");
    }

    return AttendanceRepository.create(data);
  }

  static async getAttendancesByCourse(courseId: string) {
    return AttendanceRepository.findByCourse(courseId);
  }

  static async getAttendanceDetail(id: string) {
    const attendance = await AttendanceRepository.findById(id);
    if (!attendance) {
      throw new Error("Không tìm thấy buổi điểm danh");
    }
    return attendance;
  }

  static async updateAttendance(id: string, records: AttendanceRecord[]) {
    const updated = await AttendanceRepository.updateRecords(id, records);
    if (!updated) {
      throw new Error("Cập nhật điểm danh thất bại");
    }
    return updated;
  }
}