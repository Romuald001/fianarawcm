// Appels API utilisateur : login/register
import http from "./http";


export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string,
    email: string,
    password: string
}

export const userApi = {
    // POST /api/users/login => { token }
    login: async (payload: LoginPayload): Promise<{ token: string }> => {
        const res = await http.post('/users/login', payload);
        return res.data;
    },

    // POST /api/users/register => {id, username, email, role}
    register: async (payload: RegisterPayload) => {
        const res = await http.post('/users/register', payload); // creation d'utilisateur
        return res.data; 
    },
};