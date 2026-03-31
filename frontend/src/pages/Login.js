import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (!form.username || !form.password) {
      setError("All fields required");
      return;
    }

    try {
      const data = await loginUser(form);

      localStorage.setItem("token", data.access);
      localStorage.setItem("role", data.user.role);

      // ✅ 🔥 IMPORTANT FIX
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else if (data.user.role === "hr") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err?.error || "Login failed");
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
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          placeholder="Username"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          HR Login → admin@gmail.com / admin123
        </p>
      </form>
    </div>
  );
}

export default Login;