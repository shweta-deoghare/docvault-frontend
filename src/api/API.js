// src/api/API.js
import axios from "axios";

// Create Axios instance pointing to your Render backend
const API = axios.create({
  baseURL: "https://docvault-backend-ow2g.onrender.com/api", // Render backend base URL
  withCredentials: true, // needed if your backend uses cookies or auth headers
});

// Automatically attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ===================== Auth Routes =====================
API.loginUser = (email, password) => API.post("/auth/login", { email, password });
API.registerUser = (data) => API.post("/users", data); // Admin only

// ===================== User Routes =====================
API.getUsers = () => API.get("/users");
API.deleteUser = (id) => API.delete(`/users/${id}`);

// ===================== Category Routes =====================
API.getCategories = () => API.get("/categories");
API.createCategory = (data) => API.post("/categories", data); // Admin only
API.updateCategory = (id, data) => API.put(`/categories/${id}`, data);
API.deleteCategory = (id) => API.delete(`/categories/${id}`);

// ===================== Document Routes =====================
API.getDocuments = () => API.get("/documents");
API.createDocument = (data) => API.post("/documents", data);
API.updateDocument = (id, data) => API.put(`/documents/${id}`, data);
API.deleteDocument = (id) => API.delete(`/documents/${id}`);
API.assignDocument = (id, data) => API.post(`/documents/assign/${id}`, data);

// ===================== Notifications =====================
API.getNotifications = () => API.get("/notifications");

export default API;