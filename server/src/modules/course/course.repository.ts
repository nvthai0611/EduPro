import Course from "./course.model";

class CourseRepository {
  async create(courseData: any): Promise<any> {
    return Course.create(courseData);
  }

  async findAll(query: any = {}): Promise<any[]> {
    return Course.find(query)
      .populate("instructorId", "fullName email image")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAllCourses(): Promise<any[]> {
    return Course.find({ isDeleted: { $ne: true } })
      .populate("instructorId", "fullName email image")
      .lean();
  }

  async getCourseById(courseId: string): Promise<any | null> {
    return Course.findById(courseId)
      .populate("instructorId", "fullName email image")
      .lean();
  }

  async getCourseBySlug(courseSlug: string): Promise<any | null> {
    return Course.findOne({ slug: courseSlug })
      .populate("instructorId", "fullName email image")
      .lean();
  }

  async getCoursesByInstructorId(instructorId: string): Promise<any[]> {
    return Course.find({ instructorId: instructorId, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getCoursesByManagerId(managerId: string): Promise<any[]> {
    return Course.find({ managerId: managerId, isDeleted: { $ne: true } })
      .select("title price status createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateCourse(courseId: string, updateData: any): Promise<any | null> {
    return Course.findByIdAndUpdate(
      courseId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
  }

  async deleteCourse(courseId: string): Promise<any | null> {
    return Course.findByIdAndDelete(courseId).lean();
  }

  async publishCourse(courseId: string): Promise<any | null> {
    return Course.findByIdAndUpdate(
      courseId,
      { status: "published", isPublished: true, updatedAt: new Date() },
      { new: true }
    ).lean();
  }
}

export default new CourseRepository();
