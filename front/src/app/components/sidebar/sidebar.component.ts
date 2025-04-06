import { Component, inject, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen, ShieldUser } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule, PopupComponent],
})
export class SidebarComponent {
  CalendarCheckIcon = CalendarCheckIcon;
  LogOutIcon = LogOutIcon;
  UserRoundPen = UserRoundPen;
  ShieldUser = ShieldUser;

  auth = inject(AuthService);
  toast = inject(ToastService);
  user = this.auth.currentUser;
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
