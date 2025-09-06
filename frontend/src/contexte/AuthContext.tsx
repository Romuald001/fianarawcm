import { createContext } from 'react';
import type { User } from '../types/user';



interface AuthContextValue {
    user: User | null;
    token: string | null;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail:(username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue> | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
}
