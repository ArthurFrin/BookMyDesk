import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ProfilePageComponent {
  authService = inject(AuthService);
  user = this.authService.getCurrentUser()!;

  updateProfile() {
    if (this.user) {
      this.authService.updateProfile(this.user).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
        },
        error: (error) => {
          console.error('Error updating profile', error);
        }
      });
    }
  }
}
