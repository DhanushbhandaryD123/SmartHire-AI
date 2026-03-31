const BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ COMMON API HANDLER
const apiRequest = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
};

// AUTH
export const loginUser = (data) =>
  apiRequest(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const registerUser = (data) =>
  apiRequest(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// JOBS
export const getJobs = () => apiRequest(`${BASE_URL}/jobs/`);

export const getJobById = (id) =>
  apiRequest(`${BASE_URL}/jobs/${id}/`);

// APPLY
export const applyJob = (formData) =>
  apiRequest(`${BASE_URL}/apply/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

// HR
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

export const createJob = (data) =>
  apiRequest(`${BASE_URL}/jobs/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  
export const getAllCandidates = () =>
  apiRequest(`${BASE_URL}/candidates/`, {
    headers: getAuthHeaders(),
  });