import { apiClient } from "../../utils/clientAxios";

/**
 * Đăng ký khóa học miễn phí
 * @param {string} userId - ID của user
 * @param {string} courseId - ID của course
 * @param {string} courseTitle - Tên khóa học
 * @returns {Promise} Response từ server
 */
export const enrollFreeCourse = async (userId, courseId, courseTitle) => {
  try {
    const response = await apiClient.post("/orders/enroll-free", {
      userId,
      courseId,
      courseTitle,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Kiểm tra xem course có phải là miễn phí không
 * @param {object} course - Course object
 * @returns {boolean} True nếu là khóa học miễn phí
 */
export const isFreeCourse = (course) => {
  return (
    course?.salePrice === 0 ||
    course?.salePrice === null ||
    course?.salePrice === undefined
  );
};
