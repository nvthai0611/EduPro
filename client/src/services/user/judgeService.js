import { apiClient } from "../../utils/clientAxios";

export const getAllProblems = async () => {
  return await apiClient.get("/judge/problems");
};

export const getProblemBySlug = async (slug) => {
  const response = await apiClient.get(`/judge/problems/${slug}`);
  return response;
};

export const sendSubmission = async (data) => {
  return await apiClient.post(`/judge/submissions`, data);
};

export const getAllMySubmissions = async () => {
  return await apiClient.get("/judge/submissions/me");
};

export const getSubmissionsById = async (id) => {
  return await apiClient.get(`/judge/submissions/${id}`);
};