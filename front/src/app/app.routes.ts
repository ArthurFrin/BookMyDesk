import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DayAvailabilityPageComponent } from './pages/day-availability-page/day-availability-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/disponibilite', pathMatch: 'full' },
  { path: 'disponibilite', component: HomePageComponent, canActivate: [loginGuard] },
  { path: 'disponibilite/:date', component: DayAvailabilityPageComponent, canActivate: [loginGuard] },
  { path: 'login', component: LoginPageComponent, data: { hideSidebar: true } },
  { path: 'profile', component: ProfilePageComponent, canActivate: [loginGuard] },
  { path: '404', component: PageNotFoundComponent, data: { hideSidebar: true } },
  { path: '**', redirectTo: '/404' }
];

