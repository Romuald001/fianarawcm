export type Role = 'user' | 'moderator' | 'admin'; // role geres cote back

export interface User {
    id?: number;
    username?: string;
    email?: string;
    role: Role;
};