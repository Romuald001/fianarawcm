//  Sauvegarde locale (localeForage) + sync vers backend
import localforage from "localforage";
import type { Toilet } from "../types/toilet";
import { toilet } from '../services/toilet.api';

//  cree une base "toilet-app" et un store "pending"
localforage.config({ name: 'toilets-app', storeName: 'peding' });

export async function savePendingToilet(t: Partial<Toilet>) {
    //  lit la file d'attente locale->ajoute l'element->reecrit le store
    const arr = (await localforage.getItem<Partial<Toilet>[]>('pending')) || [];
    arr.push({ ...t, createdAt: new Date().toISOString() });    //  ajouter un timestamp local
    await localforage.setItem('pending', arr);  //  persiste la nouvellle liste
};

export async function syncPendingToilets() {
    if (!navigator.onLine) return;  //  si offline->sortir silencieusement
    const arr = (await localforage.getItem<Partial<Toilet>[]>('pending')) || [];    //  recupere la file
    if (!arr.length) return;    //  rien a synchroniser
    for (const p of arr) {
        try {
            await toilet.createToilet(p);    //  POST au backend
        } catch (err) {
            console.error('Sync failed for item', p, err);  //  log, mais on continue
        }
    }
    await localforage.removeItem('pending');    //  purge la file si OK
};