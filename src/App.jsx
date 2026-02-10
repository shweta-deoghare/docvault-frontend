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
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
          path="/master"
          element={
            <ProtectedRoute>
              <Master />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign/:documentId"
          element={
            <ProtectedRoute>
              <AssignDocument />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigned-documents"
          element={
            <ProtectedRoute>
              <AssignedDocuments />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/user-details" element={<AdminUserDetails />} />
        <Route path="/documents/history/:id" element={<DocumentHistory />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;