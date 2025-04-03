import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DayAvailabilityPageComponent } from './pages/day-availability-page/day-availability-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/disponibilite', pathMatch: 'full' },
  { path: 'disponibilite', component: HomePageComponent },
  { path: 'disponibilite/:date', component: DayAvailabilityPageComponent },
  { path: 'logout', component: HomePageComponent },
  { path: '404', component: PageNotFoundComponent, data: { hideSidebar: true } },
  { path: '**', redirectTo: '/404' },
];
