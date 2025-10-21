import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaToilet, FaChartBar, FaList } from "react-icons/fa";
import "./AdminLayout.scss";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <h2 className="logo">{isSidebarOpen ? "Toilet Finder" : "TF"}</h2>
        <nav>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <FaChartBar />
            {isSidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/pending" className={({ isActive }) => isActive ? "active" : ""}>
            <FaToilet />
            {isSidebarOpen && <span>Toilettes en attente</span>}
          </NavLink>

          <NavLink to="/admin/types" className={({ isActive }) => isActive ? "active" : ""}>
            <FaList />
            {isSidebarOpen && <span>Types approuvé </span>}
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
          {isSidebarOpen && <span>Déconnexion</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>
          <h3>Admin Panel</h3>
        </header>

        <main>
          <Outlet />
        </main>

        <footer>
          &copy; {new Date().getFullYear()} Toilet Finder - Admin Panel
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
