import axiosClient from "./axiosClient";

export const clubsApi = {
  getAll: () => axiosClient.get("/Clubs"),
  getById: (id) => axiosClient.get(`/Clubs/${id}`),

  // membership endpoints
  getMyMembership: (id) => axiosClient.get(`/Clubs/${id}/members/me`),
  join: (id) => axiosClient.post(`/Clubs/${id}/join`),
  leave: (id) => axiosClient.delete(`/Clubs/${id}/leave`),

  // club creation
  create: (payload) => axiosClient.post("/Clubs", payload),

  // my clubs
  getMy: () => axiosClient.get("/Clubs/my"),

  // members list (admin)
  getMembers: (id) => axiosClient.get(`/Clubs/${id}/members`),

  // executives
  getExecutives: (id) => axiosClient.get(`/Clubs/${id}/executives`),
  upsertExecutives: (id, executives) =>
    axiosClient.put(`/Clubs/${id}/executives`, { executives }),

  // in clubsApi.js
  updateProfile: (id, payload) =>
    axiosClient.put(`/Clubs/${id}/profile`, payload),
};
