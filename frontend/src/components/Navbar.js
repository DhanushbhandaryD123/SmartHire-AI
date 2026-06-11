import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-blue-400 ${
      isActive ? "text-blue-400" : "text-gray-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500 text-white font-bold text-lg">
            S
          </span>
          <span className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
            SmartHire <span className="text-blue-400">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          {role !== "hr" && (
            <NavLink to="/jobs" className={linkClass}>
              Jobs
            </NavLink>
          )}

          {role !== "hr" && (
            <NavLink to="/careers" className={linkClass}>
              Careers
            </NavLink>
          )}

          {role === "hr" && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" className={linkClass}>
                Manage Jobs
              </NavLink>
              <NavLink to="/analytics" className={linkClass}>
                Analytics
              </NavLink>
            </>
          )}

          {!role ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-200 hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-sm font-semibold border border-gray-600 hover:border-red-400 hover:text-red-400 text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 border-t border-gray-800 pt-4">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          {role !== "hr" && (
            <NavLink to="/jobs" className={linkClass} onClick={() => setMenuOpen(false)}>
              Jobs
            </NavLink>
          )}

          {role !== "hr" && (
            <NavLink to="/careers" className={linkClass} onClick={() => setMenuOpen(false)}>
              Careers
            </NavLink>
          )}

          {role === "hr" && (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" className={linkClass} onClick={() => setMenuOpen(false)}>
                Manage Jobs
              </NavLink>
              <NavLink to="/analytics" className={linkClass} onClick={() => setMenuOpen(false)}>
                Analytics
              </NavLink>
            </>
          )}

          {!role ? (
            <>
              <Link to="/login" className={linkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="text-sm font-semibold border border-gray-600 hover:border-red-400 hover:text-red-400 text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
