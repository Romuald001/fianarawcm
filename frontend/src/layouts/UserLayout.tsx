import { NavLink, useNavigate } from "react-router-dom";
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
                <h2 className="logo"> Toilet Finder </h2>
                <nav>
                    <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
                        Carte
                    </NavLink>

                    <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
                        Ajouter une toilette
                    </NavLink>
                
                    <NavLink to="my-cotributions" className={({ isActive}) => isActive ? "active" : ""}>
                        Mes contributions
                    </NavLink>

                    <button onClick={handleLogout}>Déconnexion</button>
                </nav>
            </header>

            <main className="content">
                outl
            </main>
        </div>
    );
};

export default UserLayout;