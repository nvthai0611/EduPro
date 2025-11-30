import CourseRepository from "./course.repository";

class CourseService {
  async createCourse(courseData: any): Promise<any> {
    if (
      !courseData.title ||
      !courseData.description ||
      courseData.price === undefined
    ) {
      throw new Error("Missing required course fields");
    }
    
    // Set default values if not provided
    if (!courseData.status) {
      courseData.status = "draft";
    }
    
    // Use instructorId if provided, otherwise use manager_id
    if (!courseData.manager_id && courseData.instructorId) {
      courseData.manager_id = courseData.instructorId;
    }
    
    const course = await CourseRepository.create(courseData);
    return course;
  }

  async getAllCourses(filters: any = {}): Promise<any> {
    const query: any = { isDeleted: { $ne: true } };

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.level) {
      query.level = filters.level;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured === "true";
    }

    if (filters.price !== undefined) {
      query.price = filters.price;
    }

    const courses = await CourseRepository.findAll(query);
    return courses;
  }

  async getCourseById(courseId: string): Promise<any> {
    const course = await CourseRepository.getCourseById(courseId);
    return course;
  }

  async getCourseBySlug(courseSlug: string): Promise<any> {
    const course = await CourseRepository.getCourseBySlug(courseSlug);
    return course;
  }

  async getCoursesByInstructorService(instructorId: string): Promise<any> {
    const courses = await CourseRepository.getCoursesByInstructorId(instructorId);
    return courses;
  }

  async getCoursesByManagerService(managerId: string): Promise<any> {
    const courses = await CourseRepository.getCoursesByManagerId(managerId);
    return courses;
  }

  async updateCourseService(courseId: string, updateData: any): Promise<any> {
    const updatedCourse = await CourseRepository.updateCourse(courseId, updateData);
    return updatedCourse;
  }

  async deleteCourseService(courseId: string): Promise<any> {
    const deletedCourse = await CourseRepository.updateCourse(courseId, { 
      isDeleted: true 
    });
    return deletedCourse;
  }

  async getCourseWithDetails(courseId: string): Promise<any> {
    const course = await CourseRepository.getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  // Submit course for approval
  async submitCourseForApproval(
    courseId: string, 
    userId: string, 
    approvalMessage: string
  ): Promise<any> {
    const course = await CourseRepository.getCourseById(courseId);
    
    if (!course) {
      throw new Error("Course not found");
    }

    // Handle both populated and non-populated instructorId
    const instructorId = course.instructorId._id || course.instructorId;
    if (instructorId.toString() !== userId.toString()) {
      throw new Error("You are not authorized to submit this course");
    }

    // BR-02: Only draft courses can be submitted
    if (course.status !== "draft") {
      throw new Error(`Cannot submit course with status: ${course.status}. Only draft courses can be submitted.`);
    }

    // BR-05: Update course with approval data
    const updatedCourse = await CourseRepository.updateCourse(courseId, {
      status: "pending",
      approvalMessage: approvalMessage,
      submittedAt: new Date(),
      submittedBy: userId,
    });

    return updatedCourse;
  }
}

export default new CourseService();
