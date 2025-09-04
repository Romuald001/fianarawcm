// Appels API toilettes: approved, create, pending, approve, reject
import http from './http';
import type { Toilet } from '../types/toilet';

export const toilet = {
    getApproved: async (): Promise<Toilet[]> => { 
        // GET /api/toilets: le backend renvoi uniquement les "approved"
        const res = await http.get('/toilets'); 
        return res.data as Toilet[]; //typage de la reponse
    },

    createToilet: async (payload: Partial<Toilet>) => {
        // POST /api/toilets: cree un point en status "pending"
        const res = await http.post('/toilets', payload);
        return res.data;
    },

    listPending: async (): Promise<Toilet[]> => {
        // GET /api/toilets: liste pour moderation
        const res = await http.get('/toilets/pending');
        return res.data as Toilet[];
    },

    approve: async (id: number) => {
        // PACTCH /api/toilets/:id/approved: passe en "approuved"
        const res = await http.patch( `/toilets/${id}/approuved`, {});
        return res.data;
    },

    reject: async (id: number) => {
        // PATCH /api/toilets/:id/rejeced: passe en "rejected"
        const res = await http.patch(`/toilets/${id}/reject`, {});
        return res.data;
    },

};