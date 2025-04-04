import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isValid = await firstValueFrom(authService.verifyToken());

    if (!isValid) {
      await router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    await router.navigate(['/login']);
    return false;
  }
};
