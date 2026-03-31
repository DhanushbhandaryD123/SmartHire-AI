import React, { useEffect, useState } from "react";
import { getJobs } from "../services/api";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        const res = await getJobs();

        if (Array.isArray(res)) {
          setJobs(res);
        } else {
          setJobs([]);
        }

      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // ✅ HANDLE APPLY (FIX)
  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // ❌ Not logged in
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // ❌ HR trying to apply
    if (role !== "candidate") {
      alert("Only candidates can apply");
      return;
    }

    // ✅ Go to apply page
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-6 text-center">
        Career Opportunities
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-center">Loading jobs...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <p className="text-center">No jobs available</p>
      )}

      {/* JOB GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
          >
            <h3 className="text-xl font-semibold mb-2">
              {job.title}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {job.description}
            </p>

            <p className="text-sm mb-4">
              <span className="font-semibold">Skills:</span>{" "}
              {job.keywords?.join(", ") || "N/A"}
            </p>

            <div className="flex justify-between items-center">

              <button
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="text-blue-600 text-sm"
              >
                View Details
              </button>

              <button
                onClick={() => handleApply(job._id)}   // ✅ FIXED
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
 