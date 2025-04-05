import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // adapte le chemin selon ton arborescence
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-password-page.component.html',
  styleUrls: ['./create-password-page.component.css'],
})
export class CreatePasswordPageComponent {
  token: string | null = null;
  password = '';
  confirmPassword = '';
  message = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  submit() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.token) {
      this.message = 'Lien invalide.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.auth.setPassword(this.token, this.password).subscribe({
      next: () => {
        this.message = 'Mot de passe enregistré. Vous pouvez maintenant vous connecter.';
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.message = err.error?.error || 'Erreur lors de la création du mot de passe.';
        this.isLoading = false;
      }
    });
  }
}
