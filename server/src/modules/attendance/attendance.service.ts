import { AttendanceRepository, AttendanceRecord } from "./attendance.repository";

interface CreateAttendanceDTO {
  courseId: string;
  records: AttendanceRecord[];
}

export class AttendanceService {
  static async createAttendance(data: CreateAttendanceDTO) {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existed = await AttendanceRepository.findOne({
      courseId: data.courseId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existed) {
      throw new Error("Buổi điểm danh hôm nay đã tồn tại");
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