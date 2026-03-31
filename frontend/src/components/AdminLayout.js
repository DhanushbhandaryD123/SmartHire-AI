import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaBriefcase, FaUsers } from "react-icons/fa";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaChartBar /> },
    { name: "Jobs", path: "/admin/jobs", icon: <FaBriefcase /> },
    { name: "Candidates", path: "/analytics", icon: <FaUsers /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-5">

        <h1 className="text-xl font-bold mb-6">SmartHire AI</h1>

        {menu.map(item => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer mb-2 
              ${location.pathname === item.path ? "bg-blue-600" : "hover:bg-gray-700"}`}
          >
            {item.icon}
            {item.name}
          </div>
        ))}

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="mt-auto bg-red-500 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;