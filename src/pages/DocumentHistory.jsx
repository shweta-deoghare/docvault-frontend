import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import API from "../api/API";
import { FaEye, FaDownload, FaTrash } from "react-icons/fa";

const DocumentHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/documents/history/${id}`);
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.replacedAt) - new Date(a.replacedAt)
      );
      setHistory(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch document history");
    }
  };

  const handleView = async (index) => {
    try {
      const res = await API.get(`/documents/${id}/history/${index}/view`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url);
    } catch {
      alert("Failed to view");
    }
  };

  const handleDownload = async (index) => {
    try {
      const res = await API.get(`/documents/${id}/history/${index}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = history[index].filename;
      a.click();
    } catch {
      alert("Failed to download");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this version?")) return;
    try {
      await API.delete(`/documents/history/${id}/${index}`);
      fetchHistory();
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Document History</h2>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {history.length === 0 ? (
        <p>No previous versions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
            >
              <div className="mb-4">
                <p className="font-semibold text-lg truncate">
                  {item.filename}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.replacedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* 🔹 Icons aligned LEFT with minimal gap */}
              <div className="flex justify-start gap-3 text-xl">
                <FaEye
                  title="View"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => handleView(index)}
                />
                <FaDownload
                  title="Download"
                  className="cursor-pointer text-green-600 hover:text-green-800"
                  onClick={() => handleDownload(index)}
                />
                <FaTrash
                  title="Delete"
                  className="cursor-pointer text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DocumentHistory;