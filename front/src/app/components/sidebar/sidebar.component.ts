import { Component, inject, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
})
export class SidebarComponent {
  CalendarCheckIcon = CalendarCheckIcon;
  LogOutIcon = LogOutIcon;
  UserRoundPen = UserRoundPen;

  auth = inject(AuthService);
  toast = inject(ToastService);
  user = this.auth.currentUser;
  router = inject(Router);

  constructor() {
    document.body.style.marginLeft = '250px';
  }

  ngOnDestroy(): void {
    document.body.style.marginLeft = '0';
  }

  logout() {
    this.auth.logout();
    this.toast.showToast('Déconnexion réussie !', 'success', 2000);
    this.router.navigate(['/login']);
  }
}
