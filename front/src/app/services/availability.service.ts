import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AvailabilityWeek } from '../interfaces/availability';
import { DayAvailabilityResponse } from '../interfaces/desk';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends ApiService {

  getAvailability(userId: number): Observable<AvailabilityWeek[]> {
    return this.get<AvailabilityWeek[]>('availability?userId=' + userId);
  }

  getAvailableDesksForDay(date: string, userId: number): Observable<DayAvailabilityResponse> {
    return this.get<DayAvailabilityResponse>(`availability/day/${date}?userId=${userId}`);
  }

  unfollowDesk(deskId: number, userId: number, date: string): Observable<any> {
    return this.post(`desks/${deskId}/unfollow`, { userId, date });
  }

  reserveDesk(deskId: number, userId: number, date: string): Observable<any> {
    return this.post(`desks/${deskId}/reserve`, { userId, date });
  }
}
