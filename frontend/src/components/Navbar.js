import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      <h1
        className="font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        SmartHire AI
      </h1>

      <div className="flex gap-5 items-center">

        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/careers">Careers</Link>

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
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;