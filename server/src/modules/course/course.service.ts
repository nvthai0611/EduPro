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

  async getAllCoursesPublic(filters: any = {}): Promise<any> {
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

    // Chỉ select các fields cần thiết cho public
    const courses = await CourseRepository.findAll(query, {
      select: {
        _id: 1,
        title: 1,
        slug: 1,
        // thumbnail: 1,
        description: 1,
        // category: 1,
        level: 1,
        price: 1,
        salePrice: 1,
        currency: 1,
        // status: 1,
        // isFeatured: 1,
        totalStudents: 1,
        // totalReviews: 1,
        averageRating: 1,
        rating: 1,
        // reviewCount: 1,
        // totalDuration: 1,
        totalLessons: 1,
        // label: 1,
        // color: 1,
        // Không trả về: sessionToken, approvalMessage, submittedBy, adminNote, etc.
      },
    });
    return courses;
  }

  // Admin API - Trả về đầy đủ tất cả fields
  async getAllCoursesAdmin(filters: any = {}): Promise<any> {
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

    // Trả về tất cả fields cho admin (không select)
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
    const courses = await CourseRepository.getCoursesByInstructorId(
      instructorId
    );
    return courses;
  }

  async getCoursesByManagerService(managerId: string): Promise<any> {
    const courses = await CourseRepository.getCoursesByManagerId(managerId);
    return courses;
  }

  async updateCourseService(courseId: string, updateData: any): Promise<any> {
    const updatedCourse = await CourseRepository.updateCourse(
      courseId,
      updateData
    );
    return updatedCourse;
  }

  async deleteCourseService(courseId: string): Promise<any> {
    const deletedCourse = await CourseRepository.updateCourse(courseId, {
      isDeleted: true,
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

    // Only draft courses can be submitted
    if (course.status !== "draft") {
      throw new Error(
        `Cannot submit course with status: ${course.status}. Only draft courses can be submitted.`
      );
    }

    // Update course with approval data
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
