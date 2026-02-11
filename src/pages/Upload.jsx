import { useEffect, useState } from "react";
import API from "../api/API";
import DashboardLayout from "../Layouts/DashboardLayout";

const Upload = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategory(res.data[0]._id);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !selectedCategory) {
      alert("Please select category and file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", selectedCategory);

    try {
      setLoading(true);
      await API.post(
  "https://docvault-backend-ow2g.onrender.com/api/documents/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
      alert("Document uploaded successfully");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Upload Document</h2>

      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow max-w-lg flex flex-col gap-4"
      >
        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
          required
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* FILE */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-800 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default Upload;