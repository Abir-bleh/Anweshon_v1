import axios from "axios";

const uploadClient = axios.create({
  baseURL: "http://localhost:5079/api",
});

uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fileUploadApi = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadClient.post("/FileUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      console.error(
        "File upload error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          "Error uploading file"
      );
    }
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await uploadClient.post(
        "/FileUpload/multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.urls;
    } catch (error) {
      console.error(
        "Multiple file upload error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.response?.data ||
          "Error uploading files"
      );
    }
  },
};
