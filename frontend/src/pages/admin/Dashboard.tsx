import React from "react";
import "./Dashboard.scss";
import { useAuth } from "../../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <section className="welcome">
        <h3>Bienvenue, {user?.username ? user.username : "Admin"} 👋</h3>
        <p>
          Ici, vous pouvez gérer les nouvelles toilettes, approuver ou rejeter
          les contributions des utilisateurs, et visualiser les statistiques en
          temps réel.
        </p>
      </section>

      <div className="cards">
        <div className="card">
          <h3>Total Toilettes</h3>
          <p>120</p>
        </div>
        <div className="card">
          <h3>En attente</h3>
          <p>8</p>
        </div>
        <div className="card">
          <h3>Approuvées</h3>
          <p>112</p>
        </div>
        <div className="card">
          <h3>Types</h3>
          <p>5</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
