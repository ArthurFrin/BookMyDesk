import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityService, CalendarDay } from '../../../services/availability.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule]
})
export class CalendarComponent implements OnInit {
  availabilityService = inject(AvailabilityService);
  currentUserId = inject(AuthService).getCurrentUser()!.id;
  router = inject(Router);

  // Access the service's signal directly
  weeks = this.availabilityService.calendarData;
  currentMonth = '';
  currentYear = 0;

  // Check if a day is in the past
  isDayPassed(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  ngOnInit(): void {
    // Check if the data is already loaded
    if (this.weeks().length === 0) {
      // Load the data if it's not available
      this.availabilityService.getCalendarData(this.currentUserId).subscribe({
        next: () => {
          this.updateDateDisplay();
        },
        error: (error) => {
          console.error('Error while loading the calendar:', error);
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

  onDayClick(day: { date: Date; isDisabled: boolean }): void {
    if (day.isDisabled) return;
  }

  navigateToDayAvailability(day: any): void {
    if (day.isDisabled || this.isDayPassed(day.date)) return;

    const formattedDate = day.date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.router.navigate([`/disponibilite/${formattedDate}`]);
  }
}
