import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2 className="logo">Toilet Admin</h2>
        <nav>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/pending" className={({ isActive }) => isActive ? "active" : ""}>
            Toilettes en attente
          </NavLink>
          <NavLink to="/admin/types" className={({ isActive }) => isActive ? "active" : ""}>
            Types d'incidents
          </NavLink>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </nav>
        <button 
          className="toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "⮜" : "⮞"}
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
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
