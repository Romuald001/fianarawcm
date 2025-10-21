import React, { createContext, useEffect, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/user';
import { userApi } from '../services/user.api';
import http from '../services/http';



// Typage du contexte

interface AuthContextType {
    user: User | null;                      
    token: string | null;
    role: string | null;  
    loading: boolean;                 
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

// contexte vide par defaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken]= useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

   // verifier le token dans localstorage au demarrage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
     
        if (storedToken) {
            try {
                const decoded: User = jwtDecode(storedToken);
                setUser({
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email || "",
                    role: decoded.role,
                });
                setToken(storedToken);
                setRole(decoded.role);
                http.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
            } catch (error) {
                console.error("token invalide : ", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);
    
    // fonction login
    const loginWithEmail = async (email: string, password: string) => {
            const { token } = await userApi.login({ email, password });
            localStorage.setItem("token", token);
            setToken(token);
            const decoded: any = jwtDecode(token);
            setUser({
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role,
            });
            setRole(decoded.role);
           ( http.defaults.headers as any ).common.Authorization = `Bearer ${token}`; 
    };

    // fonction register
    const registerWithEmail = async (username: string, email: string, password: string) => {
        await userApi.register({ username, email, password });
        await loginWithEmail(email, password );
    }

    // fonction logout
    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem('token');
        delete http.defaults.headers.common.Authorization;
    };


    return (
        <AuthContext.Provider value={{ user, token, role, loading, loginWithEmail, registerWithEmail, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
