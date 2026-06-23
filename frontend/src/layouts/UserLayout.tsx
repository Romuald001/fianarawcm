import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./UserLayout.scss";

const UserLayout = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    }


    return (
        <div className="user-layout">
            <header className="navbar">
                <h2 className="logo">Toilet Finder</h2>
                <nav>
                    <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
                        Carte
                    </NavLink>

                    <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
                        Ajouter une toilette
                    </NavLink>

                    <NavLink to="/cotribution" className={({ isActive }) => isActive ? "active" : ""}>
                        Mes contributions
                    </NavLink>

                    <button onClick={handleLogout}>Déconnexion</button>
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
                                <li><NavLink to="/map">Carte</NavLink></li>
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