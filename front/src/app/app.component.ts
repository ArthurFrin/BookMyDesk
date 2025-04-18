import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, NgIf } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { MobileNavBarComponent } from "./components/mobile-nav-bar/mobile-nav-bar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NgIf, SidebarComponent, ToastComponent, CommonModule, MobileNavBarComponent]
})
export class AppComponent {
  showSidebar = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        this.showSidebar = !route.snapshot.data['hideSidebar'];
      }
    });
  }
}
