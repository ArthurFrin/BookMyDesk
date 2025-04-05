import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, RefreshCcw } from 'lucide-angular';
import { User } from '../../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
})
export class ProfilePageComponent {
  authService = inject(AuthService);
  toast = inject(ToastService);

  RefreshCcw = RefreshCcw;

  user = this.authService.currentUser;
  formUser = signal<User | null>(null);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.formUser.set({ ...user });
    }
  }

  updateProfile() {
    if (this.user() !== this.formUser()) {
      this.authService.updateProfile(this.formUser()!).subscribe({
        next: (response) => {
          this.toast.showToast('Profil mis à jour avec succès', 'success', 2000);
        },
        error: (error) => {
          this.toast.showToast('Erreur lors de la mise à jour du profil', 'error', 2000);
          console.error('Erreur lors de la mise à jour du profil', error);
        },
      });
    }
  }

  changeProfilePicture() {
    this.formUser.set({
      ...this.formUser()!,
      photoUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${uuidv4()}`,
    });
  }
}
