// src/pages/Master.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import MasterUsers from "../components/MasterUsers";
import MasterCategories from "../components/MasterCategories";

const Master = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Master Settings</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded ${
            activeTab === "categories"
              ? "bg-blue-700 text-white"
              : "bg-gray-200"
          }`}
        >
          Categories
        </button>
      </div>

      {/* Content */}
      {activeTab === "users" && <MasterUsers />}
      {activeTab === "categories" && currentUser && (
        <MasterCategories currentUser={currentUser} />
      )}
    </DashboardLayout>
  );
};

export default Master;