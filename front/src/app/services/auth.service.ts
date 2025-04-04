import { computed, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService extends ApiService {

  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());

  login(email: string, password: string): Observable<LoginResponse> {
    const res = this.post<LoginResponse>('auth/login', { email, password }).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          sessionStorage.setItem('authToken', response.token);
          this.currentUserSignal.set(response.user);
        }
      })
    );
    res.subscribe({
      error: (error) => {
        console.error('Login error:', error);
      }
    });
    return res;
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    this.currentUserSignal.set(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  updateProfile(user: User): Observable<any> {
    return this.put('/auth/profile', user);
  }

  verifyToken(): Observable<boolean> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return of(false);
    }

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.get<{ valid: boolean; user: User }>('auth/verify', headers).pipe(
      map((response) => {
        if (response.valid) {
          this.currentUserSignal.set(response.user);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Token verification error:', error);
        this.logout();
        return of(false);
      })
    );
  }

}
