import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./About.scss";


const About: React.FC = () => {
    const navigate = useNavigate()
    const { token} = useAuth();

    return (
        <div className="about-page">
            <section className="hero">
                <div className="hero-text">
                    <span className="hero-eyebrow">Fianarantsoa</span>
                    <h1>Bienvenue sur Toilet Finder 🚻</h1>
                    <p>
                        Trouvez facilement les toilettes publiques les plus proches de vous à Fianarantsoa.
                        Aidez la communauté en ajoutant celles que vous découvrez !
                    </p>
                    <button
                        className="add-btn"
                        onClick={() => navigate(token ? "/add" : "/login")}
                    >
                        ➕ Ajouter une toilette
                    </button>
                </div>
            </section>

            <section className="info-card">
                <h2>🌍 Notre mission</h2>
                <p>
                    Toilet Finder vise à rendre la ville plus propre et plus accessible en permettant à chacun
                    de localiser, noter et partager des informations sur les toilettes publiques. Ensemble,
                    construisons un environnement plus sain et solidaire.
                </p>
            </section>
        </div>
    )
}

export default About;