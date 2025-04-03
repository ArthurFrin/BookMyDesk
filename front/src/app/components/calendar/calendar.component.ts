import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityService } from '../../services/availability.service';
import { AvailabilityWeek } from '../../interfaces/availability';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule]
})
export class CalendarComponent implements OnInit {
  weeks: {
    date: Date;
    available?: number;
    isDisabled: boolean;
    userHasReservation: boolean;
    color: string;
  }[][] = [];

  currentMonth = '';
  currentYear = 0;

  availabilityService = inject(AvailabilityService);
  currentUserId = inject(AuthService).getCurrentUser()!.id;
  router = inject(Router);

  ngOnInit(): void {
    this.availabilityService.getAvailability(this.currentUserId).subscribe({
      next: (data: AvailabilityWeek[]) => {
        this.weeks = data.map((week) =>
          week.days.map((day) => {
            const dateObj = new Date(day.date);
            return {
              date: dateObj,
              available: day.availableDesks ?? undefined,
              isDisabled: day.isDisabled,
              userHasReservation: day.userHasReservation,
              color: day.isDisabled ? 'bg-dark-gray-custom' : this.getColor(day.availableDesks!),
            };
          })
        );

        if (this.weeks.length && this.weeks[0].length) {
          const firstDate = this.weeks[0][0].date;
          const lastWeek = this.weeks[this.weeks.length - 1];
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
      },
      error: (error) => {
        console.error('Erreur lors du chargement du calendrier:', error);
      }
    });
  }

  getColor(availableDesks: number): string {
    if (availableDesks === 0) return 'bg-red-500';
    if (availableDesks <= 5) return 'bg-yellow-500';
    if (availableDesks <= 10) return 'bg-teal-500';
    return 'bg-gray-300';
  }

  onDayClick(day: { date: Date; isDisabled: boolean }): void {
    if (day.isDisabled) return;
  }

  navigateToDayAvailability(day: any): void {
    if (day.isDisabled) return;

    const formattedDate = day.date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.router.navigate([`/disponibilite/${formattedDate}`]);
  }
}
