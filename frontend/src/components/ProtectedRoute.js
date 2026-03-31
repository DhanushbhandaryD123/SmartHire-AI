import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // ❌ NOT LOGGED IN → go to login page
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ WRONG ROLE
  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;