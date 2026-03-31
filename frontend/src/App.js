import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Public
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Careers from "./pages/Careers";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Register from "./pages/Register";

// HR
import Dashboard from "./pages/Dashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminJobList from "./pages/AdminJobList";
import JobCandidates from "./pages/JobCandidates";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>

      {/* ✅ ALWAYS SHOW NAVBAR */}
      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CANDIDATE */}
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute role="candidate">
              <Apply />
            </ProtectedRoute>
          }
        />

        {/* HR PANEL */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="hr">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute role="hr">
              <AdminLayout>
                <AdminJobList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute role="hr">
              <AdminLayout>
                <AdminJobs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/:jobId"
          element={
            <ProtectedRoute role="hr">
              <AdminLayout>
                <JobCandidates />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute role="hr">
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;