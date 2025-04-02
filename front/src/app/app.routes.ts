import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'dashboard', component: HomePageComponent }, // Ajout temporaire (à remplacer par un vrai composant Dashboard)
  { path: 'profile', component: HomePageComponent }, // Modification de 'profil' à 'profile'
  { path: 'reservations', component: HomePageComponent }, // Ajout de la route pour les réservations
  { path: 'logout', component: HomePageComponent }, // Ajout de la route pour la déconnexion
  { path: '404', component: PageNotFoundComponent, data: { hideSidebar: true } },
  { path: '**', redirectTo: '/404' },
];
