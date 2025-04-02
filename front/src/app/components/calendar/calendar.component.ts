import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityService } from '../../services/availability.service';
import { AvailabilityWeek } from '../../interfaces/availability';

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
    color: string;
  }[][] = [];

  currentMonth = '';
  currentYear = 0;

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.availabilityService.getAvailability().subscribe((data: AvailabilityWeek[]) => {
      this.weeks = data.map((week) =>
        week.days.map((day) => {
          const dateObj = new Date(day.date);
          return {
            date: dateObj,
            available: day.availableDesks ?? undefined,
            isDisabled: day.isDisabled,
            color: day.isDisabled ? 'bg-dark-gray-custom' : this.getColor(day.availableDesks!),
          };
        })

      );

      if (this.weeks.length && this.weeks[0].length) {
        const firstDate = this.weeks[0][0].date;
        this.currentMonth = firstDate.toLocaleString('default', { month: 'long' });
        this.currentYear = firstDate.getFullYear();
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

    // ici tu peux ouvrir une modale ou appeler une méthode pour réserver
    console.log('Date sélectionnée pour réservation :', day.date.toISOString());
  }
}
