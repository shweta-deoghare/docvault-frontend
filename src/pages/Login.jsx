// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ import navigate
// import { loginUser } from "../api/API";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate(); // ✅ initialize navigate

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setLoading(true);

//     try {
//       const response = await loginUser(email, password);
//       const { token, user } = response.data;

//       if (rememberMe) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//       } else {
//         sessionStorage.setItem("token", token);
//         sessionStorage.setItem("user", JSON.stringify(user));
//       }

//       setMessage(`Welcome, ${user.email}! Role: ${user.role}`);
//       setLoading(false);

//       // ✅ Redirect to dashboard after successful login
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4"
//       >
//         <h2 className="text-2xl font-bold text-center text-indigo-700">
//           DocVault Login
//         </h2>

//         {error && (
//           <p className="bg-red-100 text-red-600 text-sm p-2 rounded text-center">
//             {error}
//           </p>
//         )}

//         {message && (
//           <p className="bg-green-100 text-green-600 text-sm p-2 rounded text-center">
//             {message}
//           </p>
//         )}

//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium text-gray-600">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         <div className="flex flex-col gap-1 relative">
//           <label className="text-sm font-medium text-gray-600">Password</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-2 top-9 text-sm text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="rememberMe"
//             checked={rememberMe}
//             onChange={() => setRememberMe(!rememberMe)}
//             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//           />
//           <label htmlFor="rememberMe" className="text-sm text-gray-600">
//             Remember Me
//           </label>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-xs text-center text-gray-500 mt-2">
//           Secure Document Management System
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../api/API";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ use React Router navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;

      // Save token & user
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setMessage(`Welcome, ${user.email}! Role: ${user.role}`);
      setLoading(false);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          DocVault Login
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded text-center">
            {error}
          </p>
        )}

        {message && (
          <p className="bg-green-100 text-green-600 text-sm p-2 rounded text-center">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          Secure Document Management System
        </p>
      </form>
    </div>
  );
};

export default Login;