import React, { useEffect, useState, useRef } from "react";
import {
  FaEye,
  FaDownload,
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaHistory,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import API from "../api/API";

const AdminUserDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const fileInputRef = useRef(null);
  const [updateDocId, setUpdateDocId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  const fetchUserDocs = async (userId) => {
    try {
      const uploadsRes = await API.get("/documents", { params: { userId } });
      setUploads(uploadsRes.data);

      const assignedRes = await API.get("/documents");
      const filteredAssigned = assignedRes.data.filter((doc) => {
        if (!Array.isArray(doc.assignedTo)) return false;

        return doc.assignedTo.some((a) => {
          const assignedUserId = String(a.userId?._id || a.userId);
          return (
            assignedUserId === String(userId) &&
            (a.permissions.view ||
              a.permissions.download ||
              a.permissions.update)
          );
        });
      });

      setAssigned(filteredAssigned);
    } catch {
      alert("Failed to fetch documents");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUploads([]);
    setAssigned([]);
    fetchUserDocs(user._id);
  };

  const handleView = (doc) => {
    API.get(`/documents/${doc._id}/view`, { responseType: "blob" }).then(
      (res) => {
        const url = URL.createObjectURL(
          new Blob([res.data], { type: doc.mimetype })
        );
        window.open(url);
      }
    );
  };

  const handleDownload = (doc) => {
    API.get(`/documents/${doc._id}/download`, {
      responseType: "blob",
    }).then((res) => {
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.filename;
      a.click();
    });
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    await API.delete(`/documents/${docId}`);
    fetchUserDocs(selectedUser._id);
  };

  const handleUpdateClick = (docId) => {
    setUpdateDocId(docId);
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await API.put(`/documents/${updateDocId}/replace`, formData);
    setUpdateDocId(null);
    fetchUserDocs(selectedUser._id);
  };

  const getDisplayTime = (doc, isAssigned) => {
    if (!isAssigned) return doc.createdAt;

    if (!Array.isArray(doc.assignedTo) || !selectedUser) {
      return doc.createdAt;
    }

    const assignedEntry = doc.assignedTo.find(
      (a) => String(a.userId?._id || a.userId) === String(selectedUser._id)
    );

    return assignedEntry?.assignedAt || doc.createdAt;
  };

  const renderCards = (docs, isAssigned = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center">
          No documents found
        </p>
      ) : (
        docs.map((doc) => {
          const displayTime = getDisplayTime(doc, isAssigned);

          return (
            <div
              key={doc._id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              {/* Filename */}
              <p className="font-semibold truncate">{doc.filename}</p>

              {/* Category name */}
              <p className="text-xs text-gray-500">{doc.categoryId?.name || "-"}</p>

              {/* Timestamp only for uploads */}
              {!isAssigned && (
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(displayTime).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}

              {/* Line break above icons for assigned docs */}
              {isAssigned && <div className="my-2" />}

              {/* Action Icons */}
              <div className="flex items-center gap-3 text-lg">
                <FaEye
                  className="text-blue-600 cursor-pointer"
                  onClick={() => handleView(doc)}
                />
                <FaDownload
                  className="text-green-600 cursor-pointer"
                  onClick={() => handleDownload(doc)}
                />
                <FaEdit
                  className="text-yellow-500 cursor-pointer"
                  onClick={() => handleUpdateClick(doc._id)}
                />
                <FaHistory
                  className="text-purple-600 cursor-pointer"
                  onClick={() => navigate(`/documents/history/${doc._id}`)}
                />
                <FaTrash
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(doc._id)}
                />
                <FaUserPlus
                  className="text-indigo-600 cursor-pointer"
                  onClick={() => navigate(`/assign/${doc._id}`)}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">User Management</h2>

        {!selectedUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => handleUserClick(u)}
                className="cursor-pointer bg-white rounded-xl p-5 shadow hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                    {u.firstname[0]}
                    {u.lastname[0]}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {u.firstname} {u.lastname}
                    </p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedUser && (
          <>
            <button
              className="mb-5 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              onClick={() => setSelectedUser(null)}
            >
              ← Back to Users
            </button>

            {/* Display selected user name */}
            <h3 className="text-2xl font-semibold mb-4">
              {selectedUser.firstname} {selectedUser.lastname}
            </h3>

            <section className="mb-10">
              <h4 className="text-lg font-bold mb-3">📁 User Uploads</h4>
              {renderCards(uploads)}
            </section>

            <section>
              <h4 className="text-lg font-bold mb-3">🔗 Assigned Documents</h4>
              {renderCards(assigned, true)}
            </section>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetails;