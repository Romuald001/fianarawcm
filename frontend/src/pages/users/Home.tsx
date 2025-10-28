import React, { useEffect, useState } from "react";
import type { Toilet } from "../../types/toilet";
import { toilet } from "../../services/toilet.api";
import MapView from "../../components/Map/MapView";
import "./home.scss";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
 
    // États
    const [toilets, setToilets] = useState<Toilet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            <section className="hero">
                <div className="hero-text">
                    <h1>Bienvenue sur Toilet Finder 🚻</h1>
                    <p>
                        Trouvez facilement les toilettes publiques les plus proches de vous à Fianarantsoa.
                        Aidez la communauté en ajoutant celles que vous découvrez !
                    </p>
                    <button
                        className="add-btn"
                        onClick={() => navigate("/add")}
                    >
                        ➕ Ajouter une toilette
                    </button>
                </div>
            </section>



            <h2 className="map-title">🗺️ Carte des toilettes</h2>
            {loading && <p>Chargement des toilettes...</p>}
            {error && <p className="error">{error}</p>}
            <MapView toilets={toilets} onNewToilet={handleNewToilet} />


            <section className="info-card">
                <h2>🌍 Notre mission</h2>
                <p>
                    Toilet Finder vise à rendre la ville plus propre et plus accessible en permettant à chacun
                    de localiser, noter et partager des informations sur les toilettes publiques. Ensemble,
                    construisons un environnement plus sain et solidaire.
                </p>
            </section>
        </div>
    );
};

export default Home;