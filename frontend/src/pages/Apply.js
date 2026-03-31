import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { applyJob } from "../services/api";

function Apply() {
  const { jobId } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: null,
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔒 NOT LOGGED IN → redirect to login
    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/apply/${jobId}`);
      window.location.href = "/login";
      return;
    }

    // 🔒 ONLY CANDIDATE
    if (role !== "candidate") {
      setMsg("Only candidates can apply");
      return;
    }

    if (!jobId) {
      setMsg("Invalid job ID");
      return;
    }

    if (!form.name || !form.email || !form.resume) {
      setMsg("All fields required");
      return;
    }

    // ✅ FILE VALIDATION
    if (!form.resume.name.endsWith(".pdf")) {
      setMsg("Only PDF files allowed");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("resume", form.resume);
    fd.append("job_id", jobId);

    try {
      setLoading(true);
      setMsg("");

      // ✅ FIXED (no unused variable)
      await applyJob(fd);

      setMsg("Applied successfully ✅");

      // reset form
      setForm({
        name: "",
        email: "",
        resume: null,
      });

    } catch (err) {
      setMsg(err?.error || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4">Apply</h2>

        {/* MESSAGE */}
        {msg && (
          <p className="mb-3 text-center text-sm text-red-500">
            {msg}
          </p>
        )}

        {/* NAME */}
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* FILE */}
        <input
          type="file"
          className="mb-3"
          onChange={(e) =>
            setForm({ ...form, resume: e.target.files[0] })
          }
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default Apply;