import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { User } from '../../interfaces/user';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, PlusIcon, EditIcon, Trash2Icon } from 'lucide-angular';
import { UserPopupComponent } from '../../components/user-popup/user-popup.component';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    UserPopupComponent,
    PopupComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  // Icons
  PlusIcon = PlusIcon;
  EditIcon = EditIcon;
  Trash2Icon = Trash2Icon;

  // Liste des utilisateurs
  users = signal<User[]>([]);

  // État du formulaire
  isEditing = false;
  currentUser: User | null = null;

  // État des popups
  showCreateEditPopup = false;
  showDeletePopup = false;
  userToDelete: User | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (error) => {
        this.toastService.showToast('Erreur lors du chargement des utilisateur·ices', 'error', 3000);
        console.error('Erreur lors du chargement des utilisateur·ices', error);
      }
    });
  }

  openCreatePopup(): void {
    this.isEditing = false;
    this.currentUser = null;
    this.showCreateEditPopup = true;
  }

  openEditPopup(user: User): void {
    this.isEditing = true;
    this.currentUser = user;
    this.showCreateEditPopup = true;
  }

  openDeletePopup(user: User): void {
    this.userToDelete = user;
    this.showDeletePopup = true;
  }

  closePopup(): void {
    this.showCreateEditPopup = false;
    this.currentUser = null;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.userToDelete = null;
  }

  saveUser(userData: any): void {
    if (this.isEditing && this.currentUser) {
      // Mise à jour d'un utilisateur existant
      this.adminService.updateUser(this.currentUser.id, userData).subscribe({
        next: (updatedUser) => {
          this.toastService.showToast('Utilisateur·ice mis à jour avec succès', 'success', 3000);
          this.loadUsers();
          this.closePopup();
        },
        error: (error) => {
          this.toastService.showToast('Erreur lors de la mise à jour de l\'utilisateur·ice', 'error', 3000);
          console.error('Erreur lors de la mise à jour de l\'utilisateur·ice', error);
        }
      });
    } else {
      // Création d'un nouvel utilisateur
      this.adminService.createUser(userData).subscribe({
        next: (newUser) => {
          this.toastService.showToast('Utilisateur·ices créé avec succès, email envoyé', 'success', 3000);
          this.loadUsers();
          this.closePopup();
        },
        error: (error) => {
          this.toastService.showToast('Erreur lors de la création de l\'utilisateur·ice', 'error', 3000);
          console.error('Erreur lors de la création de l\'utilisateur·ice', error);
        }
      });
    }
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.toastService.showToast('Utilisateur·ice supprimé avec succès', 'success', 3000);
        this.loadUsers();
        this.closeDeletePopup();
      },
      error: (error) => {
        this.toastService.showToast('Erreur lors de la suppression de l\'utilisateur·ice', 'error', 3000);
        console.error('Erreur lors de la suppression de l\'utilisateur·ice', error);
      }
    });
  }
}
