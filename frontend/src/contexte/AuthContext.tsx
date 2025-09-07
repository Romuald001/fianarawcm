// Gere user/token globalement et expose login()/logout()
// Le contexte CONSOMME userApi.login / userApi.register
import { createContext, useEffect, useState } from 'react';
import type { User } from '../types/user';



interface AuthContextValue {
    user: User | null;                      // utilisateur courant 
    token: string | null;                   // token brut
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail:(username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

// on initialise a undefined pour pouvoir controler l'usage (hook dedier)
export const AuthContext = createContext<AuthContextValue> | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // initialiser token depuis localStorage => persistance de session
    const [token, setToken]= useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    // effet quand "token" change, on decode et met a jour user + header authorization globale
    useEffect(() => {
        if (!token) {
            setUser(null);
            delete (http.defaults.headers as any).common?.Authorization;
        }
    })
}
