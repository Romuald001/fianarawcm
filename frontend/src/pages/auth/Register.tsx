import React,{ useState }  from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Register.scss";

const Register: React.FC = () => {

    const navigate = useNavigate();
    const { registerWithEmail } = useAuth();
    const [username , setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await registerWithEmail(username, email, password);
            navigate("/"); // Redirection vers Home
        } catch (err: any) {
            setError(err?.response?.data?.error || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Inscription</h2>
                {error && <div className="error">{error}</div>}
                <label>Nom d'utilisateur
                    <input value={username} onChange={e => setUsername(e.target.value)} required />
                </label>
                <label>Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>Mot de passe
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>

                <button type="submit" disabled={loading}>{loading ? "Inscription..." : "S'inscrire"}</button>
            </form>
        </div>
    );
};

export default Register;