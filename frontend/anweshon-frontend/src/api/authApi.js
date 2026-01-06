// src/api/authApi.js
import axiosClient from "./axiosClient";

export const authApi = {
  login: (email, password) =>
    axiosClient.post("/Auth/login", { email, password }),

  register: (payload) => axiosClient.post("/Auth/register", payload),

  // OTP Registration Flow
  sendRegistrationOtp: (payload) =>
    axiosClient.post("/Auth/send-registration-otp", payload),

  verifyOtp: (payload) => axiosClient.post("/Auth/verify-otp", payload),

  // Forgot Password Flow - uses OTP
  requestPasswordReset: (email) =>
    axiosClient.post("/Auth/forgot-password", { email }),

  resetPassword: (email, otp, newPassword) =>
    axiosClient.post("/Auth/reset-password", { email, otp, newPassword }),

  // User Profile
  getUserProfile: (userId) => axiosClient.get(`/Users/${userId}`),

  updateUserProfile: (userId, payload) =>
    axiosClient.put(`/Users/${userId}`, payload),

  changePassword: (userId, payload) =>
    axiosClient.post(`/Users/${userId}/change-password`, payload),
};
