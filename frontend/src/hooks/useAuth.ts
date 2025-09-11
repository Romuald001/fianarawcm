import { useContext } from "react";
import { AuthContext } from "../contexte/AuthContext";

export function useAuth() {
    const ctx  = useContext(AuthContext);   // lit le contexte
    if (!ctx) throw new Error('useAuth must be used insie AuthProvider'); // garde dev
    return ctx; // expose { user, token, login....logout }
}