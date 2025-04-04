import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService extends ApiService {

  currentUser: User | null = {
    id: 2,
    firstName: 'Bob',
    lastName: 'Martin',
    photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=user',
    isAdmin: false
  };

  login(email: string, password: string): Observable<LoginResponse> {
    const res =this.post<LoginResponse>('auth/login', { email, password });
    res.subscribe({
      next: (response) => {
        this.currentUser = response.user;
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
    return res;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin === true;
  }
}
