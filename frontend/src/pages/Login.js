import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (!form.username || !form.password) {
      setError("All fields required");
      return;
    }

    try {
      const data = await loginUser(form);

      // ✅ Store token + role
      localStorage.setItem("token", data.access);
      localStorage.setItem("role", data.user.role);

      // ✅ Redirect logic
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else if (data.user.role === "hr") {
        navigate("/dashboard");
      } else {
        navigate("/careers");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-sm">{error}</p>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;