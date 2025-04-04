import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  errorMessage: string = '';

  authService = inject(AuthService);
  router = inject(Router);

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/disponibilite']);
      },
      error: (error) => {
        this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        console.error('Login error', error);
      }
    });
  }
}
