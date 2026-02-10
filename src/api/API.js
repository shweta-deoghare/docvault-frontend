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
  baseURL: "https://docvault-backend-ow2g.onrender.com/api/simple-auth", // only login route
});

// Attach token to all requests (optional for login)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Login function
export const loginUser = (email, password) =>
  API.post("/login", { email, password });

export default API;