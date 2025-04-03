import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityService } from '../../services/availability.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-date.component.html',
  styleUrls: ['./nav-date.component.css']
})
export class NavDateComponent implements OnInit {
  availabilityService = inject(AvailabilityService);
  currentUserId = inject(AuthService).getCurrentUser()!.id;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  weeks = this.availabilityService.calendarData;
  currentMonth = '';
  currentYear = 0;
  selectedDate: string | null = null;

  isDayPassed(day: Date): boolean {
    const today = new Date();
    return day < today;
  }

  // Get formatted selected date in the format "Lundi 6 mars 2025"
  get getFormattedSelectedDate(): string {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('fr-FR', options);
    }
    return '';
  }

  ngOnInit(): void {
    // Get the date from the URL
    this.activatedRoute.paramMap.subscribe(params => {
      this.selectedDate = params.get('date');
    });

    if (this.weeks().length === 0) {
      this.availabilityService.getCalendarData(this.currentUserId).subscribe({
        next: () => {
          this.updateDateDisplay();
        },
        error: (error) => {
          console.error('Error loading navigation dates:', error);
        }
      });
    } else {
      this.updateDateDisplay();
    }
  }

  private updateDateDisplay(): void {
    const data = this.weeks();
    if (data.length && data[0].length) {
      const firstDate = data[0][0].date;
      const lastWeek = data[data.length - 1];
      const lastDate = lastWeek[lastWeek.length - 1].date;
      const firstMonth = firstDate.toLocaleString('default', { month: 'long' });
      const lastMonth = lastDate.toLocaleString('default', { month: 'long' });
      if (firstMonth !== lastMonth) {
        this.currentMonth = `${firstMonth}-${lastMonth}`;
      } else {
        this.currentMonth = firstMonth;
      }
      this.currentYear = firstDate.getFullYear();
      if (firstDate.getFullYear() !== lastDate.getFullYear()) {
        this.currentYear = 0;
        this.currentMonth = `${firstMonth} ${firstDate.getFullYear()} - ${lastMonth} ${lastDate.getFullYear()}`;
      }
    }
  }

  navigateToDayAvailability(day: any): void {
    if (day.isDisabled) return;

    const formattedDate = day.date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.router.navigate([`/disponibilite/${formattedDate}`]);
  }
}
