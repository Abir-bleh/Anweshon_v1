// src/api/eventRegistrationsApi.js
import axiosClient from "./axiosClient";

export const eventRegistrationsApi = {
  // register for one event
  register: (eventId) =>
    axiosClient.post("/EventRegistrations", { eventId: Number(eventId) }),

  // check registration for one event
  getMyForEvent: (eventId) =>
    axiosClient.get(`/EventRegistrations/my/${eventId}`),

  // cancel registration for one event
  cancelMyForEvent: (eventId) =>
    axiosClient.delete(`/EventRegistrations/my/${eventId}`),

  // list all my registrations
  getMyAll: () => axiosClient.get("/EventRegistrations/my"),
};
