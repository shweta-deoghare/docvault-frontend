// // src/api/API.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// // Attach token to all requests
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // ================= Notification APIs =================

// // Get all notifications for the logged-in user
// export const getNotifications = () => API.get("/api/notifications");

// // Mark a notification as read
// export const markAsRead = (notificationId) =>
//   API.put(`/api/notifications/${notificationId}/read`);

// export default API;
// src/api/API.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://docvault-backend-ow2g.onrender.com/api", // full API
});

// Attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const loginUser = (email, password) => API.post("/auth/login", { email, password });
export const registerUser = (data) => API.post("/auth/register", data);

// Categories
export const getCategories = () => API.get("/categories");

// Documents
export const getDocuments = () => API.get("/documents");

// Users (admin)
export const getUsers = () => API.get("/users");

export default API;