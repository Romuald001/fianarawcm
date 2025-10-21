import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserLayout from "../layouts/UserLayout";
import Home from "../pages/users/Home";
import AddToilet from "../pages/users/AddToilet";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/dashboard";
import PendingList from "../pages/admin/PendingList";


const ProtectedRoute: React.FC<{ requiredRole: "user" | "admin" }> = ({ requiredRole }) => {
  const { token, role,loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }
  
  return <Outlet />;
};
const storedToken = localStorage.getItem("token");
        console.log("token home",storedToken);

const AppRoutes: React.FC = () => {
  const { role } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes utilisateur */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddToilet />}/>
          </Route>
        </Route>

        {/* Routes admin */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/pending" element={<PendingList />} />
          </Route>
        </Route>
        

        {/* Fallback : redirige selon le rôle ou login */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                role === "admin" ? "/admin/dashboard" : role === "user" ? "/" : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
