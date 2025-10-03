import React,{ useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
        } catch (err: any) {
            setError(err?.response?.data?.error || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Connexion</h2>
                {error && <div className="error">{error}</div>}
                <label>Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>Mot de passe
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>

                <button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
            </form>
        </div>
    );
};

export default Login;