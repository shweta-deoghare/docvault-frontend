// import { useEffect, useState } from "react";
// import API from "../api/API";
// import DashboardLayout from "../Layouts/DashboardLayout";
// import { FaEye, FaDownload, FaEdit } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user } = useAuth();

//   const [categories, setCategories] = useState([]);
//   const [recentDocs, setRecentDocs] = useState([]);
//   const [assignedDocs, setAssignedDocs] = useState([]);

//   const userId = user?._id;
//   const userRole = user?.role;

//   /* ================= FETCH ASSIGNED DOCS ================= */
//   const fetchAssignedDocs = async () => {
//     if (userRole !== "user") return [];

//     try {
//       const res = await API.get("/documents");

//       const assigned = res.data.filter((d) =>
//         d.sharedWith?.some(
//           (s) =>
//             s.userId?._id?.toString() === userId ||
//             s.userId?.toString() === userId
//         )
//       );

//       setAssignedDocs(assigned);
//       return assigned;
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   };

//   /* ================= FETCH CATEGORIES ================= */
//   const fetchCategories = async () => {
//     try {
//       const res = await API.get("/categories");

//       let assigned = [];
//       if (userRole === "user") {
//         assigned = await fetchAssignedDocs();
//       }

//       const assignedIds = assigned.map((d) => d._id.toString());

//       const withCounts = await Promise.all(
//         res.data.map(async (cat) => {
//           const docsRes = await API.get("/documents", {
//             params: {
//               categoryId: cat._id,
//               ...(userRole === "admin" ? { userId } : {}),
//             },
//           });

//           let docs = docsRes.data;

//           if (userRole === "user") {
//             docs = docs.filter(
//               (d) => !assignedIds.includes(d._id.toString())
//             );
//           }

//           return { ...cat, count: docs.length };
//         })
//       );

//       setCategories(withCounts);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= FETCH RECENT UPLOADS ================= */
//   const fetchRecent = async () => {
//     try {
//       let assigned = [];

//       if (userRole === "user") {
//         assigned = await fetchAssignedDocs();
//       }

//       const assignedIds = assigned.map((d) => d._id.toString());

//       const res = await API.get("/documents", {
//         params: userRole === "admin" ? { userId } : {},
//       });

//       let docs = res.data;

//       if (userRole === "user") {
//         docs = docs.filter(
//           (d) => !assignedIds.includes(d._id.toString())
//         );
//       }

//       setRecentDocs(
//         docs
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 5)
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchRecent();
//   }, []);

//   /* ================= ACTIONS ================= */
//   const handleView = async (id) => {
//     try {
//       const res = await API.get(`/documents/${id}/view`, {
//         responseType: "blob",
//       });
//       window.open(URL.createObjectURL(res.data));
//     } catch {
//       alert("No permission to view");
//     }
//   };

//   const handleDownload = async (id, filename) => {
//     try {
//       const res = await API.get(`/documents/${id}/download`, {
//         responseType: "blob",
//       });

//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(res.data);
//       a.download = filename;
//       a.click();
//     } catch {
//       alert("No permission to download");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <h2 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h2>

//       {/* ================= CATEGORIES ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {categories.map((c) => (
//           <div
//             key={c._id}
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
//           >
//             <p className="font-bold">{c.name}</p>
//             <p className="text-gray-500">{c.count} Documents</p>
//           </div>
//         ))}
//       </div>

//       {/* ================= RECENT UPLOADS ================= */}
//       <h3 className="text-lg sm:text-xl font-semibold mb-4">
//         Recent Uploads
//       </h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
//         {recentDocs.map((d) => (
//           <div
//             key={d._id}
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
//           >
//             <div className="flex items-center gap-3 mb-1">
//               <span className="text-2xl">📁</span>
//               <p className="font-bold truncate" title={d.filename}>
//                 {d.filename}
//               </p>
//             </div>

//             {/* 🔹 TIMESTAMP ONLY HERE */}
//             <p className="text-xs text-gray-500 mb-3">
//               Uploaded on{" "}
//               {new Date(d.createdAt).toLocaleString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>

