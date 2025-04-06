import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-mobile-nav-bar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, PopupComponent],
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

  showPopup = false;


  logout() {
    this.auth.logout();
    this.toast.showToast('Déconnexion réussie !', 'success', 2000);
    this.router.navigate(['/login']);
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  onConfirm(): void {
    this.logout();
    this.closePopup();
  }


}
