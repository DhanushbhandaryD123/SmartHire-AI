import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      <h1 onClick={() => navigate("/")}>SmartHire AI</h1>

      <div className="flex gap-5 items-center">

        <Link to="/">Home</Link>

        {role !== "hr" && <Link to="/jobs">Jobs</Link>}
        {role !== "hr" && <Link to="/careers">Careers</Link>}

        {!role && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {role === "hr" && (
          <Link to="/dashboard">Dashboard</Link>
        )}

        {role && (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;