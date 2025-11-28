import courseService from "./course.service";



//POST /courses
export const createCourse = async (req: any, res: any) => {
  try {
    const instructorId = req.user._id;
    const courseData = req.body;
    const course = await courseService.createCourse(
      { ...courseData, instructorId: instructorId }
    );
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.error("Error creating course:", error);
  }
};

/*
    Get all courses
*/
//GET /courses
export const getAllCourses = async (req: any, res: any) => {
  try {
    // Implementation for getting all courses can be added here
    const courses = await courseService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*
    Get course by id
*/
export const getCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const course = await courseService.getCourseService(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCoursesByInstructor = async (req: any, res: any) => {
  try {
    const instructorId = req.params.instructorId;
    const courses = await courseService.getCoursesByInstructorService(instructorId);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// submit course for review
//PATCH /courses/:id/submit-review
export const submitCourseForReview = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    // Call service to submit course for review
    await courseService.updateCourseService(courseId, { status: "pending", reviewAt: new Date() });
    res.status(200).json({ success: true, message: "Course submitted for review" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin review course: approve or reject
//PATCH /courses/:id/review
export const reviewCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const { action, adminNote } = req.body; // action: "approve" or "reject"
    let updateData: any = { adminNote: adminNote };

    if (action === "approve") {
      updateData.status = "approved";
    } else if (action === "reject") {
      updateData.status = "rejected";
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
    await courseService.updateCourseService(courseId, updateData);
    res.status(200).json({ success: true, message: `Course ${action}d successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//PATCH /courses/:id
export const updateCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;
    const updatedCourse = await courseService.updateCourseService(courseId, updateData);
    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// get details course by id including modules and lessons
export const getCourseDetails = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    // Get course service

    //get modules and lessons service

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// delete course (soft delete)
export const deleteCourse = async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    await courseService.deleteCourseService(courseId);
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};