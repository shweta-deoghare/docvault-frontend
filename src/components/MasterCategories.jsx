// src/components/MasterCategories.jsx
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import API from "../api/API";

const MasterCategories = ({ currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // Fetch categories based on role
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      const allCategories = res.data;

      let filteredCategories;
      if (currentUser.role === "admin") {
        filteredCategories = allCategories.filter(
          (c) => c.createdByRole === "admin"
        );
      } else {
        filteredCategories = allCategories.filter(
          (c) =>
            c.createdByRole === "admin" || c.createdBy === currentUser._id
        );
      }

      setCategories(filteredCategories);
    } catch (err) {
      console.error("Fetch categories error:", err);
      alert("Failed to fetch categories");
    }
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) return alert("Enter category name");

    try {
      await API.post("/categories", {
        name,
        createdBy: currentUser._id,
        createdByRole: currentUser.role,
      });
      setName("");
      fetchCategories();
    } catch (err) {
      console.error("Add category error:", err);
      alert(
        "Failed to add category: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await API.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      alert("Category deleted successfully");
    } catch (err) {
      console.error("Delete category error:", err);
      alert(
        "Failed to delete category: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-xl border p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Manage Categories
          </h3>
          <p className="text-sm text-gray-500">
            Create and manage document categories
          </p>
        </div>

        {/* Add Category */}
        <form
          onSubmit={handleAddCategory}
          className="bg-gray-50 border rounded-lg p-4 mb-6"
        >
          <h4 className="font-semibold text-gray-700 mb-3">
            Add New Category
          </h4>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Add Category
            </button>
          </div>
        </form>

        {/* Category List */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            Existing Categories
          </h4>

          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories found.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="flex justify-between items-center bg-gray-50 border rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.createdByRole === "admin"
                        ? "Admin category"
                        : "Your category"}
                    </p>
                  </div>

                  {((currentUser.role === "admin" &&
                    cat.createdByRole === "admin") ||
                    (currentUser.role === "user" &&
                      cat.createdBy === currentUser._id)) && (
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete category"
                    >
                      <FaTrash />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterCategories;