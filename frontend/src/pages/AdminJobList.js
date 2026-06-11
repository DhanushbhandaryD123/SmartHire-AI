import { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";

function AdminJobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role"); // ✅ ADD THIS

  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      const list = Array.isArray(data) ? data : [];
      setJobs(list);
      setFilteredJobs(list);
    } catch {
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    let data = [...jobs];

    if (search) {
      data = data.filter(
        (job) =>
          job.title?.toLowerCase().includes(search.toLowerCase()) ||
          job.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredJobs(data);
  }, [search, jobs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await deleteJob(id);
      alert("Deleted successfully");
      loadJobs();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>

        {/* ✅ ONLY HR */}
        {role === "hr" && (
          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Job
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border p-2 rounded"
        />
      </div>

      {loading && <p>Loading jobs...</p>}

      {!loading && filteredJobs.length === 0 && (
        <p>No jobs found</p>
      )}

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-500 mt-1">
                {job.description?.slice(0, 100)}...
              </p>
            </div>

            <div className="flex gap-4 text-xl">

              <FaUsers
                className="cursor-pointer text-blue-600"
                onClick={() => navigate(`/admin/jobs/${job._id}`)}
              />

              {/* ✅ ONLY HR */}
              {role === "hr" && (
                <>
                  <FaEdit
                    className="cursor-pointer text-yellow-500"
                    onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                  />

                  <FaTrash
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(job._id)}
                  />
                </>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminJobList;