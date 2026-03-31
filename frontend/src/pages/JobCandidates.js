import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  getCandidatesByJob,
  getTopCandidates,
  approveCandidate,
  rejectCandidate,
} from "../services/api";

function JobCandidates() {
  const { jobId } = useParams();

  const [allCandidates, setAllCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [minScore, setMinScore] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  // ================= LOAD =================
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);

      const data = showTop
        ? await getTopCandidates(jobId)
        : await getCandidatesByJob(jobId);

      const list = Array.isArray(data) ? data : [];

      setAllCandidates(list);
      setFiltered(list);
    } catch {
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [jobId, showTop]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // ================= FILTER =================
  useEffect(() => {
    let data = [...allCandidates];

    if (search) {
      data = data.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      data = data.filter((c) => c.hr_status === status);
    }

    if (minScore) {
      data = data.filter((c) => c.score >= Number(minScore));
    }

    setFiltered(data);
    setPage(1);
  }, [search, status, minScore, allCandidates]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // ================= VIEW RESUME (FIXED) =================
  const handleViewResume = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/resume/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

    } catch {
      toast.error("Failed to open resume");
    }
  };

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
    try {
      await approveCandidate(id);
      toast.success("Candidate Approved");
      loadCandidates();
    } catch {
      toast.error("Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCandidate(id);
      toast.error("Candidate Rejected");
      loadCandidates();
    } catch {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Candidates</h2>

          <button
            onClick={() => setShowTop(!showTop)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showTop ? "Show All" : "Top 10"}
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded shadow mb-4 grid md:grid-cols-4 gap-4">

          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="number"
            placeholder="Min Score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              setSearch("");
              setStatus("all");
              setMinScore("");
            }}
            className="bg-gray-800 text-white rounded"
          >
            Reset
          </button>
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <p>No candidates found</p>
        )}

        {/* LIST */}
        <div className="grid gap-4">
          {paginated.map((c, index) => (
            <div key={c._id} className="bg-white p-5 rounded shadow">

              <div className="flex justify-between">

                <div>
                  <h3 className="font-semibold">
                    #{(page - 1) * perPage + index + 1} {c.name}
                  </h3>

                  <p>{c.email}</p>
                  <p className="text-blue-600">Score: {c.score}</p>
                </div>

                <div className="flex flex-col items-end gap-2">

                  <span className="text-sm">{c.hr_status}</span>

                  {/* ✅ VIEW RESUME FIXED */}
                  {c.resume_file && (
                    <button
                      onClick={() => handleViewResume(c._id)}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      View Resume
                    </button>
                  )}

                  <button
                    onClick={() => handleApprove(c._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                </div>

              </div>

            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default JobCandidates;