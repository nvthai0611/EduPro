import CourseRepository from "./course.repository";

class CourseService {
  async createCourse(courseData: any) : Promise<any> {
    // Validate course data
    if (!courseData.title ||
      !courseData.description ||
      !courseData.price ||
      !courseData.instructorId
    ) {
      throw new Error("Missing required course fields");
    }
    courseData.status = "draft"; // default status
    const course = await CourseRepository.create(courseData);
    return course;
  }
  
  async getAllCourses() : Promise<any> {
    const courses = await CourseRepository.getAllCourses();
    return courses;
  }
  // chua hoan thanh
  async getCourseService(courseId: string): Promise<any> {
    const course = await CourseRepository.getCourseById(courseId);
    return course;
  }

  async getCoursesByInstructorService(instructorId: string): Promise<any> {
    const courses = await CourseRepository.getCoursesByInstructorId(instructorId);
    return courses;
  }
  async updateCourseService(courseId: string, updateData: any): Promise<any> {
    const updatedCourse = await CourseRepository.updateCourse(courseId, updateData);
    return updatedCourse;
  }
  //soft delete
  async deleteCourseService(courseId: string): Promise<any> {
    const deletedCourse = await CourseRepository.updateCourse(courseId, { isDeleted: true });
    return deletedCourse;
  }
}

export default new CourseService();
