import { apiClient } from '../../utils/clientAxios';

const addUser = async (userData) => {
  return await apiClient.post('/admin/user/addUser', userData)
}

const getAllUsers = async (params) => {
  return await apiClient.get('/admin/user')
}

const updateUser = async (userId, userData) => {
  return await apiClient.put(`/admin/user/${userId}`, userData)
}

const verifyEmail = async (userId) => {
  return await apiClient.put(`/admin/user/verify-account/${userId}`)
}
const getAllRole = async () => {
  return await apiClient.get('/admin/user/role/getAll')
}

const deleteUserById = async (userId) => {
  return await apiClient.delete(`/admin/user/${userId}`)
}

const revokePaidCourse = async (userId, courseId) => {
  return await apiClient.delete(`/admin/user/${userId}/paid-course/${courseId}`)
}

export {
  addUser,
  getAllUsers,
  updateUser,
  verifyEmail,
  deleteUserById,
  getAllRole,
  revokePaidCourse
}