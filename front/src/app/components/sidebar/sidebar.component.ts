import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CalendarCheckIcon, LogOutIcon, UserRoundPen } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true
})
export class SidebarComponent {
  CalendarCheckIcon = CalendarCheckIcon;
  LogOutIcon = LogOutIcon;
  UserRoundPen = UserRoundPen;

}
