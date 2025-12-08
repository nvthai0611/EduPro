import courseService from "./course.service";

// POST /courses
export const createCourse = async (req: any, res: any) => {
  try {
    const instructorId = req.user?.id || req.body.instructorId;
    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Unauthorized - No instructor ID" });
    }
    const courseData = req.body;
    const course = await courseService.createCourse(
      { ...courseData, instructorId: instructorId }
    );
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
    console.error("Error creating course:", error);
  }
};

// GET /courses - Public route với fields giới hạn
export const getAllCoursesPublic = async (req: any, res: any) => {
  try {
    // Handle nested params if they exist (params[status] from axios)
    const queryParams = req.query.params || req.query;
    
    const filters = {
      search: queryParams.search,
      status: queryParams.status,
      level: queryParams.level,
      category: queryParams.category,
      price: queryParams.price,
      isFeatured: queryParams.isFeatured,
    };
    
    // Chỉ trả về các fields cần thiết cho public
    const courses = await courseService.getAllCoursesPublic(filters);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /admin/courses - Admin route với full fields
export const getAllCoursesAdmin = async (req: any, res: any) => {
  try {
    // Handle nested params if they exist (params[status] from axios)
    const queryParams = req.query.params || req.query;
    
    const filters = {
      search: queryParams.search,
      status: queryParams.status,
      level: queryParams.level,
      category: queryParams.category,
      price: queryParams.price,
      isFeatured: queryParams.isFeatured,
    };
    
    // Trả về đầy đủ fields cho admin
    const courses = await courseService.getAllCoursesAdmin(filters);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Deprecated: Keep for backward compatibility
export const getAllCourses = getAllCoursesAdmin;

// GET /courses/:id
export const getCourseById = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /courses/slug/:slug
export const getCourseBySlug = async (req: any, res: any) => {
  try {
    const courseSlug = req.params.slug;
    const course = await courseService.getCourseBySlug(courseSlug);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /courses/instructor/:instructorId
export const getAllCoursesByInstructor = async (req: any, res: any) => {
  try {
    const instructorId = req.params.instructorId;
    const courses = await courseService.getCoursesByInstructorService(instructorId);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /courses/manager/:managerId
export const getCoursesByManager = async (req: any, res: any) => {
  try {
    const managerId = req.params.managerId;
    const courses = await courseService.getCoursesByManagerService(managerId);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /courses/:id
export const updateCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;
    const updatedCourse = await courseService.updateCourseService(courseId, updateData);
    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /courses/:id (soft delete)
export const deleteCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    await courseService.deleteCourseService(courseId);
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /courses/:id/submit - Submit course for approval (BR-02 to BR-05)
export const submitCourseForApproval = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const { approvalMessage } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - User not authenticated" 
      });
    }

    // BR-03: approvalMessage is required and min 10 characters
    if (!approvalMessage || approvalMessage.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Approval message is required and must be at least 10 characters" 
      });
    }

    const result = await courseService.submitCourseForApproval(
      courseId, 
      userId, 
      approvalMessage.trim()
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Course submitted for approval successfully",
      data: result
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 
                      error.message.includes("not authorized") ? 403 : 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// PATCH /courses/:id/review
export const reviewCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const { action, adminNote } = req.body;
    let updateData: any = { adminNote: adminNote };

    if (action === "approve") {
      updateData.status = "approved";
    } else if (action === "reject") {
      updateData.status = "rejected";
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
    
    await courseService.updateCourseService(courseId, updateData);
    res.status(200).json({ 
      success: true, 
      message: `Course ${action}d successfully` 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /courses/:id/details
export const getCourseDetails = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const courseDetails = await courseService.getCourseWithDetails(courseId);
    res.status(200).json({ success: true, data: courseDetails });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
