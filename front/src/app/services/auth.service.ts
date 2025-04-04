import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User | null = {
    id: 2,
    firstName: 'Bob',
    lastName: 'Martin',
    photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=user',
    isAdmin: false
  };

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin === true;
  }
}
