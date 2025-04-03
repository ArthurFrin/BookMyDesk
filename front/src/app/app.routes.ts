import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DayAvailabilityPageComponent } from './pages/day-availability-page/day-availability-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'dashboard', component: HomePageComponent }, // Ajout temporaire (à remplacer par un vrai composant Dashboard)
  { path: 'profile', component: HomePageComponent }, // Modification de 'profil' à 'profile'
  { path: 'reservations', component: DayAvailabilityPageComponent }, // Ajout de la route pour les réservations
  { path: 'disponibilite/:date', component: DayAvailabilityPageComponent }, // Correction de la route pour inclure un paramètre de date
  { path: 'logout', component: HomePageComponent }, // Ajout de la route pour la déconnexion
  { path: '404', component: PageNotFoundComponent, data: { hideSidebar: true } },
  { path: '**', redirectTo: '/404' },
];
