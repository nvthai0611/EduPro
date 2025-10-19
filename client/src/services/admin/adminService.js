import { client } from "../../utils/clientUtils";
import { apiClient } from "../../utils/clientAxios";

// Staff Service APIs
export const assignServiceToStaff = async ({ staffId, serviceId }) => {
  return await apiClient.post('/staff/branch/assign', { staffId, serviceId });
};

export const getAllStaffServices = async () => {
  return await client.get('/admin/staff-service');
};


export const getServicesByStaff = async (staffId) => {
  return await client.get(`/admin/staff-service/${staffId}`);
};
export const getStaffByServiceId = async (serviceId) => {
  return await client.get(`/admin/by-service/${serviceId}`);
};



export const removeServiceFromStaff = async (staffId, serviceId) => {
  return await client.delete(`/admin/staff-service/${staffId}/service/${serviceId}`);
};


// Service CRUD APIs
export const getAllServices = async () => {
  return await client.get('/admin/service');
};

export const getServiceByBranch = async () => {
  return await apiClient.get('/staff/branch/my-services');
};


export const getServiceById = async (id) => {
  return await client.get(`/admin/service/${id}`);
};
export const getServicesByCategory = async (categoryId) => {
  return await apiClient.get(`/admin/service/category/${categoryId}`);
};

export const createService = async (serviceData) => {
  return await apiClient.post('/admin/service', serviceData, null, 'multipart/form-data');
};

export const updateService = async (id, serviceData) => {
  return await apiClient.put(`/admin/service/${id}`, serviceData, null, 'multipart/form-data');
};


export const deleteService = async (id) => {
  return await client.delete(`/admin/service/${id}`);
};

// Category CRUD APIs
export const getAllCategories = async () => {
  return await client.get('/admin/category');
};

export const getCategoryById = async (id) => {
  return await client.get(`/admin/category/${id}`);
};

export const createCategory = async (categoryData) => {
  return await apiClient.post('/admin/category', categoryData, null, 'multipart/form-data');
};


export const updateCategory = async (id, categoryData) => {
  return await apiClient.put( `/admin/category/${id}`,categoryData,null, "multipart/form-data", false 
  );
};


export const deleteCategory = async (id) => {
  return await client.delete(`/admin/category/${id}`);
};

// User/Staff APIs
export const getAllUsers = async () => {
  return await client.get('/admin/user');
};

