// Haversine + recherche le plus proche
import type { Toilet } from "../types/toilet";

const toRad = (deg: number) => (deg * Math.PI) / 180; // degres -> radians
const R = 63711000;     // rayon moyen de la terre (m)

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    //  formule de haversine pour la distsnce "grande cercle"
    const dLat = toRad(lat2 - lat1);    
    const dLon = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        //  "a" = carre de la moitier de la corde (formule classiquw)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // angle central
        return R * c;   //  distance en metres
};

export function findNearest(toilets: Toilet[], lat: number, lng: number, k = 5) {
    //  calcule distance pour chaque toilette->trie->prend les k le plus proche
    return toilets
        .map((t) => ({ ...t, distance: haversineDistance(lat, lng, t.lat, t.lng) }))    //  enrichit chaque point
        .sort((a, b) => (a.distance! - b.distance!))    //  tri croissant par distance
        .slice(0, k);   //  top-k
};