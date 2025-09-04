import axios from 'axios'; //instance axios avec base URL

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
});

// intercepteur "request": injecter le token si present
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// intercepteur "reponse": erreur
http.interceptors.response.use(
    (resp) => resp, //laisser passer la reponse ok telle quelle
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default http; // reutilise par tous les services api