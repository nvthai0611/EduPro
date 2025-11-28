import { Course } from "./course.model";

class CourseRepository {
  create(courseData: any) {
    return Course.create(courseData);
  }
  // Get all courses
  getAllCourses() {
    return Course.find()
      .lean();
  }
  // find course by id
  getCourseById(courseId: string) {
    return Course.findById(courseId).lean();
  }

  getCourseBySlug(courseSlug: string) {
    return Course.findOne({ slug: courseSlug }).lean();
  }

  // find courses by manager id
  getCoursesByManagerId(managerId: string) {
    return Course.find({ manager_id: managerId })
      .select("title price status created_at updated_at")
      .lean();
  }

  // update course by id
  updateCourseById(courseId: string, updateData: any) {
    updateData.updated_at = new Date();
    return Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    }).lean();
  }

  // delete course by id
  deleteCourseById(courseId: string) {
    return Course.findByIdAndDelete(courseId).lean();
  }

  //publish
  publishCourseById(courseId: string) {
    return Course.findByIdAndUpdate(
      courseId,
      { status: "published", updated_at: new Date() },
      { new: true }
    ).lean();
  }
}

export default new CourseRepository();
