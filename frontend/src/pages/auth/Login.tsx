import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";

const Login: React.FC = () => {

    const { loginWithEmail } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await loginWithEmail(email, password);
            navigate("/"); // Redirection vers Home
        } catch (err) {
            const apiError = err as { response?: { data?: { error?: string }}};
            setError(apiError?.response?.data?.error || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Décor cartographique purement visuel, aucun impact sur la logique */}
            <svg className="auth-page__path" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
                <path d="M -50 650 C 250 600, 350 300, 650 350 S 1050 150, 1250 100" />
                <path d="M -50 150 C 200 250, 500 50, 800 200 S 1100 600, 1250 700" />
            </svg>

            <form className="auth-form" onSubmit={handleSubmit}>
                <span className="auth-form__pin" aria-hidden="true" />
                <p className="auth-form__eyebrow">Bienvenue</p>
                <h2>Connexion</h2>
                {error && <div className="error">{error}</div>}
                <label>Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>Mot de passe
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>

                <button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>

                <div className="auth-footer">
                    <span>Pas encore de compte ? </span>
                    <Link to="/register">S'inscrire</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;