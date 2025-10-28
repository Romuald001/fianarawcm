import React, { useState, useEffect } from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";
import "./ApprovedList.scss";

const ApprovedList: React.FC = () => {
  const [approved, setApproved] = useState<Toilet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchApproved = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await toilet.getApproved();
      setApproved(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Erreur lors du chargement des toilettes approuvées"
      );
    } finally {
      setLoading(false);
    }
  };

const deleteToilet = async (id: number) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette toilette ?")) return;
  try {
    await toilet.deleteApproved(id);
    setToilets(toilets.filter((t) => t.id !== id));
    alert("Toilette supprimée avec succès !");
  } catch (e: any) {
    alert(e.response?.data?.error || e.message);
  }
};

  useEffect(() => {
    fetchApproved();
  }, []);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="approved-list-page">
      <h2>Toilettes approuvées</h2>
      {approved.length === 0 ? (
        <p className="no-data">Aucune toilette approuvée</p>
      ) : (
        <div className="table-container">
          <table className="approved-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Coordonnées</th>
                <th>Libre</th>
                <th>Accessible</th>
                <th>Propreté</th>
                <th>Créé par</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((t) => (
                <tr key={t.id}>
                  <td>{t.name || "—"}</td>
                  <td>{t.description || "—"}</td>
                  <td>
                    {t.lat && t.lng
                      ? `${Number(t.lat).toFixed(5)}, ${Number(t.lng).toFixed(5)}`
                      : "—"}
                  </td>
                  <td>{t.isFree ? "✅" : "❌"}</td>
                  <td>{t.isAccessible ? "♿" : "—"}</td>
                  <td>{t.cleanliness || "N/A"}</td>
                  <td>{t.createdBy || "Inconnu"}</td>
                  <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}</td>
                  <td className="action-buttons">
                    <button className="delete" onClick={() => deleteToilet(t.id!)}>
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedList;
