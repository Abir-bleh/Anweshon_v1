import axiosClient from "./axiosClient";

export const achievementsApi = {
  // Get approved achievements for a club
  getApprovedAchievements: (clubId) =>
    axiosClient.get(`/Achievements/club/${clubId}`),

  // Get pending achievements for a club (admin only)
  getPendingAchievements: (clubId) =>
    axiosClient.get(`/Achievements/club/${clubId}/pending`),

  // Submit new achievement
  submitAchievement: (payload) => axiosClient.post("/Achievements", payload),

  // Approve achievement (admin only)
  approveAchievement: (id) => axiosClient.put(`/Achievements/${id}/approve`),

  // Reject achievement (admin only)
  rejectAchievement: (id) => axiosClient.put(`/Achievements/${id}/reject`),

  // Delete achievement
  deleteAchievement: (id) => axiosClient.delete(`/Achievements/${id}`),
};
