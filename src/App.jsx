// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Upload from "./pages/Upload";
import Master from "./pages/Master";
import AssignDocument from "./pages/AssignDocument";
import AssignedDocuments from "./pages/AssignedDocuments";
import AdminUserDetails from "./pages/AdminUserDetails";
import DocumentHistory from "./pages/DocumentHistory";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/admin/user-details"
         element={
         <AdminUserDetails/>
         }
         />
        <Route
          path="/master"
          element={
            <ProtectedRoute>
              <Master />
            </ProtectedRoute>
          }
        />
        <Route path="/documents/history/:id" element={<DocumentHistory />} />
    <Route path="/assign/:documentId" element={<AssignDocument />} />
        <Route path="/assigned-documents" element={<AssignedDocuments />} />
      </Routes>

    </AuthProvider>
  );
}

export default App;