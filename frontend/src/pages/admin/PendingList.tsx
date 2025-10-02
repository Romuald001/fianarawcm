import React, { useState, useEffect } from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";

const PendingList: React.FC = () => {

    const [pending, setPending] = useState<Toilet[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPending = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await toilet.listPending();
            setPending(data);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Erreur lors du chargement des toilettes en attente");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await toilet.approve(id);
            setPending(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

     const handleReject = async (id: number) => {
        try {
            await toilet.reject(id);
            setPending(prev => prev.filter(t => t.id !== id));
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="error">{error}</p>;


    return (
         <div className="pending-list">
            <h2>Toilettes en attente</h2>
            {pending.length === 0 && <p>Aucune toilette en attente</p>}
            <ul>
                {pending.map(t => (
                    <li key={t.id}>
                        <strong>{t.name}</strong> ({t.lat}, {t.lng})<br />
                        {t.description}<br />
                        <button onClick={() => handleApprove(t.id!)}>✅ Approuver</button>
                        <button onClick={() => handleReject(t.id!)}>❌ Rejeter</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingList;