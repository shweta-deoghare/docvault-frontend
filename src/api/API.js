// src/api/API.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================= Notification APIs =================

// Get all notifications for the logged-in user
export const getNotifications = () => API.get("/notifications");

// Mark a notification as read
export const markAsRead = (notificationId) =>
  API.put(`/notifications/${notificationId}/read`);

export default API;