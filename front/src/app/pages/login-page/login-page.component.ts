import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';

  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);


  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.toastService.showToast('Connexion réussie !', 'success', 2000);
        this.router.navigate(['/disponibilite']);
      },
      error: (error) => {
        this.toastService.showToast('Échec de la connexion. Veuillez vérifier vos identifiants.', 'error', 5000);
        console.error('Login error', error);
      }
    });
  }
}
