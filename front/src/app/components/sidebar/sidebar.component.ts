import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true
})
export class SidebarComponent implements OnInit {
  CalendarCheckIcon = CalendarCheckIcon;
  LogOutIcon = LogOutIcon;
  UserRoundPen = UserRoundPen;

  service = inject(AuthService);

  currentUser = signal<User | null>(null);

  ngOnInit(): void {
    this.currentUser.set(this.service.getCurrentUser());
  }
}
