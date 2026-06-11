// ✅ AUTO SWITCH BASE URL (DOCKER + LOCAL)
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "http://backend:8000/api";


// ================= AUTH HEADER =================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// ================= COMMON API HANDLER =================
const apiRequest = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw data || { error: "Something went wrong" };
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
};


// ================= AUTH =================
export const loginUser = (data) =>
  apiRequest(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const registerUser = (data) =>
  apiRequest(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });


// ================= JOBS =================
export const getJobs = () =>
  apiRequest(`${BASE_URL}/jobs/`);

export const getJobById = (id) =>
  apiRequest(`${BASE_URL}/jobs/${id}/`);

export const createJob = (data) =>
  apiRequest(`${BASE_URL}/jobs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

export const updateJob = (id, data) =>
  apiRequest(`${BASE_URL}/jobs/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

export const deleteJob = (id) =>
  apiRequest(`${BASE_URL}/jobs/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });


// ================= APPLY =================
export const applyJob = (formData) =>
  apiRequest(`${BASE_URL}/apply/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });


// ================= HR =================
export const getPendingCandidates = () =>
  apiRequest(`${BASE_URL}/hr/pending/`, {
    headers: getAuthHeaders(),
  });

export const approveCandidate = (id) =>
  apiRequest(`${BASE_URL}/hr/approve/${id}/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

export const rejectCandidate = (id) =>
  apiRequest(`${BASE_URL}/hr/reject/${id}/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

export const getCandidatesByJob = (jobId) =>
  apiRequest(`${BASE_URL}/jobs/${jobId}/candidates/`, {
    headers: getAuthHeaders(),
  });

export const getTopCandidates = (jobId) =>
  apiRequest(`${BASE_URL}/jobs/${jobId}/top-candidates/`, {
    headers: getAuthHeaders(),
  });

export const getAllCandidates = () =>
  apiRequest(`${BASE_URL}/candidates/`, {
    headers: getAuthHeaders(),
  });


// ================= ANALYTICS (NEW ✅)
export const getAnalytics = () =>
  apiRequest(`${BASE_URL}/analytics/`, {
    headers: getAuthHeaders(),
  });


// ================= SEARCH + PAGINATION =================
export const searchJobs = (query) =>
  apiRequest(`${BASE_URL}/jobs/?search=${query}`);

export const getJobsPaginated = (page = 1, limit = 10) =>
  apiRequest(`${BASE_URL}/jobs/?page=${page}&limit=${limit}`);