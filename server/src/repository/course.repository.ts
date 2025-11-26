import CourseModel from "../models/course.model";

class CourseRepository {
  create(courseData: any) {
    return CourseModel.create(courseData);
  }
  // Get all courses
  getAllCourses() {
    return CourseModel.find()
      .lean();
  }
  // find course by id
  getCourseById(courseId: string) {
    return CourseModel.findById(courseId).lean();
  }

  // find courses by manager id
  getCoursesByManagerId(managerId: string) {
    return CourseModel.find({ manager_id: managerId })
      .select("title price status created_at updated_at")
      .lean();
  }

  // update course by id
  updateCourseById(courseId: string, updateData: any) {
    updateData.updated_at = new Date();
    return CourseModel.findByIdAndUpdate(courseId, updateData, {
      new: true,
    }).lean();
  }

  // delete course by id
  deleteCourseById(courseId: string) {
    return CourseModel.findByIdAndDelete(courseId).lean();
  }

  //publish
  publishCourseById(courseId: string) {
    return CourseModel.findByIdAndUpdate(
      courseId,
      { status: "published", updated_at: new Date() },
      { new: true }
    ).lean();
  }
}

export default new CourseRepository();
