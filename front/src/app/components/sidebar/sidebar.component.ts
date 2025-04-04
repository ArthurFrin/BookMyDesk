import { Component, inject, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

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
  user = this.auth.currentUser;

  constructor() {
    document.body.style.marginLeft = '250px';
  }

  ngOnDestroy(): void {
    document.body.style.marginLeft = '0';
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
