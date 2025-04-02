import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule],
})
export class CalendarComponent implements OnInit {
  weeks: { date: Date; color: string }[][] = [];

  ngOnInit(): void {
    const days = [
      { date: new Date('2025-04-07'), color: 'bg-dark-gray' },
      { date: new Date('2025-04-08'), color: 'bg-gray' },
      { date: new Date('2025-04-09'), color: 'bg-teal' },
      { date: new Date('2025-04-10'), color: 'bg-yellow' },
      { date: new Date('2025-04-11'), color: 'bg-red' },
      { date: new Date('2025-04-12'), color: 'bg-gray' },
      { date: new Date('2025-04-13'), color: 'bg-gray' },
      { date: new Date('2025-04-14'), color: 'bg-teal' },
      { date: new Date('2025-04-15'), color: 'bg-yellow' },
      { date: new Date('2025-04-16'), color: 'bg-red' },
      { date: new Date('2025-04-17'), color: 'bg-gray' },
      { date: new Date('2025-04-18'), color: 'bg-gray' },
      { date: new Date('2025-04-19'), color: 'bg-teal' },
      { date: new Date('2025-04-20'), color: 'bg-yellow' },
      { date: new Date('2025-04-21'), color: 'bg-red' },
      { date: new Date('2025-04-22'), color: 'bg-gray' },
      { date: new Date('2025-04-23'), color: 'bg-gray' },
      { date: new Date('2025-04-24'), color: 'bg-teal' },
      { date: new Date('2025-04-25'), color: 'bg-yellow' },
      { date: new Date('2025-04-26'), color: 'bg-red' },
      { date: new Date('2025-04-27'), color: 'bg-gray' },
    ];
    this.weeks = this.getWeeks(days);
  }

  getWeeks(days: { date: Date; color: string }[]): { date: Date; color: string }[][] {
    const weeks: { date: Date; color: string }[][] = [];
    let currentWeek: { date: Date; color: string }[] = [];

    days.forEach((day) => {
      if (currentWeek.length > 0 && day.date.getDay() === 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    return weeks;
  }
}
