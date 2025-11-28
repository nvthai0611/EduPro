// import courseService from "../../../services/adminService/courseService";                               

// export const createCourse = async (req: any, res: any) => {
//   try {
//     const courseData = req.body;
//     const course = await courseService.createCourse(courseData);
//     res.status(201).json({ success: true, data: course });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /*
//     Get all courses
// */
// export const getAllCourses = async (req: any, res: any) => {
//   try {
//     // Implementation for getting all courses can be added here
//     const courses = await courseService.getAllCourses();
//     res.status(200).json({ success: true, data: courses });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /*
//     Get course by id
// */
// export const getCourse = async (req: any, res: any) => {
//   try {
//     const courseId = req.params.id;
//     const course = await courseService.getCourseService(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }
//     res.status(200).json({ success: true, data: course });
//     } catch (error) {   
//     res.status(400).json({ success: false, message: error.message });
//     }
// };

// export const getCoursesByManager = async (req: any, res: any) => {
//   try {
//     const managerId = req.params.managerId;
//     const courses = await courseService.getCoursesByManagerService(managerId);
//     res.status(200).json({ success: true, data: courses });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };