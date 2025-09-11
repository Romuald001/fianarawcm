// Gere user/token globalement et expose login()/logout()
// Le contexte CONSOMME userApi.login / userApi.register
import { createContext, useEffect, useState } from 'react';
import type { User } from '../types/user';
import http from '../services/http';
import { userApi } from '../services/user.api';



interface AuthContextValue {
    user: User | null;                      // utilisateur courant 
    token: string | null;                   // token brut
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail:(username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

// on initialise a undefined pour pouvoir controler l'usage (hook dedier)
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // initialiser token depuis localStorage => persistance de session
    const [token, setToken]= useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    // effet quand "token" change, on decode et met a jour user + header authorization globale
    useEffect(() => {
        if (!token) {
            setUser(null);
            delete (http.defaults.headers as any).common?.Authorization;
            return;
        }
        try {
            const parts = token.split('.');
            if (parts.length < 2){
                throw new Error('token invalide');
            }
           // decodage manuel du payload JWT (base64url) sans dependance 
            const payload = JSON.parse(atob(token?.split('.')[1]));
            const u: User = {
                id: payload.id,
                username: payload.username,
                email: payload.email || '',
                role: payload.role,
            };

            setUser(u); // pousser l'utilisateur dans le state

            (http.defaults.headers as any).common = (http.defaults.headers as any).common || {};
            (http.defaults.headers as any).common.Authorization = `Bearer ${token}`;  // header global axios
        } catch (err) {
            console.warn('Token invalide, purge...', err)   // token corrompu -> purge
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    }, [token]);
    
    // login : appel API, stocke token -> declenche useEffect ci-dessus
    const loginWithEmail = async (email: string, password: string) => {
        const { token } = await userApi.login({ email, password });
        localStorage.setItem('token', token);
        setToken(token);
    }
    // register : appel API, puis auto-login
    const registerWithEmail = async (username: string, email: string, password: string) => {
        await userApi.register({ username, email, password});
        await loginWithEmail(email, password);
    };

    // deconnexion : nettoyer le stockage et les etats
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, token, loginWithEmail, registerWithEmail, logout}}>
            {children}
        </AuthContext.Provider>
    );

};
