// import { useEffect, useState } from "react";
// import API from "../api/API";
// import DashboardLayout from "../Layouts/DashboardLayout";
// import {
//   FaEye,
//   FaDownload,
//   FaEdit,
//   FaUserPlus,
//   FaHistory,
//   FaTrash,
// } from "react-icons/fa";
// import _ from "lodash";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Categories = () => {
//   const [documents, setDocuments] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [selectedDocs, setSelectedDocs] = useState([]); // 🔹 STEP 1
//   const navigate = useNavigate();
//   const user = useAuth();

//   /* ================= FETCH DATA ================= */

//   const fetchCategories = async () => {
//     try {
//       const res = await API.get("/categories");
//       setCategories(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchDocuments = async (categoryId = "", search = "") => {
//     try {
//       const params = {
//         categoryId: categoryId || undefined,
//         search: search || undefined,
//       };

//       const res = await API.get("/documents", { params });
//       setDocuments(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchDocuments();
//   }, []);

//   const debouncedFetch = _.debounce((text) => {
//     fetchDocuments(selectedCategory, text);
//   }, 300);

//   useEffect(() => {
//     debouncedFetch(searchText);
//   }, [searchText, selectedCategory]);

//   /* ================= HANDLERS ================= */

//   const handleCheckboxChange = (docId) => {
//     setSelectedDocs((prev) =>
//       prev.includes(docId)
//         ? prev.filter((id) => id !== docId)
//         : [...prev, docId]
//     );
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedDocs.length === 0) {
//       alert("Select at least one document");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete selected documents?"))
//       return;

//     try {
//       // 🔹 STEP 5 – Backend will be done by you
//       await API.delete("/documents/bulk-delete", {
//         data: { documentIds: selectedDocs },
//       });

//       // Remove deleted docs from UI
//       setDocuments((prev) =>
//         prev.filter((doc) => !selectedDocs.includes(doc._id))
//       );
//       setSelectedDocs([]);

//       alert("Documents deleted successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete documents");
//     }
//   };

//   const handleView = async (id) => {
//     const res = await API.get(`/documents/${id}/view`, {
//       responseType: "blob",
//     });
//     window.open(URL.createObjectURL(res.data));
//   };

//   const handleDownload = async (id, filename) => {
//     const res = await API.get(`/documents/${id}/download`, {
//       responseType: "blob",
//     });
//     const url = URL.createObjectURL(res.data);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//   };
  

//   const handleReplace = (id) => {
//   const input = document.createElement("input");
//   input.type = "file";

//   input.onchange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await API.put(
//         `/documents/${id}/replace`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setDocuments(prev =>
//         prev.map(doc => doc._id === id ? res.data.document : doc)
//       );

//       alert("Document replaced successfully");
//     } catch (err) {
//       console.error("Replace failed:", err);
//       alert("Replace failed");
//     }
//   };

//   input.click();
// };

//   /* ================= UI ================= */

//   return (
//     <DashboardLayout>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Documents</h2>

//         {selectedDocs.length > 0 && (
//           <button
//             onClick={handleDeleteSelected}
//             className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <FaTrash /> Delete Selected
//           </button>
//         )}
//       </div>

//       <select
//         value={selectedCategory}
//         onChange={(e) => {
//           setSelectedCategory(e.target.value);
//           fetchDocuments(e.target.value, searchText);
//         }}
//         className="border p-2 mb-4 rounded w-full"
//       >
//         <option value="">All Categories</option>
//         {categories.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.name}
//           </option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Search by filename..."
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         className="border p-2 rounded mb-6 w-full"
//       />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {documents.map((doc) => (
//           <div
//             key={doc._id}
//             className="bg-white p-4 rounded shadow flex flex-col gap-2"
//           >
//             {/* 🔹 STEP 2 – Checkbox */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={selectedDocs.includes(doc._id)}
//                 onChange={() => handleCheckboxChange(doc._id)}
//               />
//               <p className="font-bold">{doc.filename}</p>
//             </div>

//             <p className="text-sm text-gray-500">
//               {new Date(doc.createdAt).toLocaleString()}
//             </p>

//             <div className="flex gap-4 mt-2 text-xl">
//               <FaEye
//                 onClick={() => handleView(doc._id)}
//                 className="text-blue-600 cursor-pointer"
//               />
//               <FaDownload
//                 onClick={() => handleDownload(doc._id, doc.filename)}
//                 className="text-green-600 cursor-pointer"
//               />
//               <FaEdit
//   className="text-yellow-500 cursor-pointer"
//   title="Replace"
//   onClick={() => handleReplace(doc._id)}
// />
//               <FaHistory
//                 onClick={() => navigate(`/documents/history/${doc._id}`)}
//                 className="text-purple-600 cursor-pointer"
//               />

//               {user?.user?.role === "admin" && (
//                 <FaUserPlus
//                   onClick={() => navigate(`/assign/${doc._id}`)}
//                   className="text-indigo-600 cursor-pointer"
//                 />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Categories;


import { useEffect, useState } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import API from "../api/API";
import { FaEye, FaDownload } from "react-icons/fa";
import _ from "lodash";

const Categories = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH DATA ================= */
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async (categoryId = "", search = "") => {
    try {
      const params = { categoryId: categoryId || undefined, search: search || undefined };
      const res = await API.get("/documents", { params });
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, []);

  const debouncedFetch = _.debounce((text) => fetchDocuments(selectedCategory, text), 300);

  useEffect(() => {
    debouncedFetch(searchText);
  }, [searchText, selectedCategory]);

  /* ================= ACTIONS ================= */
  const handleView = async (id) => {
    const res = await API.get(`/documents/${id}/view`, { responseType: "blob" });
    window.open(URL.createObjectURL(res.data));
  };

  const handleDownload = async (id, filename) => {
    const res = await API.get(`/documents/${id}/download`, { responseType: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(res.data);
    a.download = filename;
    a.click();
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Documents</h2>

      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          fetchDocuments(e.target.value, searchText);
        }}
        className="border p-2 mb-4 rounded w-full"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by filename..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border p-2 rounded mb-6 w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc._id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <p className="font-bold truncate">{doc.filename}</p>
            <p className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleString()}</p>
            <div className="flex gap-4 text-xl">
              <FaEye className="text-blue-600 cursor-pointer" onClick={() => handleView(doc._id)} />
              <FaDownload className="text-green-600 cursor-pointer" onClick={() => handleDownload(doc._id, doc.filename)} />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Categories;