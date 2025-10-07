import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { useAuth } from "../hooks/useAuth";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/home/Home";

const ProtectedRoute: React.FC<{ requiredRole: "user" | "admin" }> = ({
  requiredRole,
}) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/"} replace />;
  }
  return <Outlet />;
};

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
          </Route>
        </Route>

        {/* Routes admin */}
        

        {/* Fallback : redirige selon le rôle ou login */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                role === "admin" ? "/admin" : role === "user" ? "/" : "/login"
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
