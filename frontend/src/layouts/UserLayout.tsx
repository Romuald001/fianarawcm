import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./UserLayout.scss";


const UserLayout = () => {

    const navigate = useNavigate();
    const { token, logout, } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
;
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const closeMenu = () => setIsMenuOpen(false);


    return (
        <div className="user-layout">
            <header className="navbar">
                <h2 className="logo">Toilet Finder</h2>

                <button
                    className={'menu-toggle ${isMenuOpen ? ""}'}
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={isMenuOpen ? "open" : ""}>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                        Carte
                    </NavLink>

                    <NavLink to="/add" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                        Ajouter une toilette
                    </NavLink>

                    <NavLink to="/cotribution" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                        Mes contributions
                    </NavLink>

                    {token ? (
                        <button onClick={handleLogout}>Déconnexion</button>
                    ) : (
                        <NavLink to="/login"><button>Connexion</button></NavLink> 

                    )}
                </nav>
            </header>

            <main className="content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <p className="footer-logo">Toilet Finder</p>
                        <p>
                            Trouvez et partagez les toilettes publiques de Fianarantsoa.
                            Un projet communautaire pour une ville plus propre et accessible.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div>
                            <h4>Navigation</h4>
                            <ul>
                                <li><NavLink to="/">Carte</NavLink></li>
                                <li><NavLink to="/add">Ajouter une toilette</NavLink></li>
                                <li><NavLink to="/cotribution">Mes contributions</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Toilet Finder — Tous droits réservés</p>
                    <p>Fait à Fianarantsoa 🇲🇬</p>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;