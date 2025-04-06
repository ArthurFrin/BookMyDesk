import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mobile-nav-bar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './mobile-nav-bar.component.html',
  styleUrl: './mobile-nav-bar.component.css'
})
export class MobileNavBarComponent {
  CalendarCheckIcon = CalendarCheckIcon;
  LogOutIcon = LogOutIcon;
  UserRoundPen = UserRoundPen;
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);


  logout() {
    this.auth.logout();
    this.toast.showToast('Déconnexion réussie !', 'success', 2000);
    this.router.navigate(['/login']);
  }


}
