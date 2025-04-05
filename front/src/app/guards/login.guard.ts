import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isValid = await firstValueFrom(authService.verifyToken());

    if (!isValid) {
      await router.navigate(['/login']);
      return false;
    }

    // Vérification du rôle si spécifié dans les données de la route
    const requiresAdmin = route.data?.['role'] === 'admin';
    const user = authService.currentUser(); // Récupère l'utilisateur actuel

    if (requiresAdmin && !user?.isAdmin) {
      await router.navigate(['/']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    await router.navigate(['/login']);
    return false;
  }
};
