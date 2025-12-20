import { apiClient } from "../../utils/clientAxios";

export const createAttendance = async (data) => {
  return await apiClient.post("/admin/attendance", data);
};

export const getAttendanceByCourse = async (courseId) => {
  return await apiClient.get(`/admin/attendance?courseId=${courseId}`);
};

export const changeAttendance = async (id, data) => {
  return await apiClient.patch(`/admin/attendance/${id}`, data);
};
