import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import API from "../api/API";
import { FaEye, FaDownload, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AssignedDocuments = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await API.get("/documents/assigned");

        const filteredDocs = res.data.filter((doc) => {
          const perms = doc.permissions || {};
          return perms.view || perms.download || perms.update;
        });

        setDocs(filteredDocs);
      } catch (err) {
        console.error("Failed to fetch assigned docs", err);
        alert("Unable to fetch assigned documents");
      }
    };

    fetchAssigned();
  }, []);

  const handleView = async (id) => {
    try {
      const res = await API.get(`/documents/${id}/view`, {
        responseType: "blob",
      });
      window.open(URL.createObjectURL(res.data));
    } catch {
      alert("Failed to view document");
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await API.get(`/documents/${id}/download`, {
        responseType: "blob",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(res.data);
      a.download = name;
      a.click();
    } catch {
      alert("Failed to download document");
    }
  };

  /* ================= REPLACE ================= */
  const handleReplaceClick = (docId) => {
    setSelectedDocId(docId);
    fileInputRef.current.click();
  };

  const handleReplaceFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedDocId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.put(`/documents/${selectedDocId}/replace`, formData);
      alert("Document replaced successfully");
      window.location.reload();
    } catch {
      alert("Failed to replace document");
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        Assigned Documents
      </h2>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleReplaceFile}
      />

      {docs.length === 0 ? (
        <p className="text-gray-600">No documents assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => {
            const perms = doc.permissions || {
              view: false,
              download: false,
              update: false,
            };

            return (
              <div
                key={doc._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <p
                  className="font-bold truncate"
                  title={doc.filename}
                >
                  {doc.filename}
                </p>

                {/* PERMISSIONS */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {perms.view && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      View
                    </span>
                  )}
                  {perms.download && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      Download
                    </span>
                  )}
                  {perms.update && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Update
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-4 text-xl">
                  {perms.view && (
                    <FaEye
                      onClick={() => handleView(doc._id)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      title="View"
                    />
                  )}
                  {perms.download && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(doc._id, doc.filename)
                      }
                      className="cursor-pointer text-green-600 hover:text-green-800"
                      title="Download"
                    />
                  )}
                  {perms.update && (
                    <FaEdit
                      onClick={() => handleReplaceClick(doc._id)}
                      className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                      title="Replace"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignedDocuments;