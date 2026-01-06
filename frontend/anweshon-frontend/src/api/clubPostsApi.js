import axiosClient from "./axiosClient";

export const clubPostsApi = {
  // Get all posts for a club
  getClubPosts: (clubId) => axiosClient.get(`/ClubPosts/club/${clubId}`),

  // Create new post with images
  createPost: (payload) => axiosClient.post("/ClubPosts", payload),

  // Delete post
  deletePost: (id) => axiosClient.delete(`/ClubPosts/${id}`),
};
