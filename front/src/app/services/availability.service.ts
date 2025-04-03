import { Injectable, signal } from '@angular/core';
import { Observable, map, tap, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { AvailabilityWeek } from '../interfaces/availability';
import { DayAvailabilityResponse } from '../interfaces/desk';

export interface CalendarDay {
  date: Date;
  available?: number;
  isDisabled: boolean;
  userHasReservation: boolean;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends ApiService {
  // Using a writable signal instead of a BehaviorSubject
  public calendarData = signal<CalendarDay[][]>([]);

  // Variable to track the last used userId
  private lastUserId: number | null = null;

  getAvailability(userId: number): Observable<AvailabilityWeek[]> {
    return this.get<AvailabilityWeek[]>('availability?userId=' + userId);
  }

  getCalendarData(userId: number): Observable<CalendarDay[][]> {
    // If data is already loaded and the user hasn't changed, return existing data
    if (this.calendarData().length > 0 && this.lastUserId === userId) {
      return new Observable(observer => {
        observer.next(this.calendarData());
        observer.complete();
      });
    }

    // Otherwise, fetch new data
    this.lastUserId = userId;
    return this.getAvailability(userId).pipe(
      map((data: AvailabilityWeek[]) =>
        data.map((week) =>
          week.days.map((day) => {
            const dateObj = new Date(day.date);
            return {
              date: dateObj,
              available: day.availableDesks ?? undefined,
              isDisabled: day.isDisabled,
              userHasReservation: day.userHasReservation,
              color: day.isDisabled ? 'bg-dark-gray-custom' : this.getColorByAvailability(day.availableDesks!),
            };
          })
        )
      ),
      tap(calendarData => {
        this.calendarData.set(calendarData);
      }),
      shareReplay(1)
    );
  }

  // Method to force reload of calendar data
  refreshCalendarData(userId: number): void {
    this.getAvailability(userId).subscribe(data => {
      const calendarData = data.map((week) =>
        week.days.map((day) => {
          const dateObj = new Date(day.date);
          return {
            date: dateObj,
            available: day.availableDesks ?? undefined,
            isDisabled: day.isDisabled,
            userHasReservation: day.userHasReservation,
            color: day.isDisabled ? 'bg-dark-gray-custom' : this.getColorByAvailability(day.availableDesks!),
          };
        })
      );
      this.calendarData.set(calendarData);
    });
  }

  getColorByAvailability(availableDesks: number): string {
    if (availableDesks === 0) return 'bg-red-500';
    if (availableDesks <= 5) return 'bg-yellow-500';
    if (availableDesks <= 10) return 'bg-teal-500';
    return 'bg-gray-300';
  }

  getAvailableDesksForDay(date: string, userId: number): Observable<DayAvailabilityResponse> {
    return this.get<DayAvailabilityResponse>(`availability/day/${date}?userId=${userId}`);
  }

  unfollowDesk(deskId: number, userId: number, date: string): Observable<any> {
    return this.post(`desks/${deskId}/unfollow`, { userId, date }).pipe(
      tap(() => this.refreshCalendarData(userId))
    );
  }

  reserveDesk(deskId: number, userId: number, date: string): Observable<any> {
    return this.post(`desks/${deskId}/reserve`, { userId, date }).pipe(
      tap(() => this.refreshCalendarData(userId))
    );
  }
}
