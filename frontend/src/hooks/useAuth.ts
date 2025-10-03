import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
    const ctx  = useContext(AuthContext);   // lit le contexte
    if (!ctx) throw new Error('useAuth must be used inside an AuthProvider'); // garde dev
    return ctx; // expose { user, token, login....logout }
}