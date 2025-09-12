export type Cleanliness = 'good' | 'average' | 'bad'; // Enum TS "string literal" pour limiter les valeur aotorisees
export type Status = 'pending' | 'approved' | 'rejected'; // Status de moderation cote backend

export interface Toilet {
    id?: number;
    name?: string | null;
    description?: string | null;
    lat: number;
    lng: number;
    isFree?: boolean;
    isAccessible?: boolean;
    cleanliness?: Cleanliness;
    status?: Status;
    createdBy?: number;
    createdAt?: string;
    updatedAt?: string;
};