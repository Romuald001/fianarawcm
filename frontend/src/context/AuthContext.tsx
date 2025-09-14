import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/user';


// Typage du contexte

interface AuthContextValue {
    user: User | null;                      
    token: string | null;                   
    login: (token: string) => void;
    logout: () => void;
};

// contexte vide par defaut
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken]= useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

   // verifier le token dans localstorage au demarrage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded: User = jwtDecode(storedToken);
                setUser(decoded);
                setToken(storedToken);
            } catch (error) {
                console.error("token invalide : ", error);
                localStorage.removeItem("token");
            }
        }
    }, []);
    
    // fonctiom login
    const login = (newToken: string) => {
        try {
            const decoded: User = jwtDecode(newToken);
            setUser(decoded);
            setToken(newToken);
            localStorage.setItem("token", newToken);
        } catch(error) {
            console.error("Erreur lors du décodage du token:", error);
        }
    };

    // fonction logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };


    return (
        <AuthContext.Provider value={{ user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};
