import { useEffect, useState } from "react";
import { getJobsPaginated, searchJobs } from "../services/api";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const limit = 6; // jobs per page
  const navigate = useNavigate();

  // 🔥 Debounce (wait 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 Fetch jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        let res;

        if (debouncedSearch) {
          res = await searchJobs(debouncedSearch);
        } else {
          res = await getJobsPaginated(page, limit);
        }

        // 🔥 handle both formats
        if (res?.data) {
          setJobs(res.data);
          setTotal(res.total || 0);
        } else {
          setJobs(res);
          setTotal(res.length);
        }

      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page, debouncedSearch]);

  // APPLY
  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Only candidates can apply");
      return;
    }

    navigate(`/apply/${jobId}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-6 text-center">
        Career Opportunities
      </h2>

      {/* 🔍 SEARCH */}
      <div className="mb-6 text-center">
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* ERROR */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <p className="text-center">No jobs found</p>
      )}

      {/* JOB LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow p-5"
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>

            <p className="text-gray-600 text-sm mt-2">
              {job.description?.slice(0, 100)}...
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="text-blue-600"
              >
                View
              </button>

              <button
                onClick={() => handleApply(job._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 📄 PAGINATION */}
      {!debouncedSearch && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default Jobs;