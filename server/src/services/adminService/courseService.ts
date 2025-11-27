import CourseRepository from "../../repository/course.repository";

class CourseService {
  async createCourse(courseData: any) : Promise<any> {
    // Validate course data
    if (!courseData.title ||
      !courseData.description ||
      !courseData.category ||
      !courseData.price ||
      !courseData.manager_id
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

  async getCoursesByManagerService(managerId: string): Promise<any> {
    const courses = await CourseRepository.getCoursesByManagerId(managerId);
    return courses;
  }
  asy
}

export default new CourseService();