//             <div className="flex gap-4 text-xl">
//               <FaEye
//                 className="text-blue-600 cursor-pointer"
//                 onClick={() => handleView(d._id)}
//               />
//               <FaDownload
//                 className="text-green-600 cursor-pointer"
//                 onClick={() => handleDownload(d._id, d.filename)}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= ASSIGNED DOCUMENTS ================= */}
//       {userRole === "user" && assignedDocs.length > 0 && (
//         <>
//           <h3 className="text-lg sm:text-xl font-semibold mb-4">
//             Assigned Documents
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {assignedDocs.map((d) => {
//               const perms = d.sharedWith.find(
//                 (s) =>
//                   s.userId?._id?.toString() === userId ||
//                   s.userId?.toString() === userId
//               )?.permissions;

//               return (
//                 <div
//                   key={d._id}
//                   className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className="text-2xl">📁</span>
//                     <p className="font-bold truncate" title={d.filename}>
//                       {d.filename}
//                     </p>
//                   </div>

//                   <div className="flex gap-4 text-xl">
//                     {perms?.view && (
//                       <FaEye
//                         className="text-blue-600 cursor-pointer"
//                         onClick={() => handleView(d._id)}
//                       />
//                     )}
//                     {perms?.download && (
//                       <FaDownload
//                         className="text-green-600 cursor-pointer"
//                         onClick={() =>
//                           handleDownload(d._id, d.filename)
//                         }
//                       />
//                     )}
//                     {perms?.update && (
//                       <FaEdit className="text-yellow-600 cursor-pointer" />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </DashboardLayout>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import API from "../api/API";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaDownload } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [assignedDocs, setAssignedDocs] = useState([]);

  const userId = user?._id;
  const userRole = user?.role;

  /* ================= FETCH ASSIGNED DOCUMENTS ================= */
  const fetchAssignedDocs = async () => {
    if (userRole !== "user") return [];
    try {
      const res = await API.get("/documents");
      const assigned = res.data.filter((d) =>
        d.sharedWith?.some(
          (s) => s.userId?._id?.toString() === userId || s.userId?.toString() === userId
        )
      );
      setAssignedDocs(assigned);
      return assigned;
    } catch (err) {
      console.error("Assigned docs fetch error:", err);
      return [];
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");

      let assigned = [];
      if (userRole === "user") assigned = await fetchAssignedDocs();
      const assignedIds = assigned.map((d) => d._id.toString());

      const withCounts = await Promise.all(
        res.data.map(async (cat) => {
          const docsRes = await API.get("/documents", {
            params: { categoryId: cat._id },
          });
          let docs = docsRes.data;
          if (userRole === "user") docs = docs.filter(d => !assignedIds.includes(d._id.toString()));
          return { ...cat, count: docs.length };
        })
      );

      setCategories(withCounts);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

  /* ================= FETCH RECENT DOCUMENTS ================= */
  const fetchRecent = async () => {
    try {
      const res = await API.get("/documents");
      let docs = res.data;
      if (userRole === "user") {
        const assigned = await fetchAssignedDocs();
        const assignedIds = assigned.map(d => d._id.toString());
        docs = docs.filter(d => !assignedIds.includes(d._id.toString()));
      }
      setRecentDocs(
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
      );
    } catch (err) {
      console.error("Recent docs fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecent();
  }, []);

  /* ================= ACTIONS ================= */
  const handleView = async (id) => {
    try {
      const res = await API.get(`/documents/${id}/view`, { responseType: "blob" });
      window.open(URL.createObjectURL(res.data));
    } catch {
      alert("No permission to view");
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await API.get(`/documents/${id}/download`, { responseType: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(res.data);
      a.download = filename;
      a.click();
    } catch {
      alert("No permission to download");
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h2>

      {/* ================= CATEGORIES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md">
            <p className="font-bold">{c.name}</p>
            <p className="text-gray-500">{c.count} Documents</p>
          </div>
        ))}
      </div>

      {/* ================= RECENT UPLOADS ================= */}
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Uploads</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {recentDocs.map((d) => (
          <div key={d._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📁</span>
              <p className="font-bold truncate" title={d.filename}>{d.filename}</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Uploaded on {new Date(d.createdAt).toLocaleString()}
            </p>
            <div className="flex gap-4 text-xl">
              <FaEye className="text-blue-600 cursor-pointer" onClick={() => handleView(d._id)} />
              <FaDownload className="text-green-600 cursor-pointer" onClick={() => handleDownload(d._id, d.filename)} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= ASSIGNED DOCUMENTS ================= */}
      {userRole === "user" && assignedDocs.length > 0 && (
        <>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Assigned Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedDocs.map((d) => {
              const perms = d.sharedWith.find(
                (s) => s.userId?._id?.toString() === userId || s.userId?.toString() === userId
              )?.permissions;

              return (
                <div key={d._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📁</span>
                    <p className="font-bold truncate" title={d.filename}>{d.filename}</p>
                  </div>
                  <div className="flex gap-4 text-xl">
                    {perms?.view && <FaEye className="text-blue-600 cursor-pointer" onClick={() => handleView(d._id)} />}
                    {perms?.download && <FaDownload className="text-green-600 cursor-pointer" onClick={() => handleDownload(d._id, d.filename)} />}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;