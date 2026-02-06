import { useEffect, useState } from "react";
import API from "../api/API";
import DashboardLayout from "../Layouts/DashboardLayout";
import { FaEye, FaDownload, FaEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const AssignDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch users and current document assignments
  const fetchUsersAndAssignments = async () => {
    try {
      setLoading(true);

      const usersRes = await API.get("/users");
      const docRes = await API.get(`/documents/${documentId}`);

      const usersData = usersRes.data || [];
      const document = docRes.data; // backend sends doc with assignedTo
      const assignedTo = Array.isArray(document.assignedTo) ? document.assignedTo : [];

      const initialAssignments = {};

      usersData.forEach((user) => {
        const userIdStr = user._id.toString();

        // Find assigned entry for this user
        const assignedEntry = assignedTo.find((a) => {
          if (!a.userId) return false;
          const assignedUserId =
            typeof a.userId === "object"
              ? a.userId._id?.toString()
              : a.userId.toString();
          return assignedUserId === userIdStr;
        });

        initialAssignments[userIdStr] = {
          view: !!assignedEntry?.permissions?.view,
          download: !!assignedEntry?.permissions?.download,
          update: !!assignedEntry?.permissions?.update,
        };
      });

      setUsers(usersData);
      setAssignments(initialAssignments);
    } catch (err) {
      console.error("Assign fetch error:", err);
      alert("Failed to fetch users or document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchUsersAndAssignments();
  }, [documentId]);

  const handleCheckboxChange = (userId, perm) => {
    setAssignments((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [perm]: !prev[userId][perm] },
    }));
  };

  const handleSave = async () => {
    try {
      const payload = Object.entries(assignments).map(([userId, perms]) => ({
        userId,
        permissions: {
          view: perms.view,
          download: perms.download,
          update: perms.update,
        },
      }));

      await API.post(`/documents/${documentId}/assign`, { assignments: payload });

      alert("✅ Assignments updated");
      navigate("/categories"); // redirect back after save
    } catch (err) {
      console.error("Assignment save error:", err);
      alert("Assignment failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Assign Document</h2>

      <div className="bg-white p-6 rounded shadow max-h-[75vh] overflow-y-auto">
        {users.map((user) => {
          const userId = user._id.toString();
          const perms = assignments[userId] || {};

          return (
            <div key={userId} className="p-4 mb-4 bg-gray-50 rounded">
              <p className="font-medium">
                {user.firstname} {user.lastname} ({user.email})
              </p>

              {/* Checkboxes */}
              <div className="flex gap-6 mt-2">
                {["view", "download", "update"].map((p) => (
                  <label key={p} className="flex items-center gap-2 capitalize">
                    <input
                      type="checkbox"
                      checked={!!perms[p]}
                      onChange={() => handleCheckboxChange(userId, p)}
                    />
                    {p}
                  </label>
                ))}
              </div>

              {/* Icons */}
              <div className="flex gap-4 mt-3 text-lg">
                {perms.view && <FaEye className="text-blue-600" title="View" />}
                {perms.download && <FaDownload className="text-green-600" title="Download" />}
                {perms.update && <FaEdit className="text-yellow-600" title="Update" />}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-blue-800 text-white px-6 py-2 rounded"
      >
        Save Assignment
      </button>
    </DashboardLayout>
  );
};

export default AssignDocument;