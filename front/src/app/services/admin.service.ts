import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {

  authService = inject(AuthService);

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.get<User[]>('admin/users', this.authService.getHeaderAuth());
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: number): Observable<User> {
    return this.get<User>(`admin/users/${id}`, this.authService.getHeaderAuth());
  }

  // Créer un nouvel utilisateur
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.post<User>('admin/users', user, this.authService.getHeaderAuth());
  }

  // Mettre à jour un utilisateur existant
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.put<User>(`admin/users/${id}`, user, this.authService.getHeaderAuth());
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.delete<void>(`admin/users/${id}`, this.authService.getHeaderAuth());
  }
}
