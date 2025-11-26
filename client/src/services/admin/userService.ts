import { client } from '../../utils/clientUtils'

const addUser = async (userData: any) => {
  return await client.post('/admin/user/addUser', userData)
}

const getAllUsers = async (params: any) => {
  return await client.get('/admin/user')
}

const updateUser = async (userId: any, userData: any) => {
  return await client.put(`/admin/user/${userId}`, userData)
}

const verifyEmail = async (userId: any) => {
  return await client.put(`/admin/user/verify-account/${userId}`)
}
const getAllRole = async () => {
  return await client.get('/admin/user/role/getAll')
}

const deleteUserById = async (userId: any) => {
  return await client.delete(`/admin/user/${userId}`)
}

export {
  addUser,
  getAllUsers,
  updateUser,
  verifyEmail,
  deleteUserById,
  getAllRole
}