import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AvailabilityWeek } from '../interfaces/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends ApiService {

  getAvailability(): Observable<AvailabilityWeek[]> {
    return this.get<AvailabilityWeek[]>('availability');
  }
}
