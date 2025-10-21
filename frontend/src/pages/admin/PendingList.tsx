import React, { useState, useEffect } from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";
import "./PendingList.scss";

const PendingList: React.FC = () => {
  const [pending, setPending] = useState<Toilet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await toilet.listPending();
      setPending(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Erreur lors du chargement des toilettes en attente"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await toilet.approve(id);
      setPending((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await toilet.reject(id);
      setPending((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pending-list-page">
      <h2>Toilettes en attente</h2>
      {pending.length === 0 && <p>Aucune toilette en attente</p>}

      <div className="cards-container">
        {pending.map((t) => (
          <div key={t.id} className="toilet-card">
            <h3>{t.name || "Nom non défini"}</h3>
            <p>{t.description || "Pas de description"}</p>
            <p>
              <strong>Coordonnées:</strong>{" "}
              {t.lat != null && t.lng != null
                ? `${Number(t.lat).toFixed(5)}, ${Number(t.lng).toFixed(5)}`
                : "-"}
            </p>
            <p>
              <strong>Libre:</strong> {t.isFree ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Accessible:</strong> {t.isAccessible ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Propreté:</strong> {t.cleanliness || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {t.status || "En attente"}
            </p>
            <p>
              <strong>Créé par:</strong> {t.createdBy || "Utilisateur inconnu"}
            </p>
            <p>
              <strong>Créé le:</strong> {t.createdAt || "-"}
            </p>
            <p>
              <strong>Dernière mise à jour:</strong> {t.updatedAt || "-"}
            </p>
            <div className="action-buttons">
              <button className="approve" onClick={() => handleApprove(t.id!)}>
                ✅ Approuver
              </button>
              <button className="reject" onClick={() => handleReject(t.id!)}>
                ❌ Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingList;

