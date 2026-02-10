// import axios from "axios";

// // ✅ Use the previously working backend route
// const API = axios.create({
//   baseURL: "https://docvault-backend-ow2g.onrender.com/api/simple-auth",
// });

// // Attach token to all requests
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // Login function
// export const loginUser = (email, password) =>
//   API.post("/login", { email, password });

// // Register function (if needed)
// export const registerUser = (name, email, password, role) =>
//   API.post("/register", { name, email, password, role });

// export default API;

import axios from "axios";

// ✅ Full backend base URL
const API = axios.create({
  baseURL: "https://docvault-backend-ow2g.onrender.com/api",
});

// Attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Login function
export const loginUser = (email, password) =>
  API.post("/simple-auth/login", { email, password });

// Register function (if needed)
export const registerUser = (name, email, password, role) =>
  API.post("/simple-auth/register", { name, email, password, role });

// Fetch categories
export const fetchCategories = () => API.get("/categories");

// Fetch documents
export const fetchDocuments = () => API.get("/documents");

// Fetch notifications
export const fetchNotifications = () => API.get("/notifications");

// Mark notification as read
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);

// Delete notification
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export default API;