// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   FaBell,
//   FaTrash,
//   FaHome,
//   FaFolderOpen,
//   FaUpload,
//   FaUsers,
//   FaUserCog,
// } from "react-icons/fa";
// import API from "../api/API";

// const DashboardLayout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const navigate = useNavigate();
//   const userRole = user?.role;
//   const fullName = user ? `${user.firstname} ${user.lastname}` : "User";

//   // ================= FETCH NOTIFICATIONS (USER ONLY) =================
//   const fetchNotifications = async () => {
//     try {
//       const res = await API.get("/notifications");
//       setNotifications(res.data);
//     } catch (err) {
//       console.error("Notifications fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     if (userRole === "user") {
//       fetchNotifications();
//       const interval = setInterval(fetchNotifications, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [userRole]);

//   // ================= MARK AS READ =================
//   const markAsRead = async (id, link) => {
//     try {
//       await API.put(`/notifications/${id}/read`);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//       if (link) navigate(link);
//       setNotifOpen(false);
//     } catch (err) {
//       console.error("Mark as read error:", err);
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const deleteNotification = async (id) => {
//     try {
//       await API.delete(`/notifications/${id}`);
//       setNotifications((prev) => prev.filter((n) => n._id !== id));
//     } catch (err) {
//       console.error("Delete notification error:", err);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-64 bg-blue-900 text-white flex flex-col">
//         <div className="p-6 font-bold text-xl">DocVault</div>

//         <nav className="flex-1 flex flex-col gap-3 p-4">
//           <NavLink to="/dashboard" className="flex items-center gap-3 hover:text-indigo-400">
//             <FaHome /> Dashboard
//           </NavLink>

//           <NavLink to="/categories" className="flex items-center gap-3 hover:text-indigo-400">
//             <FaFolderOpen /> Documents
//           </NavLink>

//           <NavLink to="/upload" className="flex items-center gap-3 hover:text-indigo-400">
//             <FaUpload /> Upload
//           </NavLink>

//           <NavLink to="/master" className="flex items-center gap-3 hover:text-indigo-400">
//             <FaUserCog /> Master
//           </NavLink>

//           {/* ADMIN ONLY */}
//           {userRole === "admin" && (
//             <NavLink
//               to="/admin/user-details"
//               className="flex items-center gap-3 hover:text-indigo-400"
//             >
//               <FaUsers /> User Details
//             </NavLink>
//           )}

//           {/* USER ONLY — ASSIGNED DOCUMENTS */}
//           {userRole === "user" && (
//             <NavLink
//               to="/assigned-documents"
//               className="flex items-center gap-3 hover:text-indigo-400"
//             >
//               <FaFolderOpen /> Assigned Documents
//             </NavLink>
//           )}
//         </nav>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <div className="flex-1 flex flex-col">
//         {/* ================= NAVBAR ================= */}
//         <header className="h-16 bg-blue-800 text-white flex items-center justify-between px-6 shadow">
//           <h1 className="font-bold text-lg">
//             Secure Document Management System
//           </h1>

//           <div className="flex items-center gap-4">
//             {/* ================= NOTIFICATIONS (USER ONLY) ================= */}
//             {userRole === "user" && (
//               <div className="relative">
//                 <div
//                   className="cursor-pointer relative p-2 rounded-full hover:bg-blue-700"
//                   onClick={() => setNotifOpen(!notifOpen)}
//                 >
//                   <FaBell className="text-xl" />
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </div>

//                 {notifOpen && (
//                   <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl z-50">
//                     <div className="px-4 py-3 border-b font-semibold text-gray-700">
//                       Notifications
//                     </div>

//                     <div className="max-h-80 overflow-y-auto">
//                       {notifications.length === 0 ? (
//                         <div className="p-6 text-center text-gray-500 text-sm">
//                           🎉 No new notifications
//                         </div>
//                       ) : (
//                         notifications.map((n) => (
//                           <div
//                             key={n._id}
//                             className={`px-4 py-3 border-b flex justify-between gap-3 ${
//                               n.read ? "bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
//                             }`}
//                           >
//                             <div
//                               className="cursor-pointer flex-1"
//                               onClick={() => markAsRead(n._id, n.link)}
//                             >
//                               <p className="text-sm font-medium text-gray-800">
//                                 {n.message}
//                               </p>
//                             </div>

//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 deleteNotification(n._id);
//                               }}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <FaTrash size={14} />
//                             </button>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ================= PROFILE ================= */}
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600"
//               >
//                 {fullName}
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
//                   <div className="border-b p-3">
//                     <p className="font-semibold">{fullName}</p>
//                     <p className="text-sm text-gray-600">{user?.email}</p>
//                   </div>

//                   <button
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     onClick={() => {
//                       setShowProfile(true);
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     Profile
//                   </button>

//                   <button
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     onClick={logout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* ================= CONTENT ================= */}
//         <main className="flex-1 p-6 bg-gray-100 overflow-auto">
//           {children}
//         </main>
//       </div>

//       {/* ================= PROFILE MODAL ================= */}
//       {showProfile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-6 w-96 relative">
//             <h2 className="text-xl font-bold mb-4">Profile</h2>
//             <p><strong>Name:</strong> {fullName}</p>
//             <p><strong>Email:</strong> {user?.email}</p>
//             <p><strong>Role:</strong> {userRole}</p>

//             <button
//               className="absolute top-2 right-2 text-gray-500"
//               onClick={() => setShowProfile(false)}
//             >
//               ✖
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardLayout;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBell,
  FaTrash,
  FaHome,
  FaFolderOpen,
  FaUpload,
  FaUsers,
  FaUserCog,
} from "react-icons/fa";
import API from "../api/API";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const userRole = user?.role;
  const fullName = user ? `${user.firstname} ${user.lastname}` : "User";

  // ================= FETCH NOTIFICATIONS (USER ONLY) =================
  const fetchNotifications = async () => {
    try {
      const res = await API.fetchNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    }
  };

  useEffect(() => {
    if (userRole === "user") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  // ================= MARK AS READ =================
  const markAsRead = async (id, link) => {
    try {
      await API.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      if (link) navigate(link);
      setNotifOpen(false);
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const deleteNotification = async (id) => {
    try {
      await API.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl">DocVault</div>

        <nav className="flex-1 flex flex-col gap-3 p-4">
          <NavLink to="/dashboard" className="flex items-center gap-3 hover:text-indigo-400">
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/categories" className="flex items-center gap-3 hover:text-indigo-400">
            <FaFolderOpen /> Documents
          </NavLink>

          <NavLink to="/upload" className="flex items-center gap-3 hover:text-indigo-400">
            <FaUpload /> Upload
          </NavLink>

          <NavLink to="/master" className="flex items-center gap-3 hover:text-indigo-400">
            <FaUserCog /> Master
          </NavLink>

          {/* ADMIN ONLY */}
          {userRole === "admin" && (
            <NavLink
              to="/admin/user-details"
              className="flex items-center gap-3 hover:text-indigo-400"
            >
              <FaUsers /> User Details
            </NavLink>
          )}

          {/* USER ONLY — ASSIGNED DOCUMENTS */}
          {userRole === "user" && (
            <NavLink
              to="/assigned-documents"
              className="flex items-center gap-3 hover:text-indigo-400"
            >
              <FaFolderOpen /> Assigned Documents
            </NavLink>
          )}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* ================= NAVBAR ================= */}
        <header className="h-16 bg-blue-800 text-white flex items-center justify-between px-6 shadow">
          <h1 className="font-bold text-lg">Secure Document Management System</h1>

          <div className="flex items-center gap-4">
            {userRole === "user" && (
              <div className="relative">
                <div
                  className="cursor-pointer relative p-2 rounded-full hover:bg-blue-700"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl z-50">
                    <div className="px-4 py-3 border-b font-semibold text-gray-700">
                      Notifications
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          🎉 No new notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`px-4 py-3 border-b flex justify-between gap-3 ${
                              n.read ? "bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
                            }`}
                          >
                            <div
                              className="cursor-pointer flex-1"
                              onClick={() => markAsRead(n._id, n.link)}
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {n.message}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n._id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= PROFILE ================= */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600"
              >
                {fullName}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                  <div className="border-b p-3">
                    <p className="font-semibold">{fullName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>

                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowProfile(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>

                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <p>
              <strong>Name:</strong> {fullName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {userRole}
            </p>

            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowProfile(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;