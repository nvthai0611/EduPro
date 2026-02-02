import { apiClient } from "../../utils/clientAxios";

export const getAllProblems = async () => {
  const respone = await apiClient.get("/judge/problems");
  return respone.data;
};

export const getProblemBySlug = async (slug) => {
  const response = await apiClient.get(`/judge/problems/${slug}`);
  return response.data;
};

export const runCode = async (data) => {
  return await apiClient.post(`/judge/submissions/run`, data);
};

export const sendSubmission = async (data) => {
  const respone =  await apiClient.post(`/judge/submissions/submit`, data);
  return respone.data;
};

export const getAllMySubmissions = async () => {
  return await apiClient.get("/judge/submissions/me");
};

export const getSubmissionsById = async (id) => {
  return await apiClient.get(`/judge/submissions/${id}`);
};