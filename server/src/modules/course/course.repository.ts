import Course from "./course.model";

class CourseRepository {
  async create(data: Partial<any>): Promise<any> {
    return Course.create(data);
  }
  //get all courses that isDeleted is false
  async getAllCourses(): Promise<any[]> {
    return Course.find({ isDeleted: { $ne: true } });
  }
  async getCourseById(courseId: string): Promise<any | null> {
    return Course.findById(courseId);
  }
  async getCoursesByInstructorId(instructorId: string): Promise<any[]> {
    return Course.find({ instructorId: instructorId });
  }
  async updateCourse(courseId: string, updateData: Partial<any>): Promise<any | null> {
    return Course.findByIdAndUpdate(courseId, updateData, { new: true });
  }

  async deleteCourse(courseId: string): Promise<any | null> {
    return Course.findByIdAndDelete(courseId);
  }


}

export default new CourseRepository();