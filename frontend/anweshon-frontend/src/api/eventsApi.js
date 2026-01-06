import axiosClient from "./axiosClient";

export const eventsApi = {
  getUpcoming: () => axiosClient.get("/Events/upcoming"),
  getById: (id) => axiosClient.get(`/Events/${id}`),
  getByClub: (clubId) => axiosClient.get(`/Events/club/${clubId}`),
  getPastEvents: (clubId) => axiosClient.get(`/Events/club/${clubId}/past`),
  create: (payload) => axiosClient.post("/Events", payload),
};
