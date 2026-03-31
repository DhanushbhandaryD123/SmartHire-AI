import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await registerUser(form);

      if (data.error) {
        alert("Registration failed");
        return;
      }

      alert("Registered successfully");

      // ✅ keep redirect if exists
      navigate("/login");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={submit}
        className="bg-white/10 p-8 rounded-xl w-96"
      >
        <h2 className="text-2xl mb-6 text-center">Register</h2>

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-white/20"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/20"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white/20"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-orange-500 py-3 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;