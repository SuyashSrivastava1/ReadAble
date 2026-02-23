import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
});

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const extractErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Request failed";

export const simplifyText = async ({ text, readingProfile, token }) => {
  try {
    const response = await apiClient.post(
      "/simplify",
      { text, readingProfile },
      { headers: authHeader(token) },
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const translateText = async ({ text, targetLanguage, historyId, token }) => {
  try {
    const response = await apiClient.post(
      "/translate",
      { text, targetLanguage, historyId },
      { headers: authHeader(token) },
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await apiClient.post("/auth/register", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const fetchHistory = async (token) => {
  try {
    const response = await apiClient.get("/history", {
      headers: authHeader(token),
    });
    return response.data.history || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteHistoryItem = async ({ id, token }) => {
  try {
    const response = await apiClient.delete(`/history/${id}`, {
      headers: authHeader(token),
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
