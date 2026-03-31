import { useEffect, useState } from "react";
import { getJobs } from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>

        {/* ✅ ADD JOB BUTTON */}
        <button
          onClick={() => navigate("/admin/jobs/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Job
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading jobs...</p>}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <p>No jobs found</p>
      )}

      {/* JOB LIST */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{job.title}</h3>

            <p className="text-gray-500 mt-1">
              {job.description?.slice(0, 100)}...
            </p>

            <div className="flex gap-3 mt-3">

              <button
                onClick={() => navigate(`/admin/jobs/${job._id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                View Candidates
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminJobList;