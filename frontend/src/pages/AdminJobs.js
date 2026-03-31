import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

function AdminJobs() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.title || !form.description || !form.keywords) {
      setMsg("All fields are required");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        keywords: form.keywords.split(",").map(k => k.trim()),
      };

      const res = await createJob(payload);

      if (res.error) {
        setMsg("Failed to create job");
      } else {
        setMsg("Job created successfully ✅");

        // redirect after success
        setTimeout(() => {
          navigate("/admin/jobs");
        }, 1000);
      }

    } catch (err) {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Job
        </h2>

        {/* MESSAGE */}
        {msg && (
          <p className="mb-3 text-center text-sm text-red-500">
            {msg}
          </p>
        )}

        {/* TITLE */}
        <input
          placeholder="Job Title"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Job Description"
          className="w-full border p-3 mb-4 rounded"
          rows="4"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* KEYWORDS */}
        <input
          placeholder="Skills (comma separated)"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, keywords: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>

      </form>
    </div>
  );
}

export default AdminJobs;