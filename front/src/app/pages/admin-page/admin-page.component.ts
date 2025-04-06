import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../interfaces/user';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, PlusIcon, EditIcon, Trash2Icon } from 'lucide-angular';
import { PopupComponent } from '../../components/popup/popup.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PopupComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  // Icons
  PlusIcon = PlusIcon;
  EditIcon = EditIcon;
  Trash2Icon = Trash2Icon;

  // Liste des utilisateurs
  users = signal<User[]>([]);

  // État du formulaire
  userForm: FormGroup;
  isEditing = false;
  currentUserId: number | null = null;

  // État des popups
  showCreateEditPopup = false;
  showDeletePopup = false;
  userToDelete: User | null = null;

  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isAdmin: [false],
      photoUrl: ['https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (error) => {
        this.toastService.showToast('Erreur lors du chargement des utilisateurs', 'error', 3000);
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
  }

  openCreatePopup(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.userForm.reset({
      email: '',
      firstName: '',
      lastName: '',
      isAdmin: false,
      photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()
    });
    this.showCreateEditPopup = true;
  }

  openEditPopup(user: User): void {
    this.isEditing = true;
    this.currentUserId = user.id;
    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin || false,
      photoUrl: user.photoUrl
    });
    this.showCreateEditPopup = true;
  }

  openDeletePopup(user: User): void {
    this.userToDelete = user;
    this.showDeletePopup = true;
  }

  closePopup(): void {
    this.showCreateEditPopup = false;
    this.showDeletePopup = false;
    this.userToDelete = null;
  }

  generateNewAvatar(): void {
    this.userForm.patchValue({
      photoUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + uuidv4()
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.toastService.showToast('Veuillez remplir tous les champs obligatoires', 'error', 3000);
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditing && this.currentUserId) {
      // Mise à jour d'un utilisateur existant
      this.adminService.updateUser(this.currentUserId, userData).subscribe({
        next: (updatedUser) => {
          this.toastService.showToast('Utilisateur mis à jour avec succès', 'success', 2000);
          this.loadUsers();
          this.closePopup();
        },
        error: (error) => {
          this.toastService.showToast('Erreur lors de la mise à jour de l\'utilisateur', 'error', 3000);
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
    } else {
      // Création d'un nouvel utilisateur
      this.adminService.createUser(userData).subscribe({
        next: (newUser) => {
          this.toastService.showToast('Utilisateur créé avec succès', 'success', 2000);
          this.loadUsers();
          this.closePopup();
        },
        error: (error) => {
          this.toastService.showToast('Erreur lors de la création de l\'utilisateur', 'error', 3000);
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      });
    }
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.toastService.showToast('Utilisateur supprimé avec succès', 'success', 2000);
        this.loadUsers();
        this.closePopup();
      },
      error: (error) => {
        this.toastService.showToast('Erreur lors de la suppression de l\'utilisateur', 'error', 3000);
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      }
    });
  }
}
