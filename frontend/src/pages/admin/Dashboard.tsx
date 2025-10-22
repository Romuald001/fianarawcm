import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { useAuth } from "../../hooks/useAuth";
import { toilet } from "../../services/toilet.api";
import type { Toilet } from "../../types/toilet";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [total, setTotal] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [approved, setApproved] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const all: Toilet[] = await toilet.getApproved(); // ici backend renvoie seulement "approved"
      const pendingList: Toilet[] = await toilet.listPending();

      const approvedCount = all.length;
      const pendingCount = pendingList.length;
      const totalCount = approvedCount + pendingCount;

      setApproved(approvedCount);
      setPending(pendingCount);
      setTotal(totalCount);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

      {loading ? (
        <p className="loading">Chargement des statistiques...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="cards">
          <div className="card">
            <h3>Total Toilettes</h3>
            <p>{total}</p>
          </div>
          <div className="card">
            <h3>En attente</h3>
            <p>{pending}</p>
          </div>
          <div className="card">
            <h3>Approuvées</h3>
            <p>{approved}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
