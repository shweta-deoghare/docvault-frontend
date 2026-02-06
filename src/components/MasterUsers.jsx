import { useEffect, useState } from "react";
import API from "../api/API";
import { FaTrash, FaEdit } from "react-icons/fa";

const MasterUsers = () => {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [currentUser, setCurrentUser] = useState(null);

  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ firstname: "", lastname: "", email: "", role: "user" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    if (user?.role === "admin") fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!firstname || !lastname || !email || !password || !role) {
      return alert("Fill all fields");
    }

    try {
      await API.post("/users", { firstname, lastname, email, password, role });
      alert("User added successfully");
      setFirstname(""); setLastname(""); setEmail(""); setPassword(""); setRole("user");
      fetchUsers();
    } catch (err) {
      console.error("Add user error:", err);
      alert("Failed to add user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      alert("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit user functions
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      await API.put(`/users/${editingUser._id}`, editForm);
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update user error:", err);
      alert("Failed to update user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Master Section</h3>

      {/* ADD USER FORM - admin only */}
      <form
        onSubmit={handleAddUser}
        className={`flex flex-col gap-2 mb-6 ${
          currentUser?.role !== "admin" ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input type="text" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)} className="border p-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded" />
        <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </button>
      </form>

      {/* USERS TABLE - visible only for admin */}
      {currentUser?.role === "admin" && (
        <div>
          <h4 className="text-lg font-bold mb-2">All Users</h4>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{u.firstname} {u.lastname}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1 capitalize">{u.role}</td>
                  <td className="border px-2 py-1 flex gap-2 items-center">
                    <FaEdit
                      className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                      onClick={() => handleEditClick(u)}
                      title="Edit User"
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDelete(u._id)}
                      title="Delete User"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">Edit User</h3>

            <input
              type="text"
              name="firstname"
              value={editForm.firstname}
              onChange={handleEditChange}
              placeholder="First Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="lastname"
              value={editForm.lastname}
              onChange={handleEditChange}
              placeholder="Last Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Email"
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MasterUsers;