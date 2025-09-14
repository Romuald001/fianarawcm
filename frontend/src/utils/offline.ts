import localforage from "localforage";
import type { Toilet } from "../types/toilet";
import { toilet } from '../services/toilet.api';

//  configuration localforage : base 'toilets-app', store 'pending'
localforage.config({ name: 'toilets-app', storeName: 'pending' });

export async function savePendingToilet(t: Partial<Toilet>) {
    //  lire la file (ou tableau vide)
    const arr = (await localforage.getItem<Partial<Toilet>[]>('pending')) || [];
    //  ajouter timestamp local "createdAt"
    arr.push({ ...t, createdAt: new Date().toISOString() });
    await localforage.setItem('pending', arr); 
};

export async function syncPendingToilets() {
    if (!navigator.onLine) return;  // si hors-ligne, on sort
    const arr = (await localforage.getItem<Partial<Toilet>[]>('pending')) || [];
    if (!arr.length) return;    //  rien a synchroniser
    
    for (const p of arr) {
        try {
            // POST vers backend via service centralisé
            await toilet.createToilet(p);
        } catch (err) {
            // log et on continue : ne pas bloquer les autres éléments
            console.error('Sync failed for item', p, err);
        }
    }
    // si tout s'est bien passé, on purge la file locale
    await localforage.removeItem('pending');
};