import { apiClient } from "../../utils/clientAxios";

export const createProblem = async (data) => {
  return await apiClient.post("/admin/judge/problems", data);
};

export const updateProblem = async (id, data) => {
  return await apiClient.put(`/admin/judge/problems/${id}`, data);
};

export const deleteProblem = async (id) => {
  return await apiClient.delete(`/admin/judge/problems/${id}`);
};
