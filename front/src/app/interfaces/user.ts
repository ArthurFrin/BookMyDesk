import { Desk } from './desk';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
}

export interface UserWithReservations extends User {
  reservations: Reservation[];
}

export interface Reservation {
  id: number;
  date: string; // Au format ISO string, sera converti en Date côté client si nécessaire
  userId: number;
  deskId: number;
  desk?: Desk; // Optionnel en cas de chargement eager
}
