import React, { useEffect, useState } from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";
import MapView from "../../components/Map/MapView";
import "../home.scss";

const Home: React.FC = () => {

    // États
    const [toilets, setToilets] = useState<Toilet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les toilettes approuvées depuis l'API
    const fetchToilets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await toilet.getApproved();
            setToilets(data);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Erreur lors du chargement des toilettes");
        } finally {
            setLoading(false);
        }
    };

    // Charger les toilettes au montage
    useEffect(() => {
        fetchToilets();
    }, []);

    // Callback après ajout d'une nouvelle toilette
    const handleNewToilet = (t: Toilet) => {
        setToilets((prev) => [...prev, t]); // Ajouter la nouvelle toilette à l'état
    };

    return (
        <div className="home-page">
            <h1>Carte des toilettes</h1>

            {loading && <p>Chargement des toilettes...</p>}
            {error && <p className="error">error</p>}

            <MapView toilets={toilets} onNewToilet={handleNewToilet}/>
        </div>
    );
};

export default Home;