import axios from "axios";

// ✅ Use the previously working backend route
const API = axios.create({
  baseURL: "https://docvault-backend-ow2g.onrender.com/api/simple-auth",
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
  API.post("/login", { email, password });

// Register function (if needed)
export const registerUser = (name, email, password, role) =>
  API.post("/register", { name, email, password, role });

export default API;